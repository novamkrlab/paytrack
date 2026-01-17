/**
 * Harcama Kategori Veri Yapısı
 */

/**
 * Kategori
 */
export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji veya ikon adı
  color: string; // Hex renk kodu
  isCustom: boolean; // Kullanıcı tarafından oluşturuldu mu?
  isDefault: boolean; // Varsayılan kategori mi? (silinemez)
  createdAt: string;
  updatedAt: string;
}

/**
 * Varsayılan Kategoriler
 */
export const DEFAULT_CATEGORIES: Omit<Category, "createdAt" | "updatedAt">[] = [
  {
    id: "cat_food",
    name: "Gıda",
    icon: "🍔",
    color: "#10B981", // Yeşil
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_fuel",
    name: "Yakıt",
    icon: "⛽",
    color: "#F59E0B", // Turuncu
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_transport",
    name: "Ulaşım",
    icon: "🚌",
    color: "#3B82F6", // Mavi
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_rent",
    name: "Kira",
    icon: "🏠",
    color: "#8B5CF6", // Mor
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_bills",
    name: "Faturalar",
    icon: "💡",
    color: "#EF4444", // Kırmızı
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_entertainment",
    name: "Eğlence",
    icon: "🎬",
    color: "#EC4899", // Pembe
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_clothing",
    name: "Giyim",
    icon: "👕",
    color: "#06B6D4", // Cyan
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_health",
    name: "Sağlık",
    icon: "🏥",
    color: "#14B8A6", // Teal
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_education",
    name: "Eğitim",
    icon: "📚",
    color: "#6366F1", // Indigo
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_shopping",
    name: "Alışveriş",
    icon: "🛒",
    color: "#F97316", // Turuncu
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_restaurant",
    name: "Restoran",
    icon: "🍽️",
    color: "#84CC16", // Lime
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_subscription",
    name: "Abonelik",
    icon: "📱",
    color: "#A855F7", // Purple
    isCustom: false,
    isDefault: true,
  },
  {
    id: "cat_other",
    name: "Diğer",
    icon: "💰",
    color: "#64748B", // Gri
    isCustom: false,
    isDefault: true,
  },
];

/**
 * Kullanılabilir İkonlar (Emoji)
 */
export const AVAILABLE_ICONS = [
  "🍔", "🍕", "🍜", "🥗", "🍱", "🍰", "☕", // Yiyecek
  "⛽", "🚗", "🚌", "🚇", "✈️", "🚲", "🛵", // Ulaşım
  "🏠", "🏢", "🏪", "🏦", "🏥", "🏫", "🏨", // Binalar
  "💡", "💧", "📞", "📺", "🌐", "🔌", // Faturalar
  "🎬", "🎮", "🎵", "🎨", "🎭", "🎪", "🎯", // Eğlence
  "👕", "👗", "👔", "👞", "👜", "💄", "💍", // Giyim & Aksesuar
  "📚", "📝", "✏️", "🎓", "📖", "🖊️", // Eğitim
  "🏥", "💊", "🩺", "💉", "🦷", "👓", // Sağlık
  "🛒", "🛍️", "💳", "💰", "💵", "💸", "🏧", // Alışveriş & Para
  "📱", "💻", "⌚", "📷", "🎧", "🖥️", // Elektronik
  "🐕", "🐈", "🐠", "🌱", "🌸", "🌳", // Evcil Hayvan & Bahçe
  "⚽", "🏀", "🎾", "🏋️", "🧘", "🏊", // Spor
  "✈️", "🏖️", "🗺️", "🎒", "🧳", "🏕️", // Seyahat
  "🎁", "🎂", "🎉", "🎊", "🎈", "🎀", // Hediye & Kutlama
  "🔧", "🔨", "🪛", "🧰", "🔩", "⚙️", // Tamir & Bakım
  "📦", "📮", "📫", "📪", "📬", "📭", // Kargo & Posta
  "❓", "❔", "❕", "❗", "⭐", "✨", // Diğer
];

/**
 * Kullanılabilir Renkler
 */
export const AVAILABLE_COLORS = [
  { name: "Kırmızı", hex: "#EF4444" },
  { name: "Turuncu", hex: "#F97316" },
  { name: "Sarı", hex: "#F59E0B" },
  { name: "Yeşil", hex: "#10B981" },
  { name: "Mavi", hex: "#3B82F6" },
  { name: "Mor", hex: "#8B5CF6" },
  { name: "Pembe", hex: "#EC4899" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Lime", hex: "#84CC16" },
  { name: "Gri", hex: "#64748B" },
  { name: "Siyah", hex: "#1F2937" },
];
