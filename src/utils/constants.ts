import { GroupAreaInfo, GroupNumber, GroupSubmission, StepDefinition } from '../types';

export const GROUP_AREAS: Record<GroupNumber, GroupAreaInfo> = {
  '1': {
    groupNumber: '1',
    regionName: 'Alun-Alun Tugu – Balai Kota Malang – Stasiun Malang Kota Baru',
    expectedObjects: [
      'jalan',
      'taman',
      'bangunan pemerintahan',
      'stasiun',
      'rel',
      'permukiman',
      'vegetasi'
    ],
    description: 'Pusat pemerintahan bersejarah Kota Malang dengan pola tugu melingkar, bangunan kolonial Balai Kota, jalur rel, dan stasiun sentral.'
  },
  '2': {
    groupNumber: '2',
    regionName: 'Jalan Ijen – Museum Brawijaya – Oro-Oro Dowo',
    expectedObjects: [
      'jalan utama',
      'taman',
      'vegetasi',
      'permukiman',
      'bangunan',
      'jaringan jalan'
    ],
    description: 'Kawasan cagar budaya dengan boulevard lebar berpohon palem kembar, median taman hijau, monumen museum, dan permukiman teratur.'
  },
  '3': {
    groupNumber: '3',
    regionName: 'Universitas Brawijaya – Jalan Veteran – Malang Town Square',
    expectedObjects: [
      'kompleks pendidikan',
      'gedung besar',
      'jalan utama',
      'permukiman',
      'ruang terbuka',
      'kawasan komersial'
    ],
    description: 'Kawasan pendidikan tinggi terpadu dan koridor komersial dinamis dengan atap gedung perkuliahan luas, pusat perbelanjaan, dan jalan arteri.'
  },
  '4': {
    groupNumber: '4',
    regionName: 'Universitas Negeri Malang – Jalan Semarang – Jalan Veteran',
    expectedObjects: [
      'kompleks kampus',
      'lapangan',
      'vegetasi',
      'jalan',
      'gedung',
      'permukiman'
    ],
    description: 'Kompleks kampus berorientasi hijau dengan lapangan olahraga terbuka, kanopi pepohonan lebat, dan deretan gedung fakultas bertingkat.'
  },
  '5': {
    groupNumber: '5',
    regionName: 'Velodrome – Madyopuro – Sawojajar',
    expectedObjects: [
      'arena olahraga',
      'ruang terbuka',
      'vegetasi',
      'jalan',
      'permukiman',
      'bangunan'
    ],
    description: 'Kawasan permukiman modern Sawojajar dengan pola jalan terencana dan kompleks arena lintasan balap sepeda/olahraga Velodrome berbentuk oval khas.'
  },
  '6': {
    groupNumber: '6',
    regionName: 'Kedungkandang – Pasar Madyopuro – Jalan Danau Jonge',
    expectedObjects: [
      'permukiman',
      'jalan',
      'bangunan perdagangan',
      'vegetasi',
      'lahan terbuka',
      'jaringan jalan'
    ],
    description: 'Wilayah timur Malang yang memadukan aktivitas perdagangan tradisional Pasar Madyopuro, jaringan jalan penghubung, lahan terbuka, dan permukiman.'
  }
};

export const STEPS: StepDefinition[] = [
  {
    key: 'identity',
    number: 1,
    label: 'Identitas Kelompok',
    shortLabel: 'Identitas',
    description: 'Informasi kelompok, nomor, dan daftar 6 anggota siswa'
  },
  {
    key: 'instructions',
    number: 2,
    label: 'Tujuan & Petunjuk',
    shortLabel: 'Petunjuk',
    description: 'Tujuan pembelajaran & pembagian alokasi waktu 45 menit'
  },
  {
    key: 'material',
    number: 3,
    label: 'Materi Singkat',
    shortLabel: 'Materi',
    description: 'Konsep dasar, alur kerja, dan komponen penginderaan jauh'
  },
  {
    key: 'image_observation',
    number: 4,
    label: 'Detektif Citra',
    shortLabel: 'Citra',
    description: 'Pengamatan citra wilayah kelompok & identifikasi 5 pertanyaan awal'
  },
  {
    key: 'table_objects',
    number: 5,
    label: 'Tabel Pengamatan',
    shortLabel: 'Tabel Objek',
    description: 'Pencatatan objek, ciri visual yang tampak, dan alasan/dugaan'
  },
  {
    key: 'presentation',
    number: 6,
    label: 'Objek Presentasi',
    shortLabel: 'Presentasi',
    description: 'Pemilihan 2 objek unggulan untuk dipaparkan di depan kelas'
  },
  {
    key: 'reflection',
    number: 7,
    label: 'Refleksi Pembelajaran',
    shortLabel: 'Refleksi',
    description: 'Ulasan hasil belajar, kesimpulan, dan evaluasi konsep'
  },
  {
    key: 'summary_or_grade',
    number: 8,
    label: 'Kirim / Hasil Nilai',
    shortLabel: 'Hasil',
    description: 'Pengiriman LKPD ke guru atau melihat hasil penilaian & catatan'
  }
];

export const INITIAL_OBSERVATION_ROWS = [
  { id: 'row-1', objectName: '', visualFeature: '', reasonOrConjecture: '' },
  { id: 'row-2', objectName: '', visualFeature: '', reasonOrConjecture: '' },
  { id: 'row-3', objectName: '', visualFeature: '', reasonOrConjecture: '' },
  { id: 'row-4', objectName: '', visualFeature: '', reasonOrConjecture: '' },
  { id: 'row-5', objectName: '', visualFeature: '', reasonOrConjecture: '' },
  { id: 'row-6', objectName: '', visualFeature: '', reasonOrConjecture: '' }
];

export const createDefaultGroupSubmission = (groupNum: GroupNumber): GroupSubmission => ({
  id: `group${groupNum}`,
  groupNumber: groupNum,
  groupName: '',
  className: 'X-',
  members: ['', '', '', '', '', ''],
  assignedArea: GROUP_AREAS[groupNum].regionName,
  imageUrl: null,
  answers: {
    objectsSeen: '',
    easiestObject: '',
    easiestReason: '',
    hardestObject: '',
    doubtfulObject: ''
  },
  observations: [
    { id: 'row-1', objectName: '', visualFeature: '', reasonOrConjecture: '' },
    { id: 'row-2', objectName: '', visualFeature: '', reasonOrConjecture: '' },
    { id: 'row-3', objectName: '', visualFeature: '', reasonOrConjecture: '' },
    { id: 'row-4', objectName: '', visualFeature: '', reasonOrConjecture: '' },
    { id: 'row-5', objectName: '', visualFeature: '', reasonOrConjecture: '' },
    { id: 'row-6', objectName: '', visualFeature: '', reasonOrConjecture: '' }
  ],
  presentationObjects: {
    obj1: { objectName: '', visualFeature: '', reasonOrEvidence: '' },
    obj2: { objectName: '', visualFeature: '', reasonOrEvidence: '' }
  },
  reflection: {
    learnedToday: '',
    easiestLearned: '',
    hardestLearned: '',
    canIdentifyByShapeOnly: null
  },
  progress: 0,
  status: 'not_started',
  startedAt: null,
  submittedAt: null,
  updatedAt: new Date().toISOString()
});

export const LEARNING_OBJECTIVES = [
  'Menjelaskan pengertian penginderaan jauh secara sederhana.',
  'Mengidentifikasi komponen dasar penginderaan jauh.',
  'Mengenali beberapa objek pada citra.',
  'Mengidentifikasi objek berdasarkan kenampakan visual.',
  'Menjelaskan alasan mengapa suatu objek dapat dikenali.'
];

export const ACTIVITY_GUIDELINES = [
  'Bekerjalah bersama kelompok secara aktif dan kooperatif.',
  'Amati citra wilayah kelompok kalian dengan cermat.',
  'Temukan minimal lima objek pada citra pengamatan.',
  'Diskusikan ciri visual setiap objek bersama anggota kelompok.',
  'Tuliskan hasil pengamatan ke dalam tabel yang disediakan.',
  'Pilih dua objek terbaik untuk dipresentasikan di depan kelas.',
  'Pastikan semua jawaban telah disimpan sebelum menekan tombol kirim/selesai.'
];

export const TIME_ALLOCATION = [
  { duration: '5 menit', title: 'Observasi Awal', desc: 'Membuka citra, mengamati pola umum, dan mengenali batas wilayah pengamatan.' },
  { duration: '15 menit', title: 'Identifikasi Objek', desc: 'Mendeteksi objek-objek penting, membedakan kenampakan visual, dan berdiskusi.' },
  { duration: '15 menit', title: 'Mengisi Hasil Pengamatan', desc: 'Melengkapi tabel objek, ciri visual, alasan dugaan, serta menjawab pertanyaan LKPD.' },
  { duration: '10 menit', title: 'Diskusi & Presentasi', desc: 'Menyiapkan pemaparan 1 menit untuk 2 objek pilihan dan mengisi refleksi belajar.' }
];

export const RUBRIC_CRITERIA = [
  {
    id: 'objectIdentification',
    name: 'Ketepatan Mengidentifikasi Objek',
    maxScore: 30,
    bands: [
      { range: '26–30', label: 'Sangat Tepat', desc: 'Lima atau lebih objek dikenali dengan sangat tepat sesuai citra.' },
      { range: '21–25', label: 'Tepat', desc: 'Sebagian besar objek yang diidentifikasi tepat.' },
      { range: '16–20', label: 'Cukup', desc: 'Beberapa objek masih kurang tepat atau keliru mengenali kenampakan.' },
      { range: '0–15', label: 'Perlu Bimbingan', desc: 'Banyak objek belum tepat atau teridentifikasi secara acak.' }
    ]
  },
  {
    id: 'visualReasoning',
    name: 'Ciri Visual dan Alasan',
    maxScore: 25,
    bands: [
      { range: '21–25', label: 'Sangat Jelas', desc: 'Alasan jelas, logis, terperinci, dan sesuai dengan kenampakan pada citra.' },
      { range: '16–20', label: 'Cukup Jelas', desc: 'Alasan cukup jelas dan dapat diterima dengan argumen visual memadai.' },
      { range: '11–15', label: 'Masih Umum', desc: 'Alasan masih umum dan belum menguraikan ciri visual secara spesifik.' },
      { range: '0–10', label: 'Kurang Sesuai', desc: 'Alasan kurang sesuai atau tidak lengkap.' }
    ]
  },
  {
    id: 'completeness',
    name: 'Kelengkapan Tabel Pengamatan',
    maxScore: 20,
    bands: [
      { range: '17–20', label: 'Lengkap & Rapi', desc: 'Lengkap minimal 6 baris dan terisi dengan analisis baik.' },
      { range: '13–16', label: 'Hampir Lengkap', desc: 'Hampir lengkap (4–5 baris terisi dengan baik).' },
      { range: '9–12', label: 'Sebagian Kosong', desc: 'Beberapa bagian masih kosong atau penjelasan sangat singkat.' },
      { range: '0–8', label: 'Belum Lengkap', desc: 'Sebagian besar tabel belum diisi.' }
    ]
  },
  {
    id: 'presentation',
    name: 'Hasil Diskusi / Presentasi',
    maxScore: 15,
    bands: [
      { range: '13–15', label: 'Sangat Baik', desc: 'Penjelasan 2 objek sangat jelas dan mampu memberikan bukti visual yang tepat.' },
      { range: '10–12', label: 'Cukup Baik', desc: 'Penjelasan cukup jelas dan poin utama tersampaikan.' },
      { range: '7–9', label: 'Terbatas', desc: 'Penjelasan masih terbatas atau ragu-ragu saat menyampaikan.' },
      { range: '0–6', label: 'Kurang', desc: 'Belum mampu menjelaskan objek dan alasan visual dengan baik.' }
    ]
  },
  {
    id: 'reflection',
    name: 'Refleksi dan Kerja Kelompok',
    maxScore: 10,
    bands: [
      { range: '9–10', label: 'Mendalam', desc: 'Refleksi lengkap, jujur, dan menunjukkan pemahaman mendalam tentang konsep citra.' },
      { range: '7–8', label: 'Cukup Lengkap', desc: 'Refleksi terisi dengan jawaban logis dan relevan.' },
      { range: '5–6', label: 'Sederhana', desc: 'Refleksi masih sangat singkat atau belum elaboratif.' },
      { range: '0–4', label: 'Belum Lengkap', desc: 'Refleksi belum diisi secara lengkap.' }
    ]
  }
];
