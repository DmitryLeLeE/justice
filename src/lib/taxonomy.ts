export const REGIONS = {
  europe: 'Европа',
  'north-america': 'Северная Америка',
  'south-america': 'Южная Америка',
  africa: 'Африка',
  asia: 'Азия и Ближний Восток',
  oceania: 'Океания',
} as const;

export const CATEGORIES = {
  international: 'Международные трибуналы',
  transitional: 'Суд над прошлым',
  political: 'Политические процессы',
  miscarriage: 'Судебные ошибки',
  society: 'Наука и общество',
} as const;

export type RegionKey = keyof typeof REGIONS;
export type CategoryKey = keyof typeof CATEGORIES;

export const regionKeys = Object.keys(REGIONS) as [RegionKey, ...RegionKey[]];
export const categoryKeys = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];
