import { Drug } from '../types';

export const extraDrugs: Drug[] = [
  {
    id: 'extra-001',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA OTC Drug Facts, Children’s Ibuprofen Oral Suspension 100 mg/5 mL (DailyMed); and FDA prescription label, Ibuprofen Oral Suspension (DailyMed) | https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c3c600dd-6eec-4304-868e-9642de5e1dac&type=display',
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
    calculationMethod: 'age',
    dosageFormula: {
      method: 'age',
      fixedDose: 100, // Baz doz 100mg
      frequency: 'q8h',
      maxSingleDose: 400,
      maxDailyDose: 1200,
      ageAdjustments: [
        { minAge: 0.5, maxAge: 1, adjustmentFactor: 0.5 }, // 6-12 ay için 50mg
        { minAge: 1, maxAge: 3, adjustmentFactor: 1.0 }, // 1-3 yaş için 100mg
        { minAge: 4, maxAge: 6, adjustmentFactor: 1.5 }, // 4-6 yaş için 150mg
        { minAge: 7, maxAge: 9, adjustmentFactor: 2.0 }, // 7-9 yaş için 200mg
        { minAge: 10, maxAge: 12, adjustmentFactor: 3.0 }, // 10-12 yaş için 300mg
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
      'Bu ilacın dozu tek doz x sıklık modeliyle ifade edilemiyor (endikasyona, laboratuvar değerine veya titrasyona bağlı); bu nedenle hesap yapılmıyor. Ayrıntı ve kaynak: DOSE_VERIFICATION.md',
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
