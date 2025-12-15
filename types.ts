export enum Category {
  TOP = '上装',
  BOTTOM = '下装',
  SHOES = '鞋履',
  OUTERWEAR = '外套',
  ACCESSORY = '配饰',
  DRESS = '连衣裙',
  OTHER = '其他'
}

export enum Season {
  SUMMER = '夏季',
  WINTER = '冬季',
  SPRING_AUTUMN = '春秋',
  ALL_SEASON = '四季通用'
}

export interface ClothingItem {
  id: string;
  imageUrl: string; // Base64 or URL
  name: string;
  category: Category;
  season: Season;
  color: string;
  location: string; // e.g., "Drawer 1", "Hanging Left"
  description: string;
  createdAt: number;
}

export interface OutfitSuggestion {
  outfitName: string;
  items: string[]; // Array of clothing IDs
  reasoning: string;
}

export type ViewState = 'wardrobe' | 'add' | 'stylist';

export interface User {
  username: string;
}
