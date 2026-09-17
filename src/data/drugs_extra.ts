import { Drug } from '../types';

export const extraDrugs: Drug[] = [
  {
    id: 'extra-001',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'Ibuprofen 10 mg/kg/doz q6-8h, gunluk tavan 40 mg/kg; 6 aydan kucukte kontrendike. Surup kaydi da kilo bazli modele alindi (id 2 ile ayni kural)',
    name: 'Ibuprofen Pediatrik Şurup',
    genericName: 'Ibuprofen',
    category: 'Analgesics',
    unit: 'mg',
    maxDailyDose: 1200,
    contraindications: [
      'Aktif peptik ülser',
      'Geçmişte NSAİİ kaynaklı astım',
      'Ciddi kalp yetmezliği',
      'Ciddi böbrek yetmezliği',
    ],
    sideEffects: [
      { effect: 'Gastrointestinal rahatsızlık', frequency: 'common' },
      { effect: 'Bulantı', frequency: 'common' },
      { effect: 'Deri döküntüsü', frequency: 'uncommon' },
      { effect: 'Tinnitus (kulak çınlaması)', frequency: 'rare' },
    ],
    dosageForm: 'syrup',
    calculationMethod: 'weight',
    dosageFormula: {
      dosePerKg: 10,
      method: 'weight',
      frequency: 'q8h',
      maxSingleDose: 400,
      maxDailyDose: 1200,
      ageAdjustments: [
        { minAge: 0, maxAge: 0.5, adjustmentFactor: 0 },
        { minAge: 0.5, maxAge: 12, adjustmentFactor: 0.8 },
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.7 },
      ],
    },
    productInfo: {
      activeIngredient: 'İbuprofen',
      mechanismOfAction:
        'Prostaglandin sentezinden sorumlu siklooksijenaz (COX) enzimlerini inhibe ederek ağrı, ateş ve inflamasyonu azaltır.',
      pharmacokinetics: {
        absorption: 'Oral alımdan sonra hızla emilir (tepe noktası 1-2 saat).',
        distribution: 'Plazma proteinlerine %99 oranında bağlanır.',
        metabolism: 'Karaciğerde hızla metabolize olur.',
        elimination: 'İdrarla atılır, yarı ömrü yaklaşık 2 saattir.',
        halfLife: '2 saat',
      },
      administration: {
        route: 'Oral',
        method:
          'Mide hassasiyetini azaltmak için tok karnına veya süt ile alınmalıdır.',
        duration: '',
        diluent: '',
        concentration: '100 mg / 5 mL',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Ateş düşürücü',
        'Hafif-orta şiddetli ağrı',
        'Juvenil İdiyopatik Artrit',
      ],
      contraindications: ['Aktif peptik ülser', 'Aspirin veya NSAİİ alerjisi'],
      warnings: [
        '6 aydan küçük bebeklerde hekim onayı olmadan kullanılmamalıdır.',
      ],
      interactions: {
        drugInteractions: [
          'Antikoagülanlar (kanama riskini artırır)',
          'Kortikosteroidler (mide ülseri riskini artırır)',
        ],
        foodInteractions: [],
        labInteractions: [],
      },
      monitoring: {
        parameters: ['Ateş takibi', 'Gastrointestinal kanama bulguları'],
        frequency: 'Kullanım süresince',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altı oda sıcaklığı',
        light: 'Işıktan koruyunuz',
        stability: 'Açıldıktan sonra 6 ay içinde tüketilmelidir',
      },
      pregnancyCategory: 'C/D',
      lactation:
        'Anne sütüne geçer ancak pediatrik dozlarda genellikle güvenlidir',
      pediatricUse:
        '6 ay üzeri çocuklarda kullanılır. 6 aydan küçüklerde kullanılmamalıdır.',
      geriatricUse:
        'Bu pediatrik formülasyon erişkin/geriatrik kullanım için tasarlanmamıştır.',
      renalAdjustment:
        'GFR <30 mL/dk: kullanılmamalıdır. GFR 30-60: dikkatli kullanım, en düşük etkili doz.',
      hepaticAdjustment:
        'Ağır karaciğer yetmezliğinde kontrendike. Hafif-orta yetmezlikte doz azaltılmalıdır.',
    },
  },
  {
    id: 'extra-002',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA label, ZOVIRAX (acyclovir) capsules/tablets/suspension (accessdata.fda.gov); and FDA label, Acyclovir Tablets USP (DailyMed); CDC STI Treatment Guidelines, Genital Herpes | https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/018828s031lbl.pdf',
    clinicalReviewNote:
      'Oral asiklovirin dozu endikasyona göre birkaç kat değişir (zonada 800 mg günde 5 kez, genital herpeste 200 mg günde 5 kez, baskılama tedavisinde 400 mg günde 2 kez, suçiçeğinde 20 mg/kg günde 4 kez) ve böbrek yetmezliğinde her rejimin doz aralığı ayrı ayrı uzatılır. Bu rejimler tek bir doz ve sıklık kuralıyla doğru gösterilemediği, krem formunun da mg cinsinden dozu olmadığı için doz hesaplanmıyor.',
    requiresClinicalReview: true,
    name: 'Asiklovir Krem/Tablet',
    genericName: 'Acyclovir',
    category: 'Antiviral',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: ['Asiklovir alerjisi'],
    sideEffects: [
      { effect: 'Bulantı', frequency: 'common' },
      { effect: 'İshal', frequency: 'common' },
      { effect: 'Böbrek yetmezliği (IV kullanımda)', frequency: 'rare' },
    ],
    dosageForm: 'tablet',
    calculationMethod: 'fixed',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 400,
      frequency: 'tid',
      maxSingleDose: 800,
      maxDailyDose: 4000,
      ageAdjustments: [],
    },
    productInfo: {
      activeIngredient: 'Asiklovir',
      mechanismOfAction:
        'Viral DNA polimerazı inhibe ederek virüs replikasyonunu durdurur.',
      pharmacokinetics: {
        absorption: 'Oral biyoyararlanım düşüktür (%10-20).',
        distribution: "Geniş bir dağılım hacmi vardır, BOS'a geçer.",
        metabolism: 'Karaciğerde az miktarda metabolize olur.',
        elimination: 'Böbrekler yoluyla atılır.',
        halfLife: '2.5-3.3 saat (normal renal fonksiyon)',
      },
      administration: {
        route: 'Oral, Topikal, IV',
        method: 'Oral bol su ile, IV yavaş infüzyon',
        duration: 'En az 1 saat (IV infüzyon)',
        diluent: 'Normal salin veya %5 Dekstroz (IV için)',
        concentration: 'Max 7 mg/mL (IV)',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Herpes simplex virüs (HSV) enfeksiyonları',
        'Varicella zoster virüs (VZV) enfeksiyonları',
      ],
      contraindications: ['İlaca karşı aşırı duyarlılık'],
      warnings: [
        'Yeterli hidrasyon sağlanmalıdır, böbrek yetmezliğinde doz ayarlaması gerekir.',
      ],
      interactions: {
        drugInteractions: [
          'Nefrotoksik ilaçlar (böbrek hasarı riskini artırır)',
          'Probenesid (asiklovir atılımını azaltır)',
        ],
        foodInteractions: [],
        labInteractions: [],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyon testleri', 'İdrar çıkışı'],
        frequency: 'Özellikle IV kullanımda düzenli',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altı',
        light: 'Güneş ışığından uzak',
        stability: '',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer, hekim kontrolünde kullanılmalıdır',
      pediatricUse:
        '2 yaş üzeri çocuklarda kiloya göre dozlanır; hekim değerlendirmesi gerekir.',
      geriatricUse:
        'Böbrek fonksiyonu azalmış olabileceğinden doz aralığı uzatılmalıdır.',
      renalAdjustment:
        'CrCl 10-25 mL/dk: doz aralığı uzatılır. CrCl <10 mL/dk: doz ve aralık ayarlanmalıdır.',
      hepaticAdjustment: 'Doz ayarı genellikle gerekmez.',
    },
  },
];
