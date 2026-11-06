export const REGIONS = {
  europe: 'Europe',
  'north-america': 'North America',
  'south-america': 'South America',
  africa: 'Africa',
  asia: 'Asia & Middle East',
  oceania: 'Oceania',
} as const;

export const CATEGORIES = {
  international: 'International tribunals',
  transitional: 'Reckoning with the past',
  political: 'Political trials',
  miscarriage: 'Miscarriages of justice',
  society: 'Science & society',
  hearing: 'Public inquiries',
  crime: 'Crime trials',
} as const;

export type RegionKey = keyof typeof REGIONS;
export type CategoryKey = keyof typeof CATEGORIES;

export const regionKeys = Object.keys(REGIONS) as [RegionKey, ...RegionKey[]];
export const categoryKeys = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];
