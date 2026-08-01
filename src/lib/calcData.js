export const PHONE = "+79063052828";
export const PHONE_DISPLAY = "+7 906 305-28-28";
export const WHATSAPP = "https://wa.me/79063052828";
export const TELEGRAM = "https://t.me/+79063052828";
export const VK_MSG = "https://vk.com/rb_remont";
export const VK_GROUP = "https://vk.com/rb_remont";
export const MAX_URL = "https://max.ru";
export const CITY = "Саратов";

export const COEFFICIENTS = [
  { id: "smallBathroom", label: "Маленький санузел", value: 0.2 },
  { id: "largeTile", label: "Крупная плитка", value: 0.3 },
  { id: "diagonal", label: "Диагональная укладка", value: 0.2 },
  { id: "complexGeometry", label: "Сложная геометрия (арки, колонны)", value: 0.2 },
];

export const TURNKEY_NEW = [
  { id: "cosmetic", name: "Косметический", price: 4500, unit: "м²", desc: "Покраска, обои, напольное покрытие" },
  { id: "capital", name: "Капитальный", price: 7000, unit: "м²", desc: "Полный цикл с выравниванием" },
  { id: "turnkey", name: "Под ключ", price: 9000, unit: "м²", desc: "Дизайн + материалы + работа" },
  { id: "bathroom", name: "Санузел под ключ", price: 120000, unit: "шт", desc: "Комплексный ремонт санузла" },
];

export const CALC_CATEGORIES = [
  // 1. ДЕМОНТАЖ
  {
    id: "demolition",
    name: "Демонтажные работы",
    icon: "🔨",
    groups: [
      {
        id: "dem_walls",
        name: "Демонтаж стен и покрытий",
        items: [
          { id: "dem_wallpaper", name: "Демонтаж обоев", unit: "м²", mount: 120, dismount: 0, materials: [] },
          { id: "dem_paint", name: "Демонтаж краски", unit: "м²", mount: 180, dismount: 0, materials: [] },
          { id: "dem_deco_plaster", name: "Демонтаж декоративной штукатурки", unit: "м²", mount: 250, dismount: 0, materials: [] },
          { id: "dem_tile_wall", name: "Демонтаж плитки (стены)", unit: "м²", mount: 350, dismount: 0, materials: [] },
          { id: "dem_pvc_panel", name: "Демонтаж ПВХ панелей", unit: "м²", mount: 200, dismount: 0, materials: [] },
          { id: "dem_gkl_wall", name: "Демонтаж гипсокартона", unit: "м²", mount: 250, dismount: 0, materials: [] },
          { id: "dem_partition", name: "Демонтаж перегородок", unit: "м²", mount: 650, dismount: 0, materials: [] },
        ],
      },
      {
        id: "dem_floor",
        name: "Демонтаж полов",
        items: [
          { id: "dem_laminate", name: "Демонтаж ламината", unit: "м²", mount: 150, dismount: 0, materials: [] },
          { id: "dem_linoleum", name: "Демонтаж линолеума", unit: "м²", mount: 120, dismount: 0, materials: [] },
          { id: "dem_parquet", name: "Демонтаж паркета", unit: "м²", mount: 250, dismount: 0, materials: [] },
          { id: "dem_tile_floor", name: "Демонтаж плитки пола", unit: "м²", mount: 350, dismount: 0, materials: [] },
          { id: "dem_screed", name: "Демонтаж стяжки", unit: "м²", mount: 600, dismount: 0, materials: [] },
          { id: "dem_plinth", name: "Демонтаж плинтуса", unit: "м.п", mount: 80, dismount: 0, materials: [] },
        ],
      },
      {
        id: "dem_ceiling",
        name: "Демонтаж потолков",
        items: [
          { id: "dem_stretch_ceil", name: "Демонтаж натяжного потолка", unit: "м²", mount: 150, dismount: 0, materials: [] },
          { id: "dem_suspended_ceil", name: "Демонтаж подвесного потолка", unit: "м²", mount: 200, dismount: 0, materials: [] },
          { id: "dem_gkl_ceil", name: "Демонтаж потолка ГКЛ", unit: "м²", mount: 250, dismount: 0, materials: [] },
        ],
      },
      {
        id: "dem_misc",
        name: "Демонтаж прочего",
        items: [
          { id: "dem_door", name: "Демонтаж двери", unit: "шт", mount: 700, dismount: 0, materials: [] },
          { id: "dem_plumbing", name: "Демонтаж сантехники", unit: "шт", mount: 800, dismount: 0, materials: [] },
          { id: "dem_windowsill", name: "Демонтаж подоконника", unit: "м.п", mount: 300, dismount: 0, materials: [] },
          { id: "dem_radiator", name: "Демонтаж радиатора", unit: "шт", mount: 1500, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 2. ЧЕРНОВЫЕ РАБОТЫ
  {
    id: "roughworks",
    name: "Черновые работы и стяжка",
    icon: "🏗️",
    groups: [
      {
        id: "rough_screed",
        name: "Стяжка пола",
        items: [
          { id: "rough_concrete_screed", name: "Стяжка бетонная", unit: "м²", mount: 1200, dismount: 600,
            materials: [
              { name: "Пескобетон М300", consumption: 18, unit: "кг", price: 14 },
              { name: "Фиброволокно", consumption: 0.06, unit: "кг", price: 280 },
            ]
          },
          { id: "rough_manual_screed", name: "Стяжка ручная", unit: "м²", mount: 900, dismount: 500,
            materials: [
              { name: "Пескобетон М300", consumption: 16, unit: "кг", price: 14 },
            ]
          },
          { id: "rough_mech_screed", name: "Механизированная стяжка", unit: "м²", mount: 1200, dismount: 550,
            materials: [
              { name: "Пескобетон М300", consumption: 20, unit: "кг", price: 14 },
            ]
          },
          { id: "rough_self_level", name: "Наливной пол", unit: "м²", mount: 400, dismount: 300,
            materials: [
              { name: "Нивелирмасса", consumption: 5, unit: "кг", price: 35 },
              { name: "Грунтовка", consumption: 0.2, unit: "л", price: 85 },
            ]
          },
          { id: "rough_floor_level", name: "Выравнивание пола", unit: "м²", mount: 450, dismount: 300,
            materials: [
              { name: "Смесь для выравнивания", consumption: 8, unit: "кг", price: 28 },
            ]
          },
          { id: "rough_sound_ins", name: "Шумоизоляция пола", unit: "м²", mount: 300, dismount: 0,
            materials: [
              { name: "Шумоизоляция ЗИПС", consumption: 1.05, unit: "м²", price: 450 },
            ]
          },
          { id: "rough_hydro_ins", name: "Гидроизоляция пола", unit: "м²", mount: 250, dismount: 0,
            materials: [
              { name: "Гидроизол обмазочный", consumption: 1.2, unit: "кг", price: 180 },
            ]
          },
          { id: "rough_warmfloor", name: "Монтаж тёплого пола", unit: "м²", mount: 600, dismount: 200,
            materials: [
              { name: "Кабель тёплого пола", consumption: 1, unit: "п.м", price: 350 },
              { name: "Термостат", consumption: 0.05, unit: "шт", price: 1500 },
            ]
          },
        ],
      },
    ],
  },

  // 3. ЧИСТОВЫЕ ПОЛЫ
  {
    id: "floor",
    name: "Чистовые полы",
    icon: "⬛",
    groups: [
      {
        id: "floor_covering",
        name: "Напольные покрытия",
        items: [
          { id: "floor_laminate", name: "Укладка ламината", unit: "м²", mount: 600, dismount: 150,
            materials: [
              { name: "Ламинат 32кл", consumption: 1.07, unit: "м²", price: 650 },
              { name: "Подложка", consumption: 1.05, unit: "м²", price: 65 },
            ]
          },
          { id: "floor_quartz", name: "Укладка кварцвинила", unit: "м²", mount: 800, dismount: 200,
            materials: [
              { name: "Кварцвинил", consumption: 1.07, unit: "м²", price: 900 },
              { name: "Подложка", consumption: 1.05, unit: "м²", price: 55 },
            ]
          },
          { id: "floor_linoleum", name: "Укладка линолеума", unit: "м²", mount: 450, dismount: 120,
            materials: [
              { name: "Линолеум бытовой", consumption: 1.05, unit: "м²", price: 380 },
            ]
          },
          { id: "floor_commercial_lin", name: "Коммерческий линолеум", unit: "м²", mount: 700, dismount: 150,
            materials: [
              { name: "Линолеум коммерческий", consumption: 1.05, unit: "м²", price: 650 },
            ]
          },
          { id: "floor_parquet", name: "Укладка паркета", unit: "м²", mount: 900, dismount: 250,
            materials: [
              { name: "Паркет штучный", consumption: 1.08, unit: "м²", price: 1800 },
              { name: "Клей паркетный", consumption: 0.8, unit: "кг", price: 280 },
            ]
          },
          { id: "floor_grind", name: "Шлифовка паркета", unit: "м²", mount: 350, dismount: 0, materials: [] },
          { id: "floor_varnish", name: "Лакировка паркета", unit: "м²", mount: 400, dismount: 0,
            materials: [
              { name: "Лак паркетный", consumption: 0.15, unit: "л", price: 650 },
            ]
          },
        ],
      },
      {
        id: "floor_plinth",
        name: "Плинтусы",
        items: [
          { id: "floor_plinth_pvc", name: "Плинтус ПВХ", unit: "м.п", mount: 200, dismount: 80,
            materials: [{ name: "Плинтус ПВХ", consumption: 1.05, unit: "м.п", price: 85 }]
          },
          { id: "floor_plinth_mdf", name: "Плинтус МДФ", unit: "м.п", mount: 350, dismount: 80,
            materials: [{ name: "Плинтус МДФ", consumption: 1.05, unit: "м.п", price: 220 }]
          },
          { id: "floor_plinth_wood", name: "Плинтус деревянный", unit: "м.п", mount: 400, dismount: 80,
            materials: [{ name: "Плинтус деревянный", consumption: 1.05, unit: "м.п", price: 380 }]
          },
        ],
      },
    ],
  },

  // 4. ШТУКАТУРНЫЕ РАБОТЫ
  {
    id: "plaster",
    name: "Штукатурные работы",
    icon: "🧱",
    groups: [
      {
        id: "plaster_main",
        name: "Штукатурка стен",
        items: [
          { id: "pl_prime", name: "Грунтовка поверхности", unit: "м²", mount: 80, dismount: 0,
            materials: [{ name: "Грунтовка", consumption: 0.2, unit: "л", price: 85 }]
          },
          { id: "pl_betokontakt", name: "Бетоноконтакт", unit: "м²", mount: 150, dismount: 0,
            materials: [{ name: "Бетоноконтакт", consumption: 0.4, unit: "кг", price: 150 }]
          },
          { id: "pl_quartz", name: "Кварцгрунт", unit: "м²", mount: 150, dismount: 0,
            materials: [{ name: "Кварцгрунт", consumption: 0.5, unit: "кг", price: 120 }]
          },
          { id: "pl_gypsum", name: "Гипсовая штукатурка", unit: "м²", mount: 800, dismount: 300,
            materials: [
              { name: "Штукатурка гипсовая", consumption: 12, unit: "кг", price: 22 },
              { name: "Маяк штукатурный", consumption: 0.25, unit: "шт", price: 30 },
              { name: "Грунтовка", consumption: 0.2, unit: "л", price: 85 },
            ]
          },
          { id: "pl_cement", name: "Цементная штукатурка", unit: "м²", mount: 1000, dismount: 350,
            materials: [
              { name: "Штукатурка цементная", consumption: 18, unit: "кг", price: 18 },
              { name: "Маяк штукатурный", consumption: 0.25, unit: "шт", price: 30 },
            ]
          },
          { id: "pl_nobeacon", name: "Безмаячная штукатурка", unit: "м²", mount: 450, dismount: 250,
            materials: [{ name: "Штукатурка гипсовая", consumption: 10, unit: "кг", price: 22 }]
          },
          { id: "pl_mesh", name: "Армирование сеткой", unit: "м²", mount: 120, dismount: 0,
            materials: [{ name: "Сетка стеклотканевая", consumption: 1.1, unit: "м²", price: 45 }]
          },
          { id: "pl_slopes", name: "Штукатурка откосов", unit: "м.п", mount: 500, dismount: 200,
            materials: [{ name: "Штукатурка гипсовая", consumption: 2, unit: "кг", price: 22 }]
          },
          { id: "pl_corner", name: "Установка малярного угла", unit: "м.п", mount: 150, dismount: 0,
            materials: [{ name: "Угол малярный перфорированный", consumption: 1.05, unit: "шт", price: 25 }]
          },
        ],
      },
    ],
  },

  // 5. МАЛЯРНЫЕ РАБОТЫ
  {
    id: "painting",
    name: "Малярные работы",
    icon: "🎨",
    groups: [
      {
        id: "painting_putty",
        name: "Шпаклёвка",
        items: [
          { id: "paint_putty_wallpaper", name: "Шпаклёвка под обои", unit: "м²", mount: 550, dismount: 0,
            materials: [
              { name: "Шпаклёвка финишная", consumption: 1.2, unit: "кг", price: 32 },
              { name: "Грунтовка", consumption: 0.15, unit: "л", price: 85 },
            ]
          },
          { id: "paint_putty_paint", name: "Шпаклёвка под покраску", unit: "м²", mount: 1050, dismount: 0,
            materials: [
              { name: "Шпаклёвка финишная", consumption: 1.8, unit: "кг", price: 32 },
              { name: "Сетка серпянка", consumption: 0.5, unit: "м", price: 12 },
              { name: "Грунтовка", consumption: 0.15, unit: "л", price: 85 },
            ]
          },
          { id: "paint_grind", name: "Шлифовка поверхности", unit: "м²", mount: 120, dismount: 0, materials: [] },
          { id: "paint_fiberglass_wall", name: "Поклейка стеклохолста (стены)", unit: "м²", mount: 200, dismount: 0,
            materials: [
              { name: "Стеклохолст", consumption: 1.05, unit: "м²", price: 85 },
              { name: "Клей ПВА", consumption: 0.1, unit: "кг", price: 95 },
            ]
          },
          { id: "paint_fiberglass_ceil", name: "Поклейка стеклохолста (потолок)", unit: "м²", mount: 300, dismount: 0,
            materials: [
              { name: "Стеклохолст", consumption: 1.05, unit: "м²", price: 85 },
              { name: "Клей ПВА", consumption: 0.12, unit: "кг", price: 95 },
            ]
          },
        ],
      },
      {
        id: "painting_paint",
        name: "Покраска",
        items: [
          { id: "paint_wall", name: "Покраска стен", unit: "м²", mount: 250, dismount: 0,
            materials: [{ name: "Краска интерьерная", consumption: 0.28, unit: "л", price: 180 }]
          },
          { id: "paint_ceil", name: "Покраска потолка", unit: "м²", mount: 400, dismount: 0,
            materials: [{ name: "Краска для потолка", consumption: 0.3, unit: "л", price: 180 }]
          },
          { id: "paint_slopes", name: "Покраска откосов", unit: "м.п", mount: 700, dismount: 0,
            materials: [{ name: "Краска", consumption: 0.1, unit: "л", price: 180 }]
          },
          { id: "paint_radiator", name: "Покраска радиаторов", unit: "шт", mount: 800, dismount: 0,
            materials: [{ name: "Краска по металлу", consumption: 0.3, unit: "л", price: 350 }]
          },
          { id: "paint_pipe", name: "Покраска труб", unit: "м.п", mount: 250, dismount: 0,
            materials: [{ name: "Краска по металлу", consumption: 0.05, unit: "л", price: 350 }]
          },
          { id: "paint_door", name: "Покраска дверей", unit: "шт", mount: 1500, dismount: 0,
            materials: [{ name: "Краска", consumption: 0.5, unit: "л", price: 350 }]
          },
        ],
      },
      {
        id: "painting_wallpaper",
        name: "Обои",
        items: [
          { id: "wp_no_match", name: "Поклейка обоев без подбора", unit: "м²", mount: 250, dismount: 120,
            materials: [
              { name: "Обои", consumption: 1.05, unit: "м²", price: 250 },
              { name: "Клей для обоев", consumption: 0.1, unit: "кг", price: 280 },
            ]
          },
          { id: "wp_match", name: "Поклейка обоев с подбором", unit: "м²", mount: 350, dismount: 120,
            materials: [
              { name: "Обои", consumption: 1.15, unit: "м²", price: 350 },
              { name: "Клей для обоев", consumption: 0.1, unit: "кг", price: 280 },
            ]
          },
          { id: "wp_fleece", name: "Флизелиновые обои", unit: "м²", mount: 320, dismount: 100,
            materials: [
              { name: "Обои флизелиновые", consumption: 1.07, unit: "м²", price: 400 },
              { name: "Клей для обоев", consumption: 0.1, unit: "кг", price: 280 },
            ]
          },
          { id: "wp_vinyl", name: "Виниловые обои", unit: "м²", mount: 350, dismount: 100,
            materials: [
              { name: "Обои виниловые", consumption: 1.07, unit: "м²", price: 500 },
              { name: "Клей для обоев", consumption: 0.1, unit: "кг", price: 280 },
            ]
          },
          { id: "wp_photo", name: "Фотообои", unit: "м²", mount: 500, dismount: 100,
            materials: [
              { name: "Фотообои", consumption: 1.0, unit: "м²", price: 800 },
            ]
          },
        ],
      },
    ],
  },

  // 6. ПЛИТОЧНЫЕ РАБОТЫ
  {
    id: "tiling",
    name: "Плиточные работы",
    icon: "🟦",
    groups: [
      {
        id: "tiling_floor",
        name: "Укладка плитки",
        items: [
          { id: "tile_300", name: "Плитка 300×300", unit: "м²", mount: 1600, dismount: 350,
            materials: [
              { name: "Плитка 300×300", consumption: 1.07, unit: "м²", price: 600 },
              { name: "Плиточный клей", consumption: 5, unit: "кг", price: 28 },
              { name: "Затирка", consumption: 0.4, unit: "кг", price: 75 },
            ]
          },
          { id: "tile_400", name: "Плитка 400×400", unit: "м²", mount: 1600, dismount: 350,
            materials: [
              { name: "Плитка 400×400", consumption: 1.07, unit: "м²", price: 750 },
              { name: "Плиточный клей", consumption: 5, unit: "кг", price: 28 },
              { name: "Затирка", consumption: 0.3, unit: "кг", price: 75 },
            ]
          },
          { id: "tile_600", name: "Плитка 600×600", unit: "м²", mount: 2200, dismount: 400,
            materials: [
              { name: "Плитка 600×600", consumption: 1.07, unit: "м²", price: 1100 },
              { name: "Клей усиленный", consumption: 7, unit: "кг", price: 38 },
              { name: "Затирка", consumption: 0.25, unit: "кг", price: 75 },
            ]
          },
          { id: "tile_1200x600", name: "Плитка 1200×600", unit: "м²", mount: 2500, dismount: 450,
            materials: [
              { name: "Плитка 1200×600", consumption: 1.05, unit: "м²", price: 1800 },
              { name: "Клей для крупного формата", consumption: 8, unit: "кг", price: 45 },
            ]
          },
          { id: "tile_1800x1200", name: "Плитка 1800×1200", unit: "м²", mount: 3500, dismount: 600,
            materials: [
              { name: "Крупноформатная плитка", consumption: 1.05, unit: "м²", price: 2800 },
              { name: "Клей для крупного формата", consumption: 10, unit: "кг", price: 45 },
            ]
          },
          { id: "tile_3000x1200", name: "Плитка 3000×1200", unit: "м²", mount: 5500, dismount: 800,
            materials: [
              { name: "Крупноформатная плитка", consumption: 1.05, unit: "м²", price: 4500 },
              { name: "Клей для крупного формата", consumption: 12, unit: "кг", price: 45 },
            ]
          },
          { id: "tile_mosaic", name: "Мозаика", unit: "м²", mount: 4000, dismount: 450,
            materials: [
              { name: "Мозаика", consumption: 1.1, unit: "м²", price: 1800 },
              { name: "Белый клей", consumption: 4, unit: "кг", price: 45 },
            ]
          },
          { id: "tile_herring", name: "Укладка «ёлочкой»", unit: "м²", mount: 2500, dismount: 400,
            materials: [
              { name: "Плитка (ёлочка)", consumption: 1.12, unit: "м²", price: 900 },
              { name: "Клей", consumption: 6, unit: "кг", price: 28 },
            ]
          },
          { id: "tile_kitchen_apron", name: "Фартук кухни", unit: "м²", mount: 2500, dismount: 400,
            materials: [
              { name: "Плитка кухонная", consumption: 1.07, unit: "м²", price: 900 },
              { name: "Плиточный клей", consumption: 5, unit: "кг", price: 28 },
            ]
          },
        ],
      },
      {
        id: "tiling_extra",
        name: "Дополнительные работы",
        items: [
          { id: "tile_cut45", name: "Запил 45°", unit: "м.п", mount: 1500, dismount: 0, materials: [] },
          { id: "tile_cut", name: "Подрезка плитки", unit: "м.п", mount: 300, dismount: 0, materials: [] },
          { id: "tile_hole_pipe", name: "Отверстие под трубы", unit: "шт", mount: 800, dismount: 0, materials: [] },
          { id: "tile_hole_sewer", name: "Отверстие под канализацию", unit: "шт", mount: 1500, dismount: 0, materials: [] },
          { id: "tile_epoxy_grout", name: "Эпоксидная затирка", unit: "м²", mount: 800, dismount: 0,
            materials: [{ name: "Затирка эпоксидная", consumption: 0.5, unit: "кг", price: 850 }]
          },
        ],
      },
    ],
  },

  // 7. ГИПСОКАРТОН
  {
    id: "gkl",
    name: "Гипсокартон и перегородки",
    icon: "⬜",
    groups: [
      {
        id: "gkl_partitions",
        name: "Перегородки и потолки",
        items: [
          { id: "gkl_partition_sound", name: "Перегородка с шумоизоляцией", unit: "м²", mount: 2000, dismount: 500,
            materials: [
              { name: "ГКЛ", consumption: 2.2, unit: "шт", price: 450 },
              { name: "Профиль CW/UW", consumption: 4, unit: "п.м", price: 80 },
              { name: "Утеплитель", consumption: 0.05, unit: "м³", price: 2200 },
            ]
          },
          { id: "gkl_ceil_single", name: "Потолок ГКЛ (однуровневый)", unit: "м²", mount: 2000, dismount: 600,
            materials: [
              { name: "ГКЛ лист", consumption: 1.1, unit: "шт", price: 450 },
              { name: "Профиль CD/UD", consumption: 3, unit: "п.м", price: 75 },
              { name: "Дюбель-саморез", consumption: 12, unit: "шт", price: 4 },
            ]
          },
          { id: "gkl_ceil_double", name: "Потолок ГКЛ (двухуровневый)", unit: "м²", mount: 3000, dismount: 800,
            materials: [
              { name: "ГКЛ лист", consumption: 1.2, unit: "шт", price: 450 },
              { name: "Профиль", consumption: 5, unit: "п.м", price: 75 },
            ]
          },
          { id: "gkl_box", name: "Короб ГКЛ", unit: "м.п", mount: 1300, dismount: 400,
            materials: [
              { name: "ГКЛ лист", consumption: 0.3, unit: "шт", price: 450 },
              { name: "Профиль", consumption: 1.5, unit: "п.м", price: 75 },
            ]
          },
          { id: "gkl_box_pipe", name: "Короб под трубы", unit: "м.п", mount: 1500, dismount: 400, materials: [] },
          { id: "gkl_box_install", name: "Короб под инсталляцию", unit: "шт", mount: 6000, dismount: 0, materials: [] },
          { id: "gkl_box_exhaust", name: "Короб под вытяжку", unit: "шт", mount: 2000, dismount: 0, materials: [] },
          { id: "gkl_hole_lamp", name: "Отверстие под светильник", unit: "шт", mount: 250, dismount: 0, materials: [] },
          { id: "gkl_seam", name: "Заделка швов ГКЛ", unit: "м.п", mount: 120, dismount: 0,
            materials: [{ name: "Серпянка + шпаклёвка", consumption: 0.2, unit: "кг", price: 32 }]
          },
        ],
      },
    ],
  },

  // 8. ПОТОЛКИ
  {
    id: "ceiling",
    name: "Натяжные потолки",
    icon: "🏠",
    groups: [
      {
        id: "ceiling_stretch",
        name: "Натяжные потолки",
        items: [
          { id: "ceil_matte", name: "Натяжной матовый", unit: "м²", mount: 600, dismount: 150,
            materials: [{ name: "Полотно матовое", consumption: 1.1, unit: "м²", price: 350 }]
          },
          { id: "ceil_gloss", name: "Натяжной глянцевый", unit: "м²", mount: 600, dismount: 150,
            materials: [{ name: "Полотно глянцевое", consumption: 1.1, unit: "м²", price: 400 }]
          },
          { id: "ceil_satin", name: "Натяжной сатиновый", unit: "м²", mount: 600, dismount: 150,
            materials: [{ name: "Полотно сатиновое", consumption: 1.1, unit: "м²", price: 380 }]
          },
          { id: "ceil_fabric", name: "Натяжной тканевый", unit: "м²", mount: 900, dismount: 200,
            materials: [{ name: "Полотно тканевое", consumption: 1.1, unit: "м²", price: 750 }]
          },
          { id: "ceil_floating", name: "Парящий потолок", unit: "м.п", mount: 900, dismount: 200, materials: [] },
          { id: "ceil_profile", name: "Монтаж профиля", unit: "м.п", mount: 180, dismount: 0,
            materials: [{ name: "Профиль багет", consumption: 1.05, unit: "п.м", price: 120 }]
          },
        ],
      },
    ],
  },

  // 9. ЭЛЕКТРИКА
  {
    id: "electric",
    name: "Электрика",
    icon: "⚡",
    groups: [
      {
        id: "electric_points",
        name: "Точки питания",
        items: [
          { id: "elec_socket", name: "Монтаж розетки", unit: "шт", mount: 350, dismount: 150,
            materials: [
              { name: "Подрозетник", consumption: 1, unit: "шт", price: 40 },
              { name: "Розетка", consumption: 1, unit: "шт", price: 280 },
            ]
          },
          { id: "elec_socket_double", name: "Двойная розетка", unit: "шт", mount: 450, dismount: 150,
            materials: [
              { name: "Подрозетник двойной", consumption: 1, unit: "шт", price: 55 },
              { name: "Розетка двойная", consumption: 1, unit: "шт", price: 380 },
            ]
          },
          { id: "elec_switch", name: "Монтаж выключателя", unit: "шт", mount: 350, dismount: 150,
            materials: [
              { name: "Подрозетник", consumption: 1, unit: "шт", price: 40 },
              { name: "Выключатель", consumption: 1, unit: "шт", price: 320 },
            ]
          },
          { id: "elec_inet", name: "Интернет / ТВ розетка", unit: "шт", mount: 400, dismount: 150,
            materials: [
              { name: "Розетка интернет/ТВ", consumption: 1, unit: "шт", price: 450 },
            ]
          },
          { id: "elec_lamp", name: "Монтаж люстры", unit: "шт", mount: 800, dismount: 300, materials: [] },
          { id: "elec_spot", name: "Точечный светильник", unit: "шт", mount: 400, dismount: 150, materials: [] },
          { id: "elec_led", name: "Светодиодная лента", unit: "м", mount: 400, dismount: 0,
            materials: [{ name: "Лента LED", consumption: 1, unit: "м", price: 350 }]
          },
        ],
      },
      {
        id: "electric_cable",
        name: "Кабельные работы",
        items: [
          { id: "elec_groove", name: "Штробление стен", unit: "п.м", mount: 500, dismount: 0, materials: [] },
          { id: "elec_cable", name: "Прокладка кабеля", unit: "п.м", mount: 120, dismount: 60,
            materials: [{ name: "Кабель ВВГнг 3×2.5", consumption: 1, unit: "п.м", price: 95 }]
          },
          { id: "elec_panel", name: "Сборка электрощита", unit: "шт", mount: 5000, dismount: 1500, materials: [] },
          { id: "elec_breaker", name: "Замена автомата", unit: "шт", mount: 500, dismount: 0, materials: [] },
          { id: "elec_thermo", name: "Монтаж терморегулятора тёплого пола", unit: "шт", mount: 1500, dismount: 0,
            materials: [{ name: "Терморегулятор", consumption: 1, unit: "шт", price: 1500 }]
          },
          { id: "elec_motion", name: "Датчик движения", unit: "шт", mount: 1500, dismount: 0,
            materials: [{ name: "Датчик движения", consumption: 1, unit: "шт", price: 1200 }]
          },
        ],
      },
    ],
  },

  // 10. САНТЕХНИКА
  {
    id: "plumbing",
    name: "Сантехника",
    icon: "🚿",
    groups: [
      {
        id: "plumbing_fixtures",
        name: "Сантехнические приборы",
        items: [
          { id: "plumb_install", name: "Монтаж инсталляции", unit: "шт", mount: 6000, dismount: 1500, materials: [] },
          { id: "plumb_toilet", name: "Установка унитаза", unit: "шт", mount: 2500, dismount: 800, materials: [] },
          { id: "plumb_sink", name: "Установка раковины", unit: "шт", mount: 2500, dismount: 600, materials: [] },
          { id: "plumb_mixer", name: "Установка смесителя", unit: "шт", mount: 700, dismount: 400, materials: [] },
          { id: "plumb_bath", name: "Установка ванны", unit: "шт", mount: 5000, dismount: 1000, materials: [] },
          { id: "plumb_shower", name: "Установка душевой кабины", unit: "шт", mount: 7000, dismount: 1200, materials: [] },
          { id: "plumb_hygshower", name: "Монтаж гигиенического душа", unit: "шт", mount: 2000, dismount: 0, materials: [] },
          { id: "plumb_towel", name: "Полотенцесушитель", unit: "шт", mount: 2500, dismount: 700, materials: [] },
        ],
      },
      {
        id: "plumbing_pipes",
        name: "Трубы и разводка",
        items: [
          { id: "plumb_water_pipe", name: "Разводка воды", unit: "точка", mount: 1500, dismount: 500,
            materials: [
              { name: "Труба PPR 20мм", consumption: 1.5, unit: "п.м", price: 85 },
              { name: "Фитинг", consumption: 2, unit: "шт", price: 65 },
            ]
          },
          { id: "plumb_sewer", name: "Разводка канализации", unit: "точка", mount: 1200, dismount: 400,
            materials: [
              { name: "Труба канализационная 50мм", consumption: 1.5, unit: "п.м", price: 95 },
            ]
          },
          { id: "plumb_collector", name: "Монтаж коллектора", unit: "шт", mount: 8000, dismount: 0, materials: [] },
          { id: "plumb_filter", name: "Монтаж фильтра", unit: "шт", mount: 2000, dismount: 0, materials: [] },
        ],
      },
      {
        id: "plumbing_shower",
        name: "Душевые и поддоны",
        items: [
          { id: "plumb_tray_brick", name: "Поддон из кирпича", unit: "шт", mount: 30000, dismount: 0, materials: [] },
          { id: "plumb_tray_conv", name: "Поддон конверт", unit: "шт", mount: 25000, dismount: 0, materials: [] },
          { id: "plumb_trap", name: "Монтаж трапа", unit: "шт", mount: 4000, dismount: 0, materials: [] },
          { id: "plumb_glass", name: "Монтаж ограждения (стекло/пластик)", unit: "шт", mount: 5000, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 11. ДВЕРИ
  {
    id: "doors",
    name: "Двери",
    icon: "🚪",
    groups: [
      {
        id: "doors_interior",
        name: "Межкомнатные двери",
        items: [
          { id: "door_standard", name: "Межкомнатная дверь", unit: "шт", mount: 3500, dismount: 600,
            materials: [
              { name: "Петли", consumption: 2, unit: "шт", price: 120 },
              { name: "Наличники", consumption: 1, unit: "компл", price: 600 },
            ]
          },
          { id: "door_hidden", name: "Скрытая дверь", unit: "шт", mount: 10000, dismount: 1000, materials: [] },
          { id: "door_lock", name: "Врезка замка", unit: "шт", mount: 1200, dismount: 0,
            materials: [{ name: "Замок врезной", consumption: 1, unit: "шт", price: 800 }]
          },
          { id: "door_handle", name: "Установка ручек", unit: "шт", mount: 400, dismount: 0,
            materials: [{ name: "Ручка дверная", consumption: 1, unit: "шт", price: 500 }]
          },
          { id: "door_addon", name: "Доборы", unit: "шт", mount: 800, dismount: 0,
            materials: [{ name: "Добор дверной", consumption: 1, unit: "шт", price: 900 }]
          },
          { id: "door_trim", name: "Наличники", unit: "шт", mount: 600, dismount: 0,
            materials: [{ name: "Наличники", consumption: 1, unit: "компл", price: 600 }]
          },
        ],
      },
    ],
  },

  // 12. БАЛКОНЫ
  {
    id: "balcony",
    name: "Балконы и лоджии",
    icon: "🏡",
    groups: [
      {
        id: "balcony_works",
        name: "Отделка балкона",
        items: [
          { id: "balc_dem", name: "Демонтаж отделки", unit: "м²", mount: 350, dismount: 0, materials: [] },
          { id: "balc_penoplex", name: "Утепление пеноплекс", unit: "м²", mount: 450, dismount: 0,
            materials: [{ name: "Пеноплекс 50мм", consumption: 1.05, unit: "м²", price: 350 }]
          },
          { id: "balc_minwool", name: "Утепление минвата", unit: "м²", mount: 500, dismount: 0,
            materials: [{ name: "Минвата 50мм", consumption: 1.05, unit: "м²", price: 280 }]
          },
          { id: "balc_vapour", name: "Пароизоляция", unit: "м²", mount: 120, dismount: 0,
            materials: [{ name: "Пароизоляция", consumption: 1.1, unit: "м²", price: 45 }]
          },
          { id: "balc_pvc_panel", name: "ПВХ панели", unit: "м²", mount: 750, dismount: 200,
            materials: [{ name: "ПВХ панели", consumption: 1.05, unit: "м²", price: 280 }]
          },
          { id: "balc_mdf_panel", name: "МДФ панели", unit: "м²", mount: 850, dismount: 200,
            materials: [{ name: "МДФ панели", consumption: 1.05, unit: "м²", price: 450 }]
          },
          { id: "balc_lining", name: "Вагонка", unit: "м²", mount: 900, dismount: 200,
            materials: [{ name: "Вагонка деревянная", consumption: 1.05, unit: "м²", price: 520 }]
          },
          { id: "balc_decoplaster", name: "Декоративная штукатурка", unit: "м²", mount: 950, dismount: 0,
            materials: [{ name: "Декоративная штукатурка", consumption: 2, unit: "кг", price: 180 }]
          },
          { id: "balc_paint", name: "Покраска балкона", unit: "м²", mount: 250, dismount: 0,
            materials: [{ name: "Краска", consumption: 0.28, unit: "л", price: 180 }]
          },
          { id: "balc_screed", name: "Стяжка на балконе", unit: "м²", mount: 650, dismount: 0,
            materials: [{ name: "Пескобетон М300", consumption: 16, unit: "кг", price: 14 }]
          },
          { id: "balc_laminate", name: "Ламинат на балкон", unit: "м²", mount: 450, dismount: 150,
            materials: [{ name: "Ламинат влагостойкий", consumption: 1.07, unit: "м²", price: 750 }]
          },
          { id: "balc_tile", name: "Плитка на балкон", unit: "м²", mount: 1200, dismount: 350,
            materials: [
              { name: "Плитка напольная", consumption: 1.07, unit: "м²", price: 750 },
              { name: "Клей", consumption: 5, unit: "кг", price: 28 },
            ]
          },
          { id: "balc_windowsill", name: "Установка подоконника", unit: "м.п", mount: 900, dismount: 300,
            materials: [{ name: "Подоконник", consumption: 1, unit: "п.м", price: 550 }]
          },
          { id: "balc_dryer", name: "Монтаж сушилки", unit: "шт", mount: 800, dismount: 0, materials: [] },
          { id: "balc_wardrobe", name: "Монтаж шкафа", unit: "шт", mount: 3500, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 13. СВАРКА
  {
    id: "welding",
    name: "Сварка и металлоконструкции",
    icon: "🔥",
    groups: [
      {
        id: "welding_types",
        name: "Виды сварочных работ",
        items: [
          { id: "weld_general", name: "Сварочные работы", unit: "усл", mount: 1500, dismount: 0, materials: [] },
          { id: "weld_argon", name: "Аргоновая сварка", unit: "усл", mount: 1300, dismount: 0, materials: [] },
          { id: "weld_spot", name: "Точечная сварка", unit: "усл", mount: 970, dismount: 0, materials: [] },
          { id: "weld_pipes", name: "Сварка труб", unit: "усл", mount: 1820, dismount: 0, materials: [] },
          { id: "weld_metal", name: "Монтаж металлоконструкций", unit: "усл", mount: 2330, dismount: 0, materials: [] },
          { id: "weld_mfg", name: "Изготовление металлоконструкций", unit: "т", mount: 1200, dismount: 0, materials: [] },
          { id: "weld_gate", name: "Изготовление ворот", unit: "шт", mount: 6300, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 14. ЗАБОРЫ
  {
    id: "fences",
    name: "Заборы и ограждения",
    icon: "🏗️",
    groups: [
      {
        id: "fences_install",
        name: "Установка заборов",
        items: [
          { id: "fence_weld", name: "Сборка сварного забора", unit: "п.м", mount: 550, dismount: 200,
            materials: [{ name: "Секция сварная", consumption: 1, unit: "шт", price: 2500 }]
          },
          { id: "fence_mesh", name: "Забор из сварной сетки", unit: "п.м", mount: 550, dismount: 200,
            materials: [{ name: "Сетка сварная", consumption: 1, unit: "п.м", price: 850 }]
          },
          { id: "fence_mount", name: "Монтаж ограждений", unit: "п.м", mount: 500, dismount: 200, materials: [] },
          { id: "fence_foundation", name: "Фундамент под столбы", unit: "п.м", mount: 500, dismount: 0,
            materials: [
              { name: "Цемент М400", consumption: 5, unit: "кг", price: 22 },
              { name: "Труба 60×60", consumption: 1, unit: "п.м", price: 450 },
            ]
          },
          { id: "fence_paint", name: "Покраска забора", unit: "м²", mount: 60, dismount: 0,
            materials: [{ name: "Краска по металлу", consumption: 0.15, unit: "л", price: 250 }]
          },
        ],
      },
    ],
  },

  // 15. НАВЕСЫ
  {
    id: "canopies",
    name: "Навесы и козырьки",
    icon: "⛺",
    groups: [
      {
        id: "canopies_install",
        name: "Установка навесов",
        items: [
          { id: "canopy_car", name: "Навес автомобильный / терраса", unit: "м²", mount: 5000, dismount: 1500, materials: [] },
          { id: "canopy_porch", name: "Навес над крыльцом", unit: "шт", mount: 10000, dismount: 0, materials: [] },
          { id: "canopy_visor", name: "Козырёк над дверью", unit: "шт", mount: 5000, dismount: 1200, materials: [] },
        ],
      },
    ],
  },

  // 16. ЛЕСТНИЦЫ
  {
    id: "stairs",
    name: "Лестницы",
    icon: "🪜",
    groups: [
      {
        id: "stairs_install",
        name: "Установка лестниц",
        items: [
          { id: "stair_service", name: "Монтаж лестницы (услуга)", unit: "шт", mount: 6700, dismount: 2000, materials: [] },
          { id: "stair_wood", name: "Монтаж деревянной лестницы", unit: "шт", mount: 12700, dismount: 0, materials: [] },
          { id: "stair_full", name: "Лестница под ключ", unit: "шт", mount: 36700, dismount: 5000, materials: [] },
          { id: "stair_attic", name: "Установка чердачной лестницы", unit: "шт", mount: 4670, dismount: 0, materials: [] },
          { id: "stair_step_mfg", name: "Изготовление ступеней на заказ", unit: "усл", mount: 23300, dismount: 0, materials: [] },
          { id: "stair_march", name: "Отделка лестничных маршей", unit: "м²", mount: 1330, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 17. БЕСЕДКИ
  {
    id: "gazebo",
    name: "Строительство беседок",
    icon: "🌿",
    groups: [
      {
        id: "gazebo_install",
        name: "Строительство беседок",
        items: [
          { id: "gazebo_mount", name: "Монтаж беседки", unit: "м²", mount: 1750, dismount: 500, materials: [] },
          { id: "gazebo_full", name: "Беседка под ключ", unit: "м²", mount: 670, dismount: 0, materials: [] },
          { id: "gazebo_wood", name: "Беседка из дерева", unit: "м²", mount: 1820, dismount: 0, materials: [] },
        ],
      },
    ],
  },

  // 18. БАНИ
  {
    id: "bathhouse",
    name: "Строительство бань",
    icon: "🛁",
    groups: [
      {
        id: "bathhouse_build",
        name: "Строительство бань",
        items: [
          { id: "bath_turnkey", name: "Баня под ключ", unit: "м²", mount: 5000, dismount: 1500, materials: [] },
          { id: "bath_frame", name: "Каркасная баня", unit: "м²", mount: 5000, dismount: 0, materials: [] },
          { id: "bath_partial", name: "Частичное строительство бани", unit: "м²", mount: 1270, dismount: 0, materials: [] },
          { id: "bath_sauna_finish", name: "Отделка парной", unit: "м²", mount: 670, dismount: 0, materials: [] },
          { id: "bath_solid", name: "Баня из бревна/газоблока", unit: "м²", mount: 11500, dismount: 2000, materials: [] },
        ],
      },
    ],
  },
];