const coverImages = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=540&fit=crop',
  'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=900&h=540&fit=crop',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&h=540&fit=crop',
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&h=540&fit=crop',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&h=540&fit=crop',
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=900&h=540&fit=crop',
];

export const blogCategoryMeta = {
  'theme-travel': {
    label: '主題旅遊',
    description: '用不同主題打開亞洲城市，從美食、文化到海島假期一次收藏。',
  },
  events: {
    label: '熱門活動',
    description: '精選各地節慶、市集、展演與季節限定玩法，安排行程更有方向。',
  },
  promotions: {
    label: '限時促銷',
    description: '掌握近期優惠與熱門航線，讓下一趟旅行更輕鬆出發。',
  },
};

const titles = [
  '東京三天兩夜城市散步提案',
  '大阪親子旅行必排的五個景點',
  '首爾週末快閃購物路線',
  '曼谷夜市與河岸餐廳攻略',
  '新加坡城市花園小旅行',
  '越南峴港海岸假期指南',
  '澳門輕旅行美食地圖',
  '沖繩自駕看海路線',
  '釜山海景咖啡與市場漫遊',
  '清邁慢活週末玩法',
  '福岡屋台與購物街一日遊',
  '河內老城區散步筆記',
  '名古屋親子鐵道旅行',
  '濟州島自然景點精選',
  '胡志明城市咖啡地圖',
  '曼谷設計旅店推薦',
  '東京賞櫻航班規劃',
  '大阪環球影城出發前準備',
  '新加坡親子室內景點',
  '峴港雨季旅行注意事項',
  '澳門週末快閃行程',
  '首爾賞楓景點整理',
  '普吉島海灘假期安排',
  '福岡近郊溫泉小旅行',
];

export const articles = titles.map((title, index) => ({
  id: `article-${index + 1}`,
  title,
  date: `2026-${String((index % 6) + 1).padStart(2, '0')}-${String((index % 24) + 1).padStart(2, '0')}`,
  cover: coverImages[index % coverImages.length],
  summary: '精選航點、交通與行程靈感，幫你用更輕鬆的方式規劃下一趟亞洲旅行。',
}));
