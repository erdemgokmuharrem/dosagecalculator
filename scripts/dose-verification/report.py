"""Builds DOSE_VERIFICATION.md from the verification record and the catalogue.

Usage: python3 scripts/dose-verification/report.py <catalogue.json>
(the catalogue dump comes from dump-catalogue.mjs)
"""
import datetime
import json
import pathlib
import re
import sys
import unicodedata

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
catalogue = json.load(open(sys.argv[1], encoding='utf-8'))
current = {str(x['id']): x for x in catalogue}
rec = json.load(open(HERE / 'verification.json', encoding='utf-8'))

PER_DAY = {'q4h': 6, 'q6h': 4, 'q8h': 3, 'q12h': 2, 'q24h': 1, 'q48h': 0.5, 'q72h': 1 / 3, 'qd': 1, 'od': 1,
           'daily': 1, 'bid': 2, 'tid': 3, 'qid': 4, 'q7d': 1 / 7, 'q14d': 1 / 14, 'q21d': 1 / 21, 'q28d': 1 / 28,
           'prn': 1}
VERDICT_TR = {'UNIT_ERROR': 'BİRİM HATASI', 'MISMATCH': 'KAYNAKLA UYUŞMUYOR', 'MODEL_WRONG': 'MODEL YANLIŞ',
              'CAP_UNDERDOSES': 'TAVAN EKSİK DOZ ÜRETİYOR', 'MATCHES': 'UYUMLU', 'UNCERTAIN': 'BELİRSİZ'}
ORDER = {'UNIT_ERROR': 0, 'MISMATCH': 1, 'MODEL_WRONG': 2, 'CAP_UNDERDOSES': 3, 'MATCHES': 4, 'UNCERTAIN': 5}
SEV_TR = {'critical': 'kritik', 'high': 'yüksek', 'moderate': 'orta', 'low': 'düşük', 'none': '-'}
SEV_ORDER = {'critical': 0, 'high': 1, 'moderate': 2, 'low': 3}


def norm(name):
    s = unicodedata.normalize('NFKD', (name or '').lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.translate(str.maketrans({'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c'}))
    s = re.sub(r'[^a-z]', '', s)
    for a, b in (('sef', 'cef'), ('vankomisin', 'vancomycin'), ('metronidazole', 'metronidazol'),
                 ('piperasilin', 'piperacillin'), ('tazobaktam', 'tazobactam'), ('amoksisilin', 'amoxicillin'),
                 ('klaritromisin', 'clarithromycin'), ('azitromisin', 'azithromycin'),
                 ('siprofloksasin', 'ciprofloxacin'), ('levofloksasin', 'levofloxacin'),
                 ('gentamisin', 'gentamicin'), ('furosemide', 'furosemid'), ('doksisiklin', 'doxycycline'),
                 ('kotrimoksazoltmpsmx', 'trimethoprimsulfamethoxazole')):
        s = s.replace(a, b)
    return s


def formula(x):
    f = x.get('dosageFormula', {})
    dose = f.get('dosePerKg') or f.get('dosePerM2') or f.get('fixedDose')
    kind = 'kg başına' if 'dosePerKg' in f else ('m2 başına' if 'dosePerM2' in f else 'sabit')
    return f, dose, kind


def now_line(key):
    x = current.get(key)
    if not x:
        return None
    f, dose, kind = formula(x)
    state = []
    if x.get('requiresClinicalReview'):
        state.append('hesap reddediliyor')
    level = {'SOURCE_CHECKED': 'kaynakla karşılaştırıldı', 'REVIEWED': 'klinik onaylı',
             'UNVERIFIED': 'doğrulanmadı'}.get(x.get('sourceVerification'))
    if level:
        state.append(level)
    return (f"{dose} {x['unit']} ({kind}, {f.get('frequency')}), tek doz tavanı {f.get('maxSingleDose')}, "
            f"günlük tavan {f.get('maxDailyDose')}" + (f" — {', '.join(state)}" if state else ''))


def squash(text, limit=600):
    t = ' '.join(str(text or '').split())
    return t[:limit] + ('…' if len(t) > limit else '')


L = []
L.append('# Doz Verisi Doğrulama Raporu\n')
L.append(f'Son güncelleme: {datetime.date.today().isoformat()}\n')
L.append("""## Bu belge ne değildir

Bu bir **klinik onay değildir**. Kayıtlar halka açık otoriter kaynaklarla
(FDA etiketleri, ürün bilgileri, klinik kılavuzlar) karşılaştırılmıştır.
Hiçbir kayda hekim veya farmakolog onayı verilmemiştir; bu nedenle
`sourceVerification` alanı `REVIEWED` yapılmamıştır ve uygulama içindeki
"klinik onaydan geçmemiştir" uyarısı yerinde durmaktadır.

## Öne çıkan kalıp: gün başına doz, doz başına girilmiş

Etiketler pek çok ilacın dozunu **mg/kg/gün** olarak verir ve bunu güne bölerek
uygular. Veri setinde aynı sayı **doz başına** alanına girilmiş ve üstüne
sıklık uygulanmıştır. Sonuç, sıklık kadar (2-4 kat) yüksek günlük dozdur.
""")

# 1. Structural audit against today's catalogue.
groups = {}
for x in catalogue:
    groups.setdefault(norm(x.get('genericName') or x['name']), []).append(x)
dups = {k: v for k, v in groups.items() if len(v) > 1}


def daily(x):
    f, dose, _ = formula(x)
    n = PER_DAY.get(str(f.get('frequency', '')).lower())
    return round(dose * n, 3) if (n and dose) else None


L.append('## 1. Yapısal denetim (bugünkü katalog)\n')
L.append(f'### 1a. Aynı etkin maddenin birden fazla kaydı: {len(dups)} grup\n')
L.append('Hesaplanan kayıtların aynı dozu vermesi gerekir; farklıysa kullanıcının hangi kaydı seçtiğine göre farklı doz görür.\n')
L.append('| Etkin madde | Kayıtlar | Hesaplanan kayıtlar aynı dozu veriyor mu |')
L.append('| --- | --- | --- |')
for k, items in sorted(dups.items()):
    cells = []
    for x in items:
        f, dose, kind = formula(x)
        state = 'reddediliyor' if x.get('requiresClinicalReview') else 'hesaplanıyor'
        cells.append(f"id {x['id']}: {x['name']} — {dose} {x['unit']} ({kind}, {f.get('frequency')}), {state}")
    live = [x for x in items if not x.get('requiresClinicalReview')]
    agree = 'evet' if len({(daily(x), formula(x)[2]) for x in live}) <= 1 else '**hayır**'
    L.append(f"| {k} | {' <br> '.join(cells)} | {agree} |")

contradictions = []
for x in catalogue:
    if x.get('requiresClinicalReview'):
        continue
    f, dose, kind = formula(x)
    n = PER_DAY.get(str(f.get('frequency', '')).lower())
    max_daily = f.get('maxDailyDose')
    if not (n and dose and max_daily):
        continue
    single = dose * 70 if kind == 'kg başına' else (dose * 1.8 if kind == 'm2 başına' else dose)
    if single * n > max_daily * 1.001:
        contradictions.append((x['id'], x['name'], round(single), f.get('frequency'), round(single * n), max_daily,
                               round(single * n / max_daily, 1)))
contradictions.sort(key=lambda r: -r[6])
L.append(f'\n### 1b. Hesaplanan kayıtlardan kendi günlük tavanını aşanlar: {len(contradictions)}\n')
L.append('70 kg erişkin için doz × sıklık, kaydın günlük tavanını aşıyor. Çoğu tasarım gereğidir '
         '(pediatrik kilo başına doz + erişkin tavanı); tavan erişkin dozunu doğru sınırlar ama her erişkin hesabında uyarı çıkar.\n')
L.append('| id | İlaç | Tek doz | Sıklık | Günlük | Tavan | Kat |')
L.append('| --- | --- | --- | --- | --- | --- | --- |')
for r in contradictions:
    L.append(f'| {r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4]} | {r[5]} | {r[6]}x |')

# 2. Verification results.
matches = [k for k, v in rec.items() if v.get('verdict') == 'MATCHES' or v.get('refuted')]
actionable = {k: v for k, v in rec.items() if v.get('verdict') not in ('MATCHES', 'UNCERTAIN') and not v.get('refuted')}
blocked_now = sum(1 for x in catalogue if x.get('requiresClinicalReview'))
fixed_now = [k for k in actionable if current.get(k) and not current[k].get('requiresClinicalReview')]

L.append(f'\n## 2. Sonuç özeti ({len(rec)}/{len(catalogue)} kayıt kaynakla karşılaştırıldı)\n')
L.append(f'- Kaynakla uyumlu: **{len(matches)}**')
L.append(f'- Uyuşmazlık bulunan: **{len(actionable)}**')
L.append(f'- Bunlardan düzeltilip hesaplamaya açılan: **{len(fixed_now)}**')
L.append(f'- Şu an hesabı reddedilen kayıt: **{blocked_now}/{len(catalogue)}**\n')
L.append('Uyuşmazlık bildiren her bulgu, iddiayı çürütmeye çalışan ikinci bir bağımsız incelemeden geçirildi; '
         'çürütülenlerde veri değiştirilmedi. Düzeltme önerileri de uygulanmadan önce ayrı bir ajan tarafından '
         'etikete karşı yeniden hesaplanır.\n')

L.append('### 2a. Tüm kayıtlar\n')
L.append('| id | İlaç | Sonuç | Ciddiyet | Durum |')
L.append('| --- | --- | --- | --- | --- |')
for key, v in sorted(rec.items(), key=lambda kv: (ORDER.get(kv[1].get('verdict'), 9), kv[0])):
    x = current.get(key, {})
    state = 'hesap reddediliyor' if x.get('requiresClinicalReview') else 'hesaplanıyor'
    verdict = VERDICT_TR.get(v.get('verdict'), v.get('verdict'))
    if v.get('refuted'):
        verdict += ' (çürütüldü)'
    L.append(f"| {key} | {v.get('name', '')} | {verdict} | {SEV_TR.get(v.get('severity'), v.get('severity') or '-')} | {state} |")

L.append('\n### 2b. Uyuşmazlık bulunan kayıtlar (ayrıntı)\n')
for key, v in sorted(actionable.items(), key=lambda kv: (SEV_ORDER.get(kv[1].get('severity'), 4), kv[0])):
    L.append(f"#### {v.get('name')} (id {key}) — {VERDICT_TR.get(v.get('verdict'), v.get('verdict'))}, "
             f"ciddiyet: {SEV_TR.get(v.get('severity'), '-')}\n")
    L.append(f"- **Bulunduğunda kayıtta:** {squash(v.get('stored'), 400)}")
    now = now_line(key)
    if now:
        L.append(f'- **Şu an kayıtta:** {now}')
    L.append(f"- **Kaynak:** {squash(v.get('source'), 400)}")
    L.append(f"- **Not:** {squash(v.get('note'), 900)}")
    if v.get('suggestedFix'):
        L.append(f"- **Önerilen değer:** {squash(v.get('suggestedFix'), 600)}")
    if v.get('fix'):
        L.append(f"- **Uygulanan düzeltme:** {squash(v.get('fix'), 600)}")
    if v.get('pending'):
        L.append(f"- **Bekleyen:** {squash(v.get('pending'), 500)}")
    if v.get('blockNote'):
        L.append(f"- **Neden hesaplanmıyor:** {squash(v.get('blockNote'), 600)}")
    if v.get('fixRejected'):
        L.append(f"- **Önerilen düzeltme bağımsız kontrolde reddedildi:** {squash(v.get('fixRejected'), 700)}")
    if v.get('refuteReason'):
        L.append(f"- **Çapraz kontrol:** {squash(v.get('refuteReason'))}")
    L.append(f"- Bağlantı: {v.get('sourceUrl', '')}\n")

L.append('## 3. Devam eden iş\n')
L.append(f'- Hesabı reddedilen {blocked_now} kaydın her biri için kaynaktan düzeltilmiş kural türetilip bağımsız '
         'kontrolden geçenler hesaplamaya açılacak.')
L.append('- Modelin temsil edemediği ilaçlar (INR veya kan şekerine göre titre edilenler, düzeye göre dozlananlar, '
         'endikasyona göre değişenler, yükleme + infüzyon şemaları) kalıcı olarak reddedilir.')
L.append('- Halka açık yayından önce lisanslı bir klinisyenin imzası gerekir.\n')

(ROOT / 'DOSE_VERIFICATION.md').write_text('\n'.join(L) + '\n', encoding='utf-8')
print(f'DOSE_VERIFICATION.md: {len(rec)} records, {len(actionable)} with a finding, {blocked_now} refused, '
      f'{len(dups)} duplicate groups, {len(contradictions)} ceiling notes')
