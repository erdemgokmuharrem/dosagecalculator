import { Drug } from '../types';
import { extendedDrugs } from './drugs_extended';
import { chemoAndSupplementDrugs } from './drugs_chemo_supplements';
import { extraDrugs } from './drugs_extra';

const baseDrugs: Drug[] = [
  {
    id: '1',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA acetaminophen labelling (10-15 mg/kg/dose q4-6h; max 75 mg/kg/day or 4 g)',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: [
      'Ciddi karaciğer hastalığı',
      'Paracetamol alerjisi',
      'Akut hepatit',
    ],
    sideEffects: [
      'Bulantı',
      'Kusma',
      'Karaciğer hasarı (yüksek dozda)',
      'Alerjik reaksiyonlar',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q6h',
      maxSingleDose: 1000,
      maxDailyDose: 4000,
      ageAdjustments: [
        { minAge: 0, maxAge: 1, adjustmentFactor: 0.7 },
        { minAge: 1, maxAge: 12, adjustmentFactor: 0.9 },
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.8 },
      ],
    },
    productInfo: {
      activeIngredient: 'Parasetamol (Asetaminofen)',
      mechanismOfAction:
        'Merkezi sinir sisteminde prostaglandin sentezini inhibe eder. COX-3 enzimi üzerinde etkili olduğu düşünülmektedir. Analjezik ve antipiretik etki gösterir, anti-inflamatuar etkisi minimal.',
      pharmacokinetics: {
        absorption:
          'Oral yoldan hızlı ve tam emilir. Biyoyararlanım %70-90. Besinler emilimi geciktirir ancak toplam miktarı etkilemez.',
        distribution:
          'Vücut sıvılarına homojen dağılır. Protein bağlanma oranı %20-50. Plasenta ve anne sütüne geçer.',
        metabolism:
          'Karaciğerde glukuronidasyon (%60) ve sülfatasyon (%35) ile metabolize olur. %5 oranında CYP2E1 ile toksik metabolit NAPQI oluşur.',
        elimination:
          'Böbrekler yoluyla atılır. %2-5 değişmeden atılır. Geri kalanı konjuge metabolitler olarak.',
        halfLife: '2-3 saat (normal), karaciğer yetmezliğinde 4-8 saat',
      },
      administration: {
        route: 'Oral, IV, Rektal',
        method:
          'Oral: Yemeklerle veya yemeksiz alınabilir. IV: 15 dakikada infüzyon',
        duration: 'IV infüzyon: 15 dakika',
        diluent: 'IV form seyreltme gerektirmez, kullanıma hazır',
        concentration: 'IV: 10 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Diklofenak', 'Klorpromazin'],
      },
      indications: [
        'Hafif-orta şiddetli ağrı',
        'Ateş düşürücü',
        'Baş ağrısı',
        'Diş ağrısı',
        'Kas ağrıları',
        'Soğuk algınlığı semptomları',
        'Osteoartrit',
      ],
      contraindications: [
        'Ciddi karaciğer hastalığı',
        'Akut hepatit',
        'Paracetamol alerjisi',
        'Günde 3 birimden fazla alkol tüketimi',
        'Glutatyon eksikliği',
      ],
      warnings: [
        'Karaciğer hastalığı olanlarda dikkatli kullanım',
        'Kronik alkol kullananlarda maksimum doz 2g/gün',
        'Malnütrisyon durumlarında dikkat',
        'Diğer paracetamol içeren ilaçlarla birlikte kullanmayın',
        'Doz aşımında N-asetilsistein antidottur',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin: INR artışı riski (uzun süreli kullanımda)',
          'İzoniazid: Hepatotoksisite riski artar',
          'Rifampisin: Paracetamol metabolizması hızlanır',
          'Karbamazepin: Hepatotoksisite riski artar',
          'Metoklopramid: Paracetamol emilimi hızlanır',
        ],
        foodInteractions: ['Alkol: Hepatotoksisite riski önemli ölçüde artar'],
        labInteractions: [
          'Kan glukoz ölçümlerini etkileyebilir',
          'İdrar 5-HIAA testlerini etkileyebilir',
        ],
      },
      monitoring: {
        parameters: ['Karaciğer fonksiyon testleri (ALT, AST)', 'Klinik yanıt'],
        frequency: 'Kronik kullanımda 3 ayda bir karaciğer fonksiyonları',
        specialConsiderations: [
          'Doz aşımı şüphesinde: Paracetamol plazma seviyesi ölç',
          '4 saat sonra alınan seviye >150 mg/L ise N-asetilsistein başla',
          "Günlük doz 4g'ı geçmemeli",
        ],
      },
      storage: {
        temperature: '25°C altında, oda sıcaklığında',
        light: 'Işıktan korumak gerekmez',
        stability: 'Ambalajda belirtilen son kullanma tarihine kadar stabil',
      },
      pregnancyCategory:
        'B - Hamilelikte güvenli (tüm trimesterlerde kullanılabilir)',
      lactation:
        'Anne sütüne geçer ancak terapötik dozlarda güvenli kabul edilir',
      pediatricUse: 'Yenidoğandan itibaren kullanılabilir, doz ayarı gerekli',
      geriatricUse:
        'Yaşlılarda %20 doz azaltımı önerilir, karaciğer fonksiyonları izlenmeli',
      renalAdjustment: 'GFR <10 mL/dk: Doz aralığı 8 saate uzatılır',
      hepaticAdjustment:
        'Karaciğer yetmezliğinde kontrendike veya günlük maksimum doz 2g',
    },
  },
  {
    id: '2',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA/product labelling (10 mg/kg/dose q6-8h, max 40 mg/kg/day; adults max 3200 mg/day)',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Analgesics',
    unit: 'mg',
    maxDailyDose: 2400,
    contraindications: [
      'Aktif peptik ülser',
      'Ciddi kalp yetmezliği',
      'NSAID alerjisi',
      'Üçüncü trimester gebelik',
      'Ciddi böbrek yetmezliği',
    ],
    sideEffects: [
      'Mide rahatsızlığı',
      'Baş ağrısı',
      'Baş dönmesi',
      'Ödem',
      'Hipertansiyon',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q8h',
      maxSingleDose: 800,
      maxDailyDose: 2400,
      ageAdjustments: [
        { minAge: 0, maxAge: 0.5, adjustmentFactor: 0 }, // 6 ay (0.5 yıl) altı kontrendike. NOT: yaş alanları YIL cinsindendir.
        { minAge: 0.5, maxAge: 12, adjustmentFactor: 0.8 },
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.7 },
      ],
    },
    productInfo: {
      activeIngredient: 'İbuprofen (2-(4-izobütilfenil)propiyonik asit)',
      mechanismOfAction:
        'Non-selektif COX inhibitörü. COX-1 ve COX-2 enzimlerini inhibe ederek prostaglandin sentezini azaltır. Anti-inflamatuar, analjezik ve antipiretik etki gösterir.',
      pharmacokinetics: {
        absorption:
          'Oral yoldan hızlı emilir. Biyoyararlanım %80-100. Yemeklerle alındığında emilim yavaşlar.',
        distribution:
          'Protein bağlanma oranı %99. Sinoviyal sıvıya iyi penetre olur. Vd: 0.12-0.2 L/kg',
        metabolism:
          'Karaciğerde CYP2C9 ile hidroksilasyon ve glukuronidasyon. 4 inaktif metabolit oluşur.',
        elimination:
          'Böbrekler yoluyla %90 metabolit olarak atılır. %10 safra ile.',
        halfLife: '2-4 saat (kısa yarı ömür)',
      },
      administration: {
        route: 'Oral, IV, Topikal',
        method:
          'Oral: Yemekle birlikte alınması önerilir (GI toleransı artırır). IV: 30 dakikada infüzyon',
        duration: 'IV infüzyon: 30 dakika',
        diluent: '0.9% NaCl veya %5 Dekstroz ile seyreltilir',
        concentration: 'IV: 4 mg/mL (maksimum)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: ['TPN solüsyonları', 'Aminoglikozidler'],
      },
      indications: [
        'Hafif-orta şiddetli ağrı',
        'İnflamatuar durumlar',
        'Romatoid artrit',
        'Osteoartrit',
        'Dismenore',
        'Ateş',
        'Migren',
        'Diş ağrısı',
      ],
      contraindications: [
        'Aktif GI kanama veya ülser',
        'Ciddi kalp yetmezliği (NYHA III-IV)',
        'Üçüncü trimester gebelik',
        'Ciddi böbrek yetmezliği (GFR <30)',
        'Aspirin veya NSAID alerjisi',
        'Koroner arter bypass cerrahisi sonrası',
        'Aktif karaciğer hastalığı',
      ],
      warnings: [
        'Kardiyovasküler risk: MI ve inme riski artabilir',
        'GI kanama riski: Yaşlılarda ve ülser öyküsü olanlarda dikkat',
        'Böbrek fonksiyonu: Hidrasyon sağlanmalı',
        'Hipertansiyon: Kan basıncı izlenmeli',
        'Aspirin kardiyoprotektif etkisini azaltabilir',
        'En düşük etkili doz, en kısa süre kullanılmalı',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin/Antikoagülanlar: Kanama riski artar',
          'Aspirin: Aspirin kardiyoprotektif etkisi azalır',
          'ACE inhibitörleri/ARB: Antihipertansif etki azalır, böbrek hasarı riski',
          'Lityum: Lityum seviyeleri artar',
          'Metotreksat: Metotreksat toksisitesi artar',
          'Diüretikler: Diüretik etki azalır',
          'SSRI: GI kanama riski artar',
          'Kortikosteroidler: GI ülser riski artar',
        ],
        foodInteractions: [
          'Alkol: GI kanama riski artar',
          'Yemekle alınması önerilir',
        ],
        labInteractions: [
          'Kanama zamanı uzayabilir',
          'Karaciğer enzimleri yükselebilir',
          'Kreatinin yükselebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'Tam kan sayımı',
          'Karaciğer fonksiyon testleri',
          'Kan basıncı',
          'GI semptomlar',
        ],
        frequency: 'Kronik kullanımda 3 ayda bir',
        specialConsiderations: [
          'Yaşlılarda ve böbrek hastalığı olanlarda sık izlem',
          'Antikoagülan kullananları yakın takip edin',
          'Kardiyovasküler risk faktörü olanlarda dikkat',
        ],
      },
      storage: {
        temperature: '25°C altında, oda sıcaklığında',
        light: 'Işıktan korumak gerekmez',
        stability: 'Ambalajda belirtilen son kullanma tarihine kadar stabil',
      },
      pregnancyCategory:
        'C (1. ve 2. trimester), D (3. trimester) - 3. trimesterde kontrendike',
      lactation:
        'Anne sütüne minimal geçer, kısa süreli kullanımda genellikle güvenli',
      pediatricUse:
        '6 aylıktan büyük çocuklarda kullanılabilir, 6 ay altında kontrendike',
      geriatricUse:
        'Yaşlılarda %30 doz azaltımı önerilir, GI ve renal yan etkiler açısından dikkat',
      renalAdjustment:
        'GFR 30-60: Doz azaltımı düşünülmeli. GFR <30: Kullanımdan kaçının',
      hepaticAdjustment:
        'Hafif-orta Child-Pugh: Dikkatli kullanım. Ciddi: Kontrendike',
    },
  },
  {
    id: '3',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA amoxicillin label (25-45 mg/kg/DAY divided q12h; 20-40 mg/kg/DAY divided q8h)',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 3000,
    contraindications: [
      'Penisilin alerjisi',
      'Enfeksiyöz mononükleoz',
      'Sefalosporin alerjisi (çapraz reaksiyon)',
    ],
    sideEffects: [
      'İshal',
      'Bulantı',
      'Döküntü',
      'Kandida enfeksiyonu',
      'Antibiyotik ilişkili kolit',
    ],
    dosageForm: 'capsule',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 20,
      frequency: 'q12h',
      maxSingleDose: 1000,
      maxDailyDose: 3000,
      ageAdjustments: [
        { minAge: 0, maxAge: 0.25, adjustmentFactor: 0.5 }, // Yenidoğan
        { minAge: 0.25, maxAge: 12, adjustmentFactor: 1.0 },
      ],
    },
    productInfo: {
      activeIngredient: 'Amoksisilin trihidrat',
      mechanismOfAction:
        'Aminopenisilin grubu beta-laktam antibiyotik. Bakteri hücre duvarı sentezinde PBP (penisilin bağlayan proteinler) enzimlerini inhibe eder. Bakterisidal etki gösterir.',
      pharmacokinetics: {
        absorption:
          'Oral yoldan iyi emilir. Biyoyararlanım %70-90. Yemekler emilimi etkilemez.',
        distribution:
          'Vücut sıvılarına iyi dağılır. Protein bağlanma %17-20. Plasenta ve anne sütüne geçer. BOS penetrasyonu düşük (ancak menenjitte artar).',
        metabolism:
          'Minimal hepatik metabolizma. Büyük oranda değişmeden atılır.',
        elimination:
          'Böbrekler yoluyla %60-70 değişmeden atılır. Probenesid atılımı yavaşlatır.',
        halfLife: '1-1.5 saat (normal), böbrek yetmezliğinde 7-20 saat',
      },
      administration: {
        route: 'Oral, IV',
        method:
          'Oral: Yemekle veya yemeksiz alınabilir. IV: 15-30 dakikada infüzyon veya bolus',
        duration: 'IV infüzyon: 15-30 dakika',
        diluent: '0.9% NaCl veya %5 Dekstroz',
        concentration: 'IV: 50 mg/mL (maksimum)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: ['Aminoglikozidler (ayrı uygulayın)', 'Metronidazol'],
      },
      indications: [
        'Üst solunum yolu enfeksiyonları',
        'Alt solunum yolu enfeksiyonları',
        'Otitis media',
        'Sinüzit',
        'Farenjit/Tonsillit',
        'Üriner sistem enfeksiyonları',
        'Deri ve yumuşak doku enfeksiyonları',
        'H. pylori eradikasyonu (kombinasyonda)',
        'Lyme hastalığı',
        'Endokardit profilaksisi',
      ],
      contraindications: [
        'Penisilin veya beta-laktam alerjisi',
        'Enfeksiyöz mononükleoz (döküntü riski)',
        'Ciddi sefalosporin alerjisi öyküsü',
        'Penisilin kaynaklı sarılık öyküsü',
      ],
      warnings: [
        'Ciddi alerjik reaksiyon riski (anafilaksi)',
        'C. difficile ilişkili ishal izlenmeli',
        'Uzun süreli kullanımda süperenfeksiyon riski',
        'Mononükleozda döküntü riski yüksek',
        'Böbrek yetmezliğinde doz ayarı gerekli',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin: INR artışı (izlem gerekli)',
          'Metotreksat: Metotreksat atılımı yavaşlar (toksisite)',
          'Allopurinol: Döküntü riski artar',
          'Probenesid: Amoksisilin seviyeleri artar',
          'Oral kontraseptifler: Etkinlik azalabilir',
        ],
        foodInteractions: ['Yemekler emilimi etkilemez'],
        labInteractions: [
          'İdrar glukoz testlerinde yanlış pozitiflik',
          'Coombs testi pozitifleşebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Klinik yanıt (ateş, semptomlar)',
          'Böbrek fonksiyonları (uzun süreli kullanımda)',
          'İshal gelişimi (C. difficile izlemi)',
          'Alerjik reaksiyon belirtileri',
        ],
        frequency: 'Tedavi süresince klinik izlem',
        specialConsiderations: [
          'Beta-laktam alerjisi öyküsü olanlarda dikkat',
          'Böbrek yetmezliğinde doz aralığı uzatılmalı',
          'Ciddi enfeksiyonlarda doz artırılabilir (50 mg/kg)',
        ],
      },
      storage: {
        temperature:
          'Kapsül: 25°C altında. Süspansiyon: Hazırlandıktan sonra 7-14 gün buzdolabında',
        light: 'Işıktan korumak gerekmez',
        stability: 'Süspansiyon hazırlandıktan sonra 14 gün (2-8°C)',
      },
      pregnancyCategory: 'B - Hamilelikte güvenli kabul edilir',
      lactation:
        'Anne sütüne geçer, genellikle güvenli, bebekte ishal izlenmeli',
      pediatricUse: 'Yenidoğandan itibaren kullanılabilir, doz ayarı gerekli',
      geriatricUse: 'Böbrek fonksiyonuna göre doz ayarı',
      renalAdjustment: 'GFR 10-30: q12h. GFR <10: q24h veya doz %50 azalt',
      hepaticAdjustment:
        'Karaciğer yetmezliğinde genellikle doz ayarı gerekmez',
    },
  },
  {
    id: '4',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA methotrexate label (RA: fixed 7.5 mg once weekly; pJIA: 10 mg/m2 weekly; oncology protocols differ)',
    clinicalReviewNote:
      'Metotreksat dozu endikasyona göre değişir: romatoid artritte haftalık sabit 7,5-25 mg, juvenil artritte 10 mg/m2/hafta, onkolojide protokole özgü. Tek bir m2 formülü bu rejimleri karşılamaz.',
    requiresClinicalReview: true,
    name: 'Methotrexate',
    genericName: 'Methotrexate',
    category: 'Immunosuppressants',
    unit: 'mg',
    maxDailyDose: 30,
    contraindications: [
      'Pregnancy',
      'Severe liver disease',
      'Severe renal impairment',
    ],
    sideEffects: ['Nausea', 'Mouth sores', 'Liver toxicity'],
    dosageForm: 'tablet',
    calculationMethod: 'bsa',
    dosageFormula: {
      method: 'bsa',
      dosePerM2: 7.5,
      frequency: 'q7d', // weekly
      maxSingleDose: 30,
      maxDailyDose: 30,
      ageAdjustments: [{ minAge: 65, maxAge: 120, adjustmentFactor: 0.75 }],
    },
    productInfo: {
      activeIngredient: 'Metotreksat (4-amino-10-metilfolik asit)',
      mechanismOfAction:
        'Folat antagonisti antimetabolit. Dihidrofolat redüktaz enzimini inhibe ederek DNA sentezini, onarımını ve hücresel replikasyonu bozar. Romatoid artritte etki mekanizması tam bilinmemekle birlikte adenozin salınımını artırdığı düşünülmektedir.',
      pharmacokinetics: {
        absorption:
          'Düşük dozlarda (<30 mg/m²) oral emilim iyidir (%60), ancak değişkendir. Besinler emilimi geciktirir.',
        distribution:
          'Vücut dokularına geniş dağılım. Plevral effüzyon veya asitte birikebilir (üçüncü boşluk). Protein bağlanma %50.',
        metabolism:
          'Hücre içinde poliglutamat formlarına metabolize olur (uzun etkili). Karaciğerde kısmen metabolize edilir.',
        elimination:
          'Böbrekler yoluyla %80-90 değişmeden atılır. Safra ile %10 atılır.',
        halfLife:
          '3-10 saat (düşük doz), 8-15 saat (yüksek doz). Böbrek yetmezliğinde uzar.',
      },
      administration: {
        route: 'Oral, SC, IM, IV, İntratekal',
        method:
          'Oral: Haftada bir kez (günlük değil!). IV: Bolus veya infüzyon.',
        duration: 'Romatoid artrit/Sedef: Haftada tek doz.',
        diluent: '0.9% NaCl veya %5 Dekstroz',
        concentration: '25 mg/mL (enjeksiyon)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: [
          'Sitarabin',
          'Prednizolon (fiziksel geçimsizlik)',
          'Ranitidin',
        ],
      },
      indications: [
        'Romatoid Artrit',
        'Psoriasis (Şiddetli)',
        'Juvenil İdiyopatik Artrit',
        'Akut Lenfoblastik Lösemi (ALL)',
        'Ektopik gebelik',
        'Crohn hastalığı',
        'Uveit',
      ],
      contraindications: [
        'Gebelik (Kategori X) ve emzirme',
        'Ciddi karaciğer yetmezliği veya alkolizm',
        'Ciddi böbrek yetmezliği',
        'Önceden mevcut kemik iliği supresyonu',
        'Aktif enfeksiyonlar',
        'İmmün yetmezlik sendromları',
      ],
      warnings: [
        'HAFTALIK KULLANIM - Günlük kullanım ölümcül olabilir',
        'Hepatotoksisite riski (özellikle uzun süreli kullanım)',
        'İnterstisyel akciğer hastalığı (pnömonit) yapabilir',
        'Kemik iliği supresyonu yapabilir',
        'Üçüncü boşluklarda (asit, plevral sıvı) birikerek toksisiteyi artırır',
        'Teratojeniktir',
        'Folik asit takviyesi yan etkileri azaltır',
      ],
      interactions: {
        drugInteractions: [
          "NSAID'ler: Metotreksat atılımını azaltarak toksisiteyi artırır (yüksek dozda)",
          'Penisilinler/Sülfonamidler: Renal atılımı azaltır',
          'Proton Pompa İnhibitörleri (Omeprazol): Metotreksat seviyesini artırabilir',
          'Trimetoprim (Bactrim): Kemik iliği toksisitesini artırır (kaçınılmalı)',
          'Alkol: Hepatotoksisite riskini artırır',
          'Leflunomid: Hepatotoksisite riski artar',
        ],
        foodInteractions: [
          'Alkol (kesinlikle kaçınılmalı)',
          'Kafein (etkinliği azaltabilir)',
        ],
        labInteractions: [
          'Karaciğer enzimlerini yükseltir',
          'Kan sayımını düşürür',
          'Üre/Kreatinin yükseltebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Tam kan sayımı (lökosit, trombosit)',
          'Karaciğer fonksiyon testleri (AST, ALT, Albumin)',
          'Böbrek fonksiyon testleri',
          'Akciğer grafisi (başlangıçta)',
          'Hepatit B ve C serolojisi (başlangıçta)',
        ],
        frequency: 'Başlangıçta 2-4 haftada bir, stabil ise 8-12 haftada bir',
        specialConsiderations: [
          'Toksisite belirtileri: Ağız yaraları, bulantı, kusma, ishal, kuru öksürük',
          'Folik asit kullanımı (1-5 mg/gün) önerilir (MTX günleri hariç)',
          'Gebelik planlayanlarda en az 3 ay (erkek) veya 1 ovulasyon döngüsü (kadın) önce kesilmeli',
        ],
      },
      storage: {
        temperature: '25°C altında, ışıktan korunarak',
        light: 'Işıktan korunmalı',
        stability: 'Sitotoksik ilaç prosedürlerine göre saklanmalı',
      },
      pregnancyCategory:
        'X (Böbrek yetmezliği, intrauterin büyüme geriliği, iskelet anomalileri)',
      lactation: 'Anne sütüne geçer, kontrendike',
      pediatricUse:
        'JIA ve kanser tedavisinde kullanılır, doz vücut yüzey alanına göre',
      geriatricUse:
        'Böbrek fonksiyonları düşük olduğu için doz azaltılmalı ve yakın izlenmeli',
      renalAdjustment: 'GFR 10-50: Doz %50 azaltılır. GFR <10: Kullanılmaz.',
      hepaticAdjustment: 'Bilirubin >5 mg/dL ise kontrendike.',
    },
  },
  {
    id: '5',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA LANOXIN label (maintenance 3-4.5 mcg/kg/day adults and >10 y; 5.6-11.3 mcg/kg/day divided for 5-10 y)',
    clinicalReviewNote:
      'Digoksin dar terapötik aralıklıdır; idame dozu serum düzeyi, böbrek işlevi ve yaşa göre belirlenir (erişkin ve >10 yaş 3-4,5 mcg/kg/gün; 5-10 yaş 5,6-11,3 mcg/kg/gün bölünmüş). Sabit kilo başına kural bunu karşılamaz.',
    requiresClinicalReview: true,
    name: 'Digoxin',
    genericName: 'Digoxin',
    category: 'Cardiac Glycosides',
    unit: 'mcg',
    maxDailyDose: 250,
    contraindications: [
      'Ventriküler fibrilasyon',
      'Dijital toksisitesi',
      'Hipertrofik kardiyomiyopati',
      'WPW sendromu',
    ],
    sideEffects: [
      'Bulantı',
      'Kusma',
      'Aritmi',
      'Görme bozuklukları',
      'Baş ağrısı',
      'Konfüzyon',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 4,
      frequency: 'q24h',
      maxSingleDose: 250,
      maxDailyDose: 250,
      ageAdjustments: [
        { minAge: 0, maxAge: 1, adjustmentFactor: 0.5 },
        { minAge: 1, maxAge: 10, adjustmentFactor: 0.8 },
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.6 },
      ],
    },
    productInfo: {
      activeIngredient: 'Digoksin (Digitalis lanata glikozidi)',
      mechanismOfAction:
        'Na+/K+-ATPaz pompasını inhibe eder. Hücre içi kalsiyum artar, miyokardiyal kontraktilite artar (pozitif inotrop). AV iletimi yavaşlatır (negatif kronotrop). Vagal tonus artar.',
      pharmacokinetics: {
        absorption:
          'Oral biyoyararlanım %60-80 (tablet), %70-85 (likit). İnce barsaktan emilir. Yemekler emilimi geciktirir.',
        distribution:
          'Geniş dağılım hacmi (4-7 L/kg). İskelet kasına bağlanır. Protein bağlanma %20-25. Plasenta geçer.',
        metabolism:
          'Minimal hepatik metabolizma (%16). Büyük oranda değişmeden atılır.',
        elimination:
          'Böbrekler yoluyla %60-80 değişmeden atılır. Enterohepatik dolaşım var.',
        halfLife: '36-48 saat (normal), böbrek yetmezliğinde 3.5-5 gün',
      },
      administration: {
        route: 'Oral, IV',
        method:
          'Oral: Günde tek doz. IV: Yavaş bolus (5 dakikadan fazla) veya infüzyon',
        duration: 'IV bolus: minimum 5 dakika',
        diluent: '0.9% NaCl veya %5 Dekstroz (en az 4 kat seyreltme)',
        concentration: 'IV: 0.25 mg/mL (seyreltilmemiş)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: [
          'Amfoterisin B',
          'Flukonazol',
          'Propofol',
          'Pantoprazol',
        ],
      },
      indications: [
        'Atriyal fibrilasyon (hız kontrolü)',
        'Atriyal flutter',
        'Konjestif kalp yetmezliği (düşük ejeksiyon fraksiyonu)',
        'Supraventriküler taşikardi',
      ],
      contraindications: [
        'Ventriküler fibrilasyon',
        'Dijital toksisitesi veya dijital alerjisi',
        'Hipertrofik obstrüktif kardiyomiyopati',
        'WPW sendromu ile atriyal fibrilasyon',
        'İkinci veya üçüncü derece AV blok (pacemaker yoksa)',
        'Aksesuvar yol kaynaklı taşiaritmiler',
      ],
      warnings: [
        'DAR TERAPÖTİK ARALIK - Toksisite riski yüksek',
        'Hipokalemi toksisiteyi artırır - potasyum izlenmeli',
        'Hipomagnezemi toksisiteyi artırır',
        'Hiperkalsemi toksisiteyi artırır',
        'Hipotiroidizm duyarlılığı artırır',
        'Böbrek yetmezliğinde doz azaltılmalı',
        'Dijital toksisitesi belirtileri: bulantı, kusma, görme bozuklukları (sarı-yeşil haleler), bradikardi, aritmiler',
      ],
      interactions: {
        drugInteractions: [
          'Amiodaron: Digoksin seviyesi %50-100 artar - doz yarıya düşür',
          'Verapamil: Digoksin seviyesi %50-75 artar',
          'Kinidin: Digoksin seviyesi 2 kat artar',
          'Spironolakton: Digoksin seviyesi artar, atılım azalır',
          'Diüretikler (tiazid, loop): Hipokalemi ile toksisite riski',
          'Makrolid antibiyotikler: Digoksin seviyesi artar',
          'Azoller (itrakonazol): Digoksin seviyesi artar',
          'Beta-blokerler: Aditif bradikardi',
          'Kalsiyum kanal blokerleri: Aditif AV blok',
        ],
        foodInteractions: [
          'Yüksek lifli gıdalar emilimi azaltabilir',
          'St. Johns Wort digoksin seviyesini azaltır',
        ],
        labInteractions: [
          'Digoksin seviyeleri immunoassay ile ölçülür',
          'DLIS (digoxin-like immunoreactive substances) yanlış yükseklik yapabilir',
        ],
      },
      monitoring: {
        parameters: [
          'Serum digoksin seviyesi (terapötik: 0.5-2.0 ng/mL, optimal: 0.8-1.2 ng/mL)',
          'Serum potasyum',
          'Serum magnezyum',
          'Serum kalsiyum',
          'Böbrek fonksiyonları (kreatinin, BUN)',
          'EKG (PR uzaması, ST çökmesi - "digitalis etkisi")',
          'Kalp hızı',
        ],
        frequency:
          'Başlangıçta sık, stabil olduktan sonra 6-12 ayda bir. Seviye: dozdan 6-8 saat sonra alınmalı.',
        specialConsiderations: [
          'Toksisite belirtileri için hasta eğitimi',
          'Elektrolit dengesizliklerinde dikkat',
          'Kardiyoversiyon öncesi dijital kesilmeli',
          'Toksisite antidotu: Digoxin Immune Fab (Digibind)',
        ],
      },
      storage: {
        temperature: '25°C altında, oda sıcaklığında',
        light: 'Işıktan korunmalı',
        stability: 'Ambalajda belirtilen süre',
      },
      pregnancyCategory:
        'C - Plasenta geçer ancak gerekirse kullanılabilir, fetal kalp hızı izlenmeli',
      lactation: 'Anne sütüne geçer ancak bebek üzerinde önemli etki beklenmez',
      pediatricUse:
        'Yenidoğan ve süt çocuklarında doz dikkatle ayarlanmalı, mcg/kg bazında hesaplanır',
      geriatricUse:
        'Yaşlılarda böbrek fonksiyonu azalır, %40 doz azaltımı önerilir, toksisite riski yüksek',
      renalAdjustment:
        'GFR 10-50: %25-75 doz azaltımı. GFR <10: %50-75 doz azaltımı veya 48 saatte bir',
      hepaticAdjustment:
        'Karaciğer yetmezliğinde genellikle doz ayarı gerekmez (minimal hepatik metabolizma)',
    },
  },
  {
    id: '6',
    name: 'Warfarin',
    genericName: 'Warfarin',
    category: 'Anticoagulants',
    unit: 'mg',
    maxDailyDose: 10,
    contraindications: ['Active bleeding', 'Pregnancy', 'Severe liver disease'],
    sideEffects: ['Bleeding', 'Bruising', 'Hair loss'],
    dosageForm: 'tablet',
    calculationMethod: 'fixed',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 5,
      frequency: 'q24h',
      maxSingleDose: 10,
      maxDailyDose: 10,
      ageAdjustments: [
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.8 }, // Yaşlılarda daha düşük doz
      ],
    },
    productInfo: {
      activeIngredient: 'Warfarin Sodyum',
      mechanismOfAction:
        'K Vitamini Antagonisti. Karaciğerde K vitaminine bağımlı pıhtılaşma faktörlerinin (II, VII, IX, X) ve Protein C ile S sentezini inhibe eder.',
      pharmacokinetics: {
        absorption:
          'Oral yoldan tam emilir (%100). Gıdalar emilim hızını etkileyebilir ama miktarını etkilemez.',
        distribution:
          'Plazma proteinlerine (albümin) yüksek oranda (%99) bağlanır. . Vd: 0.14 L/kg.',
        metabolism:
          'Karaciğerde CYP2C9 (S-izomer) ve diğer enzimlerle inaktif metabolitlere dönüşür.',
        elimination: 'Böbrekler yoluyla metabolitler halinde atılır.',
        halfLife:
          '20-60 saat (ortalama 40 saat). Etki başlangıcı 24-72 saat, tam etki 5-7 gün.',
      },
      administration: {
        route: 'Oral',
        method: 'Günde tek doz, tercihen akşam aynı saatte.',
        duration: 'Endikasyona göre 3 ay, 6 ay veya ömür boyu.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Derin ven trombozu (DVT) tedavisi ve profilaksisi',
        'Pulmoner emboli (PE) tedavisi ve profilaksisi',
        'Atriyal fibrilasyon (inme profilaksisi)',
        'Mekanik kalp kapakları',
        'Kalp kapak hastalıkları',
        'Anti-fosfolipid sendromu',
      ],
      contraindications: [
        'Aktif kanama veya kanama diyatezi',
        'Gebelik (mekanik kapak hariç, X kategorisi)',
        'Kontrolsüz hipertansiyon (>160/100 mmHg)',
        'Ciddi karaciğer yetmezliği',
        'Kooperasyon kurulamayan hastalar (demans vb.)',
        'Yakın zamanda geçirilmiş nörocerrahi veya göz cerrahisi',
      ],
      warnings: [
        'DAR TERAPÖTİK ARALIK - Düzenli INR takibi şart',
        'Kanama riski en önemli yan etkidir',
        'Cilt nekrozu (Protein C eksikliği olanlarda)',
        'Mor parmak sendromu (kolesterol embolizasyonu)',
        'Diyetle K vitamini alımı sabit tutulmalı',
        'Başka ilaç başlamadan önce etkileşim kontrol edilmeli',
      ],
      interactions: {
        drugInteractions: [
          'INR Artıranlar (Kanama riski): Amiodaron, Metronidazol, Flukonazol, TMP-SMX, Siprofloksasin, Makrolidler, SSRI',
          'INR Azaltanlar (Pıhtı riski): Rifampisin, Karbamazepin, Fenitoin, Barbitüratlar, K Vitamini',
          'Antiplateletler (Aspirin, Klopidogrel): Kanama riskini önemli ölçüde artırır',
          "NSAID'ler: GIS kanama riskini artırır",
        ],
        foodInteractions: [
          "K Vitamininden zengin gıdalar (Yeşil yapraklı sebzeler): INR'yi düşürür. Miktar sabit tutulmalı.",
          'Alkol: Akut alım INR artırır, kronik alım azaltabilir.',
          'Kızılcık suyu (Cranberry): INR artırabilir',
        ],
        labInteractions: ['PT ve INR uzar (beklenen etki)'],
      },
      monitoring: {
        parameters: [
          'INR (Uluslararası Normalleştirilmiş Oran)',
          'Hemoglobin/Hematokrit (kanama şüphesinde)',
          'Dışkıda gizli kan',
        ],
        frequency:
          'Başlangıçta sık (günlük/haftalık), stabil dozda 4 haftada bir.',
        specialConsiderations: [
          'Hedef INR genellikle 2.0-3.0',
          'Mekanik mitral kapak için hedef 2.5-3.5',
          'INR >5.0 ise vit K veya doz atlama, kanama varsa PCC/TDP',
        ],
      },
      storage: {
        temperature: '25°C altında oda sıcaklığında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory:
        'X (D - mekanik kapaklı yüksek riskli hastalarda). Fetal Warfarin Sendromu yapar.',
      lactation:
        'Anne sütüne geçmez veya çok az geçer. Emzirme güvenli kabul edilir.',
      pediatricUse: 'Çocuklarda kullanılabilir, sıkı INR takibi gerekir.',
      geriatricUse:
        'Yaşlılar warfarine daha duyarlıdır, düşük doz başlanmalı (örn. 2.5-5 mg).',
      renalAdjustment: 'Doz ayarlaması gerekmez, ancak kanama riski artabilir.',
      hepaticAdjustment: 'INR cevabı artar, dikkatli doz ayarı gerekli.',
    },
  },
  {
    id: '7',
    name: 'Insulin Regular',
    genericName: 'Insulin Human',
    category: 'Antidiabetics',
    unit: 'units',
    maxDailyDose: 100,
    contraindications: ['Hypoglycemia', 'Allergy to insulin'],
    sideEffects: ['Hypoglycemia', 'Weight gain', 'Injection site reactions'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 0.5,
      frequency: 'q8h',
      maxSingleDose: 20,
      maxDailyDose: 100,
      ageAdjustments: [{ minAge: 0, maxAge: 5, adjustmentFactor: 0.8 }],
    },
    productInfo: {
      activeIngredient: 'İnsülin Human (rDNA kökenli)',
      mechanismOfAction:
        'Kısa etkili insülin. İnsülin reseptörlerine bağlanarak glukozun hücre içine girmesini sağlar. Karaciğerde glukoz üretimini baskılar. Lipoliz ve proteolizi inhibe eder.',
      pharmacokinetics: {
        absorption:
          'SC uygulamadan sonra 30-60 dakikada emilir. Etki başlangıcı 30-60 dk.',
        distribution: 'Hücre dışı sıvıda dağılır. Vd: 0.15 L/kg.',
        metabolism:
          'Karaciğer (%50) ve böbreklerde (%50) insülinaz enzimi ile metabolize olur.',
        elimination:
          'Yarı ömrü birkaç dakikadır ancak etki süresi reseptör bağlarına bağlıdır.',
        halfLife: 'IV: 5-10 dk, SC etki süresi: 6-8 saat.',
      },
      administration: {
        route: 'SC, IV, IM',
        method:
          'Yemeklerden 30 dakika önce SC. Acil durumlarda (DKA) IV infüzyon/bolus.',
        duration: 'Etki piki: 2-4 saat. Etki süresi: 6-8 saat.',
        diluent: '0.9% NaCl (IV kullanım için)',
        concentration: '100 IU/mL',
        compatibility: ['0.9% NaCl', 'KCL solüsyonları'],
        incompatibility: [
          'Aminofilin',
          'Fenitoin',
          'Tiyopental',
          'Dopamin (yüksek pH)',
        ],
      },
      indications: [
        'Tip 1 Diyabet',
        'Tip 2 Diyabet (oral antidiyabetiklerin yetersiz olduğu veya kontrendike olduğu durumlarda)',
        'Diyabetik Ketoasidoz (DKA) - IV yol',
        'Hiperozmolar Hiperglisemik Durum (HHS)',
        'Gebelik diyabeti',
        'Hiperkalemi tedavisi (glukoz ile birlikte)',
      ],
      contraindications: ['Hipoglisemi', 'İnsülin veya krezol alerjisi'],
      warnings: [
        'En önemli yan etki HİPOGLİSEMİDİR',
        'Enjeksiyon yeri rotasyonu yapılmalı (lipodistrofi riski)',
        'Böbrek ve karaciğer yetmezliğinde insülin ihtiyacı azalabilir',
        'Enfeksiyon, stres, travma insülin ihtiyacını artırır',
        'Hipokalemi yapabilir (hücre içine potasyum sokar)',
      ],
      interactions: {
        drugInteractions: [
          'Hipoglisemi riskini artıranlar: Oral antidiyabetikler, ACE inhibitörleri, Fluoksetin, Salisilatlar',
          'Kan şekerini yükseltenler: Kortikosteroidler, Danazol, Diüretikler, Sempatomimetikler, Tiroid hormonları',
          'Beta-blokerler: Hipoglisemi belirtilerini (taşikardi) maskeleyebilir',
          'Alkol: Hipoglisemi riskini artırır ve uzatır',
        ],
        foodInteractions: [
          'Öğün atlama veya yetersiz karbonhidrat alımı hipoglisemiye neden olur.',
        ],
        labInteractions: [
          'Kan potasyumunu düşürür',
          'Kan magnezyum ve fosforunu düşürebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Kan Glukozu (açlık, tokluk, gece)',
          'HbA1c (3 ayda bir)',
          'Hipoglisemi semptomları',
          'Kilo takibi',
          'Potasyum (IV kullanımda)',
        ],
        frequency:
          'Tip 1 DM: Günde en az 4 kez. Tip 2 DM: Bireysel hedefe göre.',
        specialConsiderations: [
          'Hipoglisemi tedavisi: 15-20g hızlı karbonhidrat (meyve suyu, kesme şeker)',
          'DKA tedavisinde potasyum <3.3 mEq/L ise insülin verilmez (önce K replasmanı)',
        ],
      },
      storage: {
        temperature:
          'Açılmamış: 2-8°C (buzdolabı). Açılmış: Oda ısısında (25°C altı) 4 hafta.',
        light: 'Işıktan ve dondan korunmalı.',
        stability: 'Donmuş insülin kullanılmamalıdır.',
      },
      pregnancyCategory:
        'B - Gebelikte tercih edilen diyabet tedavisidir. Plasentayı geçmez.',
      lactation:
        'Emzirme döneminde güvenle kullanılabilir. İnsülin ağızdan alınırsa bebek sindirir, etkisizdir.',
      pediatricUse: 'Çocuklarda güvenle kullanılır.',
      geriatricUse:
        'Yaşlılarda hipoglisemi riski daha yüksektir ve daha tehlikelidir (düşme riski). Hedefler gevşetilebilir.',
      renalAdjustment:
        'GFR 10-50: Doz %25 azaltılır. GFR <10: Doz %50 azaltılır.',
      hepaticAdjustment:
        'İnsülin metabolizması yavaşlar, doz azaltımı gerekebilir.',
    },
  },
  {
    id: '8',
    name: 'Prednisolone',
    genericName: 'Prednisolone',
    category: 'Corticosteroids',
    unit: 'mg',
    maxDailyDose: 80,
    contraindications: [
      'Systemic fungal infections',
      'Allergy to corticosteroids',
    ],
    sideEffects: ['Weight gain', 'Mood changes', 'Increased infection risk'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 1,
      frequency: 'q24h',
      maxSingleDose: 40,
      maxDailyDose: 80,
      ageAdjustments: [{ minAge: 65, maxAge: 120, adjustmentFactor: 0.9 }],
    },
    productInfo: {
      activeIngredient: 'Prednizolon',
      mechanismOfAction:
        'Sentetik glukokortikoid. Anti-inflamatuar ve immünsüpresif. Lökosit migrasyonunu engeller, kapiller geçirgenliği azaltır, enflamatuar mediatörleri baskılar.',
      pharmacokinetics: {
        absorption: 'Oral yoldan iyi emilir. Biyoyararlanım yüksektir.',
        distribution:
          'Protein bağlanma %70-90. Vd: 0.2-1.3 L/kg. Kan-beyin bariyerini geçer.',
        metabolism:
          'Karaciğerde metabolize olur (Prednizon karaciğerde aktif prednizolona döner).',
        elimination: 'İdrarla atılır.',
        halfLife: '2-4 saat (plazma), 12-36 saat (biyolojik etki).',
      },
      administration: {
        route: 'Oral, Topikal, Oftalmik',
        method:
          'Oral dozlar sabah tek doz (sirkadiyen ritme uygun) ve tok karna alınmalıdır.',
        duration:
          'Akut durumlarda kısa süreli, kronik hastalıklarda uzun süreli (tedricen azaltarak kesilmeli).',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Otoimmün hastalıklar (SLE, Romatoid Artrit)',
        'Alerjik reaksiyonlar ve Astım',
        'İnflamatuar barsak hastalıkları (Crohn, Ülseratif Kolit)',
        'Nefrotik sendrom',
        'Transplantasyon (reddi önleme)',
        'Bazı kanser türleri (Lösemi, Lenfoma)',
        'Bell paralizisi',
      ],
      contraindications: [
        'Sistemik mantar enfeksiyonları',
        'Canlı aşı uygulaması (immünsüpresif dozlarda)',
        'Aktif tedavi edilmemiş enfeksiyonlar',
        'Kortikosteroid aşırı duyarlılığı',
        'Herpes simplex keratiti',
      ],
      warnings: [
        'Aniden kesilmemeli (Adrenal yetmezlik riski)',
        'İmmünsüpresyon ve enfeksiyon riskini artırır',
        'Peptik ülser riski (özellikle NSAID ile)',
        'Osteoporoz riski (uzun süreli kullanımda)',
        'Hiperglisemi ve diyabet gelişimi',
        'Psikiyatrik etkiler (öfori, uykusuzluk, depresyon)',
        'Çocuklarda büyüme geriliği',
      ],
      interactions: {
        drugInteractions: [
          "NSAID'ler: Gastrointestinal kanama riski artar",
          'Warfarin: Etkisi değişebilir (artabilir veya azalabilir), INR takibi',
          'Antidiyabetikler: Kan şekeri yükselir, doz ayarlaması gerekebilir',
          'Canlı aşılar: Kontrendikedir',
          'Fenitoin/Rifampisin: Steroid etkisini azaltır (metabolizmayı hızlandırır)',
          'Diüretikler: Hipokalemi riski artar',
        ],
        foodInteractions: [
          'Tuz kısıtlaması gerekebilir (su tutulumu). Kalsiyum ve D vit desteği önerilir.',
          'Meyan kökü hipokalemiyi artırabilir.',
        ],
        labInteractions: [
          'Lökositoz (enfeksiyon olmadan da)',
          'Hiperglisemi',
          'Hipokalemi',
          'Kolesterol artışı',
        ],
      },
      monitoring: {
        parameters: [
          'Kan basıncı',
          'Kan glukozu',
          'Elektrolitler (K, Na)',
          'Kilo takibi (ödem)',
          'Göz muayenesi (katarakt, glokom - uzun süreli kullanımda)',
          'Kemik yoğunluğu (uzun süreli kullanımda)',
        ],
        frequency: 'Doz ve süreye göre değişir.',
        specialConsiderations: [
          'Uzun süre kullananlarda stres dozları (cerrahi, travma) gerekebilir',
          'Mide koruyucu (PPI) gerekebilir',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory:
        'C (D bazı durumlarda). Plasentayı geçer. Yarık damak riski, adrenal yetmezlik riski.',
      lactation:
        'Anne sütüne geçer. Yüksek dozlarda (>40mg) emzirmeden 4 saat beklenmeli.',
      pediatricUse:
        'Büyüme geriliği yapabilir, boy takibi önemli. En düşük etkili doz verilmeli.',
      geriatricUse:
        'Yan etkilere (diyabet, osteoporoz, hipertansiyon) daha duyarlı.',
      renalAdjustment: 'Doz ayarı gerekmez ancak sodyum/su tutulumuna dikkat.',
      hepaticAdjustment:
        'Prednizolon (aktif form) karaciğer yetmezliğinde prednizona (inaktif) tercih edilir.',
    },
  },
  {
    id: '9',
    name: 'Furosemide',
    genericName: 'Furosemide',
    category: 'Diuretics',
    unit: 'mg',
    maxDailyDose: 600,
    contraindications: [
      'Anüri',
      'Ciddi elektrolit dengesizliği',
      'Hepatik koma',
      'Sülfonamid alerjisi',
    ],
    sideEffects: [
      'Dehidratasyon',
      'Elektrolit dengesizliği',
      'İşitme kaybı',
      'Hipotansiyon',
      'Hiperglisemi',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 1,
      frequency: 'q12h',
      maxSingleDose: 200,
      maxDailyDose: 600,
      ageAdjustments: [
        { minAge: 0, maxAge: 1, adjustmentFactor: 0.5 },
        { minAge: 65, maxAge: 120, adjustmentFactor: 0.8 },
      ],
    },
    productInfo: {
      activeIngredient:
        'Furosemid (4-kloro-N-furfuril-5-sülfamoilanthranilik asit)',
      mechanismOfAction:
        'Loop diüretik. Henle kulpunun çıkan kalın kolunda Na+/K+/2Cl- kotransportörünü inhibe eder. Güçlü, hızlı ve kısa süreli diürez sağlar. Venodilatasyon ile preload azaltır.',
      pharmacokinetics: {
        absorption:
          'Oral biyoyararlanım %60-70. Etki 30-60 dakikada başlar. Yemekler emilimi yavaşlatır.',
        distribution:
          'Protein bağlanma %91-99. Plasenta ve anne sütüne geçer. Vd: 0.1-0.2 L/kg',
        metabolism:
          'Karaciğerde minimal metabolizma. %50 glukuronidasyona uğrar.',
        elimination:
          'Böbrekler yoluyla %60-90 atılır. Tübüler sekresyon önemli.',
        halfLife:
          '1-2 saat (normal), böbrek yetmezliğinde 9-10 saat, karaciğer yetmezliğinde 2-3 saat',
      },
      administration: {
        route: 'Oral, IV, IM',
        method:
          'IV: Yavaş bolus (1-2 dakika, 4 mg/dk aşılmamalı) veya infüzyon. Hızlı infüzyon ototoksik!',
        duration:
          'IV bolus: minimum 1-2 dakika. Yüksek dozlarda infüzyon: 4 mg/dk',
        diluent: '0.9% NaCl veya %5 Dekstroz',
        concentration:
          'IV: 10 mg/mL (seyreltilmemiş) veya 1-2 mg/mL (infüzyon)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: [
          'Amiodaron',
          'Diltiazem',
          'Dobutamin',
          'Dopamin',
          'Milrinon',
          'Ondansetron',
        ],
      },
      indications: [
        'Konjestif kalp yetmezliğine bağlı ödem',
        'Akut pulmoner ödem',
        'Kronik böbrek hastalığında ödem',
        'Karaciğer sirozuna bağlı asit',
        'Akut böbrek yetmezliği (oligürik fazda)',
        'Hipertansif kriz (yardımcı)',
        'Hiperkalsemi',
        'Hiperkalemi (acil)',
      ],
      contraindications: [
        'Anüri veya renal shutdown',
        'Hepatik koma veya prekoma',
        'Ciddi hipokalemi veya hiponatremi',
        'Hipovolemi veya dehidratasyon',
        'Sülfonamid alerjisi',
        'Digoksin toksisitesi ile birlikte hipokalemi',
      ],
      warnings: [
        'ELEKTROLİT DENGESİZLİĞİ - Potasyum, sodyum, magnezyum izlenmeli',
        'Hızlı IV uygulama OTOTOKSİSİTE yapabilir (kalıcı işitme kaybı)',
        'Hipovolemi ve hipotansiyon gelişebilir',
        'Diyabetiklerde hiperglisemi yapabilir',
        'Gut ataklarını tetikleyebilir (hiperürisemi)',
        'Digoksin alanlarda hipokalemi toksisiteyi artırır',
        'Fotosensitivite olabilir',
      ],
      interactions: {
        drugInteractions: [
          'Digoksin: Hipokalemi dijital toksisitesini artırır',
          'Aminoglikozidler: Aditif ototoksisite ve nefrotoksisite',
          'NSAIDler: Diüretik etki azalır, böbrek yetmezliği riski',
          'ACE inhibitörleri: Aşırı hipotansiyon riski (ilk doz)',
          'Lityum: Lityum seviyeleri artar (toksisite)',
          'Kortikosteroidler: Hipokalemi riski artar',
          'Antihipertansifler: Aditif hipotansiyon',
          'Sisplatin: Ototoksisite ve nefrotoksisite artar',
        ],
        foodInteractions: [
          'Potasyumdan zengin gıdalar tüketimi önerilir (kaybı telafi için)',
        ],
        labInteractions: [
          'Glukoz yükselebilir',
          'Ürik asit yükselebilir',
          'Potasyum, sodyum, klor düşebilir',
          'Kalsiyum düşebilir',
          'BUN ve kreatinin yükselebilir (prerenal)',
        ],
      },
      monitoring: {
        parameters: [
          'Serum elektrolitleri (K, Na, Cl, Mg, Ca)',
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'Kan basıncı',
          'İdrar çıkışı',
          'Kilo (günlük)',
          'İşitme (yüksek doz veya uzun süreli kullanımda)',
          'Kan şekeri (diyabetiklerde)',
        ],
        frequency:
          'Başlangıçta sık (günlük elektrolitler), stabil olduktan sonra haftalık-aylık',
        specialConsiderations: [
          'Potasyum düşükse potasyum replasmanı veya K-tutucu diüretik ekle',
          'Yaşlılarda daha dikkatli titre et',
          'Sabah veya öğleden önce ver (gece idrara kalkma önlenir)',
        ],
      },
      storage: {
        temperature: '25°C altında, oda sıcaklığında',
        light: 'Işıktan korunmalı (sarı renk bozulursa kullanılmaz)',
        stability: 'IV solüsyon 24 saat oda sıcaklığında stabil',
      },
      pregnancyCategory: 'C - Gerekli olmadıkça kullanılmamalı, plasenta geçer',
      lactation:
        'Anne sütüne geçer ve laktasyonu baskılayabilir, dikkatli kullanım',
      pediatricUse:
        'Yenidoğanda dikkatli kullanım, 1-2 mg/kg IV, maksimum 6 mg/kg/gün',
      geriatricUse:
        'Yaşlılarda düşük başlangıç dozu, elektrolitler yakın izlenmeli',
      renalAdjustment:
        'GFR <30: Daha yüksek dozlar gerekebilir (direnç). Anüride kontrendike.',
      hepaticAdjustment:
        'Sirozu olan hastalarda hepatik koma tetiklenebilir, dikkatli titre',
    },
  },
  {
    id: '10',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitors',
    unit: 'mg',
    maxDailyDose: 80,
    contraindications: ['Allergy to omeprazole'],
    sideEffects: ['Headache', 'Nausea', 'Vitamin B12 deficiency'],
    dosageForm: 'capsule',
    calculationMethod: 'age',
    dosageFormula: {
      method: 'age',
      fixedDose: 20,
      frequency: 'q24h',
      maxSingleDose: 40,
      maxDailyDose: 80,
      ageAdjustments: [
        { minAge: 65, maxAge: 120, adjustmentFactor: 1.0 }, // Yaşlılarda doz ayarlaması gerekmez ancak maksimum 20mg önerilebilir (Asyalı hastalarda)
      ],
    },
    productInfo: {
      activeIngredient: 'Omeprazol',
      mechanismOfAction:
        'Proton Pompası İnhibitörü (PPI). Mide paryetal hücrelerinde H+/K+-ATPaz enzim sistemini (proton pompası) geri dönüşümsüz olarak inhibe ederek asit salgısını baskılar.',
      pharmacokinetics: {
        absorption:
          'İnce barsaktan hızla emilir (aside dayanıksızdır, enterik kaplı tablet). Biyoyararlanım %30-40 (tekrarlayan dozlarda %60).',
        distribution: 'Protein bağlanma %95. Vd: 0.3 L/kg.',
        metabolism: 'Karaciğerde CYP2C19 ve CYP3A4 ile tam metabolize olur.',
        elimination:
          'İdrarla (%77) metabolit olarak atılır. Değişmeden atılmaz.',
        halfLife:
          '0.5-1 saat (ancak etki süresi >24 saat irreversible inhibisyon nedeniyle).',
      },
      administration: {
        route: 'Oral, IV',
        method:
          'Kahvaltıdan 30-60 dakika önce aç karna alınmalıdır. Tabletler çiğnenmemelidir.',
        duration: 'Ülser: 4-8 hafta. GÖRH: Uzun süreli. H.pylori: 7-14 gün.',
        diluent: 'IV flakon sadece kendi çözücüsü veya %5 Dekstroz/SF ile.',
        concentration: '4 mg/mL (IV infüzyon)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Diğer ilaçlarla karıştırılmamalıdır.'],
      },
      indications: [
        'Gastroözofageal Reflü Hastalığı (GÖRH)',
        'Peptik Ülser (Gastrik ve Duodenal)',
        'Zollinger-Ellison Sendromu',
        'NSAID ilişkili ülser profilaksisi ve tedavisi',
        'H. pylori eradikasyonu (kombinasyon tedavisi)',
      ],
      contraindications: [
        'Omeprazol veya diğer PPI alerjisi',
        'Rilpivirin içeren ürünlerle birlikte kullanım',
      ],
      warnings: [
        'Mide malignitesini maskeleyebilir (önce endoskopi)',
        'Uzun süreli kullanımda B12 vitamini eksikliği',
        'Hipomagnezemi riski (uzun süreli kullanımda)',
        'Kemik kırığı riskinde artış (yüksek doz/uzun süre)',
        'C. difficile ishali riski',
        'Klopidogrel etkinliğini azaltabilir',
      ],
      interactions: {
        drugInteractions: [
          'Klopidogrel: Aktif metabolite dönüşümü engellenir, antiplatelet etki azalır (Pantoprazol tercih edilir)',
          'Metotreksat: MTX seviyelerini artırabilir (toksisite)',
          'Warfarin: INR artışı yapabilir',
          'Digoksin: Emilimi artar (pH artışına bağlı)',
          'Azol antifungaller (İtrakonazol): Emilimi azalır (asit gerekir)',
          'Sitalopram/Essitalopram: QT uzaması riski (doz kısıtlaması gerekebilir)',
        ],
        foodInteractions: ['Yemek emilimi geciktirir, aç karna alınmalıdır.'],
        labInteractions: [
          'Kromogranin A (CgA) seviyeleri artar',
          'Magnezisyon seviyesi düşebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Magnezyum (uzun süreli kullanımda)',
          'B12 Vitamini (yıllık)',
          'Kemik yoğunluğu (riskli hastalarda)',
        ],
        frequency: 'Semptomatik izlem',
        specialConsiderations: [
          'Klopidogrel alanlarda etkileşim riski değerlendirilmeli',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan/nemden korunmalı',
        stability: '-',
      },
      pregnancyCategory:
        'C (genel kabul), ancak bazı kaynaklarda güvenli kabul edilir. Zorunlu olmadıkça kullanılmamalı.',
      lactation: 'Anne sütüne geçer. Önerilmez.',
      pediatricUse: '1 yaş üstü çocuklarda kullanılabilir.',
      geriatricUse: 'Doz ayarlaması gerekmez. Kemik erimesi riskine dikkat.',
      renalAdjustment: 'Doz ayarlaması gerekmez.',
      hepaticAdjustment:
        'Ciddi karaciğer yetmezliğinde doz 10-20 mg/gün ile sınırlandırılmalı (yarı ömür uzar).',
    },
  },
  // Additional drugs for performance testing
  {
    id: '11',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Analgesics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: [
      'Active bleeding',
      'Peptic ulcer',
      'Allergy to aspirin',
    ],
    sideEffects: ['GI bleeding', 'Nausea', 'Tinnitus'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q6h',
      maxSingleDose: 1000,
      maxDailyDose: 4000,
      ageAdjustments: [
        { minAge: 0, maxAge: 12, adjustmentFactor: 0 }, // 12 yaş altı Reye Sendromu riski nedeniyle antiviral amaçlı kullanılmaz (Kawasaki hariç)
        { minAge: 12, maxAge: 16, adjustmentFactor: 0.8 },
      ],
    },
    productInfo: {
      activeIngredient: 'Asetilsalisilik Asit (ASA)',
      mechanismOfAction:
        'COX-1 ve COX-2 enzimlerinin geri dönüşümsüz inhibitörü. Trombositlerde Tromboksan A2 üretimini engelleyerek ömür boyu (7-10 gün) antiplatelet etki sağlar. Yüksek dozlarda analjezik, antipiretik, anti-inflamatuar.',
      pharmacokinetics: {
        absorption:
          'Hızla emilir. Biyoyararlanım %50-75 (ilk geçiş etkisi). Enterik kaplı tabletlerde emilim gecikir.',
        distribution: 'Geniş dağılım. Anne sütü ve plasentaya geçer.',
        metabolism: 'Karaciğerde salisilik asite hidrolize olur.',
        elimination: 'Böbrekler yoluyla atılır. Alkali idrarda atılım artar.',
        halfLife:
          'ASA: 15-20 dk. Salisilik asit: 2-3 saat (düşük doz), 15-30 saat (yüksek doz).',
      },
      administration: {
        route: 'Oral',
        method:
          'MI şüphesinde çiğnenmeli (300mg). Kronik kullanımda tok karna bol su ile.',
        duration: 'Profilakside ömür boyu.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Akut Koroner Sendrom (MI, Angina)',
        'İskemik İnme (Felç) Profilaksisi',
        'Kardiyovasküler Koruma (Sekonder profilaksi)',
        'Ağrı ve Ateş (Erişkinlerde)',
        'Kawasaki Hastalığı',
        'Romatizmal Ateş',
      ],
      contraindications: [
        'Aktif peptik ülser veya GI kanama',
        'Kanama bozuklukları (Hemofili vb.)',
        'Aspirin/NSAID alerjisi ve astım (Samter triadı)',
        'Çocuklarda viral enfeksiyonlar (Reye Sendromu riski)',
        'Ciddi böbrek veya karaciğer yetmezliği',
      ],
      warnings: [
        'Kanama riski artar',
        'Cerrahi öncesi 7 gün önce kesilmeli',
        'Astım ataklarını tetikleyebilir',
        'Reye Sedromu: Çocuklarda viral hastalıklarda kullanılmamalı',
        'Kulak çınlaması (Tinnitus) doz aşımı belirtisidir',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin/Antikoagülanlar: Kanama riski ciddi oranda artar',
          'İbuprofen: Aspirinin antiplatelet etkisini engelleyebilir (önce aspirin alınmalı)',
          'Metotreksat: MTX atılımını azaltır (toksisite)',
          'Kortikosteroidler: GI ülser riski artar',
          'Alkol: GI kanama riski artar',
          'ACE İnhibitörleri: Böbrek yetmezliği riski',
        ],
        foodInteractions: ['Alkolle alınmamalıdır.'],
        labInteractions: [
          'Kanama zamanı uzar',
          'Kreatinin, Ürik Asit seviyelerini etkileyebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Kanama belirtileri',
          'Tam kan sayımı (kronik kullanım)',
          'Dışkıda gizli kan',
          'Böbrek fonksiyonları',
        ],
        frequency: 'Yıllık (profilakside)',
        specialConsiderations: [
          'MI şüphesinde 160-325 mg çiğnetilmeli',
          'Düşük doz (75-100 mg) profilaksi için yeterlidir',
        ],
      },
      storage: {
        temperature: '25°C altında, nemden uzak',
        light: '-',
        stability: 'Sirke kokusu varsa bozulmuştur (hidroliz).',
      },
      pregnancyCategory:
        'C (1. ve 2. trimesterde), D (3. trimesterde - erken duktus kapanması, kanama riski).',
      lactation:
        'Anne sütüne geçer. Düşük dozda dikkatli kullanılabilir, yüksek dozda önerilmez (Reye riski).',
      pediatricUse:
        'KONTRENDİKE (Viral enfeksiyonlarda Reye Sendromu). Sadece Kawasaki hastalığında uzman kontrolünde.',
      geriatricUse:
        'Kanama riski artar, dikkatli olunmalı. Ancak KV koruma faydası yüksektir.',
      renalAdjustment: 'GFR <10: Kullanımdan kaçınılmalı.',
      hepaticAdjustment:
        'Ciddi karaciğer yetmezliğinde kaçınılmalı (pıhtılaşma bozukluğu riski).',
    },
  },
  {
    id: '12',
    name: 'Metformin',
    genericName: 'Metformin',
    category: 'Antidiabetics',
    unit: 'mg',
    maxDailyDose: 2550,
    contraindications: ['Severe renal impairment', 'Lactic acidosis'],
    sideEffects: ['GI upset', 'Lactic acidosis', 'Vitamin B12 deficiency'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q12h',
      maxSingleDose: 1000,
      maxDailyDose: 2550,
      ageAdjustments: [
        { minAge: 0, maxAge: 10, adjustmentFactor: 0 },
        { minAge: 80, maxAge: 120, adjustmentFactor: 0.5 },
      ],
    },
    productInfo: {
      activeIngredient: 'Metformin Hidroklorür',
      mechanismOfAction:
        'Biguanid grubu oral antidiyabetik. Karaciğerde glukoz üretimini (glukoneogenez) azaltır, barsaktan glukoz emilimini azaltır ve periferde insülin duyarlılığını artırır (glukoz uptake). Hipoglisemi yapmaz.',
      pharmacokinetics: {
        absorption:
          'İnce barsaktan yavaşça tam emilmez. Biyoyararlanım %50-60. Yemekle emilim azalır.',
        distribution:
          'Eritrositlere dağılır. Proteinlere bağlanmaz. Vd: 654 L.',
        metabolism: 'Metabolize olmaz.',
        elimination:
          'Böbrekler yoluyla %90 değişmeden atılır (tübüler sekresyon).',
        halfLife: '6.2 saat (plazma), 17.6 saat (kan).',
      },
      administration: {
        route: 'Oral',
        method:
          'Yemeklerle birlikte veya yemekten hemen sonra (GI yan etkileri azaltmak için).',
        duration: 'Kronik kullanım.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Tip 2 Diyabet (ilk basamak tedavi)',
        'Prediyabet',
        'Polikistik Over Sendromu (PKOS)',
        'Gestasyonel Diyabet (bazı durumlarda)',
      ],
      contraindications: [
        'Ciddi böbrek yetmezliği (GFR <30 mL/dk)',
        'Akut veya kronik metabolik asidoz (DKA)',
        'Doku hipoksisi durumları (kalp yetmezliği, solunum yetmezliği)',
        'İyotlu kontrast madde kullanımı (işlem günü ve sonrası)',
        'Ciddi karaciğer yetmezliği',
      ],
      warnings: [
        'LAKTİK ASİDOZ RİSKİ (Nadir ama ölümcül) - Böbrek yetmezliği, hipoksi, sepsis, alkolizm durumunda risk artar',
        'Uzun süreli kullanımda B12 vitamini eksikliği yapabilir',
        'İyotlu kontrast öncesi kesilmeli (48 saat önce ve sonra)',
        'Cerrahi öncesi kesilmeli',
      ],
      interactions: {
        drugInteractions: [
          'İyotlu Kontrast Maddeler: Akut böbrek yetmezliği ve laktik asidoz riski',
          'Alkol: Laktik asidoz riskini artırır',
          'Diüretikler, ACEi, ARB: Böbrek fonksiyonunu bozarak metformin birikimine yol açabilir',
          'Simetidin: Metformin atılımını azaltır',
        ],
        foodInteractions: ['Alkol akut ve kronik kullanımda riskli.'],
        labInteractions: [
          'B12 düzeyini düşürür',
          'İdrar keton testlerini yanlış pozitif yapabilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (GFR takibi şart)',
          'HbA1c ve kan şekeri',
          'B12 Vitamini (yıllık)',
          'Laktik asidoz belirtileri (halsizlik, kas ağrısı, solunum sıkıntısı)',
        ],
        frequency: 'GFR en az yılda bir, riskli hastalarda 3-6 ayda bir.',
        specialConsiderations: [
          'GFR 30-45 arası doz yarısı verilir (takip sıklaşır)',
          'GFR <30 ise kesilir',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory:
        'B. Gebelikte kullanılabilir (insülin ilk tercih olsa da metformin de güvenli kabul edilmektedir).',
      lactation: 'Anne sütüne geçer. Genellikle güvenli kabul edilir.',
      pediatricUse: '10 yaş üstü çocuklarda Tip 2 DM için onaylıdır.',
      geriatricUse:
        'Böbrek fonksiyonları azaldığı için düşük doz başlanmalı, GFR 80 yaş üstünde dikkatle izlenmeli.',
      renalAdjustment:
        'GFR 45-60: İzlem. GFR 30-45: Maks 1000mg/gün. GFR <30: Kontrendike.',
      hepaticAdjustment:
        'Laktik asidoz riski nedeniyle karaciğer yetmezliğinde kaçınılmalı.',
    },
  },
  {
    id: '13',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Antihypertensives',
    unit: 'mg',
    maxDailyDose: 40,
    contraindications: ['Pregnancy', 'Bilateral renal artery stenosis'],
    sideEffects: ['Dry cough', 'Hyperkalemia', 'Angioedema'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 0.1,
      frequency: 'q24h',
      maxSingleDose: 40,
      maxDailyDose: 40,
    },
    productInfo: {
      activeIngredient: 'Lisinopril',
      mechanismOfAction:
        "Anjiyotensin Dönüştürücü Enzim (ACE) inhibitörü. Anjiyotensin I'in vazokonstriktör Anjiyotensin II'ye dönüşümünü engeller. Aldosteron salınımını azaltır. Bradikinin yıkımını da engeller (öksürük nedeni). Vazodilatasyon yapar.",
      pharmacokinetics: {
        absorption:
          'Oral emilim %25 (değişken). Besinler emilimi etkilemez. Ön ilaç değildir (kaptopril gibi).',
        distribution: 'Proteine bağlanmaz. Vd: 124 L.',
        metabolism: 'Metabolize olmaz.',
        elimination: 'Böbrekler yoluyla tamamen değişmeden atılır.',
        halfLife: '12 saat.',
      },
      administration: {
        route: 'Oral',
        method: 'Günde tek doz, her gün aynı saatte. Aç veya tok.',
        duration: 'Kronik hipertansiyon/kalp yetmezliği tedavisi.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Hipertansiyon',
        'Kalp Yetersizliği (Sistolik)',
        'Akut Miyokard İnfarktüsü (ilk 24 saat içinde)',
        'Diyabetik nefropati (Renal koruma)',
      ],
      contraindications: [
        'Gebelik (2. ve 3. trimesterde kesin, 1. trimesterde önerilmez)',
        'Herediter veya idiyopatik anjiyoödem öyküsü',
        'ACE inhibitörü kaynaklı anjiyoödem öyküsü',
        'Bilateral renal arter darlığı',
        'Aliskiren ile birlikte kullanım (diyabetiklerde)',
      ],
      warnings: [
        'Anjiyoödem (Dudak, dil, boğaz şişmesi) acil durumdur',
        'Kuru öksürük yapabilir (bradikinin birikimi)',
        'Hiperkalemi riski',
        'İlk doz hipotansiyonu',
        'Böbrek fonksiyonlarında bozulma (özellikle renal arter darlığında)',
        'Nötropeni/Agranülositoz (nadir)',
      ],
      interactions: {
        drugInteractions: [
          'Potasyum tutucu diüretikler/Potasyum takviyesi: Hiperkalemi riski',
          "NSAID'ler: Antihipertansif etki azalır, böbrek yetmezliği riski artar",
          'Lityum: Lityum toksisitesi artar',
          'Diüretikler: Hipotansiyon riski artar',
          'İnsülin/Oral antidiyabetikler: Hipoglisemi riski',
        ],
        foodInteractions: ['Potasyum içeren tuzlar ve gıdalarla dikkat.'],
        labInteractions: [
          'BUN ve Kreatinin artışı',
          'Potasyum artışı',
          'Karaciğer enzimleri artışı (nadir)',
        ],
      },
      monitoring: {
        parameters: [
          'Kan basıncı',
          'Böbrek fonksiyonları (BUN, Kreatinin)',
          'Serum Potasyum',
          'Anjiyoödem belirtileri',
        ],
        frequency: 'Başlangıçtan 1-2 hafta sonra, sonra periyodik.',
        specialConsiderations: [
          "Kreatininde %30'a kadar artış normal kabul edilebilir, daha fazlasında kesilmelidir.",
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Nemden korunmalı',
        stability: '-',
      },
      pregnancyCategory:
        'D (Özellikle 2. ve 3. trimesterde oligohidramniyos, renal yetmezlik, ölüm riski). Gebelik tespit edilince hemen kesilmeli.',
      lactation: 'Anne sütüne geçip geçmediği bilinmiyor. Önerilmez.',
      pediatricUse:
        '6 yaş üstü hipertansif çocuklarda kullanılabilir. GFR<30 ise önerilmez.',
      geriatricUse: 'Düşük doz başlanır, böbrek fonksiyonları izlenir.',
      renalAdjustment:
        'GFR 10-30: Doz yarıya düşürülür (2.5-5 mg). GFR <10: 2.5 mg ile başla.',
      hepaticAdjustment: 'Doz ayarlaması gerekmez.',
    },
  },
  {
    id: '14',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    category: 'Statins',
    unit: 'mg',
    maxDailyDose: 80,
    contraindications: ['Active liver disease', 'Pregnancy'],
    sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'GI upset'],
    dosageForm: 'tablet',
    calculationMethod: 'fixed',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 20,
      frequency: 'q24h',
      maxSingleDose: 80,
      maxDailyDose: 80,
    },
    productInfo: {
      activeIngredient: 'Atorvastatin Kalsiyum',
      mechanismOfAction:
        'HMG-CoA Redüktaz inhibitörü (Statin). Kolesterol sentezindeki hız kısıtlayıcı basamağı inhibe eder. LDL reseptörlerini artırarak LDL klirensini hızlandırır. Pleiotropik (anti-inflamatuar, plak stabilize edici) etkileri vardır.',
      pharmacokinetics: {
        absorption:
          'Oral hızla emilir. Biyoyararlanım %14 (ilk geçiş etkisi yüksek).',
        distribution: 'Protein bağlanma %98. Kan-beyin bariyerini geçer.',
        metabolism:
          'Karaciğerde CYP3A4 ile metabolize olur. Aktif metabolitleri vardır.',
        elimination: 'Safra ile atılır. Böbrek atılımı <%2.',
        halfLife:
          '14 saat (ilacın kendisi), 20-30 saat (aktif metabolitlerle).',
      },
      administration: {
        route: 'Oral',
        method:
          'Günün herhangi bir saatinde, aç veya tok. Akşam alınması şart değildir (uzun etkili).',
        duration: 'Ömür boyu (genellikle).',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Hiperkolesterolemi (LDL düşürme)',
        'Kardiyovasküler olayların (MI, İnme) önlenmesi',
        'Ailevi hiperkolesterolemi',
        'Diyabetiklerde KV risk azaltımı',
      ],
      contraindications: [
        'Aktif karaciğer hastalığı veya açıklanamayan transaminaz yüksekliği',
        'Gebelik (X kategorisi)',
        'Emzirme',
        'Miyopati öyküsü (ciddi)',
      ],
      warnings: [
        'Miyopati ve Rabdomiyoliz riski (Kas ağrısı, güçsüzlük)',
        'Karaciğer enzimlerinde yükselme',
        'Diyabet riskinde hafif artış',
        'Greyfurt suyu ile etkileşim',
      ],
      interactions: {
        drugInteractions: [
          'CYP3A4 inhibitörleri (Klaritromisin, İtrakonazol, HIV ilaçları): Miyopati riskini artırır',
          'Siklosporin: Rabdomiyoliz riski',
          'Gemfibrozil/Fibratlar: Miyopati riski artar',
          'Digoksin: Seviyelerini hafif artırabilir',
          'Oral kontraseptifler: Hormon seviyelerini artırır',
        ],
        foodInteractions: [
          'GREYFURT SUYU: Atorvastatin seviyelerini belirgin artırır, kaçınılmalı.',
        ],
        labInteractions: [
          'CK (Kreatin kinaz) artışı',
          'ALT/AST artışı',
          'HbA1c hafif artış',
        ],
      },
      monitoring: {
        parameters: [
          'Lipid profili (LDL, HDL, TG)',
          'Karaciğer testleri (ALT, AST) - başlangıçta ve gerekirse',
          'CK (Kas ağrısı varsa)',
        ],
        frequency: 'Başlangıçtan 4-12 hafta sonra, sonra 3-12 ayda bir.',
        specialConsiderations: [
          'Kas ağrısı, hassasiyeti varsa hemen CK bakılmalı',
          'ALT 3 katına çıkarsa doz azaltılmalı veya kesilmeli',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory:
        'X - Fetal gelişim için kolesterol gereklidir. Kesinlikle kontrendike.',
      lactation: 'Kontrendike.',
      pediatricUse:
        '10 yaş üstü heterozigot ailesel hiperkolesterolemide kullanılabilir.',
      geriatricUse: 'Yüksek dozlarda miyopati riski artabilir.',
      renalAdjustment: 'Doz ayarlaması gerekmez.',
      hepaticAdjustment: 'Karaciğer yetmezliğinde kontrendikedir.',
    },
  },
  {
    id: '15',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA levothyroxine labelling (full replacement ~1.6 mcg/kg/day; elderly or cardiac disease start 12.5-25 mcg/day)',
    name: 'Levothyroxine',
    requiresClinicalReview: true,
    clinicalReviewNote:
      '50 yaş üstü ve kardiyak hastalarda 25-50 mcg sabit başlangıç dozu gerekir; mg/kg modeli bu rejimi karşılamaz.',
    genericName: 'Levothyroxine',
    category: 'Thyroid Hormones',
    unit: 'mcg',
    maxDailyDose: 300,
    contraindications: ['Thyrotoxicosis', 'Uncorrected adrenal insufficiency'],
    sideEffects: ['Palpitations', 'Weight loss', 'Insomnia'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 1.6,
      frequency: 'q24h',
      maxSingleDose: 200,
      maxDailyDose: 300,
      // NOTE: initiation over 50 uses a fixed 25-50 mcg regimen rather than a
      // mg/kg multiplier. That regimen is not modelled here, so the drug is
      // routed to clinical review instead of producing a weight-based number.
      ageAdjustments: [],
    },
    productInfo: {
      activeIngredient: 'Levotiroksin Sodyum (T4)',
      mechanismOfAction:
        "Sentetik tiroid hormonu. Periferik dokularda aktif T3'e dönüşerek metabolizma hızını, büyümeyi ve gelişimi düzenler.",
      pharmacokinetics: {
        absorption:
          "İnce barsaktan %40-80 emilir. Açlık emilimi artırır. T3'e dönüşüm karaciğer ve böbreklerde olur.",
        distribution: 'Proteine (TBG) %99 oranda bağlanır.',
        metabolism: "T3'e deiyonizasyon ile metabolize olur.",
        elimination: 'Böbrek ve safra yoluyla atılır.',
        halfLife:
          '6-7 gün (Hipotiroidide uzar 9-10 gün, hipertiroidide kısalır 3-4 gün).',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Sabah aç karna, kahvaltıdan en az 30 dakika önce su ile.',
        duration: 'Genellikle ömür boyu.',
        diluent: 'IV kullanım için özel flakon.',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Hipotiroidizm (Primer, Sekonder, Tersiyer)',
        'TSH baskılama (Tiroid kanseri)',
        'Guatr tedavisi',
      ],
      contraindications: [
        'Tedavi edilmemiş tirotoksikoz',
        'Tedavi edilmemiş adrenal yetmezlik (Addison krizi riski)',
        'Akut miyokard infarktüsü',
        'İçeriğe alerji',
      ],
      warnings: [
        'Kilo vermek için kullanılmamalıdır (toksik)',
        'Adrenal yetmezliği olanlarda önce steroid başlanmalı',
        'Yaşlılarda ve kalp hastalarında düşük doz başlanmalı (angina riski)',
        'Osteoporoz riski (TSH çok baskılanırsa)',
      ],
      interactions: {
        drugInteractions: [
          'Emilimi bozanlar: Demir, Kalsiyum, Antiasitler, Sukralfat, PPI (4 saat ara verilmeli)',
          'Metabolizmayı artıranlar (doz yetersizliği): Fenitoin, Karbamazepin, Rifampisin',
          'Warfarin: Warfarin etkisi artar',
          'İnsülin/Oral antidiyabetikler: Doz ihtiyacı artabilir',
        ],
        foodInteractions: [
          'Soya, ceviz, lifli gıdalar emilimi bozabilir.',
          'Kahve emilimi azaltır.',
          'Aç karna alınmalıdır.',
        ],
        labInteractions: [
          'TSH ve T4 düzeyleri',
          'Biyotin yüksek dozda testleri etkileyebilir (ilaç etkileşimi değil test hatası)',
        ],
      },
      monitoring: {
        parameters: [
          'TSH (primer hipotiroidide en iyi gösterge)',
          'Serbest T4',
          'Kalp hızı ve ritmi',
        ],
        frequency:
          'Doz değişiminden 6-8 hafta sonra. Stabil hastalarda 6-12 ayda bir.',
        specialConsiderations: [
          'TSH hedefi: 0.5-2.5 mIU/L (genel)',
          'Gebelikte doz ihtiyacı artar (%30-50)',
        ],
      },
      storage: {
        temperature: '25°C altında, ışıktan korunmalı',
        light: 'Işıktan korunmalı',
        stability: '-1',
      },
      pregnancyCategory:
        'A. Gebelikte güvenlidir ve gereklidir. Tedavi edilmezse fetusa zarar verir.',
      lactation:
        'Anne sütüne minimal geçer, güvenlidir. Kullanıma devam edilmelidir.',
      pediatricUse:
        'Yenidoğan hipotiroidizminde acil tedavi gerekir (Zeka geriliğini önlemek için).',
      geriatricUse:
        'Düşük doz (12.5-25 mcg) başlanır. Kalp yetmezliği/AF riski.',
      renalAdjustment: 'Doz ayarlaması gerekmez.',
      hepaticAdjustment: 'Doz ayarlaması gerekmez.',
    },
  },
  // Comprehensive Antibiotics List
  {
    id: '16',
    name: 'Meropenem',
    genericName: 'Meropenem',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to carbapenems',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Headache', 'Rash'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 20,
      frequency: 'q8h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
    },
    productInfo: {
      activeIngredient: 'Meropenem trihydrate',
      mechanismOfAction:
        'Beta-lactam antibiyotik, hücre duvarı sentezini inhibe eder. Penicillin-binding proteinleri (PBP) bağlar.',
      pharmacokinetics: {
        absorption: 'IV/IM uygulama sonrası hızlı absorpsiyon',
        distribution: 'Vücut sıvılarına iyi dağılım, BOS penetrasyonu iyi',
        metabolism: 'Böbreklerde dehidropeptidaz-1 enzimi ile metabolize olur',
        elimination: 'Böbrekler yoluyla %70-80 değişmeden atılır',
        halfLife: '1 saat (normal böbrek fonksiyonu)',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV infüzyon: 15-30 dakika, IM enjeksiyon: derin kas içi',
        duration: '15-30 dakika (IV infüzyon)',
        diluent: '0.9% NaCl, %5 Dekstroz, Ringer laktat',
        concentration: '1-20 mg/ml (IV), 250-500 mg/ml (IM)',
        compatibility: [
          '0.9% NaCl',
          '%5 Dekstroz',
          'Ringer laktat',
          'Mannitol',
          'Amino asit solüsyonları',
        ],
        incompatibility: [
          'Aminoglikozidler',
          'Heparin',
          'Sodyum bikarbonat',
          'Konsantre elektrolit solüsyonları',
        ],
      },
      indications: [
        'Ciddi bakteriyel enfeksiyonlar',
        'Sepsis ve septik şok',
        'Pnömoni (hastane kökenli)',
        'İntraabdominal enfeksiyonlar',
        'Menenjit',
        'Endokardit',
        'Osteomiyelit',
      ],
      contraindications: [
        'Karbapenem alerjisi',
        'Beta-laktam alerjisi (ciddi)',
        'Bilinen hipersensitivite',
      ],
      warnings: [
        'Pseudomembranöz kolit riski',
        'Nöbet riski (özellikle böbrek yetmezliğinde)',
        'Süperenfeksiyon riski',
        'Böbrek fonksiyonları izlenmeli',
      ],
      interactions: {
        drugInteractions: [
          'Probenesid: Meropenem eliminasyonunu azaltır',
          'Valproik asit: Serum seviyelerini düşürür',
          'Warfarin: INR artışı riski',
        ],
        foodInteractions: ['Yemekle birlikte alınabilir'],
        labInteractions: [
          'Coombs testi pozitifleşebilir',
          'Glukoz testlerini etkileyebilir',
          'Kreatinin seviyelerini etkileyebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'Karaciğer fonksiyonları (ALT, AST)',
          'Tam kan sayımı',
          'Kültür ve duyarlılık testleri',
        ],
        frequency: 'Günlük (ciddi enfeksiyonlarda)',
        specialConsiderations: [
          'Böbrek yetmezliğinde doz ayarı gerekli',
          'Nöbet öyküsü olanlarda dikkatli kullanım',
          'Uzun süreli kullanımda süperenfeksiyon riski',
        ],
      },
      storage: {
        temperature: '2-8°C (buzdolabı)',
        light: 'Işıktan korunmalı',
        stability: 'Oda sıcaklığında 24 saat stabil',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer, emzirme sırasında dikkatli kullanım',
      pediatricUse: '3 aylıktan büyük çocuklarda güvenli',
      geriatricUse: 'Yaşlılarda böbrek fonksiyonları dikkate alınmalı',
      renalAdjustment: 'CrCl <50 ml/dk: Doz azaltılmalı',
      hepaticAdjustment: 'Karaciğer yetmezliğinde özel doz ayarı gerekmez',
    },
  },
  {
    id: '17',
    name: 'Imipenem/Cilastatin',
    genericName: 'Imipenem/Cilastatin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: [
      'Allergy to carbapenems',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Seizures', 'Rash'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q6h',
      maxSingleDose: 1000,
      maxDailyDose: 4000,
    },
    productInfo: {
      activeIngredient: 'İmipenem + Silastatin Sodyum',
      mechanismOfAction:
        'İmipenem: Geniş spektrumlu karbapenem grubu antibiyotik. Hücre duvarı sentezini inhibe eder. Silastatin: İmipenemi böbreklerdeki dehidropeptidaz-1 enzimi ile yıkılmaktan koruyan enzim inhibitörüdür.',
      pharmacokinetics: {
        absorption: 'IV uygulamadan sonra hemen dağılır.',
        distribution:
          'Vücut sıvılarına iyi dağılır. BOS geçişi enflamasyonda artar. İmipenem %20, Silastatin %40 proteine bağlanır.',
        metabolism:
          'İmipenem tek başına böbrekte metabolize olur (silastatin bunu engeller). Silastatin %50 hepatik metabolize olur.',
        elimination: 'Böbrekler yoluyla %70 değişmeden atılır.',
        halfLife: '1 saat (her ikisi de). Böbrek yetmezliğinde uzar.',
      },
      administration: {
        route: 'IV',
        method: 'Yavaş IV infüzyon.',
        duration:
          '500 mg dozlar 20-30 dakikada, 1g dozlar 40-60 dakikada verilmeli (Bulantıyı önlemek için).',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '5 mg/mL (maksimum)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: [
          'Aminoglikozidler (aynı sette karışmaz)',
          'Sodyum bikarbonat',
          'Laktatlı Ringer',
        ],
      },
      indications: [
        'Komplike İntraabdominal Enfeksiyonlar',
        'Nozokomiyal Pnömoni',
        'Komplike Üriner Sistem Enfeksiyonları',
        'Jinekolojik Enfeksiyonlar',
        'Kemik ve Eklem Enfeksiyonları',
        'Polimikrobiyal Enfeksiyonlar (Aerob+Anaerob)',
        'Nötropenik Ateş',
      ],
      contraindications: [
        'Karbapenem veya süperozmolar diğer bileşenlere alerji',
        'Ciddi beta-laktam alerjisi öyküsü (Anafilaksi)',
        'Lokal anestezik alerjisi (IM form için)',
      ],
      warnings: [
        'Nöbet (Konvülsiyon) riski (Özellikle böbrek yetmezliğinde veya yüksek dozda)',
        'Valproik asit düzeylerini düşürür (Nöbet riski)',
        'Pseudomembranöz kolit riski',
        'Menenjit tedavisinde ÖNERİLMEZ (Nöbet riski nedeniyle Meropenem tercih edilir)',
      ],
      interactions: {
        drugInteractions: [
          'Valproik Asit / Divalproeks: Serum seviyelerini terapötik altı düzeye düşürür (Birlikte kullanımdan kaçının)',
          'Gansiklovir: Nöbet riskini artırır',
          'Probenesid: İmipenem atılımını azaltır',
        ],
        foodInteractions: ['Yemeklerle etkileşimi yoktur (IV kullanım).'],
        labInteractions: [
          'Direkt Coombs testi pozitifleşebilir',
          'Karaciğer enzimleri yükselebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, Kreatinin)',
          'Karaciğer fonksiyonları',
          'Nörolojik durum (Nöbet belirtileri)',
          'Kan tablosu',
        ],
        frequency: 'Günlük (yoğun bakımda)',
        specialConsiderations: [
          'Kreatinin klirensi <5 ml/dk ise diyaliz dışında verilmemeli',
          'Nöbet geçirenlerde doz azaltılmalı veya kesilmeli',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability:
          'Hazırlandıktan sonra oda ısısında 4 saat, buzdolabında 24 saat stabil.',
      },
      pregnancyCategory: 'C. Yarar/zarar hesabı yapılmalı.',
      lactation: 'Anne sütüne geçer. Dikkatli kullanılmalı.',
      pediatricUse:
        'Yenidoğanlarda (özellikle prematüre) kullanımı önerilmez (SSS toksisitesi).',
      geriatricUse: 'Böbrek fonksiyonlarına göre doz ayarı şarttır.',
      renalAdjustment:
        'GFR 20-40: Doz ve sıklık azaltılır (500mg q8h). GFR <20: 250-500mg q12h.',
      hepaticAdjustment: 'Doz ayarlaması gerekmez.',
    },
  },
  {
    id: '18',
    name: 'Ertapenem',
    genericName: 'Ertapenem',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1000,
    contraindications: [
      'Allergy to carbapenems',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Headache', 'Rash'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q24h',
      maxSingleDose: 1000,
      maxDailyDose: 1000,
      ageAdjustments: [
        { minAge: 0.25, maxAge: 12, adjustmentFactor: 1 }, // 3 ay - 12 yaş arası doz: 15 mg/kg günde 2 kez (maks 1g/gün)
      ],
    },
    productInfo: {
      activeIngredient: 'Ertapenem',
      mechanismOfAction:
        "Uzun etkili Karbapenem (Grup 1). Hücre duvarı sentezini inhibe eder. Pseudomonas ve Acinetobacter'e ETKİLİ DEĞİLDİR (Diğer karbapenemlerden farkı budur).",
      pharmacokinetics: {
        absorption: 'IM uygulama sonrası %90 biyoyararlanım.',
        distribution:
          'Yüksek protein bağlanma (%95). Bu nedenle yarı ömrü uzundur.',
        metabolism: 'Böbrekte hidroliz.',
        elimination: 'Böbrek (%80) ve feçes (%10).',
        halfLife: '4 saat (Günde tek doz kullanım sağlar).',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV infüzyon veya derin IM enjeksiyon.',
        duration: '30 dakika (IV infüzyon).',
        diluent: '0.9% NaCl, Bakteriyostatik su (IM için lidokain ile).',
        concentration: '20 mg/mL (IV), 200 mg/mL (IM için geçici).',
        compatibility: ['0.9% NaCl'],
        incompatibility: [
          '%5 Dekstroz ile karıştırılmamalıdır (stabilite sorunu).',
          'Diğer ilaçlar.',
        ],
      },
      indications: [
        'Komplike İntraabdominal Enfeksiyonlar (Toplum kökenli)',
        'Komplike Deri ve Yumuşak Doku Enfeksiyonları',
        'Toplum Kökenli Pnömoni (CAP)',
        'Komplike Üriner Sistem Enfeksiyonları',
        'Akut Pelvik Enfeksiyonlar',
        'Elektif kolorektal cerrahi profilaksisi',
      ],
      contraindications: [
        'Karbapenem alerjisi',
        'Ciddi beta-laktam anafilaksi öyküsü',
        'IM form için lidokain alerjisi',
      ],
      warnings: [
        'Pseudomonas ve Acinetobacter enfeksiyonlarında KULLANILMAZ',
        'Valproik asit düzeyini düşürür',
        'Nöbet riski (Meropenemden fazla, İmipenemden az olabilir)',
        'Uzun süreli kullanımda direnç gelişimi',
      ],
      interactions: {
        drugInteractions: [
          'Valproik Asit: Seviyeleri düşürür (nöbet riski)',
          'Probenesid: Atılımı azaltır',
        ],
        foodInteractions: ['-'],
        labInteractions: ['ALT/AST artışı'],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları',
          'Karaciğer enzimleri',
          'Enflamasyon belirteçleri',
        ],
        frequency: 'Periyodik.',
        specialConsiderations: [
          'Hastane enfeksiyonlarında Pseudomonas riski varsa tercih edilmemeli',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'Hazırlandıktan sonra oda ısısında 6 saat stabil.',
      },
      pregnancyCategory: 'B. Gebelikte kullanılabilir (Gerekliyse).',
      lactation: 'Anne sütüne geçer. Dikkatli kullanım.',
      pediatricUse:
        '3 aydan küçüklerde önerilmez. Çocuklarda günde 2 kez (bid) verilir.',
      geriatricUse: 'Böbrek fonksiyonuna göre doz ayarı.',
      renalAdjustment: 'GFR <30: 500 mg/gün (Doz yarıya düşer).',
      hepaticAdjustment: 'Doz ayarlaması gerekmez.',
    },
  },
  {
    id: '19',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA ceftriaxone label (50-75 mg/kg/day, max 2 g; 100 mg/kg/day up to 4 g for meningitis only)',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q24h',
      maxSingleDose: 2000,
      maxDailyDose: 4000,
    },
    productInfo: {
      activeIngredient: 'Ceftriaxone sodium',
      mechanismOfAction:
        '3. nesil sefalosporin, hücre duvarı sentezini inhibe eder.',
      pharmacokinetics: {
        absorption: 'IV/IM uygulama sonrası hızlı absorpsiyon',
        distribution: 'Vücut sıvılarına iyi dağılım, BOS penetrasyonu iyi',
        metabolism: 'Minimal metabolizma',
        elimination: 'Böbrekler (%60) ve safra (%40) yoluyla atılır',
        halfLife: '6-9 saat (uzun yarı ömür)',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV infüzyon: 30 dakika, IM enjeksiyon: derin kas içi',
        duration: '30 dakika (IV infüzyon)',
        diluent: '0.9% NaCl, %5 Dekstroz, %10 Dekstroz',
        concentration: '10-40 mg/ml (IV), 250 mg/ml (IM)',
        compatibility: [
          '0.9% NaCl',
          '%5 Dekstroz',
          '%10 Dekstroz',
          'Ringer laktat',
        ],
        incompatibility: [
          'Kalsiyum içeren solüsyonlar',
          'Aminoglikozidler',
          'Heparin',
        ],
      },
      indications: [
        'Ciddi bakteriyel enfeksiyonlar',
        'Menenjit',
        'Pnömoni',
        'İntraabdominal enfeksiyonlar',
        'Üriner sistem enfeksiyonları',
        'Gonore',
        'Lyme hastalığı',
      ],
      contraindications: [
        'Sefalosporin alerjisi',
        'Beta-laktam alerjisi (ciddi)',
        'Bilinen hipersensitivite',
      ],
      warnings: [
        'Pseudomembranöz kolit riski',
        'Bilirubin artışı (yenidoğanlarda)',
        'Kalsiyum çökeltisi riski',
        'Böbrek taşı riski',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin: INR artışı riski',
          'Probenesid: Eliminasyonu azaltır',
          'Kalsiyum: Çökelti oluşumu',
        ],
        foodInteractions: ['Yemekle birlikte alınabilir'],
        labInteractions: [
          'Coombs testi pozitifleşebilir',
          'Glukoz testlerini etkileyebilir',
          'Bilirubin seviyelerini artırabilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'Karaciğer fonksiyonları (ALT, AST, bilirubin)',
          'Tam kan sayımı',
          'Kültür ve duyarlılık testleri',
        ],
        frequency: 'Günlük (ciddi enfeksiyonlarda)',
        specialConsiderations: [
          'Yenidoğanlarda bilirubin riski',
          'Böbrek yetmezliğinde doz ayarı gerekli',
          'Kalsiyum içeren solüsyonlarla karıştırılmamalı',
        ],
      },
      storage: {
        temperature: '2-8°C (buzdolabı)',
        light: 'Işıktan korunmalı',
        stability: 'Oda sıcaklığında 24 saat stabil',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer, emzirme sırasında dikkatli kullanım',
      pediatricUse: 'Yenidoğanlarda dikkatli kullanım (bilirubin riski)',
      geriatricUse: 'Yaşlılarda böbrek fonksiyonları dikkate alınmalı',
      renalAdjustment: 'CrCl <10 ml/dk: Doz azaltılmalı',
      hepaticAdjustment: 'Karaciğer yetmezliğinde özel doz ayarı gerekmez',
    },
  },
  {
    id: '20',
    name: 'Cefepime',
    genericName: 'Cefepime',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Headache'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q8h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
    },
    productInfo: {
      activeIngredient: 'Sefepim',
      mechanismOfAction:
        '4. Kuşak Sefalosporin. Gram pozitif (MSSA) ve Gram negatif (Pseudomonas dahil) geniş spektrumlu etki. Beta-laktamazlara (AmpC) daha dayanıklı.',
      pharmacokinetics: {
        absorption: 'IV/IM sonrası tam emilir.',
        distribution:
          'BOS dahil vücut sıvılarına iyi geçer. Protein bağlanma <%20.',
        metabolism: 'Minimal metabolize olur.',
        elimination: 'Böbrekler yoluyla %85 değişmeden atılır.',
        halfLife: '2 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV infüzyon veya derin IM.',
        duration: '30 dakika infüzyon.',
        diluent: '0.9% NaCl, %5 Dekstroz, Ringer.',
        concentration: '40 mg/mL (IV), 280 mg/mL (IM).',
        compatibility: ['Metronidazol', 'Amikacin (ayrı bölmelerde)'],
        incompatibility: [
          'Vankomisin',
          'Aminoglikozidler (aynı şırıngada)',
          'Asiklovir',
        ],
      },
      indications: [
        'Nötropenik Ateş (Ampirik tedavi)',
        'Komplike Üriner Sistem Enfeksiyonları',
        'Nozokomiyal (Hastane) Pnömonisi',
        'Komplike İntraabdominal Enfeksiyonlar (Metronidazol ile)',
        'Deri enfeksiyonları',
        'Menenjit (Pseudomonas şüphesinde)',
      ],
      contraindications: [
        'Sefalosporin veya penisilin (anafilaksi) alerjisi',
        'Beta-laktam aşırı duyarlılığı',
      ],
      warnings: [
        'NEUROTOKSİSİTE (Ensefalopati, miyoklonus, nöbet) - Özellikle böbrek yetmezliğinde doz ayarlanmazsa risk yüksektir',
        'Ciddi cilt reaksiyonları',
        'C. difficile koliti',
      ],
      interactions: {
        drugInteractions: [
          'Aminoglikozidler: Nefrotoksisite riski artar',
          'Furosemid: Nefrotoksisite riski artar',
        ],
        foodInteractions: ['-'],
        labInteractions: [
          'Coombs testi pozitifliği',
          'İdrar glukoz testlerinde yanlış pozitiflik',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, Kreatinin) - Kritisiz önemde',
          'Nörolojik durum (Bilinç bulanıklığı)',
          'CBC',
        ],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Yaşlı ve böbrek yetmezliği olan hastalarda nörolojik yan etkiler (konfüzyon vb.) açısından uyanık olunmalı',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: 'Oda ısısında 24 saat.',
      },
      pregnancyCategory: 'B. Güvenli kabul edilir.',
      lactation: 'Anne sütüne çok az geçer, güvenli kabul edilir.',
      pediatricUse:
        '2 ay üstü çocuklarda güvenli. Febril nötropenide 50mg/kg q8h.',
      geriatricUse: 'Böbrek fonksiyonuna göre doz mutlaka ayarlanmalı.',
      renalAdjustment:
        'GFR 30-60: 2g q12h veya 1g q12h. GFR 11-29: 1g q24h. GFR <10: 500mg q24h. (Doz ayarlaması endikasyona göre değişir)',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '21',
    name: 'Piperacillin/Tazobactam',
    genericName: 'Piperacillin/Tazobactam',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 18000,
    contraindications: [
      'Allergy to penicillins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Fever'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 100,
      frequency: 'q6h',
      maxSingleDose: 4500,
      maxDailyDose: 18000,
    },
    productInfo: {
      activeIngredient: 'Piperacillin sodium + Tazobactam sodium',
      mechanismOfAction:
        'Piperacillin: Beta-laktam antibiyotik, hücre duvarı sentezini inhibe eder. Tazobactam: Beta-laktamaz inhibitörü.',
      pharmacokinetics: {
        absorption: 'IV uygulama sonrası hızlı dağılım',
        distribution: 'Vücut sıvılarına iyi dağılım, BOS penetrasyonu değişken',
        metabolism: 'Minimal metabolizma',
        elimination: 'Böbrekler yoluyla %80-90 değişmeden atılır',
        halfLife: '0.7-1.2 saat (normal böbrek fonksiyonu)',
      },
      administration: {
        route: 'IV',
        method: 'IV infüzyon: 30 dakika (standart), 4 saat (sürekli infüzyon)',
        duration: '30 dakika (intermittent), 4 saat (sürekli)',
        diluent: '0.9% NaCl, %5 Dekstroz, Ringer laktat',
        concentration: '100-200 mg/ml (maksimum)',
        compatibility: [
          '0.9% NaCl',
          '%5 Dekstroz',
          'Ringer laktat',
          'Amino asit solüsyonları',
        ],
        incompatibility: [
          'Aminoglikozidler',
          'Heparin',
          'Sodyum bikarbonat',
          'Konsantre elektrolit solüsyonları',
        ],
      },
      indications: [
        'Ciddi bakteriyel enfeksiyonlar',
        'Sepsis ve septik şok',
        'Pnömoni (hastane kökenli)',
        'İntraabdominal enfeksiyonlar',
        'Üriner sistem enfeksiyonları',
        'Deri ve yumuşak doku enfeksiyonları',
        'Nötropenik ateş',
      ],
      contraindications: [
        'Penisilin alerjisi',
        'Beta-laktam alerjisi (ciddi)',
        'Bilinen hipersensitivite',
      ],
      warnings: [
        'Pseudomembranöz kolit riski',
        'Süperenfeksiyon riski',
        'Böbrek fonksiyonları izlenmeli',
        'Sodyum yükü (yüksek dozlarda)',
      ],
      interactions: {
        drugInteractions: [
          'Probenesid: Eliminasyonu azaltır',
          'Warfarin: INR artışı riski',
          'Methotrexate: Eliminasyonu azaltır',
        ],
        foodInteractions: ['Yemekle birlikte alınabilir'],
        labInteractions: [
          'Coombs testi pozitifleşebilir',
          'Glukoz testlerini etkileyebilir',
          'Kreatinin seviyelerini etkileyebilir',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'Karaciğer fonksiyonları (ALT, AST)',
          'Tam kan sayımı',
          'Elektrolit seviyeleri (sodyum)',
          'Kültür ve duyarlılık testleri',
        ],
        frequency: 'Günlük (ciddi enfeksiyonlarda)',
        specialConsiderations: [
          'Böbrek yetmezliğinde doz ayarı gerekli',
          'Yüksek dozlarda sodyum yükü riski',
          'Uzun süreli kullanımda süperenfeksiyon riski',
        ],
      },
      storage: {
        temperature: '2-8°C (buzdolabı)',
        light: 'Işıktan korunmalı',
        stability: 'Oda sıcaklığında 24 saat stabil',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer, emzirme sırasında dikkatli kullanım',
      pediatricUse: '2 aylıktan büyük çocuklarda güvenli',
      geriatricUse: 'Yaşlılarda böbrek fonksiyonları dikkate alınmalı',
      renalAdjustment: 'CrCl <40 ml/dk: Doz azaltılmalı',
      hepaticAdjustment: 'Karaciğer yetmezliğinde özel doz ayarı gerekmez',
    },
  },
  {
    id: '22',
    name: 'Vancomycin',
    genericName: 'Vancomycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 4000,
    contraindications: ['Allergy to vancomycin', 'Severe hearing loss'],
    sideEffects: [
      'Nephrotoxicity',
      'Ototoxicity',
      'Red man syndrome',
      'Thrombophlebitis',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15,
      frequency: 'q8h',
      maxSingleDose: 1000,
      maxDailyDose: 4000,
    },
    productInfo: {
      activeIngredient: 'Vancomycin hydrochloride',
      mechanismOfAction:
        'Hücre duvarı sentezini inhibe eder. D-alanil-D-alanin uçlarını bağlar.',
      pharmacokinetics: {
        absorption: 'IV uygulama sonrası hızlı dağılım',
        distribution: 'Doku penetrasyonu iyi, BOS penetrasyonu değişken',
        metabolism: 'Minimal metabolizma',
        elimination: 'Böbrekler yoluyla %80-90 değişmeden atılır',
        halfLife: '4-6 saat (normal böbrek fonksiyonu)',
      },
      administration: {
        route: 'IV',
        method: 'IV infüzyon: 60 dakika (standart), 90 dakika (yüksek doz)',
        duration: '60-90 dakika (yavaş infüzyon)',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '5 mg/ml (maksimum)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: [
          'Aminoglikozidler',
          'Heparin',
          'Sodyum bikarbonat',
          'Fosfomisin',
        ],
      },
      indications: [
        'MRSA enfeksiyonları',
        'Endokardit (MRSA)',
        'Bakteriyel menenjit',
        'Ciddi C. difficile enfeksiyonu',
        'Prostetik eklem enfeksiyonları',
        'Osteomiyelit',
      ],
      contraindications: [
        'Vancomycin alerjisi',
        'Ciddi işitme kaybı',
        'Böbrek yetmezliği (ciddi)',
      ],
      warnings: [
        'Nefrotoksisite riski',
        'Ototoksisite riski',
        'Red man syndrome (hızlı infüzyon)',
        'Tromboflebit riski',
        'Trough seviyeleri izlenmeli',
      ],
      interactions: {
        drugInteractions: [
          'Aminoglikozidler: Nefrotoksisite riski artar',
          'Furosemid: Ototoksisite riski artar',
          'Amfoterisin B: Nefrotoksisite riski artar',
        ],
        foodInteractions: ['Yemekle birlikte alınabilir'],
        labInteractions: [
          'Kreatinin seviyelerini artırabilir',
          'BUN seviyelerini artırabilir',
          'Vancomycin seviyeleri izlenmeli',
        ],
      },
      monitoring: {
        parameters: [
          'Vancomycin trough seviyeleri (15-20 mg/L)',
          'Böbrek fonksiyonları (BUN, kreatinin)',
          'İşitme testleri',
          'Tam kan sayımı',
        ],
        frequency: 'Trough seviyeleri: 4. dozdan önce',
        specialConsiderations: [
          'Böbrek yetmezliğinde doz ayarı zorunlu',
          'Yaşlılarda dikkatli kullanım',
          'Uzun süreli kullanımda toksisite riski',
        ],
      },
      storage: {
        temperature: '2-8°C (buzdolabı)',
        light: 'Işıktan korunmalı',
        stability: 'Oda sıcaklığında 24 saat stabil',
      },
      pregnancyCategory: 'C',
      lactation: 'Anne sütüne geçer, emzirme sırasında dikkatli kullanım',
      pediatricUse: 'Yenidoğanlarda dikkatli kullanım',
      geriatricUse: 'Yaşlılarda böbrek fonksiyonları dikkate alınmalı',
      renalAdjustment: 'CrCl <50 ml/dk: Doz azaltılmalı, sıklık değiştirilmeli',
      hepaticAdjustment: 'Karaciğer yetmezliğinde özel doz ayarı gerekmez',
    },
  },
  {
    id: '23',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA ciprofloxacin label (peds 10 mg/kg q12h; adults 500-750 mg PO BID, 400 mg IV)',
    name: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1500,
    contraindications: [
      'Allergy to fluoroquinolones',
      'Pregnancy',
      'Children <18 years',
    ],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Dizziness',
      'Tendon rupture',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q12h',
      maxSingleDose: 750,
      maxDailyDose: 1500,
      ageAdjustments: [
        { minAge: 0, maxAge: 18, adjustmentFactor: 0 }, // 18 yaş altı kontrendike (Kistik fibrozis ve şarbon hariç)
      ],
    },
    productInfo: {
      activeIngredient: 'Siprofloksasin',
      mechanismOfAction:
        'Florokinolon grubu antibiyotik. Bakteriyel DNA giraz ve Topoizomeraz IV enzimlerini inhibe ederek DNA replikasyonunu durdurur. Bakterisidaldir.',
      pharmacokinetics: {
        absorption: 'Oral emilim hızlı ve iyi (%70-80).',
        distribution:
          'Dokulara (akciğer, prostat, kemik) mükemmel geçer. Protein bağlanma %20-40.',
        metabolism: 'Karaciğerde kısmen metabolize olur.',
        elimination: 'Böbrek (%40-50) ve safra (%20-35) yoluyla atılır.',
        halfLife: '4-5 saat.',
      },
      administration: {
        route: 'Oral, IV, Oftalmik, Otik',
        method:
          'Oral: Aç veya tok (süt ürünleri ile değil). IV infüzyon: 60 dakika (400mg için).',
        duration: 'Enfeksiyona göre 7-14 gün. Şarbon profilaksisinde 60 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '2 mg/mL (hazır solüsyon)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz', 'Ringer laktat'],
        incompatibility: [
          'Aminofilin',
          'Klindamisin',
          'Heparin',
          'Seftazidim',
          'Magnezyum',
        ],
      },
      indications: [
        'Komplike Üriner Sistem Enfeksiyonları',
        'Prostatit',
        'Gastrointestinal Enfeksiyonlar (Tifo vb.)',
        'Kemik ve Eklem Enfeksiyonları',
        'Şarbon (Maruziyet sonrası profilaksi)',
        'Pseudomonas enfeksiyonları (Oral seçenek olarak)',
      ],
      contraindications: [
        'Kinolon alerjisi',
        'Gebelik ve Emzirme',
        '18 yaş altı çocuklar (kıkırdak hasarı riski)',
        'Tizanidin ile birlikte kullanım',
        'Myastenia Gravis öyküsü',
      ],
      warnings: [
        'Tendon rüptürü ve tendinit riski (özellikle yaşlılar ve steroid kullananlar)',
        'QT uzaması ve aritmi riski',
        'Periferik nöropati (kalıcı olabilir)',
        'SSS etkileri (Konvülsiyon, anksiyete, psikoz)',
        'Aort anevrizması rüptürü riski',
        'Fototoksisite (Güneşten korunmalı)',
        'Kan şekeri düzensizlikleri',
      ],
      interactions: {
        drugInteractions: [
          'Tizanidin: Hipotansiyon ve sedasyon (Kontrendike)',
          'Teofilin: Teofilin seviyelerini artırır (Konvülsiyon riski)',
          'Warfarin: INR belirgin artar',
          'Antiasitler/Demir/Çinko/Kalsiyum: Emilimi %90 azaltır (2 saat ara verilmeli)',
          'Sülfonilüreler: Hipoglisemi riski',
          'Kortikosteroidler: Tendon rüptürü riski artar',
        ],
        foodInteractions: [
          'Süt, yoğurt ve kalsiyumdan zengin sularla AYNI ANDA ALINMAMALI (emilim bozulur). Yemekle alınabilir.',
        ],
        labInteractions: [
          'Karaciğer enzimleri artışı',
          'İdrarda kristalüri (nadir)',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları',
          'Karaciğer fonksiyonları',
          'Tam kan sayımı',
          'EKG (Riskli hastalarda QT)',
          'Kan şekeri (Diyabetiklerde)',
        ],
        frequency: 'Periyodik.',
        specialConsiderations: [
          'Eklem/kas ağrısı olursa hemen kesilmeli',
          'İshal gelişirse C. difficile düşünülmeli',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: 'IV solüsyon ışıktan korunmalıdır.',
      },
      pregnancyCategory: 'C. Hayvanlarda kıkırdak hasarı. Önerilmez.',
      lactation:
        'Anne sütüne geçer. Kıkırdak hasarı riski nedeniyle önerilmez.',
      pediatricUse:
        'Genelde kontrendike. Sadece Şarbon ve Kistik Fibrozis alevlenmesinde (Pseudomonas) kar/zarar oranıyla kullanılır.',
      geriatricUse:
        'Tendon hasarı ve QT uzaması riski yüksektir. Doz azaltılmalı.',
      renalAdjustment: 'GFR 30-50: 250-500mg q12h. GFR <30: 250-500mg q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '24',
    name: 'Levofloxacin',
    genericName: 'Levofloxacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 750,
    contraindications: [
      'Allergy to fluoroquinolones',
      'Pregnancy',
      'Children <18 years',
    ],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Dizziness',
      'Tendon rupture',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10, // Yüksek doz rejimi: 750mg total
      frequency: 'q24h',
      maxSingleDose: 750,
      maxDailyDose: 750,
      ageAdjustments: [{ minAge: 0, maxAge: 18, adjustmentFactor: 0 }],
    },
    productInfo: {
      activeIngredient: 'Levofloxacin',
      mechanismOfAction:
        'Florokinolon (Ofloxacin\'in L-izomeri). DNA giraz ve Topoizomeraz IV inhibitörü. "Solunum kinolonu" olarak bilinir (S. pneumoniae etkinliği yüksek).',
      pharmacokinetics: {
        absorption: 'Oral emilim mükemmel (%99). Oral/IV biyoeşdeğerdir.',
        distribution:
          'Akciğer dokusuna, sinüslere yüksek geçiş. Protein bağlanma %30.',
        metabolism: 'Minimal metabolizma.',
        elimination: 'Böbrekler yoluyla %87 değişmeden atılır.',
        halfLife: '6-8 saat.',
      },
      administration: {
        route: 'Oral, IV, Oftalmik',
        method:
          'Oral: Aç veya tok. IV: Yavaş infüzyon (750mg için en az 90 dakika). Hızlı verilirse hipotansiyon yapar.',
        duration: 'Pnömoni: 5-14 gün. Sinüzit: 5-10 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '5 mg/mL (hazır solüsyon)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: [
          'Furosemid',
          'Heparin',
          'Nitrogliserin',
          'Azitromisin',
        ],
      },
      indications: [
        'Toplum Kökenli Pnömoni (CAP)',
        'Nozokomiyal Pnömoni',
        'Akut Bakteriyel Sinüzit',
        'Komplike İdrar Yolu Enfeksiyonları',
        'Kronik Bronşit Alevlenmesi',
        'Deri ve Yumuşak Doku Enfeksiyonları',
      ],
      contraindications: [
        'Kinolon alerjisi',
        'Epilepsi öyküsü',
        'Tendon bozukluğu öyküsü',
        'Gebelik ve Çocuklar',
      ],
      warnings: [
        'Tendon rüptürü (Aşil tendonu)',
        'QT Uzaması (Siprofloksasine göre daha belirgin olabilir)',
        'Myastenia Gravis alevlenmesi',
        'Aort anevrizması',
        'Kan şekeri düzensizliği (hipo/hiperglisemi)',
      ],
      interactions: {
        drugInteractions: [
          'Antiasitler/Multivitaminler: Emilimi bozar (2 saat ara)',
          'Warfarin: INR artışı',
          "NSAID'ler: Nöbet eşiğini düşürür",
          'Antidiyabetikler: Kan şekeri bozukluğu',
          'QT uzatan ilaçlar (Amiodaron vb.): Aritmi riski',
        ],
        foodInteractions: ['-'],
        labInteractions: ['İdrar opiat testlerinde yanlış pozitiflik'],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları',
          'Kan şekeri (Diyabetiklerde)',
          'EKG (Riskli hastalarda)',
        ],
        frequency: 'Semptomatik.',
        specialConsiderations: ['Tendon ağrısında kesilmeli'],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory: 'C. Önerilmez.',
      lactation: 'Önerilmez.',
      pediatricUse:
        'Kontrendike (Kıkırdak hasarı). Sadece şarbon inhalasyonunda onaylı.',
      geriatricUse:
        'Böbrek fonksiyonuna göre doz ayarlanmalı. QT uzaması riski.',
      renalAdjustment:
        '750mg dozu için -> GFR 20-49: 750mg yükleme, sonra 750mg q48h. GFR 10-19: 750mg yükleme, sonra 500mg q48h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '25',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'Gentamicin labelling (3-5 mg/kg/day divided q8h, or 5-7 mg/kg once daily; interval depends on renal function and postmenstrual age)',
    clinicalReviewNote:
      'Aminoglikozid dozu ve uygulama aralığı böbrek işlevine, yenidoğanda postmenstrüel yaşa göre belirlenir ve serum düzeyiyle izlenir. Tek doz x sıklık modeli bu rejimi karşılamaz.',
    requiresClinicalReview: true,
    name: 'Gentamicin',
    genericName: 'Gentamicin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 500,
    contraindications: [
      'Allergy to aminoglycosides',
      'Severe hearing loss',
      'Severe renal impairment',
    ],
    sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Neuromuscular blockade'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // Geleneksel doz (3-5 mg/kg gün 3'e bölünmüş) veya Tek doz (5-7 mg/kg)
      frequency: 'q24h',
      maxSingleDose: 500,
      maxDailyDose: 500,
    },
    productInfo: {
      activeIngredient: 'Gentamisin Sülfat',
      mechanismOfAction:
        'Aminoglikozid grubu antibiyotik. Bakteri ribozomunun 30S alt birimine geri dönüşümsüz bağlanarak protein sentezini bozar. Bakterisidaldir. Konsantrasyona bağlı öldürme gücü vardır (Post-antibiyotik etki).',
      pharmacokinetics: {
        absorption: 'IM sonrası hızlı emilir. Oral emilmez.',
        distribution:
          'Hücre dışı sıvıya dağılır. Vd: 0.2-0.3 L/kg (Ödemde, asitte artar). Yağ dokusuna geçmez.',
        metabolism: 'Metabolize olmaz.',
        elimination: 'Böbrekler yoluyla %90 değişmeden atılır.',
        halfLife: '2-3 saat (Böbrek yetmezliğinde 24-48 saate uzar).',
      },
      administration: {
        route: 'IV, IM, Topikal, İntratekal',
        method:
          'IV: 30-60 dakika infüzyon. Hızlı verilmemeli (Nöromusküler blokaj riski).',
        duration:
          '7-10 gün (Oto/Nefrotoksisite riski nedeniyle kısa tutulmalı).',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1 mg/mL (infüzyon için), 40 mg/mL (flakon)',
        compatibility: ['0.9% NaCl', 'Ringer laktat'],
        incompatibility: [
          'Beta-laktamlar (aynı torbada inaktive ederler)',
          'Amfoterisin B',
          'Heparin',
          'Furosemid',
        ],
      },
      indications: [
        'Ciddi Gram-negatif enfeksiyonlar (Pseudomonas, E.coli, Klebsiella)',
        'Sepsis',
        'Endokardit (Sinerji için penisilin/vankomisin ile)',
        'Komplike üriner enfeksiyonlar',
      ],
      contraindications: [
        'Aminoglikozid alerjisi',
        'Myastenia Gravis (Nöromusküler blokajı artırır)',
      ],
      warnings: [
        'NEFROTOKSİSİTE (Genelde geri dönüşlü)',
        'OTOTOKSİSİTE (İşitme ve Denge - Geri dönüşsüz olabilir)',
        'Nöromusküler blokaj (Solunum felci riski - özellikle anesteziyle)',
        'Gebelik (Fetal işitme kaybı)',
      ],
      interactions: {
        drugInteractions: [
          'Nefrotoksik ilaçlar (Sefalosporinler, Vankomisin, Amfoterisin B, Sisplatin): Risk artar',
          'Ototoksik ilaçlar (Furosemid/Loop diüretikleri): İşitme kaybı riski artar',
          'Kas gevşeticiler: Etkileri uzar',
        ],
        foodInteractions: ['-'],
        labInteractions: [
          'BUN ve Kreatinin artışı',
          'Kalsiyum, Magnezyum düşüşü',
        ],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları (Günlük)',
          'Serum İlaç Düzeyleri (TDM)',
          'İşitme testi (Uzun kullanımda)',
          'Sıvı dengesi (Output)',
        ],
        frequency: 'TDM: 3. dozdan sonra/önce.',
        specialConsiderations: [
          'Hedef Peak (Geleneksel): 5-10 mcg/mL',
          'Hedef Trough (Geleneksel): < 2 mcg/mL (Toksisiteyi önlemek için şart)',
          'Tek doz (Once-daily) kullanımda etkinlik ve güvenlilik daha iyi olabilir',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'D. Fetal sağırlık riski.',
      lactation:
        'Anne sütüne az geçer, oral emilim yoktur. Güvenli kabul edilebilir ama florayı etkileyebilir.',
      pediatricUse:
        'Yenidoğanda Vd arttığı için daha yüksek doz/kg gerekir (2.5 mg/kg).',
      geriatricUse: 'Böbrek fonksiyonu ve işitme yakından izlenmeli.',
      renalAdjustment:
        'Doz aralığı uzatılır. Nomogram veya düzey takibi kullanılmalı. GFR<60 ise aralık uzat.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '26',
    name: 'Amikacin',
    genericName: 'Amikacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1500,
    contraindications: [
      'Allergy to aminoglycosides',
      'Severe hearing loss',
      'Severe renal impairment',
    ],
    sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Neuromuscular blockade'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15, // Günde tek doz rejimi veya 7.5mg/kg q12h
      frequency: 'q24h',
      maxSingleDose: 1000,
      maxDailyDose: 1500,
    },
    productInfo: {
      activeIngredient: 'Amikasin Sülfat',
      mechanismOfAction:
        'Yarı sentetik Aminoglikozid. Gentamisine dirençli suşlara etkilidir (dirençli enzimlere dayanıklı). Protein sentez inhibitörü.',
      pharmacokinetics: {
        absorption: 'IM hızlı emilir.',
        distribution:
          "Ekstraselüler sıvıya dağılır. Vd: 0.25 L/kg. BOS'a geçiş kötüdür.",
        metabolism: 'Yok.',
        elimination: 'Böbrekler yoluyla (GF) değişmeden atılır.',
        halfLife: '2-3 saat.',
      },
      administration: {
        route: 'IV, IM, İntratekal',
        method: 'IV: 30-60 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '5 mg/mL (infüzyon)',
        compatibility: ['0.9% NaCl'],
        incompatibility: [
          'Beta-laktam antibiyotikler',
          'Amfoterisin B',
          'Heparin',
        ],
      },
      indications: [
        'Çoklu ilaç direnci olan Gram-negatif enfeksiyonlar',
        'Pseudomonas enfeksiyonları',
        'Mikobakteri enfeksiyonları (Tüberküloz, NTM)',
        'Sepsis (Direnç şüphesinde)',
      ],
      contraindications: ['Aminoglikozid alerjisi', 'Myastenia Gravis'],
      warnings: [
        'NEFROTOKSİSİTE',
        'OTOTOKSİSİTE (İşitme kaybı)',
        'Nöromusküler blokaj',
      ],
      interactions: {
        drugInteractions: [
          'Vankomisin/Sefalosporinler: Nefrotoksisite artar',
          'Loop diüretikleri: Ototoksisite hızlanır',
          'Anestezikler: Felç riski artar',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Kreatinin artışı'],
      },
      monitoring: {
        parameters: [
          'Böbrek fonksiyonları',
          'İlaç düzeyleri (TDM)',
          'Odyometri (uzun kullanımda)',
        ],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Hedef Peak: 20-30 mcg/mL',
          'Hedef Trough: < 5-10 mcg/mL',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'Sarı renk bozulma belirtisi değildir (oksidasyon).',
      },
      pregnancyCategory: 'D. Fetal toksisite.',
      lactation: 'Emzirme önerilmez.',
      pediatricUse: 'Yenidoğanda yükleme dozu gerekebilir.',
      geriatricUse: 'Doz ayarlaması şarttır.',
      renalAdjustment:
        "GFR'ye göre doz aralığı uzatılır (örn. 24, 48 saatte bir).",
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '27',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 500,
    contraindications: ['Allergy to macrolides', 'Severe liver disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'QT prolongation'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 500,
      frequency: 'q24h',
      maxSingleDose: 500,
      maxDailyDose: 500,
    },
    productInfo: {
      activeIngredient: 'Azitromisin',
      mechanismOfAction:
        'Makrolid grubu antibiyotik. Bakteri ribozomunun 50S alt birimine bağlanarak protein sentezini inhibe eder. Uzun yarı ömrü sayesinde kısa süreli tedaviye olanak sağlar.',
      pharmacokinetics: {
        absorption: 'Oral biyoyararlanım %37. Dokulara çok iyi dağılır.',
        distribution:
          'Lökositlerde yoğunlaşır ve enfeksiyon bölgesine taşınır. Doku konsantrasyonu serumdan 50 kat fazladır.',
        metabolism: 'Karaciğerde metabolize olur.',
        elimination: 'Safra yoluyla atılır. İdrarla atılım azdır.',
        halfLife: '68 saat (dokularda).',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Oral: Aç veya tok (süspansiyon tok). IV: 60 dakika infüzyon.',
        duration: 'Pnömoni/Farenjit: 3-5 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1-2 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Diğer ilaçlar'],
      },
      indications: [
        'Toplum Kökenli Pnömoni (CAP)',
        'Akut Sinüzit',
        'Farenjit / Tonsillit (Penisilin alerjisi varsa)',
        'KOAH alevlenmesi',
        'Deri ve Yumuşak Doku Enfeksiyonları',
        'Klamidya enfeksiyonları',
      ],
      contraindications: ['Makrolid alerjisi', 'Ciddi karaciğer yetmezliği'],
      warnings: [
        'QT uzaması ve aritmi riski (özellikle hipokalemi/hipomagnezemide)',
        'Hepatotoksisite',
        'İnfantil Hipertrofik Pilor Stenozu (yenidoğanda)',
        'Myastenia Gravis alevlenmesi',
      ],
      interactions: {
        drugInteractions: [
          'QT uzatan ilaçlar: Aritmi riski artar',
          'Antiasitler: Emilimi azaltır (2 saat ara)',
          'Warfarin: INR artabilir (izlem gerekli)',
          'Ergot türevleri: Ergotizm riski',
        ],
        foodInteractions: [
          'Oral tablet yemekle alınabilir, süspansiyon tok karna alınır.',
        ],
        labInteractions: ['Karaciğer enzimleri artışı'],
      },
      monitoring: {
        parameters: ['EKG (Riskli hastalarda)', 'Karaciğer fonksiyonları'],
        frequency: 'Semptomatik.',
        specialConsiderations: [
          'İlaç kesildikten sonra bile etkileri devam eder (uzun doku yarı ömrü)',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'Süspansiyon hazırlandıktan sonra oda ısısında korunabilir.',
      },
      pregnancyCategory: 'B. Genelde güvenli kabul edilir.',
      lactation: 'Anne sütüne geçer. Dikkatli kullanım.',
      pediatricUse: '6 aydan büyüklerde güvenli.',
      geriatricUse: 'QT riskine dikkat.',
      renalAdjustment: 'GFR <10: Dikkatli kullanım.',
      hepaticAdjustment: 'Gerekmez (Ciddi yetmezlikte kontrendike).',
    },
  },
  {
    id: '28',
    name: 'Clarithromycin',
    genericName: 'Clarithromycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1000,
    contraindications: ['Allergy to macrolides', 'Severe liver disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'QT prolongation'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 7.5,
      frequency: 'q12h',
      maxSingleDose: 500,
      maxDailyDose: 1000,
    },
    productInfo: {
      activeIngredient: 'Klaritromisin',
      mechanismOfAction:
        'Makrolid. 50S ribozomal alt birime bağlanır. H. pylori eradikasyonunda etkilidir.',
      pharmacokinetics: {
        absorption: 'Oral iyi emilir (%50). İlk geçiş etkisi var.',
        distribution: 'Dokulara iyi dağılır.',
        metabolism: 'Karaciğerde CYP3A4 ile aktif metabolite dönüşür.',
        elimination: 'Böbrek (%30) ve safra.',
        halfLife: '3-7 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method:
          'Oral: Aç/Tok. IV: 60 dakika büyük damara infüzyon (flebit riski).',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '2 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Diğer ilaçlar'],
      },
      indications: [
        'H. pylori enfeksiyonu',
        'Toplum Kökenli Pnömoni',
        'Akut Sinüzit',
        'Kronik Bronşit Alevlenmesi',
        'Deri enfeksiyonları',
        'Mikobakteri enfeksiyonları',
      ],
      contraindications: [
        'Makrolid alerjisi',
        'QT uzaması öyküsü',
        'Kolşisin ile birlikte kullanım (Böbrek/KC yetmezliğinde)',
        'Simvastatin/Lovastatin/Ergotamin ile kullanım',
      ],
      warnings: [
        'GÜÇLÜ CYP3A4 İNHİBİTÖRÜ (İlaç etkileşimleri çok yaygındır)',
        'QT uzaması',
        'Hepatotoksisite',
      ],
      interactions: {
        drugInteractions: [
          'Statinler (Simvastatin, Atorvastatin): Miyopati/Rabdomiyoliz riski (Kontrendike veya dikkat)',
          'Kolşisin: Ölümcül toksisite riski',
          'Warfarin: Kanama riski artar',
          'Digoksin: Digoksin toksisitesi',
          'Teofilin, Karbamazepin: Düzeylerini artırır',
        ],
        foodInteractions: ['-'],
        labInteractions: ['KC enzimleri artışı'],
      },
      monitoring: {
        parameters: ['EKG', 'Karaciğer testleri', 'INR (Warfarin alanlarda)'],
        frequency: '-',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'C',
      lactation: 'Önerilmez.',
      pediatricUse: '6 aydan küçüklerde önerilmez.',
      geriatricUse: 'Böbrek yetmezliğinde doz ayarı gerekli.',
      renalAdjustment: 'GFR <30: Doz yarıya indirilir.',
      hepaticAdjustment:
        'Kontrendike (eğer böbrek yetmezliği de eşlik ediyorsa).',
    },
  },
  {
    id: '29',
    name: 'Doxycycline',
    genericName: 'Doxycycline',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 200,
    contraindications: [
      'Allergy to tetracyclines',
      'Pregnancy',
      'Children <8 years',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Photosensitivity',
      'Tooth discoloration',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 100, // Genelde 100mg günde 2 kez
      frequency: 'q12h',
      maxSingleDose: 100,
      maxDailyDose: 200,
    },
    productInfo: {
      activeIngredient: 'Doksisiklin',
      mechanismOfAction:
        'Tetrasiklin grubu. 30S ribozomal alt birime bağlanır. Bakteriyostatiktir.',
      pharmacokinetics: {
        absorption: 'Oral emilim mükemmel (%90-100).',
        distribution: 'Dokulara, kemik ve dişe iyi geçer.',
        metabolism: 'Karaciğerde kısmen.',
        elimination: 'Safra ve feçes yoluyla (Böbrek yetmezliğinde güvenli).',
        halfLife: '18-22 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method:
          'Oral: Bol su ile ve dik pozisyonda (Özofajit riski). IV: 1-4 saat infüzyon.',
        duration: '7-14 gün (Hastalığa göre değişir).',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '0.1-1 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Beta-laktamlar', 'Kalsiyum içeren çözeltiler'],
      },
      indications: [
        'Atipik Pnömoni (Mycoplasma, Chlamydia)',
        'Akne Vulgaris',
        'Lyme Hastalığı',
        'Sıtma profilaksisi',
        'Pelvik İnflamatuar Hastalık',
        'Şarbon',
      ],
      contraindications: [
        'Tetrasiklin alerjisi',
        'Gebelik ve Emzirme',
        '8 yaş altı çocuklar (Diş lekelenmesi)',
      ],
      warnings: [
        'FOTOSENSİTİVİTE (Güneş yanığı riski)',
        'Özofajit ve özofagus ülseri (Yatarken alınmamalı)',
        'Kalıcı diş lekelenmesi (çocuklarda)',
        'Kafa içi basınç artışı (psödotümör serebri)',
      ],
      interactions: {
        drugInteractions: [
          'Antiasitler/Demir/Kalsiyum: Emilimi bozar',
          'Warfarin: INR artırır',
          'Oral kontraseptifler: Etkisini azaltabilir',
          'Retinoidler (İzotretinoin): KİBAS riski artar (Birlikte kullanılmaz)',
        ],
        foodInteractions: [
          'Süt ürünleri emilimi bir miktar azaltabilir ama diğer tetrasiklinler kadar değil.',
        ],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['-'],
        frequency: '-',
        specialConsiderations: ['Yatmadan hemen önce alınmamalıdır.'],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory: 'D. Kontrendike.',
      lactation: 'Anne sütüne geçer. Önerilmez.',
      pediatricUse:
        '8 yaş altında kontrendike (kalıcı diş diskolorasyonu ve kemik büyüme geriliği). Sadece şarbon gibi hayati durumlarda.',
      geriatricUse: 'Güvenli.',
      renalAdjustment: 'Gerekmez (Safra ile atılır).',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '30',
    name: 'Clindamycin',
    genericName: 'Clindamycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 2700,
    contraindications: ['Allergy to clindamycin', 'Severe liver disease'],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Pseudomembranous colitis'],
    dosageForm: 'capsule',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q6h',
      maxSingleDose: 900,
      maxDailyDose: 2700,
    },
    productInfo: {
      activeIngredient: 'Klindamisin',
      mechanismOfAction:
        'Linkozamid. 50S ribozomal alt birime bağlanır. Anaerob bakterilere ve Gram pozitiflere etkilidir.',
      pharmacokinetics: {
        absorption: 'Oral %90.',
        distribution: "Çoğu dokuya geçer (Kemik dahil). BOS'a geçmez.",
        metabolism: 'Karaciğerde aktif metabolitlere dönüşür.',
        elimination: 'İdrar ve safra.',
        halfLife: '2-3 saat.',
      },
      administration: {
        route: 'Oral, IV, IM, Topikal',
        method: 'Oral: Bol su ile. IV: 10-60 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '18 mg/mL (Maks)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: [
          'Ampisilin',
          'Barbitüratlar',
          'Aminofilin',
          'Kalsiyum glukonat',
        ],
      },
      indications: [
        'Anaerobik enfeksiyonlar (Abse, Peritonit)',
        'Deri ve yumuşak doku enfeksiyonları (MRSA şüphesi dahil)',
        'Kemik ve eklem enfeksiyonları',
        'Aspirasyon pnömonisi',
        'Pelvik enfeksiyonlar',
      ],
      contraindications: [
        'Linkozamid alerjisi',
        'Geçmişte antibiyotiğe bağlı kolit öyküsü (dikkat)',
      ],
      warnings: [
        'PSEUDOMEMBRANÖZ KOLİT (C. difficile) RİSKİ YÜKSEKTİR',
        'Ciddi deri reaksiyonları',
      ],
      interactions: {
        drugInteractions: [
          'Nöromusküler blokerler: Etkisini artırır',
          'Eritromisin: Antagonistik etki',
        ],
        foodInteractions: ['-'],
        labInteractions: ['ALT/AST artışı'],
      },
      monitoring: {
        parameters: [
          'Böbrek/KC fonksiyonları',
          'Dışkılama sayısı (ishal takibi)',
        ],
        frequency: 'Semptomatik.',
        specialConsiderations: [
          'İshal gelişirse hemen kesilmeli ve C. difficile testi yapılmalı.',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer. İshal riski nedeniyle dikkat.',
      pediatricUse: '1 aydan küçüklerde kontrendike.',
      geriatricUse: 'Kolit riski artar.',
      renalAdjustment: 'Gerekmez.',
      hepaticAdjustment: 'Gerekmez (Ciddi yetmezlikte dikkat).',
    },
  },
  {
    id: '31',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'FDA metronidazole label (adults 7.5 mg/kg q6h, max 4 g/day; paediatric 30-50 mg/kg/day divided TID)',
    name: 'Metronidazole',
    genericName: 'Metronidazole',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 2000,
    contraindications: [
      'Allergy to metronidazole',
      'Pregnancy (first trimester)',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Metallic taste',
      'Peripheral neuropathy',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q8h',
      maxSingleDose: 500,
      maxDailyDose: 4000,
    },
    productInfo: {
      activeIngredient: 'Metronidazol',
      mechanismOfAction:
        'Nitroimidazol. Anaerob bakterilerde ve protozoalarda DNA yapısını bozar. Bakterisidaldir.',
      pharmacokinetics: {
        absorption: 'Oral %100 emilir (IV ile eşdeğer).',
        distribution:
          'BOS dahil tüm vücut sıvılarına, abse içine mükemmel geçer.',
        metabolism: 'Karaciğerde.',
        elimination: 'Böbrek (%60-80) ve feçes.',
        halfLife: '8 saat.',
      },
      administration: {
        route: 'Oral, IV, Topikal, Vajinal',
        method: 'Oral: Tok karna (GİS iritasyonu). IV: 30-60 dakika infüzyon.',
        duration: '7-10 gün.',
        diluent: 'Kullanıma hazır solüsyon (genelde).',
        concentration: '5 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Sefamandol', 'Oksitetrasiklin', 'Alkol'],
      },
      indications: [
        'Anaerobik bakteri enfeksiyonları',
        'İntraabdominal enfeksiyonlar',
        'C. difficile koliti (Hafif vakalar)',
        'Vajinit (Trichomonas, Bakteriyel vaginozis)',
        'Amibiyazis, Giardiyazis',
        'H. pylori tedavisi',
      ],
      contraindications: [
        'Nitroimidazol alerjisi',
        'İlk trimester gebelik (tartışmalı, genelde kaçınılır)',
        'Alkol kullanımı (tedavi sırasında ve 3 gün sonrasına kadar)',
      ],
      warnings: [
        'ALKOL İLE REAKSİYON (Disülfiram benzeri: bulantı, kusma, kızarma)',
        'SSS etkileri (Nöropati, nöbet, ataksi - uzun dönemde)',
        'Metalik tat',
      ],
      interactions: {
        drugInteractions: [
          'Alkol: Disülfiram reaksiyonu (KEŞİNLİKLE YASAK)',
          'Warfarin: INR belirgin artar',
          'Lityum: Lityum toksisitesi',
          'Fenitoin/Fenobarbital: Metronidazol etkisini azaltır',
        ],
        foodInteractions: ['Alkol yasak.'],
        labInteractions: ['ALT/AST testlerini etkileyebilir'],
      },
      monitoring: {
        parameters: [
          'Nörolojik muayene (uzun dönem kullanımda)',
          'INR (Warfarin alanlar)',
        ],
        frequency: '-',
        specialConsiderations: [
          'İdrar rengini koyulaştırabilir (kırmızı-kahverengi).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory: 'B (İlk trimesterde dikkat)',
      lactation:
        'Anne sütüne geçer. İlaç alındıktan sonra 12-24 saat emzirilmez.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Doz ayarı gerekebilir.',
      renalAdjustment: 'GFR <10: %50 doz azaltılabilir (metabolit birikir).',
      hepaticAdjustment: 'Ciddi yetmezlikte doz %50 azaltılır.',
    },
  },
  {
    id: '32',
    name: 'Linezolid',
    genericName: 'Linezolid',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1200,
    contraindications: ['Allergy to linezolid', 'Concurrent MAO inhibitors'],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Thrombocytopenia',
      'Peripheral neuropathy',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q12h',
      maxSingleDose: 600,
      maxDailyDose: 1200,
    },
    productInfo: {
      activeIngredient: 'Linezolid',
      mechanismOfAction:
        'Oksazolidinon sınıfı. 50S ribozomal alt birime bağlanır. MRSA ve VRE gibi dirençli Gram pozitiflere etkilidir.',
      pharmacokinetics: {
        absorption: 'Oral emilim %100 (IV/Oral geçiş kolaydır).',
        distribution: 'Dokulara (akciğer, deri) iyi dağılır.',
        metabolism: 'Karaciğerde (CYP enzimi kullanmaz).',
        elimination: 'İdrar (%30).',
        halfLife: '4-5 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Oral: Aç/Tok. IV: 30-120 dakika infüzyon.',
        duration:
          '10-14 gün (28 günden fazla kullanımda toksisite riski artar).',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '2 mg/mL (hazır)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: [
          'Amfoterisin B',
          'Klorpromazin',
          'Diazepam',
          'Fenitoin',
          'Eritromisin',
        ],
      },
      indications: [
        'Vankomisine Dirençli Enterokok (VRE) enfeksiyonları',
        'Nozokomiyal Pnömoni (S. aureus - MRSA dahil)',
        'Komplike Deri ve Yumuşak Doku Enfeksiyonları',
        'Toplum Kökenli Pnömoni',
      ],
      contraindications: [
        'Linezolid alerjisi',
        'Son 2 hafta içinde MAO inhibitörü kullanımı',
        'Kontrolsüz hipertansiyon, Feokromositoma, Tirotoksikoz (KB artışı riski)',
      ],
      warnings: [
        'Miyelosupresyon (Trombositopeni, anemi) - 2 haftadan uzun kullanımda sıktır',
        'Serotonin Sendromu (SSRI ile kullanımda)',
        'Periferik ve Optik Nöropati (uzun süreli kullanımda)',
        'Laktik asidoz',
      ],
      interactions: {
        drugInteractions: [
          'SSRI/SNRI antidepresanlar: Serotonin sendromu riski (Dikkat)',
          'MAO inhibitörleri: Kontrendike',
          'Adrenerjik ilaçlar (Psödoefedrin, Dopamin): Hipertansiyon krizi',
          'Rifampin: Linezolid düzeyini düşürür',
        ],
        foodInteractions: [
          'Tiramin içeren gıdalar (eski peynir vb.) tansiyonu yükseltebilir (Zayıf MAO inhibisyonu).',
        ],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: [
          'Tam kan sayımı (Haftalık)',
          'Görme muayenesi (uzun kullanımda)',
          'Kan basıncı',
        ],
        frequency: 'Haftalık CBC.',
        specialConsiderations: ['Trombosit sayısı düşerse ilaç kesilmeli.'],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı (folyo kaplı).',
        stability: 'Torba açıldıktan sonra hemen kullanılmalı.',
      },
      pregnancyCategory: 'C',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kullanılabilir (Doz farklıdır: <12 yaş için 10mg/kg q8h).',
      geriatricUse: 'Güvenli.',
      renalAdjustment: 'Gerekmez (Diyaliz sonrası ek doz gerekmez).',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '33',
    name: 'Daptomycin',
    genericName: 'Daptomycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 600,
    contraindications: ['Allergy to daptomycin', 'Severe muscle disorders'],
    sideEffects: ['Muscle pain', 'CPK elevation', 'Nausea', 'Diarrhea'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 4, // 4-6 mg/kg
      frequency: 'q24h',
      maxSingleDose: 600,
      maxDailyDose: 600,
    },
    productInfo: {
      activeIngredient: 'Daptomisin',
      mechanismOfAction:
        'Siklik Lipopeptid. Bakteri hücre membranına (kalsiyum bağımlı) bağlanarak depolarizasyon ve hızlı bakteri ölümü sağlar. Bakterisidaldir.',
      pharmacokinetics: {
        absorption: 'IV (Oral emilmez).',
        distribution: 'Protein bağlanma %92.',
        metabolism: 'Yok denecek kadar az.',
        elimination: 'Böbrek (%78).',
        halfLife: '8-9 saat.',
      },
      administration: {
        route: 'IV',
        method: '2 dakika bolus veya 30 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, Ringer Laktat',
        concentration: '50 mg/mL',
        compatibility: ['0.9% NaCl', 'Ringer Laktat'],
        incompatibility: ['%5 Dekstroz (UYUMSUZ)', 'Diğer ilaçlar'],
      },
      indications: [
        'Komplike Deri ve Yumuşak Doku Enfeksiyonları',
        'S. aureus bakteriyemisi (Sağ kalp endokarditi dahil)',
        'VRE enfeksiyonları (Off-label)',
      ],
      contraindications: ['Daptomisin alerjisi'],
      warnings: [
        'PNÖMONİ TEDAVİSİNDE KULLANILMAZ (Akciğer sürfaktanı tarafından inaktive edilir)',
        'Miyopati ve Rabdomiyoliz (CPK artışı)',
        'Eozinofilik pnömoni',
        'Periferik nöropati',
      ],
      interactions: {
        drugInteractions: [
          'Statinler: Miyopati riskini artırır (Daptomisin alırken statinler geçici olarak kesilmelidir)',
        ],
        foodInteractions: ['-'],
        labInteractions: ['PT/INR testlerinde yanlış uzama yapabilir'],
      },
      monitoring: {
        parameters: ['CPK (Kreatin Fosfokinaz)', 'Kas ağrısı semptomları'],
        frequency:
          'Haftalık CPK (Statin alıyorsa veya böbrek yetmezliği varsa daha sık).',
        specialConsiderations: [
          'Kas ağrısı başlarsa ve CPK > 1000 ise veya semptomsuz CPK > 2000 ise kesilmeli.',
        ],
      },
      storage: {
        temperature: 'Buzdolabında (2-8°C).',
        light: '-',
        stability:
          'Sulandırıldıktan sonra 12 saat (oda ısısı), 48 saat (buzdolabı).',
      },
      pregnancyCategory: 'B',
      lactation: 'Anne sütüne geçer. Dikkatli kullanım.',
      pediatricUse: '1 yaş altı önerilmez.',
      geriatricUse: 'Güvenli.',
      renalAdjustment:
        'GFR <30: Doz aynı kalır ama sıklık 48 saatte bire düşürülür.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '34',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'Colistimethate label (2.5-5 mg/kg/day of colistin BASE activity, divided 2-4; CBA, CMS and IU are not interchangeable)',
    clinicalReviewNote:
      'Kolistin dozu birbirine dönüştürülemeyen üç birimle ifade edilir (kolistin baz aktivitesi, kolistimetat, IU) ve böbrek işlevine göre ayarlanır. Birim belirtilmeden doz hesaplanamaz.',
    requiresClinicalReview: true,
    name: 'Colistin',
    genericName: 'Colistin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 300,
    contraindications: ['Allergy to colistin', 'Severe renal impairment'],
    sideEffects: ['Nephrotoxicity', 'Neurotoxicity', 'Nausea', 'Vomiting'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 1.25, // 2.5-5 mg/kg gün (kolistin baz aktivitesi)
      frequency: 'q12h',
      maxSingleDose: 150,
      maxDailyDose: 300,
    },
    productInfo: {
      activeIngredient: 'Kolistin (Kolistimetat Sodyum)',
      mechanismOfAction:
        'Polimiksin grubu. Gram-negatif bakteri dış membranını deterjan gibi parçalar. Bakterisidaldir.',
      pharmacokinetics: {
        absorption: 'Oral emilmez.',
        distribution:
          'Dokulara dağılımı iyidir. BOS geçişi zayıftır (intratekal verilebilir).',
        metabolism:
          'İn vivo Kolistimetat sodyum (CMS) hidrolize olarak aktif Kolistine dönüşür.',
        elimination: 'Böbrekler.',
        halfLife: '2-3 saat (CMS), 14 saat (Kolistin).',
      },
      administration: {
        route: 'IV, İM, İnhaler, İntratekal',
        method: 'IV: 30-60 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: 'CMS formuna göre değişir.',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Eritromisin', 'Deksametazon', 'Sefalotin'],
      },
      indications: [
        'Çoklu İlaca Dirençli (MDR) Gram-negatif enfeksiyonlar (Acinetobacter, Pseudomonas, K. pneumoniae)',
        'Sepsis (diğer seçenekler tükendiğinde)',
        'Kistik fibrozis (inhaler)',
      ],
      contraindications: [
        'Kolistin alerjisi',
        'Myastenia Gravis (Nöromusküler blokajı artırır)',
      ],
      warnings: [
        'CİDDİ NEFROTOKSİSİTE (Doz bağımlı)',
        'NÖROTOKSİSİTE (Parestezi, baş dönmesi, konuşma bozukluğu)',
        'Nöromusküler blokaj (Solunum yetmezliği)',
      ],
      interactions: {
        drugInteractions: [
          'Nefrotoksik ilaçlar (Aminoglikozid, Vankomisin): Risk artar',
          'Kas gevşeticiler: Etkisi uzar',
        ],
        foodInteractions: ['-'],
        labInteractions: ['BUN/Kreatinin artışı'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları (Günlük)', 'Nörolojik durum'],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Yükleme dozu yapılması önerilir (hızlı etki için).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: 'Hazırlandıktan sonra hemen kullanılmalı.',
      },
      pregnancyCategory: 'C',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kullanılabilir (Doz ayarı gerekir).',
      geriatricUse: 'Böbrek fonksiyonuna göre çok dikkatli.',
      renalAdjustment: "GFR'ye göre doz ciddi şekilde azaltılır.",
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '35',
    name: 'Tigecycline',
    genericName: 'Tigecycline',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 100,
    contraindications: ['Allergy to tigecycline', 'Pregnancy'],
    sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Pancreatitis'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 50, // Yükleme 100, idame 50q12h
      frequency: 'q12h',
      maxSingleDose: 100,
      maxDailyDose: 100,
    },
    productInfo: {
      activeIngredient: 'Tigesiklin',
      mechanismOfAction:
        'Glisilsiklin (Minosiklin türevi). 30S ribozomal alt birime bağlanır. Tetrasiklin direnç mekanizmalarından (eflüks ve koruma) etkilenmez. Bakteriyostatiktir.',
      pharmacokinetics: {
        absorption: 'IV.',
        distribution:
          'Dokulara MÜKEMMEL, kanda AZ bulunur (Vd çok geniştir, >12 L/kg).',
        metabolism: 'Az miktarda.',
        elimination: 'Safra/Feçes (%59), İdrar (%33).',
        halfLife: '42 saat (dokularda), 27 saat (serum).',
      },
      administration: {
        route: 'IV',
        method: '30-60 dakika infüzyon. Yükleme dozu (100mg) şarttır.',
        duration: '5-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '10 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Amfoterisin B', 'Vorikonazol'],
      },
      indications: [
        'Komplike Deri ve Yumuşak Doku Enfeksiyonları',
        'Komplike İntraabdominal Enfeksiyonlar',
        'Toplum Kökenli Pnömoni',
      ],
      contraindications: [
        'Tigesiklin alerjisi',
        'Gebelik',
        '8 yaş altı (diş lekelenmesi)',
      ],
      warnings: [
        'MORTALİTE RİSKİ ARTIŞI (FDA Black Box - Ciddi enfeksiyonlarda diğerlerine göre ölüm oranı daha yüksek)',
        'BAKTERİYEMİ TEDAVİSİNDE UYGUN DEĞİLDİR (Serum düzeyi düşüktür)',
        'Pankreatit riski',
        'Hepatotoksisite',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin: INR artışı',
          'Oral kontraseptifler: Etki azalması',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Fibrinojen düşüklüğü'],
      },
      monitoring: {
        parameters: ['Karaciğer enzimleri', 'Amilaz/Lipaz', 'Koagülasyon'],
        frequency: 'Semptomatik.',
        specialConsiderations: [
          "Pseudomonas'a ETKİSİZDİR.",
          "P. mirabilis'e (Proteus) ETKİSİZDİR.",
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'D',
      lactation: 'Önerilmez.',
      pediatricUse: '8 yaş altı kontrendike.',
      geriatricUse: 'Güvenli.',
      renalAdjustment: 'Gerekmez (Diyaliz dahil).',
      hepaticAdjustment:
        'Child Pugh C (Ağır): Yükleme 100, idame 25q12h (Doz yarıya düşer).',
    },
  },
  // Additional Beta-lactam Antibiotics
  {
    id: '36',
    name: 'Ceftazidime',
    genericName: 'Ceftazidime',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q8h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
    },
    productInfo: {
      activeIngredient: 'Seftazidim',
      mechanismOfAction:
        "3. Kuşak Sefalosporin. Hücre duvarı sentezini inhibe eder. Pseudomonas aeruginosa'ya karşı en etkili sefalosporinlerden biridir (Antipseudomonal).",
      pharmacokinetics: {
        absorption: 'IV/IM tam.',
        distribution: 'BOS dahil tüm vücut sıvılarına iyi geçer.',
        metabolism: 'Yok.',
        elimination: 'Böbrekler (%80-90 değişmeden).',
        halfLife: '2 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV: 3-5 dakika bolus veya 15-30 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '40 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Vankomisin', 'Aminoglikozidler (aynı şırıngada)'],
      },
      indications: [
        'Pseudomonas enfeksiyonları',
        'Nötropenik ateş (ampirik)',
        'Kistik fibrozis akciğer alevlenmesi',
        'Menenjit (Pseudomonas şüphesi)',
        'Komplike İYE',
      ],
      contraindications: [
        'Sefalosporin alerjisi',
        'Ciddi penisilin alerjisi (kros reaksiyon riski %5-10)',
      ],
      warnings: [
        'Nörotoksisite (Ensefalopati, nöbet) - Böbrek yetmezliğinde doz ayarlanmazsa',
        'C. difficile koliti',
      ],
      interactions: {
        drugInteractions: [
          'Aminoglikozidler: Nefrotoksisite artar (sinerjist etki için ayrı verilmeli)',
          'Kloramfenikol: Antagonistik etki',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Coombs testi pozitifliği'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları', 'CBC'],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Gram pozitif etkinliği zayıftır (MSSA için uygun değil).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: 'Oda ısısında 18 saat stabildir.',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Güvenli.',
      geriatricUse: 'Doz ayarı şart.',
      renalAdjustment:
        'GFR 30-50: 1g q12h. GFR 10-30: 1g q24h. GFR <10: 500mg q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '37',
    name: 'Cefotaxime',
    genericName: 'Cefotaxime',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 12000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q6h',
      maxSingleDose: 2000,
      maxDailyDose: 12000,
    },
    productInfo: {
      activeIngredient: 'Sefotaksim',
      mechanismOfAction:
        '3. Kuşak Sefalosporin. Seftriaksona benzer ancak safra çamuru yapmaz (Yenidoğanda avantaj). BOS geçişi iyidir.',
      pharmacokinetics: {
        absorption: 'IV/IM tam.',
        distribution: 'BOS ve dokulara iyi yayılır.',
        metabolism: 'Kısmen karaciğerde (aktif metabolit deasetil-sefotaksim).',
        elimination: 'Böbrek.',
        halfLife: '1 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV: 3-5 dk bolus veya 20-30 dk infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '50 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Aminoglikozidler', 'Sodyum bikarbonat'],
      },
      indications: [
        'Bakteriyel Menenjit (Yenidoğan ve çocuk)',
        'Sepsis',
        'Pnömoni',
        'Gonore',
      ],
      contraindications: ['Sefalosporin alerjisi'],
      warnings: ['Aritmi (Hızlı bolus yapılırsa)', 'Kolit riski'],
      interactions: {
        drugInteractions: ['Probenesid: Atılımı azaltır'],
        foodInteractions: ['-'],
        labInteractions: ['Coombs pozitifliği'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Yenidoğan yoğun bakımda Seftriakson yerine tercih edilir (Bilirubin ile yarışmaz, safra taşı yapmaz).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Yenidoğanda güvenli.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment: 'GFR <20: Doz yarıya indirilir.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '38',
    name: 'Ceftazidime/Avibactam',
    genericName: 'Ceftazidime/Avibactam',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50, // 2.5g (2g/0.5g) q8h
      frequency: 'q8h',
      maxSingleDose: 2500,
      maxDailyDose: 7500,
    },
    productInfo: {
      activeIngredient: 'Seftazidim + Avibaktam',
      mechanismOfAction:
        '3. Kuşak Sefalosporin + Yeni nesil Beta-laktamaz inhibitörü (Avibaktam). KPC ve OXA-48 gibi karbapenemaz üreten (CRE) bakterilere karşı etkilidir.',
      pharmacokinetics: {
        absorption: 'IV.',
        distribution: 'Ekstraselüler sıvı.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '2-3 saat.',
      },
      administration: {
        route: 'IV',
        method: '2 saat süreli infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: 'Hazır flakon',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['-'],
      },
      indications: [
        'Karbapenem Dirençli Enterobacteriaceae (CRE) enfeksiyonları',
        'Komplike İntraabdominal Enfeksiyonlar (+Metronidazol)',
        'Komplike İYE',
        'Nozokomiyal Pnömoni',
      ],
      contraindications: ['Beta-laktam alerjisi'],
      warnings: ['Böbrek yetmezliğinde doz ayarı kritiktir'],
      interactions: {
        drugInteractions: ['Probenesid'],
        foodInteractions: ['-'],
        labInteractions: ['Coombs pozitifliği'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Günlük.',
        specialConsiderations: [
          'MDR Gram-negatifler için rezerve edilmelidir.',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Dikkatli kullanım.',
      pediatricUse: '3 aydan büyüklerde onaylıdır.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment:
        'GFR 30-50: 1.25g q8h. GFR 15-29: 0.94g q12h. GFR <15: 0.94g q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '39',
    name: 'Cefiderocol',
    genericName: 'Cefiderocol',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50, // 2g q8h
      frequency: 'q8h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
    },
    productInfo: {
      activeIngredient: 'Sefiderokol',
      mechanismOfAction:
        'Siderofor Sefalosporin. Demiri bağlayarak bakteri içine "Truva atı" gibi girer. Tüm karbapenemaz sınıflarına (Metallo-beta-laktamazlar dahil) dayanıklıdır.',
      pharmacokinetics: {
        absorption: 'IV.',
        distribution: 'İyi.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '2-3 saat.',
      },
      administration: {
        route: 'IV',
        method: '3 saat süreli infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl',
        concentration: '-',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['-'],
      },
      indications: [
        'XDR (Çok ilaca dirençli) Gram-negatif enfeksiyonlar (Acinetobacter, Pseudomonas, Stenotrophomonas)',
        'Komplike İYE',
        'Nozokomiyal Pnömoni',
      ],
      contraindications: ['Ciddi beta-laktam alerjisi'],
      warnings: ['Mortalite artışı gözlenmemiştir (Tigesiklin aksine)'],
      interactions: {
        drugInteractions: ['-'],
        foodInteractions: ['-'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Günlük.',
        specialConsiderations: ['Son çare (salvage) tedavisidir.'],
      },
      storage: {
        temperature: 'Buzdolabı.',
        light: 'Korunmalı.',
        stability: '-',
      },
      pregnancyCategory: 'Veri yok.',
      lactation: 'Veri yok.',
      pediatricUse: 'Veri sınırlı.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment: 'GFR <60 ise doz ayarla.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '40',
    name: 'Ampicillin/Sulbactam',
    genericName: 'Ampicillin/Sulbactam',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 12000,
    contraindications: [
      'Allergy to penicillins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Fever'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q6h',
      maxSingleDose: 3000,
      maxDailyDose: 12000,
    },
    productInfo: {
      activeIngredient: 'Ampisilin + Sulbaktam',
      mechanismOfAction:
        'Aminopenisilin + Beta-laktamaz inhibitörü. Sadece Ampisilin/Sulbaktam bileşimindeki SULBAKTAM, Acinetobacter türlerine karşı direkt bakterisidal etkiye sahiptir.',
      pharmacokinetics: {
        absorption: 'IV/IM.',
        distribution: 'İyi.',
        metabolism: 'Kısmen.',
        elimination: 'Böbrek.',
        halfLife: '1 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV: 15-30 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl',
        concentration: '30 mg/mL',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['Aminoglikozidler'],
      },
      indications: [
        'Acinetobacter baumannii enfeksiyonları (Yüksek doz: 9-12g/gün)',
        'Baş-boyun enfeksiyonları',
        'Aspirasyon pnömonisi',
        'Deri ve yumuşak doku enfeksiyonları',
        'Jinekolojik enfeksiyonlar',
      ],
      contraindications: ['Penisilin alerjisi'],
      warnings: [
        'Hepatotoksisite (Kolestatik sarılık)',
        'Döküntü (EBV enfeksiyonunda)',
      ],
      interactions: {
        drugInteractions: [
          'Allopurinol (döküntü artar)',
          'Oral kontraseptifler',
        ],
        foodInteractions: ['-'],
        labInteractions: ['ALT/AST artışı'],
      },
      monitoring: {
        parameters: ['Karaciğer/Böbrek fonksiyonları'],
        frequency: 'Periyodik.',
        specialConsiderations: [
          'Acinetobacter için günlük toplam 6-9g Sulbaktam alacak şekilde dozlanmalıdır (örn. 3g Amp/Sulb q4h).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'Hazırlandıktan sonra 8 saat.',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Güvenli.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment: 'GFR 15-29: q12h. GFR 5-14: q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '41',
    name: 'Ticarcillin/Clavulanate',
    genericName: 'Ticarcillin/Clavulanate',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 18000,
    contraindications: [
      'Allergy to penicillins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Fever'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 75, // 3.1g q4-6h
      frequency: 'q6h',
      maxSingleDose: 3100,
      maxDailyDose: 18000,
    },
    productInfo: {
      activeIngredient: 'Tikarsilin + Klavulanat',
      mechanismOfAction:
        'Karboksipenisilin (Antipseudomonal) + Beta-laktamaz inhibitörü. Geniş spektrumlu.',
      pharmacokinetics: {
        absorption: 'IV.',
        distribution: 'İyi.',
        metabolism: 'Kısmen.',
        elimination: 'Böbrek.',
        halfLife: '1.2 saat.',
      },
      administration: {
        route: 'IV',
        method: '30 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '-',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['Aminoglikozidler'],
      },
      indications: ['Pseudomonas enfeksiyonları', 'Sepsis', 'Komplike İYE'],
      contraindications: ['Penisilin alerjisi'],
      warnings: [
        'Sodyum yükü (Kalp yetmezliğinde dikkat)',
        'Kanama bozukluğu (Trombosit disfonksiyonu)',
        'Hipokalemi',
      ],
      interactions: {
        drugInteractions: ['Warfarin', 'Aminoglikozidler'],
        foodInteractions: ['-'],
        labInteractions: ['Elektrolit bozukluğu'],
      },
      monitoring: {
        parameters: ['Elektrolitler (K)', 'Kanama zamanı'],
        frequency: 'Günlük.',
        specialConsiderations: ['Yüksek dozlarda sodyum yüklemesi yapar.'],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Güvenli.',
      geriatricUse: 'Na yüküne dikkat.',
      renalAdjustment: 'GFR <30: Doz ayarla.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '42',
    name: 'Cefuroxime',
    genericName: 'Cefuroxime',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 3000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 25,
      frequency: 'q8h',
      maxSingleDose: 1500,
      maxDailyDose: 3000,
    },
    productInfo: {
      activeIngredient: 'Sefuroksim (Sodyum veya Aksetil)',
      mechanismOfAction:
        '2. Kuşak Sefalosporin. Hücre duvarı sentezi inhibisyonu. H. influenzae ve Moraxella gibi solunum yolu patojenlerine etkilidir.',
      pharmacokinetics: {
        absorption: 'Oral (Aksetil) emilim yemekle artar. IV/IM tam emilim.',
        distribution: 'BOS geçişi zayıftır (menenjitte kullanılmaz).',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '1.5 saat.',
      },
      administration: {
        route: 'IV, IM, Oral',
        method: 'IV: 3-5 dk bolus veya 15-60 dk infüzyon.',
        duration: '7-10 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '100 mg/mL (Maks)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Aminoglikozidler', 'Sodyum bikarbonat'],
      },
      indications: [
        'Toplum Kökenli Pnömoni (Hafif)',
        'Akut Bakteriyel Sinüzit',
        'Akut Otitis Media',
        'Cerrahi Profilaksi (Kardiyovasküler, Ortopedik)',
      ],
      contraindications: ['Sefalosporin alerjisi'],
      warnings: ['Penisilin alerjisi olanlarda dikkat'],
      interactions: {
        drugInteractions: [
          'Mide asidini azaltan ilaçlar (Oral formun emilimini bozar)',
        ],
        foodInteractions: ['Oral form yemekle alınmalı'],
        labInteractions: [
          'Coombs pozitifliği',
          'Glukoz testlerinde yalancı pozitiflik',
        ],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Semptomatik.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'Sulandırıldıktan sonra oda ısısında 24 saat.',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Güvenli.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment: 'GFR 10-20: 750mg q12h. GFR <10: 750mg q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '43',
    name: 'Cefazolin',
    genericName: 'Cefazolin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 25,
      frequency: 'q8h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
    },
    productInfo: {
      activeIngredient: 'Sefazolin',
      mechanismOfAction:
        '1. Kuşak Sefalosporin. S. aureus (MSSA) enfeksiyonlarında ve cerrahi profilakside altın standarttır. Gram-negatif etkinliği azdır.',
      pharmacokinetics: {
        absorption: 'IM/IV tam.',
        distribution: "BOS'a geçmez.",
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '1.8 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV: 3-5 dk bolus veya 20-30 dk infüzyon.',
        duration:
          'Profilaksi: Tek doz (uzun ameliyatlarda tekrar). Tedavi: 7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '100 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Aminoglikozidler'],
      },
      indications: [
        'Cerrahi Profilaksi (Hemen her cerrahide ilk tercih)',
        'Deri ve Yumuşak Doku Enfeksiyonları (MSSA)',
        'Endokardit, Bakteriyemi (MSSA)',
      ],
      contraindications: ['Sefalosporin alerjisi'],
      warnings: ['Menenjitte KULLANILMAZ'],
      interactions: {
        drugInteractions: ['Warfarin (etkisini artırabilir)'],
        foodInteractions: ['-'],
        labInteractions: ['Coombs pozitifliği'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları (uzun kullanımda)'],
        frequency: 'Semptomatik.',
        specialConsiderations: ["MRSA'ya ETKİSİZDİR."],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: 'Oda ısısında 24 saat.',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: 'Güvenli (Yenidoğan hariç).',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment:
        'GFR 10-30: Doz yarıya, q12h. GFR <10: Doz dörtte bire, q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '44',
    name: 'Cefoxitin',
    genericName: 'Cefoxitin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 12000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 40,
      frequency: 'q6h',
      maxSingleDose: 2000,
      maxDailyDose: 12000,
    },
    productInfo: {
      activeIngredient: 'Sefoksitin',
      mechanismOfAction:
        '2. Kuşak Sefalosporin (Sefamisin grubu). Anaerob bakterilere (Bacteroides fragilis dahil) etkilidir. Beta-laktamazlara dirençlidir.',
      pharmacokinetics: {
        absorption: 'IV/IM.',
        distribution: 'İyi.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '1 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV: 3-5 dk bolus veya 20-30 dk infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '100 mg/mL',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['Aminoglikozidler'],
      },
      indications: [
        'İntraabdominal Enfeksiyonlar (Hafif-Orta)',
        'Pelvik İnflamatuar Hastalık (PID)',
        'Cerrahi Profilaksi (Kolorektal cerrahi)',
        'Diyabetik ayak enfeksiyonları',
      ],
      contraindications: ['Sefalosporin alerjisi'],
      warnings: ['Eozinofili'],
      interactions: {
        drugInteractions: ['Nefrotoksik ilaçlar'],
        foodInteractions: ['-'],
        labInteractions: ['Kreatinin ölçümünü etkileyebilir (Jaffe metodu)'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Semptomatik.',
        specialConsiderations: ['ESBL üretimini indükleyebilir, dikkat.'],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Güvenli.',
      pediatricUse: '3 aydan büyüklerde.',
      geriatricUse: 'Doz ayarı.',
      renalAdjustment:
        'GFR 30-50: 1-2g q8-12h. GFR 10-29: 1-2g q12-24h. GFR <10: 0.5-1g q24h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '45',
    name: 'Ceftolozane/Tazobactam',
    genericName: 'Ceftolozane/Tazobactam',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 6000,
    contraindications: [
      'Allergy to cephalosporins',
      'Severe hypersensitivity to beta-lactams',
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Vomiting',
      'Rash',
      'Injection site reactions',
    ],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50, // 1.5g q8h
      frequency: 'q8h',
      maxSingleDose: 1500,
      maxDailyDose: 4500,
    },
    productInfo: {
      activeIngredient: 'Seftolozan + Tazobaktam',
      mechanismOfAction:
        "Yeni nesil Sefalosporin + Beta-laktamaz inhibitörü. Özellikle MDR Pseudomonas aeruginosa'ya karşı çok güçlüdür.",
      pharmacokinetics: {
        absorption: 'IV.',
        distribution: 'İyi.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '3 saat.',
      },
      administration: {
        route: 'IV',
        method: '1 saat infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: 'Hazır flakon',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['-'],
      },
      indications: [
        'Komplike İdrar Yolu Enfeksiyonları (MDR Pseudomonas)',
        'Komplike İntraabdominal Enfeksiyonlar (+Metronidazol)',
        'Nozokomiyal Pnömoni (VAP)',
      ],
      contraindications: ['Beta-laktam alerjisi'],
      warnings: ['Böbrek yetmezliğinde doz ayarı önemli'],
      interactions: {
        drugInteractions: [
          'Tazobaktam OAT substratıdır, probenesid ile etkileşir',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Coombs pozitifliği'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları'],
        frequency: 'Günlük.',
        specialConsiderations: [
          'Karbapenemazlara (KPC, NDM vb.) ETKİSİZDİR. Sadece Pseudomonas direnci için idealdir.',
        ],
      },
      storage: {
        temperature: 'Buzdolabı.',
        light: 'Korunmalı.',
        stability: 'Hazırlandıktan sonra oda ısısında 4 saat.',
      },
      pregnancyCategory: 'B',
      lactation: 'Veri yok.',
      pediatricUse: '18 yaş altı önerilmez (bazı ülkelerde onaylı).',
      geriatricUse: 'Doz ayarı.',
      renalAdjustment:
        'GFR 30-50: 750mg q8h. GFR 15-29: 375mg q8h. GFR <15: 750mg yükleme, 150mg q8h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  // Additional Fluoroquinolones
  {
    id: '46',
    name: 'Moxifloxacin',
    genericName: 'Moxifloxacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 400,
    contraindications: [
      'Allergy to fluoroquinolones',
      'Pregnancy',
      'Children <18 years',
    ],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Dizziness',
      'QT prolongation',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 400,
      frequency: 'q24h',
      maxSingleDose: 400,
      maxDailyDose: 400,
    },
    productInfo: {
      activeIngredient: 'Moksifloksisin',
      mechanismOfAction:
        '4. Kuşak Florokinolon. DNA giraz ve Topoizomeraz IV inhibitörü. Anaerobik etkinliği yüksektir. Pseudomonas etkinliği zayıftır.',
      pharmacokinetics: {
        absorption: 'Oral emilim iyi (%90).',
        distribution: 'Dokulara iyi dağılır. BOS geçişi sınırlı.',
        metabolism:
          'Karaciğerde metabolize olur (Glukuronidasyon). CYP enzimi kullanmaz.',
        elimination: 'Safra (%50) ve böbrek (%20) yoluyla atılır.',
        halfLife: '12 saat.',
      },
      administration: {
        route: 'Oral, IV, Oftalmik',
        method: 'Oral: Aç/Tok. IV: 60 dakika infüzyon.',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1.6 mg/mL (hazır)',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Diğer ilaçlar'],
      },
      indications: [
        'Toplum Kökenli Pnömoni (CAP)',
        'Komplike İntraabdominal Enfeksiyonlar',
        'Deri ve Yumuşak Doku Enfeksiyonları',
        'Akut Sinüzit',
        'Pelvik İnflamatuar Hastalık (Kombine tedavide)',
      ],
      contraindications: [
        'Kinolon alerjisi',
        'Gebelik/Emzirme/Çocuklar',
        'Ciddi karaciğer yetmezliği (Child Pugh C)',
        'QT uzaması öyküsü veya yapan ilaçlar',
      ],
      warnings: [
        'QT UZAMASI (Kinolonlar içinde en yüksek risk)',
        'Karaciğer toksisitesi (Fulminan hepatit riski)',
        'Tendon rüptürü',
        'SSS etkileri',
      ],
      interactions: {
        drugInteractions: [
          'QT uzatan ilaçlar (Amiodaron, Sotalol vb.): Kontrendike',
          'Antiasitler: Emilimi bozar',
          'Warfarin: INR artışı',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Karaciğer testi anomalileri'],
      },
      monitoring: {
        parameters: ['EKG (QT takibi)', 'Karaciğer fonksiyon testleri'],
        frequency: 'Başlangıç ve semptomatik.',
        specialConsiderations: [
          'İdrar yolu enfeksiyonlarında KULLANILMAZ (İdrara geçmez)',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'C. Önerilmez.',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kontrendike.',
      geriatricUse: 'QT riskine dikkat.',
      renalAdjustment: 'Doz ayarlaması gerekmez (Böbrekten atılmaz).',
      hepaticAdjustment: 'Hafif-Orta: Gerekmez. Ciddi: Kontrendike.',
    },
  },
  {
    id: '47',
    name: 'Ofloxacin',
    genericName: 'Ofloxacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 800,
    contraindications: [
      'Allergy to fluoroquinolones',
      'Pregnancy',
      'Children <18 years',
    ],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Dizziness',
      'Tendon rupture',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // 200-400 mg doz
      frequency: 'q12h',
      maxSingleDose: 400,
      maxDailyDose: 800,
    },
    productInfo: {
      activeIngredient: 'Ofloksasin',
      mechanismOfAction:
        'Florokinolon. DNA giraz inhibitörü. Levofloksasinin rasemik formudur.',
      pharmacokinetics: {
        absorption: 'Oral emilim iyi.',
        distribution: 'Prostat ve akciğere iyi geçer.',
        metabolism: 'Az metabolize olur (%5).',
        elimination: 'Böbrekler yoluyla atılır.',
        halfLife: '5-7 saat.',
      },
      administration: {
        route: 'Oral, IV, Oftalmik',
        method: 'Oral: Aç/Tok. IV: 60 dakika.',
        duration: '3-10 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '4 mg/mL',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Komplike İdrar Yolu Enfeksiyonları',
        'Prostatit',
        'Pelvik İnflamatuar Hastalık',
        'Bel soğukluğu (Gonore)',
        'Alt solunum yolu enfeksiyonları',
      ],
      contraindications: [
        'Kinolon alerjisi',
        'Gebelik/Emzirme/Çocuklar',
        'Epilepsi',
        'G6PD eksikliği',
      ],
      warnings: ['Tendon rüptürü', 'QT uzaması', 'Fotosensitivite'],
      interactions: {
        drugInteractions: [
          'Antiasitler: Emilimi bozar',
          'Warfarin: INR artışı',
          'Teofilin: Toksisite riski',
        ],
        foodInteractions: ['-'],
        labInteractions: [],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları', 'Karaciğer testleri'],
        frequency: 'Periyodik.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability: '-',
      },
      pregnancyCategory: 'C',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kontrendike.',
      geriatricUse: 'Doz ayarı gerekir.',
      renalAdjustment:
        'GFR 20-50: Doz aynı, 24 saatte bir. GFR <20: Doz yarısı, 24 saatte bir.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '48',
    name: 'Norfloxacin',
    genericName: 'Norfloxacin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 800,
    contraindications: [
      'Allergy to fluoroquinolones',
      'Pregnancy',
      'Children <18 years',
    ],
    sideEffects: [
      'Nausea',
      'Diarrhea',
      'Headache',
      'Dizziness',
      'Tendon rupture',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 400,
      frequency: 'q12h',
      maxSingleDose: 400,
      maxDailyDose: 800,
    },
    productInfo: {
      activeIngredient: 'Norfloksasin',
      mechanismOfAction:
        'Florokinolon. DNA giraz inhibitörü. Sistemik emilimi düşüktür, idrar konsantrasyonu yüksektir.',
      pharmacokinetics: {
        absorption: 'Oral %30-40.',
        distribution:
          'Dokulara geçişi kısıtlıdır. Böbrek ve idrarda yoğunlaşır.',
        metabolism: 'Karaciğer.',
        elimination: 'Böbrek ve safra.',
        halfLife: '3-4 saat.',
      },
      administration: {
        route: 'Oral',
        method: 'Aç karna (yemekten 1 saat önce veya 2 saat sonra).',
        duration: '3-7 gün (sistit).',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Komplike olmayan İdrar Yolu Enfeksiyonları',
        'Komplike İYE',
        'Prostatit (Bazen)',
      ],
      contraindications: ['Kinolon alerjisi', 'Gebelik/Emzirme/Çocuklar'],
      warnings: [
        'Sistemik enfeksiyonlarda (Pyelonefrit vb.) YETERSİZDİR',
        'Tendon rüptürü',
      ],
      interactions: {
        drugInteractions: [
          'Antiasitler',
          'Kafein (metabolizmasını bozar)',
          'Siklosporin',
        ],
        foodInteractions: ['Süt ürünleri ile alınmaz'],
        labInteractions: [],
      },
      monitoring: {
        parameters: ['Böbrek fonskiyonları'],
        frequency: '-',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'C',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kontrendike.',
      geriatricUse: 'Dikkatli kullanım.',
      renalAdjustment: 'GFR <30: 400mg günde tek doz.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  // Additional Aminoglycosides
  {
    id: '49',
    sourceVerification: 'SOURCE_CHECKED',
    sourceDate: '2026-09-15',
    sourceReference:
      'Tobramycin labelling (3 mg/kg/DAY divided q8h; up to 5 mg/kg/day only in life-threatening infection)',
    clinicalReviewNote:
      'Aminoglikozid dozu ve uygulama aralığı böbrek işlevine, yenidoğanda postmenstrüel yaşa göre belirlenir ve serum düzeyiyle izlenir. Tek doz x sıklık modeli bu rejimi karşılamaz.',
    requiresClinicalReview: true,
    name: 'Tobramycin',
    genericName: 'Tobramycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 500,
    contraindications: [
      'Allergy to aminoglycosides',
      'Severe hearing loss',
      'Severe renal impairment',
    ],
    sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Neuromuscular blockade'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // 1.5-2.5 mg/kg q8h
      frequency: 'q24h',
      maxSingleDose: 500,
      maxDailyDose: 500,
    },
    productInfo: {
      activeIngredient: 'Tobramisin Sülfat',
      mechanismOfAction:
        "Aminoglikozid. Protein sentez inhibitörü. Pseudomonas aeruginosa'ya Gentamisinden daha etkilidir.",
      pharmacokinetics: {
        absorption: 'IM/IV tam.',
        distribution: 'Ekstraselüler sıvı.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '2 saat.',
      },
      administration: {
        route: 'IV, IM, İnhaler, Oftalmik',
        method: 'IV: 30-60 dakika infüzyon. İnhaler (Kistik fibrozis).',
        duration: '7-10 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1 mg/mL',
        compatibility: ['0.9% NaCl'],
        incompatibility: ['Beta-laktamlar', 'Heparin'],
      },
      indications: [
        'Pseudomonas aeruginosa enfeksiyonları (özellikle akciğer)',
        'Kistik fibrozis alevlenmesi',
        'Ciddi Gram-negatif enfeksiyonlar',
      ],
      contraindications: ['Aminoglikozid alerjisi'],
      warnings: ['Ototoksisite (İşitme ve Vestibüler)', 'Nefrotoksisite'],
      interactions: {
        drugInteractions: ['Nefrotoksik/Ototoksik ilaçlar'],
        foodInteractions: ['-'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['Böbrek fonksiyonları', 'İşitme', 'İlaç düzeyi'],
        frequency: 'Günlük.',
        specialConsiderations: ['Peak: 5-10 mcg/mL. Trough: <2 mcg/mL.'],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'D',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Doz ayarı şart.',
      renalAdjustment: "GFR'ye göre aralık uzatılır.",
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '50',
    name: 'Netilmicin',
    genericName: 'Netilmicin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 480,
    contraindications: [
      'Allergy to aminoglycosides',
      'Severe hearing loss',
      'Severe renal impairment',
    ],
    sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Neuromuscular blockade'],
    dosageForm: 'injection',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 4, // 1.3-2.2 mg/kg q8h veya 4-6 mg/kg q24h
      frequency: 'q24h',
      maxSingleDose: 300,
      maxDailyDose: 400,
    },
    productInfo: {
      activeIngredient: 'Netilmisin Sülfat',
      mechanismOfAction:
        'Yarı sentetik Aminoglikozid. Diğerlerine göre daha az ototoksik olduğu iddia edilse de kanıtlanmamıştır.',
      pharmacokinetics: {
        absorption: 'IM/IV tam.',
        distribution: 'ESS.',
        metabolism: 'Yok.',
        elimination: 'Böbrek.',
        halfLife: '2.5 saat.',
      },
      administration: {
        route: 'IV, IM',
        method: 'IV infüzyon 30-60 dk.',
        duration: '7-10 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1-3 mg/mL',
        compatibility: [],
        incompatibility: ['Beta-laktamlar'],
      },
      indications: [
        'Ciddi Gram-negatif enfeksiyonlar',
        'Sepsis',
        'Komplike İYE',
      ],
      contraindications: ['Aminoglikozid alerjisi'],
      warnings: ['Nefro/Ototoksisite'],
      interactions: {
        drugInteractions: [
          'Nefrotoksik ilaçlar (Vankomisin, Sefalosporinler)',
          'Ototoksik ilaçlar',
          'Kas gevşeticiler',
        ],
        foodInteractions: ['-'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['Böbrek', 'İşitme', 'İlaç düzeyi'],
        frequency: 'Günlük.',
        specialConsiderations: ['Peak: 6-10 mcg/mL. Trough: <2 mcg/mL.'],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'D',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Dikkat.',
      renalAdjustment: 'Doz aralığı uzatılır.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  // Additional Macrolides
  {
    id: '51',
    name: 'Erythromycin',
    genericName: 'Erythromycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 2000,
    contraindications: ['Allergy to macrolides', 'Severe liver disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'QT prolongation'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q6h',
      maxSingleDose: 500,
      maxDailyDose: 2000,
    },
    productInfo: {
      activeIngredient: 'Eritromisin',
      mechanismOfAction:
        'Makrolid grubu. 50S ribozomal alt birime bağlanır. Protein sentezini inhibe eder. Prokinetik etkisi vardır (Mide boşalmasını hızlandırır).',
      pharmacokinetics: {
        absorption: 'Oral emilim değişkendir (aç karna daha iyi).',
        distribution: "Dokulara iyi dağılır. BOS'a geçmez.",
        metabolism: 'Karaciğerde (CYP3A4 inhibitörü).',
        elimination: 'Safra (ana yol) ve idrar (az).',
        halfLife: '1.5-2 saat.',
      },
      administration: {
        route: 'Oral, IV, Oftalmik, Topikal',
        method: 'Oral: Aç karna. IV: Yavaş infüzyon (flebit yapabilir).',
        duration: '7-14 gün.',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '1-5 mg/mL',
        compatibility: ['0.9% NaCl', '%5 Dekstroz'],
        incompatibility: ['Aminofilin', 'Ampisilin', 'Heparin'],
      },
      indications: [
        'Atipik Pnömoni (Mycoplasma, Legionella)',
        'Difteri',
        'Boğmaca (Bordetella pertussis)',
        'Klamidya enfeksiyonları',
        'Penisilin alerjisi olanlarda alternatif',
        'Gastroparazi (Off-label)',
      ],
      contraindications: [
        'Makrolid alerjisi',
        'Simvastatin/Lovastatin kullanımı',
        'Ergot alkaloidleri kullanımı',
      ],
      warnings: ['QT uzaması', 'Hepatotoksisite', 'Pilor stenozu (bebeklerde)'],
      interactions: {
        drugInteractions: [
          'Teofilin',
          'Warfarin',
          'Karbamazepin',
          'Siklosporin (Düzeylerini artırır)',
          'Simvastatin (Miyopati riski)',
        ],
        foodInteractions: ['Greypfrut suyu (etkisini artırabilir)'],
        labInteractions: ['Karaciğer enzimleri artışı'],
      },
      monitoring: {
        parameters: ['Karaciğer fonksiyonları', 'EKG'],
        frequency: 'Semptomatik.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Süte geçer. Dikkatli kullanılmalı.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'İşitme kaybı riskine dikkat.',
      renalAdjustment: 'Gerekmez.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '52',
    name: 'Roxithromycin',
    genericName: 'Roxithromycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 600,
    contraindications: ['Allergy to macrolides', 'Severe liver disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'QT prolongation'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // 2.5-4 mg/kg q12h
      frequency: 'q12h',
      maxSingleDose: 300,
      maxDailyDose: 600,
    },
    productInfo: {
      activeIngredient: 'Roksitromisin',
      mechanismOfAction:
        'Makrolid. Ertirosmisinden daha uzun etkili ve aside dayanıklıdır.',
      pharmacokinetics: {
        absorption: 'Oral iyi.',
        distribution: 'Doku ve vücut sıvılarına iyi.',
        metabolism: 'Kısmen karaciğer.',
        elimination: 'Safra ve feçes.',
        halfLife: '10-12 saat.',
      },
      administration: {
        route: 'Oral',
        method: 'Yemeklerden önce.',
        duration: '7-10 gün.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Üst ve Alt Solunum Yolu Enfeksiyonları',
        'Deri ve Yumuşak Doku Enfeksiyonları',
        'Genital enfeksiyonlar (Gonokokal olmayan)',
      ],
      contraindications: ['Makrolid alerjisi', 'Ergotamin kullanımı'],
      warnings: ['Karaciğer yetmezliğinde dikkat'],
      interactions: {
        drugInteractions: [
          'Ergot alkaloidleri (Ergotizm riski)',
          'Teofilin (düzeyi artırır)',
          'Warfarin',
        ],
        foodInteractions: ['-'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['Karaciğer fonksiyonları'],
        frequency: '-',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Az miktarda geçer.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Doz ayarı gerekmez.',
      renalAdjustment: 'Gerekmez.',
      hepaticAdjustment: 'Ağır yetmezlikte doz yarıya iner.',
    },
  },
  // Additional Tetracyclines
  {
    id: '53',
    name: 'Tetracycline',
    genericName: 'Tetracycline',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 2000,
    contraindications: [
      'Allergy to tetracyclines',
      'Pregnancy',
      'Children <8 years',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Photosensitivity',
      'Tooth discoloration',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5,
      frequency: 'q6h',
      maxSingleDose: 500,
      maxDailyDose: 2000,
    },
    productInfo: {
      activeIngredient: 'Tetrasiklin',
      mechanismOfAction:
        'Tetrasiklin grubu. 30S. Geniş spektrumlu bakteriostatik.',
      pharmacokinetics: {
        absorption: 'Oral %60-80.',
        distribution: 'Geniş.',
        metabolism: 'Karaciğerde konsantre olur.',
        elimination: 'Böbrek ve safra.',
        halfLife: '6-11 saat.',
      },
      administration: {
        route: 'Oral, Topikal',
        method: 'Aç karna, bol su ile.',
        duration: '7-14 gün.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Akne',
        'Bruselloz',
        'Kolera',
        'Riketsiya enfeksiyonları',
        'H. pylori (kombine)',
      ],
      contraindications: [
        'Tetrasiklin alerjisi',
        'Gebelik',
        '8 yaş altı',
        'Böbrek yetmezliği',
      ],
      warnings: [
        'Diş lekelenmesi ve mine hipoplazisi (<8 yaş)',
        'Kemik gelişimini baskılama',
        'Fotosensitivite',
        'Benign intrakraniyal hipertansiyon',
      ],
      interactions: {
        drugInteractions: [
          'Antiasitler/Süt/Demir (Emilimi bozar)',
          'Oral kontraseptifler',
          'Retinoidler',
        ],
        foodInteractions: ['Süt ürünleri ile ALINMAZ'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['Böbrek/KC fonksiyonları'],
        frequency: 'Uzun kullanımda.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Işıktan korunmalı',
        stability:
          'Son kullanma tarihi geçenler ASLA kullanılmaz (Fanconi sendromu).',
      },
      pregnancyCategory: 'D',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kontrendike (<8 yaş).',
      geriatricUse: 'Dikkat.',
      renalAdjustment: 'Kontrendike (Azotemi yapar).',
      hepaticAdjustment: 'Dikkat.',
    },
  },
  {
    id: '54',
    name: 'Minocycline',
    genericName: 'Minocycline',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 200,
    contraindications: [
      'Allergy to tetracyclines',
      'Pregnancy',
      'Children <8 years',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Photosensitivity',
      'Tooth discoloration',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 2, // 2mg/kg yükleme, 1mg/kg idame q12h
      frequency: 'q12h',
      maxSingleDose: 100,
      maxDailyDose: 200,
    },
    productInfo: {
      activeIngredient: 'Minosiklin',
      mechanismOfAction:
        'Lipofilik Tetrasiklin. Dokulara geçişi tetrasiklinden daha iyidir.',
      pharmacokinetics: {
        absorption: 'Oral %90-100.',
        distribution: 'Yağ dokusu, deri, prostat.',
        metabolism: 'Karaciğer.',
        elimination: 'Feçes ve idrar.',
        halfLife: '11-26 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Yemeklerle alınabilir (süt hariç).',
        duration: 'Akne için aylar.',
        diluent: '0.9% NaCl',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Akne Vulgaris',
        'Menenjit taşıyıcılığı (N. meningitidis)',
        'MRSA deri enfeksiyonları',
        'Nokardiyoz',
      ],
      contraindications: ['Tetrasiklin alerjisi', 'Gebelik', '8 yaş altı'],
      warnings: [
        'Vestibüler toksisite (Baş dönmesi, vertigo)',
        'Ciltte ve mukozada mavi-gri pigmentasyon',
        'Lupus benzeri sendrom',
      ],
      interactions: {
        drugInteractions: ['İzotretinoin (KİBAS riski)', 'Warfarin'],
        foodInteractions: ['Süt emilimi azaltır (az oranda)'],
        labInteractions: [],
      },
      monitoring: {
        parameters: ['Karaciğer, Böbrek, Tiroid (uzun kullanımda)'],
        frequency: '3-6 ayda bir.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'D',
      lactation: 'Önerilmez.',
      pediatricUse: 'Kontrendike (<8 yaş).',
      geriatricUse: 'Baş dönmesi riskine dikkat.',
      renalAdjustment: 'Böbrek yetmezliğinde doz ayarı gerekmez.',
      hepaticAdjustment: 'Dikkat.',
    },
  },
  // Additional Antibiotics
  {
    id: '55',
    name: 'Trimethoprim/Sulfamethoxazole',
    genericName: 'Trimethoprim/Sulfamethoxazole',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1600,
    contraindications: [
      'Allergy to sulfonamides',
      'Severe liver disease',
      'Severe renal impairment',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Rash',
      'Stevens-Johnson syndrome',
      'Blood dyscrasias',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // 6-12 mg/kg/gün TMP üzerinden (İYE profilaksi: 2mg/kg)
      frequency: 'q12h',
      maxSingleDose: 800,
      maxDailyDose: 1600,
    },
    productInfo: {
      activeIngredient: 'Trimetoprim (TMP) + Sulfametoaksazol (SMX)',
      mechanismOfAction:
        'Folat sentez yolunu iki farklı basamakta bloke eder (Sinerjistik etki). Bakterisidaldir.',
      pharmacokinetics: {
        absorption: 'Oral mükemmel.',
        distribution: 'Tüm dokular, BOS, prostat.',
        metabolism: 'Karaciğer (SMX).',
        elimination: 'Böbrek.',
        halfLife: '10 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Oral: Bol su ile. IV: 60-90 dk infüzyon.',
        duration: '3-14 gün (PCP tedavisi 21 gün).',
        diluent: '%5 Dekstroz (Tercih)',
        concentration: '1 ampul (160/800) 250ml içinde.',
        compatibility: ['%5 Dekstroz'],
        incompatibility: ['Diğer ilaçlar'],
      },
      indications: [
        'İdrar Yolu Enfeksiyonları',
        'Pneumocystis jirovecii pnömonisi (PCP) - Tedavi ve Profilaksi',
        'Stenotrophomonas maltophilia enfeksiyonları',
        'MRSA (Toplum kökenli)',
      ],
      contraindications: [
        'Sülfonamid (Sülfa) alerjisi',
        'Gebelik (son dönem)',
        'G6PD eksikliği',
        'Şiddetli renal/hepatik yetmezlik',
        '2 aydan küçük bebekler',
      ],
      warnings: [
        'Stevens-Johnson Sendromu / Toksik Epidermal Nekroliz (CİDDİ DERİ REAKSİYONU)',
        'Hiperkalemi (Böbrek yetmezliğinde yüksek risk)',
        'Kristalüri (Bol su içilmeli)',
        'Kemik iliği baskılanması',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin (INR çok artar)',
          'Metotreksat (Toksisite artar)',
          'ACE inhibitörleri (Hiperkalemi)',
        ],
        foodInteractions: ['-'],
        labInteractions: [
          'Kreatinin artışı (Tübüler sekresyonu inhibe eder, GFR bozulmaz)',
        ],
      },
      monitoring: {
        parameters: ['Tam kan sayımı', 'Potasyum', 'Böbrek fonksiyonları'],
        frequency: 'Uzun kullanımda periyodik.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: 'IV solüsyonu dayanıksızdır, hemen kullanılmalı.',
      },
      pregnancyCategory:
        'C (İlk trimester folat eksikliği, son trimester kernikterus riski).',
      lactation: 'Önerilmez (G6PD eksikliği riski).',
      pediatricUse: '2 aydan küçüklerde kontrendike.',
      geriatricUse: 'Cilt reaksiyonu ve hiperkalemi riski artar.',
      renalAdjustment: 'GFR 15-30: Doz yarıya. GFR <15: Önerilmez.',
      hepaticAdjustment: 'Dikkat.',
    },
  },
  {
    id: '56',
    name: 'Nitrofurantoin',
    genericName: 'Nitrofurantoin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 400,
    contraindications: [
      'Allergy to nitrofurantoin',
      'Severe renal impairment',
      'Pregnancy (near term)',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Pulmonary fibrosis',
      'Peripheral neuropathy',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 100, // 50-100 mg q6h
      frequency: 'q6h',
      maxSingleDose: 100,
      maxDailyDose: 400,
    },
    productInfo: {
      activeIngredient: 'Nitrofurantoin',
      mechanismOfAction:
        'Bakteriyel enzimlerle aktifleşerek DNA ve proteinlere hasar verir. İdrar yollarında yüksek konsantrasyona ulaşır.',
      pharmacokinetics: {
        absorption: 'Oral iyi (özellikle makrokristal form).',
        distribution:
          'Sadece idrar yollarında etkilidir. Sistemik düzeyi düşüktür.',
        metabolism: 'Dokularda.',
        elimination: 'Böbrek.',
        halfLife: '20 dk.',
      },
      administration: {
        route: 'Oral',
        method: 'Yemeklerle (emilim artar, GİS yan etkisi azalır).',
        duration: '5-7 gün.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Komplike olmayan alt idrar yolu enfeksiyonu (Sistit)',
        'İYE profilaksisi',
      ],
      contraindications: [
        'Böbrek yetmezliği (GFR <60)',
        'Gebeliğin son haftaları (38-42)',
        'Yeni doğan (<1 ay)',
      ],
      warnings: [
        'PYELONEFRİT TEDAVİSİNDE KULLANILMAZ (Böbrek dokusuna yetersiz geçer)',
        'Pulmoner Fibrozis (Uzun süreli kullanımda)',
        'Periferik nöropati',
        'Hemolitik anemi (G6PD eksikliği)',
      ],
      interactions: {
        drugInteractions: ['Antiasitler (Emilimi azaltır)', 'Probenesid'],
        foodInteractions: ['-'],
        labInteractions: ['İdrar rengini kahverengi yapabilir'],
      },
      monitoring: {
        parameters: ['Akciğer grafisi (uzun kullanımda)', 'Böbrek fonksiyonu'],
        frequency: 'Semptomatik.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B (Son dönem hariç).',
      lactation: 'G6PD eksikliği şüphesi varsa kaçınılmalı.',
      pediatricUse: '1 aydan küçüklerde kontrendike.',
      geriatricUse:
        'Böbrek fonksiyonuna dikkat (GFR<60 ise etkisiz ve toksik).',
      renalAdjustment: 'GFR <60: KONTRENDİKE.',
      hepaticAdjustment: 'Dikkat.',
    },
  },
  {
    id: '57',
    name: 'Fosfomycin',
    genericName: 'Fosfomycin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 3000,
    contraindications: ['Allergy to fosfomycin', 'Severe renal impairment'],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Headache'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'fixed',
      fixedDose: 3000, // 3g tek doz şase
      frequency: 'q24h',
      maxSingleDose: 3000,
      maxDailyDose: 3000,
    },
    productInfo: {
      activeIngredient: 'Fosfomisin Trometamol',
      mechanismOfAction:
        'Hücre duvarı sentezinin ilk ve farklı bir aşamasını (MurA enzimi) inhibe eder. Çapraz direnç yoktur.',
      pharmacokinetics: {
        absorption: 'Oral emilim aç karna daha iyidir.',
        distribution: 'İdrar yollarına iyi geçer.',
        metabolism: 'Yok.',
        elimination: 'Böbrek (değişmeden).',
        halfLife: '4-8 saat (idrarda 48 saat kalır).',
      },
      administration: {
        route: 'Oral (Şase)',
        method:
          'Gece yatmadan önce, aç karna, mesane boşaltıldıktan sonra suda eritilerek içilir.',
        duration: 'Tek doz (Kadınlarda basit sistit).',
        diluent: 'Su',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Komplike olmayan alt idrar yolu enfeksiyonu (Sistit)',
        'ESBL pozitif E. coli enfeksiyonları',
        'Cerrahi profilaksi (transrektal prostat biyopsisi)',
      ],
      contraindications: ['Fosfomisin alerjisi', 'Ciddi böbrek yetmezliği'],
      warnings: ['Erkeklerde İYE tedavisinde tek doz genellikle yetersizdir'],
      interactions: {
        drugInteractions: ['Metoklopramid (Emilimi azaltır)'],
        foodInteractions: ['Yemekler emilimi azaltır'],
        labInteractions: ['-'],
      },
      monitoring: {
        parameters: ['-'],
        frequency: '-',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'B',
      lactation: 'Az miktarda geçer.',
      pediatricUse: 'Çocuk formu yok (ülkeye göre değişir).',
      geriatricUse: 'Güvenli.',
      renalAdjustment:
        'GFR azaldıkça atılım yavaşlar ama tek dozda sorun olmaz. Hemodiyaliz hastasında her seanstan sonra verilir.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
  {
    id: '58',
    name: 'Rifampin',
    genericName: 'Rifampin',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 600,
    contraindications: ['Allergy to rifampin', 'Severe liver disease'],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Hepatotoxicity',
      'Orange discoloration of body fluids',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 10,
      frequency: 'q24h',
      maxSingleDose: 600,
      maxDailyDose: 600,
    },
    productInfo: {
      activeIngredient: 'Rifampisin',
      mechanismOfAction: 'DNA bağımlı RNA polimeraz inhibitörü. Bakterisidal.',
      pharmacokinetics: {
        absorption: 'Oral iyi.',
        distribution: "Tüm dokulara, kazeöz lezyonlara, BOS'a geçer.",
        metabolism:
          'Karaciğer (Kendi metabolizmasını indükler - Autoinduction).',
        elimination: 'Safra/Feçes (%60) ve idrar.',
        halfLife: '3-4 saat.',
      },
      administration: {
        route: 'Oral, IV',
        method: 'Aç karna alınmalıdır (emilim azalır).',
        duration: '6-9 ay (Tüberküloz).',
        diluent: '0.9% NaCl, %5 Dekstroz',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Tüberküloz',
        'Bruselloz (+Doksisiklin)',
        'Menenjit profilaksisi (N. meningitidis, H. influenzae)',
        'Protez enfeksiyonları (Biyofilm etkisi)',
      ],
      contraindications: [
        'Rifamisin alerjisi',
        'Aktif sarılık',
        'Proteaz inhibitörleri ile kullanım',
      ],
      warnings: [
        'GÜÇLÜ CYP İNDÜKLEYİCİSİ (Birçok ilaçla etkileşir)',
        'Vücut sıvılarını (idrar, ter, gözyaşı) TURUNCU/KIRMIZI boyar (Lensler boyanabilir)',
        'Hepatotoksisite',
      ],
      interactions: {
        drugInteractions: [
          'Warfarin',
          'Oral kontraseptifler',
          'HIV ilaçları',
          'Antifungaller',
          'Kalsiyum kanal blokerleri (Etkileşim listesi çok uzundur, mutlaka kontrol edilmeli)',
        ],
        foodInteractions: ['-'],
        labInteractions: ['Karaciğer testleri'],
      },
      monitoring: {
        parameters: ['Karaciğer fonksiyonları (ALT, AST, Bilirubin)'],
        frequency: 'Aylık.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'C',
      lactation: 'Güvenli sayılır.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Dikkat.',
      renalAdjustment: 'Gerekmez.',
      hepaticAdjustment: 'Doz azaltılır veya kullanılmaz.',
    },
  },
  {
    id: '59',
    name: 'Isoniazid',
    genericName: 'Isoniazid',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 300,
    contraindications: ['Allergy to isoniazid', 'Severe liver disease'],
    sideEffects: [
      'Hepatotoxicity',
      'Peripheral neuropathy',
      'Nausea',
      'Vomiting',
    ],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 5, // 5mg/kg günlük (max 300)
      frequency: 'q24h',
      maxSingleDose: 300,
      maxDailyDose: 300,
    },
    productInfo: {
      activeIngredient: 'İzoniazid (INH)',
      mechanismOfAction:
        'Mikolik asit sentez inhibitörü. Tüberküloz için en güçlü bakterisidal ilaçtır.',
      pharmacokinetics: {
        absorption: 'Oral iyi.',
        distribution: 'Tüm vücut, kazeöz doku.',
        metabolism:
          'Karaciğer (Asetilasyon ile - Genetik polimorfizm: Hızlı/Yavaş asetileyiciler).',
        elimination: 'İdrar.',
        halfLife: '1-4 saat.',
      },
      administration: {
        route: 'Oral, IM',
        method: 'Aç karna.',
        duration: '6-9 ay.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: ['Tüberküloz Tedavisi', 'Latent Tüberküloz Profilaksisi'],
      contraindications: ['Akut karaciğer hastalığı'],
      warnings: [
        'Hepatotoksisite (Yaşla risk artar)',
        'Periferik Nöropati (B6 vitamini eksikliği yapar)',
      ],
      interactions: {
        drugInteractions: ['Fenitoin/Karbamazepin (Toksisite artar)', 'Alkol'],
        foodInteractions: ['Tiramin içeren gıdalar (Reaksiyon yapabilir)'],
        labInteractions: ['ALT/AST artışı (geçici olabilir)'],
      },
      monitoring: {
        parameters: ['Karaciğer fonksiyonları'],
        frequency: 'Aylık.',
        specialConsiderations: [
          'Nöropatiyi önlemek için mutlaka Piridoksin (B6 Vitamini) eklenmelidir (özellikle diyabetik, alkolik, malnütrisyonlu hastalarda).',
        ],
      },
      storage: {
        temperature: '25°C altında',
        light: 'Korunmalı.',
        stability: '-',
      },
      pregnancyCategory: 'C (ancak gerekliyse kullanılır + B6 vit).',
      lactation: 'Güvenli.',
      pediatricUse: 'Kullanılabilir.',
      geriatricUse: 'Hepatotoksisite riski yüksek.',
      renalAdjustment: 'Gerekmez.',
      hepaticAdjustment: 'Kontrendike veya dikkat.',
    },
  },
  {
    id: '60',
    name: 'Ethambutol',
    genericName: 'Ethambutol',
    category: 'Antibiotics',
    unit: 'mg',
    maxDailyDose: 1600,
    contraindications: ['Allergy to ethambutol', 'Severe renal impairment'],
    sideEffects: ['Optic neuritis', 'Nausea', 'Vomiting', 'Rash'],
    dosageForm: 'tablet',
    calculationMethod: 'weight',
    dosageFormula: {
      method: 'weight',
      dosePerKg: 15, // 15-25 mg/kg
      frequency: 'q24h',
      maxSingleDose: 1600,
      maxDailyDose: 1600,
    },
    productInfo: {
      activeIngredient: 'Etambutol',
      mechanismOfAction:
        'Hücre duvarı sentezini (arabingalaktan) inhibe eder. Bakteriyostatiktir.',
      pharmacokinetics: {
        absorption: 'Oral %80.',
        distribution:
          "Akciğer hariç dağılımı diğerleri kadar iyi değildir. BOS'a sadece inflamasyonda geçer.",
        metabolism: 'Kısmen.',
        elimination: 'Böbrek.',
        halfLife: '3-4 saat.',
      },
      administration: {
        route: 'Oral',
        method: 'Yemekle alınabilir.',
        duration: 'TB tedavisinde ilk 2 ay.',
        diluent: '-',
        concentration: '-',
        compatibility: [],
        incompatibility: [],
      },
      indications: [
        'Tüberküloz (Dörtlü tedavinin parçası)',
        'Atipik mikobakteri enfeksiyonları (MAC)',
      ],
      contraindications: [
        'Optik nörit öyküsü',
        'Çok küçük çocuklar (görme muayenesi yapılamayan)',
      ],
      warnings: [
        'OPTİK NÖRİT (Görme keskinliğinde azalma, Kırmızı-Yeşil renk körlüğü). Geri dönüşümlü olabilir ama kalıcı da olabilir.',
      ],
      interactions: {
        drugInteractions: ['Alüminyum hidroksit (emilimi azaltır)'],
        foodInteractions: ['-'],
        labInteractions: ['Ürik asit artışı'],
      },
      monitoring: {
        parameters: ['Göz muayenesi (Renk görme, keskinlik)', 'Ürik asit'],
        frequency: 'Aylık.',
        specialConsiderations: [],
      },
      storage: {
        temperature: '25°C altında',
        light: '-',
        stability: '-',
      },
      pregnancyCategory: 'C',
      lactation: 'Güvenli.',
      pediatricUse: 'Göz muayenesi yapılamayan çocuklarda önerilmez.',
      geriatricUse: 'Böbrek fonksiyonlarına göre doz ayarı.',
      renalAdjustment: 'GFR 10-50: q24-36h. GFR <10: q48h.',
      hepaticAdjustment: 'Gerekmez.',
    },
  },
];

export const sampleDrugs: Drug[] = [
  ...baseDrugs,
  ...extendedDrugs,
  ...chemoAndSupplementDrugs,
  ...extraDrugs,
];

export const getDrugsByCategory = (category: string): Drug[] => {
  return sampleDrugs.filter(drug => drug.category === category);
};

export const searchDrugs = (query: string): Drug[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleDrugs.filter(
    drug =>
      drug.name.toLowerCase().includes(lowercaseQuery) ||
      drug.genericName.toLowerCase().includes(lowercaseQuery) ||
      drug.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDrugById = (id: string): Drug | undefined => {
  return sampleDrugs.find(drug => drug.id === id);
};
