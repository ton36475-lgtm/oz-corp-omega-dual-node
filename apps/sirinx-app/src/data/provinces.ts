export type Region = 'north' | 'northeast' | 'central' | 'east' | 'west' | 'south'

export interface Province {
  id: number
  slug: string
  nameTh: string
  nameEn: string
  region: Region
  regionTh: string
  priority: 'P1' | 'P2' | 'P3'

  // Solar data
  sunHours: number          // peak sun hours / day
  irradiation: number       // kWh/m²/day
  electricityAuthority: 'MEA' | 'PEA'
  tariffPerUnit: number     // THB/kWh

  // Business estimates
  avgElectricityCost: number  // THB/month (typical factory/warehouse)
  estimatedSavings: number    // THB/year (for 100 kWp system)
  popularSystemSize: number   // kW

  // Local context
  localBenefits: string
  keyIndustries: string[]

  // Geography
  lat: number
  lng: number
  distanceFromHQKm: number  // from Phitsanulok
}

export const REGION_LABELS: Record<Region, string> = {
  north:     'ภาคเหนือ',
  northeast: 'ภาคตะวันออกเฉียงเหนือ',
  central:   'ภาคกลาง',
  east:      'ภาคตะวันออก',
  west:      'ภาคตะวันตก',
  south:     'ภาคใต้',
}

export const REGION_EN: Record<Region, string> = {
  north:     'Northern Thailand',
  northeast: 'Northeastern Thailand',
  central:   'Central Thailand',
  east:      'Eastern Thailand',
  west:      'Western Thailand',
  south:     'Southern Thailand',
}

export const provinces: Province[] = [
  // ===== ภาคเหนือ (17) =====
  {
    id: 1, slug: 'chiang-mai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P1',
    sunHours: 4.7, irradiation: 4.7, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 180000, estimatedSavings: 520000, popularSystemSize: 300,
    localBenefits: 'ศูนย์กลางการท่องเที่ยวและโรงแรม โซลาร์เซลล์ช่วยลดต้นทุนและดึงดูดนักท่องเที่ยวกลุ่ม Eco-conscious',
    keyIndustries: ['การท่องเที่ยว', 'โรงแรมและรีสอร์ท', 'เกษตรกรรม', 'อุตสาหกรรมเบา'],
    lat: 18.7883, lng: 98.9853, distanceFromHQKm: 320,
  },
  {
    id: 2, slug: 'chiang-rai', nameTh: 'เชียงราย', nameEn: 'Chiang Rai',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 4.6, irradiation: 4.6, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 90000, estimatedSavings: 420000, popularSystemSize: 150,
    localBenefits: 'พื้นที่เกษตรกรรมกว้างใหญ่ เหมาะสำหรับ Solar Farm และ Agro-solar ลดต้นทุนการสูบน้ำชลประทาน',
    keyIndustries: ['เกษตรกรรม', 'การท่องเที่ยว', 'ชาและกาแฟ'],
    lat: 19.9105, lng: 99.8406, distanceFromHQKm: 430,
  },
  {
    id: 3, slug: 'lampang', nameTh: 'ลำปาง', nameEn: 'Lampang',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 4.7, irradiation: 4.7, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 120000, estimatedSavings: 460000, popularSystemSize: 200,
    localBenefits: 'ศูนย์กลางอุตสาหกรรมเซรามิก ถ่านหิน และโรงไฟฟ้า โซลาร์ช่วยลดการพึ่งพาพลังงานฟอสซิล',
    keyIndustries: ['เซรามิก', 'โรงไฟฟ้าถ่านหิน', 'เกษตรกรรม'],
    lat: 18.2888, lng: 99.4908, distanceFromHQKm: 250,
  },
  {
    id: 4, slug: 'lamphun', nameTh: 'ลำพูน', nameEn: 'Lamphun',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P1',
    sunHours: 4.7, irradiation: 4.7, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 250000, estimatedSavings: 680000, popularSystemSize: 500,
    localBenefits: 'นิคมอุตสาหกรรมภาคเหนือ มีโรงงาน Electronics และ Hard Drive มากกว่า 1,800 แห่ง เหมาะสุดสำหรับ Solar Rooftop ขนาดใหญ่',
    keyIndustries: ['อิเล็กทรอนิกส์', 'Hard Drive', 'นิคมอุตสาหกรรม'],
    lat: 18.5744, lng: 99.0087, distanceFromHQKm: 340,
  },
  {
    id: 5, slug: 'mae-hong-son', nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P3',
    sunHours: 4.5, irradiation: 4.5, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 50000, estimatedSavings: 280000, popularSystemSize: 80,
    localBenefits: 'พื้นที่ห่างไกล ค่าไฟแพง โซลาร์เซลล์ช่วยให้ธุรกิจท่องเที่ยวและรีสอร์ทในป่าพึ่งพาตนเองได้',
    keyIndustries: ['การท่องเที่ยวเชิงธรรมชาติ', 'รีสอร์ทป่า'],
    lat: 19.3020, lng: 97.9654, distanceFromHQKm: 490,
  },
  {
    id: 6, slug: 'nan', nameTh: 'น่าน', nameEn: 'Nan',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P3',
    sunHours: 4.6, irradiation: 4.6, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 55000, estimatedSavings: 300000, popularSystemSize: 80,
    localBenefits: 'จังหวัดท่องเที่ยวธรรมชาติ โซลาร์เซลล์เสริมภาพลักษณ์ Green Tourism',
    keyIndustries: ['การท่องเที่ยว', 'เกษตรกรรม', 'ป่าไม้'],
    lat: 18.7756, lng: 100.7730, distanceFromHQKm: 340,
  },
  {
    id: 7, slug: 'phayao', nameTh: 'พะเยา', nameEn: 'Phayao',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P3',
    sunHours: 4.6, irradiation: 4.6, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 60000, estimatedSavings: 310000, popularSystemSize: 100,
    localBenefits: 'ศูนย์การศึกษาและเกษตรกรรม มหาวิทยาลัยพะเยา สนับสนุนพลังงานสะอาด',
    keyIndustries: ['การศึกษา', 'เกษตรกรรม', 'ประมง'],
    lat: 19.1664, lng: 100.2016, distanceFromHQKm: 380,
  },
  {
    id: 8, slug: 'phrae', nameTh: 'แพร่', nameEn: 'Phrae',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P3',
    sunHours: 4.7, irradiation: 4.7, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 70000, estimatedSavings: 340000, popularSystemSize: 100,
    localBenefits: 'ศูนย์กลางเครื่องเฟอร์นิเจอร์และสิ่งทอ โซลาร์เซลล์ลดต้นทุนการผลิต',
    keyIndustries: ['เฟอร์นิเจอร์ไม้', 'สิ่งทอ', 'เกษตรกรรม'],
    lat: 18.1445, lng: 100.1404, distanceFromHQKm: 270,
  },
  {
    id: 9, slug: 'uttaradit', nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 85000, estimatedSavings: 390000, popularSystemSize: 150,
    localBenefits: 'ประตูเหนือ-กลาง มีอุตสาหกรรมการผลิตและคลังสินค้าขนาดกลาง',
    keyIndustries: ['การผลิต', 'คลังสินค้า', 'เกษตรกรรม'],
    lat: 17.6200, lng: 100.0993, distanceFromHQKm: 120,
  },
  {
    id: 10, slug: 'phitsanulok', nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P1',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 130000, estimatedSavings: 500000, popularSystemSize: 200,
    localBenefits: 'สำนักงานใหญ่ SIRINX — มีทีมวิศวกรประจำพื้นที่ ให้บริการเร็วที่สุด สำรวจหน้างานภายใน 24 ชั่วโมง',
    keyIndustries: ['โรงงานอาหาร', 'ค้าปลีก', 'การศึกษา', 'คลังสินค้า'],
    lat: 16.8198, lng: 100.2654, distanceFromHQKm: 0,
  },
  {
    id: 11, slug: 'phichit', nameTh: 'พิจิตร', nameEn: 'Phichit',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 75000, estimatedSavings: 360000, popularSystemSize: 120,
    localBenefits: 'อุตสาหกรรมข้าวและเกษตรแปรรูป ใช้ Solar ลดต้นทุนการสีข้าวและโรงเก็บ',
    keyIndustries: ['เกษตรแปรรูป', 'โรงสีข้าว', 'คลังสินค้า'],
    lat: 16.4415, lng: 100.3486, distanceFromHQKm: 55,
  },
  {
    id: 12, slug: 'phetchabun', nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 95000, estimatedSavings: 430000, popularSystemSize: 150,
    localBenefits: 'แหล่งปลูกข้าวโพดและมันสำปะหลัง โซลาร์ช่วยลดค่าไฟโรงงานแปรรูปเกษตร',
    keyIndustries: ['เกษตรแปรรูป', 'ข้าวโพด', 'มันสำปะหลัง'],
    lat: 16.4190, lng: 101.1594, distanceFromHQKm: 130,
  },
  {
    id: 13, slug: 'sukhothai', nameTh: 'สุโขทัย', nameEn: 'Sukhothai',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 370000, popularSystemSize: 120,
    localBenefits: 'เมืองมรดกโลก เพิ่มมูลค่า Sustainable Tourism ด้วย Solar Energy ที่สะอาดและเงียบ',
    keyIndustries: ['การท่องเที่ยวมรดกโลก', 'เกษตรกรรม', 'อุตสาหกรรมเบา'],
    lat: 17.0069, lng: 99.8267, distanceFromHQKm: 60,
  },
  {
    id: 14, slug: 'tak', nameTh: 'ตาก', nameEn: 'Tak',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 580000, popularSystemSize: 400,
    localBenefits: 'เขตเศรษฐกิจพิเศษชายแดน (SEZ) มีโรงงานอุตสาหกรรม BOI Zone 3 ภาษีและสิทธิ์ดี',
    keyIndustries: ['เขตเศรษฐกิจพิเศษ', 'การผลิต', 'ชายแดนการค้า'],
    lat: 16.8840, lng: 99.1258, distanceFromHQKm: 160,
  },
  {
    id: 15, slug: 'kamphaeng-phet', nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 450000, popularSystemSize: 200,
    localBenefits: 'ศูนย์กลางมันสำปะหลังและอ้อย มีโรงงานน้ำตาลและ Ethanol ใช้ไฟจำนวนมาก',
    keyIndustries: ['โรงงานน้ำตาล', 'Ethanol', 'เกษตรแปรรูป'],
    lat: 16.4827, lng: 99.5226, distanceFromHQKm: 110,
  },
  {
    id: 16, slug: 'nakhon-sawan', nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P1',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 160000, estimatedSavings: 540000, popularSystemSize: 300,
    localBenefits: 'ศูนย์กลาง Logistics ภาคเหนือ-กลาง มีคลังสินค้าขนาดใหญ่ หลังคาพื้นที่มากเหมาะ Solar Rooftop',
    keyIndustries: ['Logistics', 'คลังสินค้า', 'อาหารและเครื่องดื่ม'],
    lat: 15.7030, lng: 100.1374, distanceFromHQKm: 140,
  },
  {
    id: 17, slug: 'uthai-thani', nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani',
    region: 'north', regionTh: 'ภาคเหนือ', priority: 'P3',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 55000, estimatedSavings: 290000, popularSystemSize: 80,
    localBenefits: 'พื้นที่เกษตรกรรมและอ่างเก็บน้ำ เหมาะสำหรับ Floating Solar บนบึงน้ำ',
    keyIndustries: ['เกษตรกรรม', 'ประมง', 'Floating Solar'],
    lat: 15.3835, lng: 100.0249, distanceFromHQKm: 190,
  },

  // ===== ภาคอีสาน (20) =====
  {
    id: 18, slug: 'nakhon-ratchasima', nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P1',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 280000, estimatedSavings: 750000, popularSystemSize: 500,
    localBenefits: 'โคราช ประตูสู่อีสาน มีนิคมอุตสาหกรรมหนาแน่น โรงงานมากกว่า 3,200 แห่ง แสงแดดดีเยี่ยม 5.2 ชม./วัน',
    keyIndustries: ['อุตสาหกรรมรถยนต์', 'อาหารและเครื่องดื่ม', 'ยาง', 'นิคมอุตสาหกรรม'],
    lat: 14.9798, lng: 102.0978, distanceFromHQKm: 220,
  },
  {
    id: 19, slug: 'khon-kaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P1',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 220000, estimatedSavings: 640000, popularSystemSize: 400,
    localBenefits: 'ศูนย์กลางอีสาน Smart City, Medical Hub, อุตสาหกรรมน้ำตาล Ethanol ใช้ Solar เสริมกับ Biomass',
    keyIndustries: ['โรงพยาบาล', 'น้ำตาล Ethanol', 'Logistics', 'Smart City'],
    lat: 16.4322, lng: 102.8236, distanceFromHQKm: 290,
  },
  {
    id: 20, slug: 'ubon-ratchathani', nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P1',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 160000, estimatedSavings: 560000, popularSystemSize: 300,
    localBenefits: 'แสงแดดดีที่สุดในภาคอีสาน 5.3 ชม./วัน พื้นที่เกษตรและอุตสาหกรรมเกษตรขนาดใหญ่',
    keyIndustries: ['เกษตรกรรม', 'น้ำตาล', 'สิ่งทอ'],
    lat: 15.2285, lng: 104.8577, distanceFromHQKm: 450,
  },
  {
    id: 21, slug: 'udon-thani', nameTh: 'อุดรธานี', nameEn: 'Udon Thani',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P1',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 180000, estimatedSavings: 590000, popularSystemSize: 350,
    localBenefits: 'ฮับ logistics อีสานตอนบน มีคลังสินค้าขนาดใหญ่ โรงแรมบริเวณท่องเที่ยว Phu Phan',
    keyIndustries: ['Logistics', 'การค้า', 'โรงแรม', 'เกษตรกรรม'],
    lat: 17.4139, lng: 102.7870, distanceFromHQKm: 350,
  },
  {
    id: 22, slug: 'buriram', nameTh: 'บุรีรัมย์', nameEn: 'Buriram',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 120000, estimatedSavings: 470000, popularSystemSize: 200,
    localBenefits: 'บุรีรัมย์ United City, สนามแข่งรถ Chang Arena ใช้ Solar ลดค่าไฟงานกีฬาขนาดใหญ่',
    keyIndustries: ['กีฬาและบันเทิง', 'เกษตรกรรม', 'ข้าว', 'ยาง'],
    lat: 14.9930, lng: 103.1027, distanceFromHQKm: 300,
  },
  {
    id: 23, slug: 'surin', nameTh: 'สุรินทร์', nameEn: 'Surin',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 440000, popularSystemSize: 180,
    localBenefits: 'อุตสาหกรรมผ้าไหมและงานช้าง โซลาร์ช่วยโรงงานสิ่งทอลดต้นทุน',
    keyIndustries: ['ผ้าไหม', 'เกษตรกรรม', 'ข้าว', 'ยาง'],
    lat: 14.8821, lng: 103.4940, distanceFromHQKm: 340,
  },
  {
    id: 24, slug: 'si-sa-ket', nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 90000, estimatedSavings: 410000, popularSystemSize: 150,
    localBenefits: 'เกษตรกรรมหลักข้าวและมันสำปะหลัง ลดต้นทุนไฟฟ้าโรงสีและโรงงานแปรรูป',
    keyIndustries: ['เกษตรแปรรูป', 'ข้าว', 'มันสำปะหลัง'],
    lat: 15.1164, lng: 104.3220, distanceFromHQKm: 390,
  },
  {
    id: 25, slug: 'chaiyaphum', nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 95000, estimatedSavings: 430000, popularSystemSize: 160,
    localBenefits: 'พื้นที่กว้างใหญ่ แสงแดดดี เหมาะสำหรับ Solar Farm ขนาดใหญ่',
    keyIndustries: ['เกษตรกรรม', 'ยาง', 'อ้อย', 'Solar Farm'],
    lat: 15.8068, lng: 102.0314, distanceFromHQKm: 250,
  },
  {
    id: 26, slug: 'roi-et', nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 95000, estimatedSavings: 430000, popularSystemSize: 150,
    localBenefits: 'แหล่งข้าวหอมมะลิ มีโรงสีและโรงงานบรรจุข้าวใช้ Solar ลดต้นทุน',
    keyIndustries: ['ข้าวหอมมะลิ', 'เกษตรกรรม', 'โรงสีข้าว'],
    lat: 16.0538, lng: 103.6520, distanceFromHQKm: 360,
  },
  {
    id: 27, slug: 'kalasin', nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 70000, estimatedSavings: 330000, popularSystemSize: 100,
    localBenefits: 'เมืองไดโนเสาร์ แหล่งเกษตรกรรมอีสาน โซลาร์ช่วยฟาร์มสัตว์ลดต้นทุนไฟฟ้า',
    keyIndustries: ['เกษตรกรรม', 'ฟาร์มสัตว์', 'การท่องเที่ยว'],
    lat: 16.4337, lng: 103.5060, distanceFromHQKm: 360,
  },
  {
    id: 28, slug: 'maha-sarakham', nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 445000, popularSystemSize: 180,
    localBenefits: 'ศูนย์การศึกษาอีสาน มหาวิทยาลัยมหาสารคาม โซลาร์ลดค่าไฟอาคารเรียนและหอพัก',
    keyIndustries: ['การศึกษา', 'เกษตรกรรม', 'น้ำตาล'],
    lat: 16.1853, lng: 103.3005, distanceFromHQKm: 330,
  },
  {
    id: 29, slug: 'mukdahan', nameTh: 'มุกดาหาร', nameEn: 'Mukdahan',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 370000, popularSystemSize: 120,
    localBenefits: 'เขตเศรษฐกิจพิเศษ ติดลาว Solar+EV สนับสนุน logistics ระหว่างประเทศ',
    keyIndustries: ['การค้าชายแดน', 'Logistics', 'เกษตรกรรม'],
    lat: 16.5435, lng: 104.7238, distanceFromHQKm: 430,
  },
  {
    id: 30, slug: 'nakhon-phanom', nameTh: 'นครพนม', nameEn: 'Nakhon Phanom',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 70000, estimatedSavings: 330000, popularSystemSize: 100,
    localBenefits: 'ริมแม่น้ำโขง เหมาะ Floating Solar และระบบสูบน้ำชลประทาน Solar-powered',
    keyIndustries: ['การค้าชายแดน', 'เกษตรกรรม', 'ท่องเที่ยว'],
    lat: 17.3910, lng: 104.7784, distanceFromHQKm: 450,
  },
  {
    id: 31, slug: 'sakon-nakhon', nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 85000, estimatedSavings: 390000, popularSystemSize: 140,
    localBenefits: 'ศูนย์กลางอีสานตอนบน หนองหาร แหล่งน้ำขนาดใหญ่ เหมาะ Floating Solar',
    keyIndustries: ['เกษตรกรรม', 'ประมง', 'Floating Solar'],
    lat: 17.1564, lng: 104.1486, distanceFromHQKm: 420,
  },
  {
    id: 32, slug: 'loei', nameTh: 'เลย', nameEn: 'Loei',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 90000, estimatedSavings: 410000, popularSystemSize: 150,
    localBenefits: 'แหล่งท่องเที่ยวธรรมชาติ ภูกระดึง ภูเรือ โรงแรมและรีสอร์ทใช้ Solar ลดต้นทุน',
    keyIndustries: ['การท่องเที่ยว', 'เกษตรกรรม', 'ยาง'],
    lat: 17.4861, lng: 101.7224, distanceFromHQKm: 230,
  },
  {
    id: 33, slug: 'nong-bua-lam-phu', nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 65000, estimatedSavings: 310000, popularSystemSize: 100,
    localBenefits: 'เกษตรกรรมอ้อย มันสำปะหลัง ลดต้นทุนชลประทานด้วย Solar Water Pump',
    keyIndustries: ['อ้อย', 'มันสำปะหลัง', 'เกษตรกรรม'],
    lat: 17.2024, lng: 102.4260, distanceFromHQKm: 320,
  },
  {
    id: 34, slug: 'nong-khai', nameTh: 'หนองคาย', nameEn: 'Nong Khai',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 95000, estimatedSavings: 430000, popularSystemSize: 160,
    localBenefits: 'ประตูสะพานมิตรภาพ ฮับ logistics ไทย-ลาว Solar เพิ่ม competitive advantage ให้ warehouse',
    keyIndustries: ['Logistics', 'การค้าชายแดน', 'เกษตรกรรม'],
    lat: 17.8782, lng: 102.7415, distanceFromHQKm: 380,
  },
  {
    id: 35, slug: 'bueng-kan', nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 60000, estimatedSavings: 290000, popularSystemSize: 80,
    localBenefits: 'จังหวัดใหม่ติดโขง ยางพาราและเกษตรกรรม ลดต้นทุนฟาร์มและโกดัง',
    keyIndustries: ['ยางพารา', 'เกษตรกรรม', 'ประมง'],
    lat: 18.3609, lng: 103.6463, distanceFromHQKm: 460,
  },
  {
    id: 36, slug: 'yasothon', nameTh: 'ยโสธร', nameEn: 'Yasothon',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 70000, estimatedSavings: 330000, popularSystemSize: 100,
    localBenefits: 'เมืองข้าวหอมมะลิ เกษตรอินทรีย์ Solar เสริม Green Agriculture ครบวงจร',
    keyIndustries: ['ข้าวอินทรีย์', 'เกษตรกรรม'],
    lat: 15.7928, lng: 104.1452, distanceFromHQKm: 390,
  },
  {
    id: 37, slug: 'amnat-charoen', nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen',
    region: 'northeast', regionTh: 'ภาคตะวันออกเฉียงเหนือ', priority: 'P3',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 65000, estimatedSavings: 310000, popularSystemSize: 90,
    localBenefits: 'เกษตรกรรมและมันสำปะหลัง Solar ช่วยฟาร์มสัตว์และโรงงานแปรรูป',
    keyIndustries: ['เกษตรกรรม', 'มันสำปะหลัง', 'ยาง'],
    lat: 15.8655, lng: 104.6284, distanceFromHQKm: 420,
  },

  // ===== ภาคกลาง (9) =====
  {
    id: 38, slug: 'bangkok', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'MEA', tariffPerUnit: 4.00,
    avgElectricityCost: 500000, estimatedSavings: 1200000, popularSystemSize: 1000,
    localBenefits: 'ศูนย์กลางธุรกิจ อาคารสำนักงาน โรงแรม ห้างสรรพสินค้า ค่าไฟสูงที่สุด Solar ROI ดีที่สุด',
    keyIndustries: ['อาคารสำนักงาน', 'โรงแรม', 'ห้างสรรพสินค้า', 'อุตสาหกรรมทุกประเภท'],
    lat: 13.7563, lng: 100.5018, distanceFromHQKm: 377,
  },
  {
    id: 39, slug: 'nonthaburi', nameTh: 'นนทบุรี', nameEn: 'Nonthaburi',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'MEA', tariffPerUnit: 4.00,
    avgElectricityCost: 300000, estimatedSavings: 800000, popularSystemSize: 600,
    localBenefits: 'ปริมณฑล สำนักงานใหญ่บริษัทขนาดใหญ่ นิคมอุตสาหกรรม Solar ลดค่าไฟ MEA ที่ค่อนข้างแพง',
    keyIndustries: ['สำนักงานใหญ่', 'นิคมอุตสาหกรรม', 'โรงพยาบาล'],
    lat: 13.8621, lng: 100.5144, distanceFromHQKm: 370,
  },
  {
    id: 40, slug: 'pathum-thani', nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 380000, estimatedSavings: 950000, popularSystemSize: 700,
    localBenefits: 'นิคมอุตสาหกรรมรังสิต Navanakorn มีโรงงานอิเล็กทรอนิกส์ อาหาร Logistics จำนวนมาก',
    keyIndustries: ['นิคมอุตสาหกรรม', 'อิเล็กทรอนิกส์', 'อาหาร', 'Logistics'],
    lat: 14.0208, lng: 100.5250, distanceFromHQKm: 340,
  },
  {
    id: 41, slug: 'samut-prakan', nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'MEA', tariffPerUnit: 4.00,
    avgElectricityCost: 450000, estimatedSavings: 1100000, popularSystemSize: 900,
    localBenefits: 'นิคมอุตสาหกรรมหนาแน่นที่สุดในไทย โรงงาน 7,000+ แห่ง ใกล้สนามบินสุวรรณภูมิ',
    keyIndustries: ['นิคมอุตสาหกรรม', 'การผลิต', 'ยานยนต์', 'อาหาร'],
    lat: 13.5991, lng: 100.5998, distanceFromHQKm: 380,
  },
  {
    id: 42, slug: 'samut-sakhon', nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 320000, estimatedSavings: 860000, popularSystemSize: 600,
    localBenefits: 'ศูนย์กลางอาหารทะเลและห้องเย็น ค่าไฟสูงมากจากระบบทำความเย็น Solar คืนทุนเร็ว',
    keyIndustries: ['อาหารทะเล', 'ห้องเย็น', 'โรงงานอาหาร'],
    lat: 13.5475, lng: 100.2745, distanceFromHQKm: 395,
  },
  {
    id: 43, slug: 'nakhon-pathom', nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 620000, popularSystemSize: 400,
    localBenefits: 'โรงงานอาหารและเครื่องดื่ม เกษตรกรรมสวนองุ่น Solar ลดต้นทุนการผลิต',
    keyIndustries: ['อาหารและเครื่องดื่ม', 'เกษตรกรรม', 'สถาบันการศึกษา'],
    lat: 13.8199, lng: 100.0624, distanceFromHQKm: 345,
  },
  {
    id: 44, slug: 'ayutthaya', nameTh: 'พระนครศรีอยุธยา', nameEn: 'Ayutthaya',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 400000, estimatedSavings: 1000000, popularSystemSize: 800,
    localBenefits: 'นิคมอุตสาหกรรมหนาแน่น Honda, Toyota, Western Digital มากกว่า 3,800 โรงงาน',
    keyIndustries: ['ยานยนต์', 'อิเล็กทรอนิกส์', 'อาหาร', 'นิคมอุตสาหกรรม'],
    lat: 14.3692, lng: 100.5877, distanceFromHQKm: 320,
  },
  {
    id: 45, slug: 'ang-thong', nameTh: 'อ่างทอง', nameEn: 'Ang Thong',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 120000, estimatedSavings: 480000, popularSystemSize: 200,
    localBenefits: 'อุตสาหกรรมสิ่งทอและน้ำตาล Solar ช่วยลดต้นทุนโรงงานขนาดกลาง',
    keyIndustries: ['สิ่งทอ', 'น้ำตาล', 'เกษตรกรรม'],
    lat: 14.5896, lng: 100.4550, distanceFromHQKm: 290,
  },
  {
    id: 46, slug: 'sing-buri', nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P3',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 360000, popularSystemSize: 120,
    localBenefits: 'เกษตรกรรมและอุตสาหกรรมเบา โซลาร์ช่วยโรงงานขนาดเล็กลดต้นทุน',
    keyIndustries: ['เกษตรกรรม', 'อุตสาหกรรมเบา'],
    lat: 14.8936, lng: 100.3967, distanceFromHQKm: 255,
  },

  // ===== ภาคตะวันออก (7) =====
  {
    id: 47, slug: 'chon-buri', nameTh: 'ชลบุรี', nameEn: 'Chon Buri',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P1',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 600000, estimatedSavings: 1400000, popularSystemSize: 1000,
    localBenefits: 'EEC เขตเศรษฐกิจพิเศษภาคตะวันออก โรงงาน 12,000+ แห่ง ยานยนต์ไฟฟ้า อิเล็กทรอนิกส์ Aerospace',
    keyIndustries: ['EEC', 'ยานยนต์ EV', 'อิเล็กทรอนิกส์', 'Aerospace'],
    lat: 13.3622, lng: 100.9847, distanceFromHQKm: 480,
  },
  {
    id: 48, slug: 'rayong', nameTh: 'ระยอง', nameEn: 'Rayong',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P1',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 500000, estimatedSavings: 1200000, popularSystemSize: 1000,
    localBenefits: 'Petrochemical Hub มาบตาพุด โรงงาน Hazard Area ใช้ Solar-battery ลดความเสี่ยงไฟดับและลดค่าไฟ',
    keyIndustries: ['Petrochemical', 'ปิโตรเคมี', 'EEC', 'ยานยนต์'],
    lat: 12.6814, lng: 101.2816, distanceFromHQKm: 520,
  },
  {
    id: 49, slug: 'chanthaburi', nameTh: 'จันทบุรี', nameEn: 'Chanthaburi',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 150000, estimatedSavings: 530000, popularSystemSize: 250,
    localBenefits: 'ศูนย์กลางพลอยและอัญมณีโลก โรงงานแปรรูปผลไม้ Solar ลดต้นทุน',
    keyIndustries: ['อัญมณี', 'ผลไม้', 'ประมง'],
    lat: 12.6112, lng: 102.1038, distanceFromHQKm: 560,
  },
  {
    id: 50, slug: 'trat', nameTh: 'ตราด', nameEn: 'Trat',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P3',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 360000, popularSystemSize: 120,
    localBenefits: 'เกาะช้างและเกาะกูด รีสอร์ทบนเกาะพึ่งพา Solar+Battery ลดค่าไฟฟ้าดีเซล',
    keyIndustries: ['การท่องเที่ยว', 'ประมง', 'ผลไม้'],
    lat: 12.2427, lng: 102.5175, distanceFromHQKm: 610,
  },
  {
    id: 51, slug: 'chachoengsao', nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P1',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 300000, estimatedSavings: 800000, popularSystemSize: 600,
    localBenefits: 'EEC ชานเมืองทิศตะวันออก คลังสินค้าและโรงงาน Logistics จำนวนมาก หลังคาพื้นที่ใหญ่',
    keyIndustries: ['Logistics', 'คลังสินค้า', 'อาหาร', 'EEC'],
    lat: 13.6902, lng: 101.0770, distanceFromHQKm: 390,
  },
  {
    id: 52, slug: 'prachin-buri', nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 620000, popularSystemSize: 400,
    localBenefits: 'นิคม 304 Industrial Park โรงงาน Honda Bridgestone มีโรงงานขนาดใหญ่เยอะ',
    keyIndustries: ['ยานยนต์', 'ยาง', 'นิคมอุตสาหกรรม'],
    lat: 14.0514, lng: 101.3663, distanceFromHQKm: 390,
  },
  {
    id: 53, slug: 'sa-kaeo', nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo',
    region: 'east', regionTh: 'ภาคตะวันออก', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 450000, popularSystemSize: 180,
    localBenefits: 'เขตเศรษฐกิจพิเศษสระแก้ว ชายแดนกัมพูชา การค้าชายแดนและ Logistics',
    keyIndustries: ['การค้าชายแดน', 'เกษตรกรรม', 'Logistics'],
    lat: 13.8241, lng: 102.0646, distanceFromHQKm: 430,
  },

  // ===== ภาคตะวันตก (5) =====
  {
    id: 54, slug: 'kanchanaburi', nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi',
    region: 'west', regionTh: 'ภาคตะวันตก', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 150000, estimatedSavings: 530000, popularSystemSize: 250,
    localBenefits: 'พื้นที่กว้างใหญ่ เหมาะ Solar Farm ขนาดใหญ่ การท่องเที่ยวและโรงงานอ้อย-น้ำตาล',
    keyIndustries: ['Solar Farm', 'น้ำตาล', 'การท่องเที่ยว', 'เกษตรกรรม'],
    lat: 14.0023, lng: 99.5476, distanceFromHQKm: 310,
  },
  {
    id: 55, slug: 'ratchaburi', nameTh: 'ราชบุรี', nameEn: 'Ratchaburi',
    region: 'west', regionTh: 'ภาคตะวันตก', priority: 'P1',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 640000, popularSystemSize: 400,
    localBenefits: 'โรงงานน้ำตาล Biomass Gas ใช้ร่วมกับ Solar เป็น Hybrid Energy ลดต้นทุนได้สูงสุด',
    keyIndustries: ['น้ำตาล', 'โรงไฟฟ้า Biomass', 'เกษตรกรรม'],
    lat: 13.5282, lng: 99.8134, distanceFromHQKm: 360,
  },
  {
    id: 56, slug: 'phetchaburi', nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi',
    region: 'west', regionTh: 'ภาคตะวันตก', priority: 'P2',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 130000, estimatedSavings: 490000, popularSystemSize: 220,
    localBenefits: 'Cha-am และ Hua Hin อยู่ใกล้ โรงแรมและรีสอร์ท Solar ลดค่าไฟ สร้าง Green Resort',
    keyIndustries: ['รีสอร์ท', 'โรงแรม', 'เกษตรกรรม', 'น้ำตาล'],
    lat: 13.1120, lng: 99.9390, distanceFromHQKm: 400,
  },
  {
    id: 57, slug: 'prachuap-khiri-khan', nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan',
    region: 'west', regionTh: 'ภาคตะวันตก', priority: 'P2',
    sunHours: 5.1, irradiation: 5.1, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 140000, estimatedSavings: 510000, popularSystemSize: 240,
    localBenefits: 'Hua Hin รีสอร์ทระดับนานาชาติ มีนิคมอุตสาหกรรม สวนอุตสาหกรรม',
    keyIndustries: ['โรงแรม', 'รีสอร์ท', 'น้ำตาล', 'นิคมอุตสาหกรรม'],
    lat: 11.8126, lng: 99.7957, distanceFromHQKm: 500,
  },
  {
    id: 58, slug: 'samut-songkhram', nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram',
    region: 'west', regionTh: 'ภาคตะวันตก', priority: 'P2',
    sunHours: 4.8, irradiation: 4.8, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 440000, popularSystemSize: 180,
    localBenefits: 'ชุมชนริมน้ำ Floating Solar บนคลองเหมาะสมมาก อุตสาหกรรมอาหารทะเล',
    keyIndustries: ['อาหารทะเล', 'Floating Solar', 'เกษตรกรรม'],
    lat: 13.4098, lng: 100.0022, distanceFromHQKm: 380,
  },

  // ===== ภาคใต้ (14) =====
  {
    id: 59, slug: 'surat-thani', nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P1',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 250000, estimatedSavings: 730000, popularSystemSize: 500,
    localBenefits: 'ศูนย์กลางภาคใต้ตอนบน สวนยางและปาล์ม Solar Farm + Agro-solar ได้ประโยชน์ 2 ต่อ',
    keyIndustries: ['ยางพารา', 'ปาล์มน้ำมัน', 'การท่องเที่ยว', 'Logistics'],
    lat: 9.1382, lng: 99.3214, distanceFromHQKm: 780,
  },
  {
    id: 60, slug: 'songkhla', nameTh: 'สงขลา', nameEn: 'Songkhla',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P1',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 280000, estimatedSavings: 760000, popularSystemSize: 500,
    localBenefits: 'Hat Yai ศูนย์กลางการค้าใต้ อุตสาหกรรมยาง ประมง Logistics ชายแดนมาเลเซีย',
    keyIndustries: ['ยางพารา', 'ประมง', 'การค้า', 'Logistics'],
    lat: 7.1893, lng: 100.5953, distanceFromHQKm: 900,
  },
  {
    id: 61, slug: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P1',
    sunHours: 5.4, irradiation: 5.4, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 400000, estimatedSavings: 1000000, popularSystemSize: 800,
    localBenefits: 'Solar สูงสุดในไทย 5.4 ชม./วัน โรงแรมระดับโลก ค่าไฟแพง ROI เร็ว 4-6 ปี',
    keyIndustries: ['โรงแรมระดับโลก', 'การท่องเที่ยว', 'อสังหาริมทรัพย์'],
    lat: 7.8804, lng: 98.3923, distanceFromHQKm: 980,
  },
  {
    id: 62, slug: 'nakhon-si-thammarat', nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P1',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 620000, popularSystemSize: 400,
    localBenefits: 'จังหวัดใหญ่ภาคใต้ตอนกลาง ยางพารา อุตสาหกรรมยาง Solar เสริมประสิทธิภาพ',
    keyIndustries: ['ยางพารา', 'ปาล์มน้ำมัน', 'การผลิต'],
    lat: 8.4322, lng: 99.9630, distanceFromHQKm: 870,
  },
  {
    id: 63, slug: 'krabi', nameTh: 'กระบี่', nameEn: 'Krabi',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 630000, popularSystemSize: 350,
    localBenefits: 'เกาะและรีสอร์ทระดับโลก แสงแดดดีมาก Solar ลดค่าไฟ + สร้างภาพลักษณ์ Green Tourism',
    keyIndustries: ['การท่องเที่ยว', 'โรงแรม', 'ยางพารา'],
    lat: 8.0863, lng: 98.9063, distanceFromHQKm: 940,
  },
  {
    id: 64, slug: 'phang-nga', nameTh: 'พังงา', nameEn: 'Phang Nga',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 150000, estimatedSavings: 530000, popularSystemSize: 250,
    localBenefits: 'อ่าวพังงา เกาะ Eco-resort Solar+Battery ช่วยรีสอร์ทบนเกาะเป็นอิสระจากดีเซล',
    keyIndustries: ['Eco-resort', 'การท่องเที่ยว', 'ยางพารา'],
    lat: 8.4510, lng: 98.5253, distanceFromHQKm: 960,
  },
  {
    id: 65, slug: 'ranong', nameTh: 'ระนอง', nameEn: 'Ranong',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P3',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 360000, popularSystemSize: 120,
    localBenefits: 'ชายแดนพม่า ท่าเรือ Logistics ชายแดน Solar ลดต้นทุนคลังสินค้าริมน้ำ',
    keyIndustries: ['ประมง', 'การค้าชายแดน', 'ยางพารา'],
    lat: 9.9529, lng: 98.6084, distanceFromHQKm: 810,
  },
  {
    id: 66, slug: 'chumphon', nameTh: 'ชุมพร', nameEn: 'Chumphon',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 130000, estimatedSavings: 490000, popularSystemSize: 220,
    localBenefits: 'ประตูสู่ภาคใต้ สวนปาล์มและยาง Solar Farm ขนาดใหญ่บนพื้นที่เปิดโล่ง',
    keyIndustries: ['ยางพารา', 'ปาล์มน้ำมัน', 'ประมง'],
    lat: 10.4930, lng: 99.1800, distanceFromHQKm: 680,
  },
  {
    id: 67, slug: 'trang', nameTh: 'ตรัง', nameEn: 'Trang',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 140000, estimatedSavings: 510000, popularSystemSize: 240,
    localBenefits: 'ยางพาราอันดับต้น โรงงานยางหลายแห่ง Solar ช่วยลดต้นทุนการผลิตยาง',
    keyIndustries: ['ยางพารา', 'ประมง', 'การท่องเที่ยว'],
    lat: 7.5592, lng: 99.6113, distanceFromHQKm: 900,
  },
  {
    id: 68, slug: 'phatthalung', nameTh: 'พัทลุง', nameEn: 'Phatthalung',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 450000, popularSystemSize: 180,
    localBenefits: 'ทะเลสาบสงขลา Floating Solar บนทะเลสาบ เกษตรกรรมและประมง',
    keyIndustries: ['ยางพารา', 'ประมง', 'Floating Solar'],
    lat: 7.6168, lng: 100.0741, distanceFromHQKm: 850,
  },
  {
    id: 69, slug: 'satun', nameTh: 'สตูล', nameEn: 'Satun',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P3',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 80000, estimatedSavings: 370000, popularSystemSize: 120,
    localBenefits: 'ท่าเรือปากบาราเป็น Logistics Hub อาเซียน Solar เสริมคลังสินค้าและท่าเรือ',
    keyIndustries: ['ท่าเรือ', 'Logistics', 'ยางพารา'],
    lat: 6.6238, lng: 100.0673, distanceFromHQKm: 930,
  },
  {
    id: 70, slug: 'pattani', nameTh: 'ปัตตานี', nameEn: 'Pattani',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 450000, popularSystemSize: 180,
    localBenefits: 'ประมงและอุตสาหกรรมอาหารทะเล Solar ช่วยห้องเย็นและโรงงานแปรรูปปลา',
    keyIndustries: ['ประมง', 'อาหารทะเล', 'เกษตรกรรม'],
    lat: 6.8689, lng: 101.2503, distanceFromHQKm: 940,
  },
  {
    id: 71, slug: 'yala', nameTh: 'ยะลา', nameEn: 'Yala',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.3, irradiation: 5.3, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 110000, estimatedSavings: 460000, popularSystemSize: 200,
    localBenefits: 'ยางพาราและผลไม้ทุเรียน Solar Farm เพิ่มรายได้เกษตรกร Agro-solar',
    keyIndustries: ['ยางพารา', 'ทุเรียน', 'เกษตรกรรม'],
    lat: 6.5407, lng: 101.2808, distanceFromHQKm: 960,
  },
  {
    id: 72, slug: 'narathiwat', nameTh: 'นราธิวาส', nameEn: 'Narathiwat',
    region: 'south', regionTh: 'ภาคใต้', priority: 'P2',
    sunHours: 5.2, irradiation: 5.2, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 440000, popularSystemSize: 180,
    localBenefits: 'ชายแดนมาเลเซีย ยางพาราและปาล์ม Solar+Battery ลดการพึ่งพาไฟฟ้าชายแดน',
    keyIndustries: ['ยางพารา', 'ปาล์มน้ำมัน', 'การค้าชายแดน'],
    lat: 6.4255, lng: 101.8235, distanceFromHQKm: 990,
  },

  // ===== เพิ่มเติม (5) =====
  {
    id: 73, slug: 'lop-buri', nameTh: 'ลพบุรี', nameEn: 'Lop Buri',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 200000, estimatedSavings: 620000, popularSystemSize: 400,
    localBenefits: 'Solar Farm ขนาดใหญ่ของรัฐบาลตั้งอยู่ที่นี่ บริษัทเอกชนหลายแห่งลงทุน Solar เพิ่ม',
    keyIndustries: ['Solar Farm', 'การผลิต', 'เกษตรกรรม', 'ทหาร'],
    lat: 14.7995, lng: 100.6534, distanceFromHQKm: 220,
  },
  {
    id: 74, slug: 'saraburi', nameTh: 'สระบุรี', nameEn: 'Saraburi',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P1',
    sunHours: 5.0, irradiation: 5.0, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 280000, estimatedSavings: 760000, popularSystemSize: 500,
    localBenefits: 'นิคมอุตสาหกรรม Navanakorn, HPT มีโรงงานปูนซีเมนต์ เหล็ก เคมีภัณฑ์ ใช้ไฟมหาศาล',
    keyIndustries: ['ปูนซีเมนต์', 'เหล็ก', 'เคมีภัณฑ์', 'นิคมอุตสาหกรรม'],
    lat: 14.5289, lng: 100.9107, distanceFromHQKm: 250,
  },
  {
    id: 75, slug: 'chai-nat', nameTh: 'ชัยนาท', nameEn: 'Chai Nat',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 90000, estimatedSavings: 400000, popularSystemSize: 150,
    localBenefits: 'ชัยนาทนรินทร์ฝาย เกษตรชลประทาน Solar Water Pump ลดค่าสูบน้ำได้มาก',
    keyIndustries: ['เกษตรกรรม', 'ชลประทาน', 'อุตสาหกรรมเบา'],
    lat: 15.1822, lng: 100.1253, distanceFromHQKm: 200,
  },
  {
    id: 76, slug: 'suphan-buri', nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 150000, estimatedSavings: 530000, popularSystemSize: 250,
    localBenefits: 'แหล่งข้าวและน้ำตาล โรงสีข้าวและโรงงานน้ำตาลใช้ไฟมาก Solar ลดต้นทุน',
    keyIndustries: ['ข้าว', 'น้ำตาล', 'เกษตรแปรรูป'],
    lat: 14.4744, lng: 100.1177, distanceFromHQKm: 280,
  },
  {
    id: 77, slug: 'nakhon-nayok', nameTh: 'นครนายก', nameEn: 'Nakhon Nayok',
    region: 'central', regionTh: 'ภาคกลาง', priority: 'P2',
    sunHours: 4.9, irradiation: 4.9, electricityAuthority: 'PEA', tariffPerUnit: 4.18,
    avgElectricityCost: 100000, estimatedSavings: 440000, popularSystemSize: 180,
    localBenefits: 'ท่องเที่ยวธรรมชาติ ดอกไม้ไทยแลนด์ รีสอร์ทและโรงแรม Solar เสริม Green Tourism',
    keyIndustries: ['การท่องเที่ยว', 'รีสอร์ท', 'เกษตรกรรม'],
    lat: 14.2057, lng: 101.2132, distanceFromHQKm: 320,
  },
]

export function getProvinceBySlug(slug: string): Province | undefined {
  return provinces.find((p) => p.slug === slug)
}

export function getProvincesByRegion(region: Region): Province[] {
  return provinces.filter((p) => p.region === region)
}

export function getAllSlugs(): string[] {
  return provinces.map((p) => p.slug)
}

export function getProvincesByPriority(priority: 'P1' | 'P2' | 'P3'): Province[] {
  return provinces.filter((p) => p.priority === priority)
}

// Calculate annual savings for a given system size (kWp)
export function calcAnnualSavings(province: Province, systemKwp: number): number {
  const annualKwh = systemKwp * province.sunHours * 365 * 0.8 // 80% system efficiency
  return Math.round(annualKwh * province.tariffPerUnit)
}

// Calculate payback period in years
export function calcPaybackYears(province: Province, systemKwp: number, costPerKwp = 35000): number {
  const totalCost = systemKwp * costPerKwp
  const annualSavings = calcAnnualSavings(province, systemKwp)
  return Math.round((totalCost / annualSavings) * 10) / 10
}
