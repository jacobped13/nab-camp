type ReviewDataItem = {
  fieldName: string;
  value: string;
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];
  confidenceScore: number;
};

export const REVIEW_DATA: ReviewDataItem[] = [
  {
    fieldName: "Employee's social security number",
    value: "257-34-9518",
    coordinates: [
      [335, 84],
      [450, 84],
      [450, 98],
      [335, 98],
    ],
    confidenceScore: 0.985_924_541_950_225_8,
  },
  {
    fieldName: "Employer identification number (EIN)",
    value: "77-3995612",
    coordinates: [
      [86, 126],
      [195, 126],
      [195, 140],
      [86, 140],
    ],
    confidenceScore: 0.989_504_337_310_791,
  },
  {
    fieldName: "Employer's name, address, and ZIP code",
    value: "Amanda A. Scott\n4340 Fire Access Road\nCharlotte, NC 28202",
    coordinates: [
      [53, 108],
      [324, 153],
      [324, 166],
      [53, 168],
    ],
    confidenceScore: 0.968_846_440_315_246_6,
  },
  {
    fieldName: "Control number",
    value: "R3D1",
    coordinates: [
      [90, 321],
      [137, 321],
      [137, 336],
      [90, 336],
    ],
    confidenceScore: 0.982_829_689_979_553_2,
  },
  {
    fieldName: "Employee’s first name and initial",
    value: "Derek",
    coordinates: [
      [68, 345],
      [140, 357],
      [140, 358],
      [68, 358],
    ],
    confidenceScore: 0.991_563_796_997_070_3,
  },
  {
    fieldName: "Employee’s address and ZIP code",
    value: "18 Yawkey Way\nBoston, MA 55192",
    coordinates: [
      [84, 217],
      [311, 234],
      [311, 260],
      [84, 260],
    ],
    confidenceScore: 0.979_897_975_921_630_9,
  },
  {
    fieldName: "1 Wages, tips, other compensation",
    value: "78,000.00",
    coordinates: [
      [666, 128],
      [754, 127],
      [754, 143],
      [666, 144],
    ],
    confidenceScore: 0.976_018_905_639_648_4,
  },
  {
    fieldName: "3 Social security wages",
    value: "54,239.92",
    coordinates: [
      [668, 225],
      [756, 224],
      [756, 240],
      [668, 241],
    ],
    confidenceScore: 0.968_576_312_065_124_5,
  },
  {
    fieldName: "5 Medicare wages and tips",
    value: "65,000.00",
    coordinates: [
      [640, 203],
      [816, 202],
      [816, 240],
      [640, 241],
    ],
    confidenceScore: 0.982_335_984_706_878_7,
  },
  {
    fieldName: "7 Social security tips",
    value: "9",
    coordinates: [
      [641, 298],
      [649, 298],
      [649, 307],
      [641, 307],
    ],
    confidenceScore: 0.952_486_693_859_100_3,
  },
  {
    fieldName: "2 Federal income tax withheld",
    value: "1,111.00",
    coordinates: [
      [881, 107],
      [1075, 106],
      [1075, 141],
      [881, 142],
    ],
    confidenceScore: 0.984_609_484_672_546_4,
  },
  {
    fieldName: "4 Social security tax withheld",
    value: "1,111.00",
    coordinates: [
      [882, 203],
      [1037, 203],
      [1037, 214],
      [882, 214],
    ],
    confidenceScore: 0.983_570_396_900_177,
  },
  {
    fieldName: "6 Medicare tax withheld",
    value: "1,111.00",
    coordinates: [
      [921, 224],
      [998, 223],
      [998, 239],
      [921, 240],
    ],
    confidenceScore: 0.954_673_409_461_975_1,
  },
  {
    fieldName: "8 Allocated tips",
    value: "12a",
    coordinates: [
      [640, 108],
      [845, 107],
      [844, 143],
      [639, 144],
    ],
    confidenceScore: 0.982_784_986_495_971_7,
  },
  {
    fieldName: "10 Dependent care benefits",
    value: "9",
    coordinates: [
      [641, 298],
      [649, 298],
      [649, 307],
      [641, 307],
    ],
    confidenceScore: 0.952_486_693_859_100_3,
  },
  {
    fieldName: "12a Code",
    value: "D",
    coordinates: [
      [121, 558],
      [190, 558],
      [190, 571],
      [120, 571],
    ],
    confidenceScore: 0.973_232_150_077_819_8,
  },
  {
    fieldName: "12a Amount",
    value: "1,234.00",
    coordinates: [
      [640, 153],
      [779, 252],
      [779, 264],
      [639, 263],
    ],
    confidenceScore: 0.985_534_608_364_105_2,
  },
  {
    fieldName: "Statutory employee",
    value: "employee",
    coordinates: [
      [732, 389],
      [778, 398],
      [778, 409],
      [732, 408],
    ],
    confidenceScore: 0.993_457_853_794_097_9,
  },
  {
    fieldName: "Retirement plan",
    value: "Retirement plan",
    coordinates: [
      [773, 659],
      [1108, 671],
      [1108, 672],
      [773, 672],
    ],
    confidenceScore: 0.985_999_047_756_195_1,
  },
  {
    fieldName: "Third-party sick pay",
    value: "Third-party sick pay",
    coordinates: [
      [802, 389],
      [851, 407],
      [850, 409],
      [801, 407],
    ],
    confidenceScore: 0.986_118_555_068_969_7,
  },
  {
    fieldName: "12b Code",
    value: "C",
    coordinates: [
      [193, 558],
      [224, 558],
      [224, 571],
      [193, 571],
    ],
    confidenceScore: 0.992_290_735_244_751,
  },
  {
    fieldName: "14 Other",
    value: "C 123.45",
    coordinates: [
      [832, 108],
      [845, 121],
      [845, 121],
      [832, 108],
    ],
    confidenceScore: 0.991_563_796_997_070_3,
  },
  {
    fieldName: "12c Code",
    value: "C",
    coordinates: [
      [243, 653],
      [280, 651],
      [282, 684],
      [245, 686],
    ],
    confidenceScore: 0.991_814_851_760_864_3,
  },
  {
    fieldName: "12c Amount",
    value: "123.45",
    coordinates: [
      [832, 108],
      [845, 121],
      [845, 121],
      [832, 108],
    ],
    confidenceScore: 0.991_563_796_997_070_3,
  },
  {
    fieldName: "12d Code",
    value: "°",
    coordinates: [
      [876, 475],
      [881, 475],
      [881, 479],
      [876, 479],
    ],
    confidenceScore: 0.446_868_717_670_440_7,
  },
  {
    fieldName: "Employer’s state ID number",
    value: "319-9921-4512",
    coordinates: [
      [147, 580],
      [285, 595],
      [285, 595],
      [147, 580],
    ],
    confidenceScore: 0.986_369_073_390_960_7,
  },
  {
    fieldName: "16 State wages, tips, etc.",
    value: "78,000",
    coordinates: [
      [881, 578],
      [917, 591],
      [917, 591],
      [881, 578],
    ],
    confidenceScore: 0.910_562_336_444_854_7,
  },
  {
    fieldName: "17 State income tax",
    value: "6,535",
    coordinates: [
      [868, 578],
      [894, 591],
      [894, 591],
      [868, 578],
    ],
    confidenceScore: 0.910_562_336_444_854_7,
  },
  {
    fieldName: "18 Local wages, tips, etc.",
    value: "78,000",
    coordinates: [
      [693, 440],
      [727, 450],
      [727, 450],
      [693, 440],
    ],
    confidenceScore: 0.983_008_623_123_169,
  },
  {
    fieldName: "19 Local income tax",
    value: "1,949",
    coordinates: [
      [880, 251],
      [986, 262],
      [986, 262],
      [880, 251],
    ],
    confidenceScore: 0.981_102_466_583_252,
  },
  {
    fieldName: "20 Locality name",
    value: "Atlanta",
    coordinates: [
      [519, 690],
      [639, 728],
      [639, 728],
      [519, 690],
    ],
    confidenceScore: 0.971_224_308_013_916,
  },
];
