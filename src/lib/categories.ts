// Kategorilere ait tüm görsel/metin ayarları tek yerde.
// Veritabanına yeni bir kategori eklenirse burada tanımı yoksa varsayılan stil kullanılır.

export type CategoryStyle = {
  icon: string
  description: string
  /** Sol kenardaki renkli şerit / nokta */
  accent: string
  /** Kategori etiketi (rozet) */
  badge: string
  /** Kategori kartı arka planı */
  card: string
  /** Seçili kart çerçevesi */
  ring: string
}

const categoryStyles: Record<string, CategoryStyle> = {
  Fonksiyonlar: {
    icon: '⚡',
    description: 'Qlik Sense fonksiyonları hakkında detaylı bilgiler ve kullanım örnekleri',
    accent: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
    card: 'from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5',
    ring: 'ring-blue-500',
  },
  Konular: {
    icon: '📚',
    description: 'Temel kavramlar ve önemli konular hakkında açıklamalar',
    accent: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    card: 'from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/5',
    ring: 'ring-emerald-500',
  },
  'Nasıl Yapılır': {
    icon: '🎯',
    description: 'Adım adım rehberler ve çözüm yöntemleri',
    accent: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    card: 'from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-500/5',
    ring: 'ring-amber-500',
  },
  Görseller: {
    icon: '📊',
    description: 'Görselleştirme türleri ve kullanım örnekleri',
    accent: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300',
    card: 'from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5',
    ring: 'ring-purple-500',
  },
}

const defaultStyle: CategoryStyle = {
  icon: '📁',
  description: '',
  accent: 'bg-gray-400',
  badge: 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300',
  card: 'from-gray-50 to-gray-100 dark:from-gray-500/10 dark:to-gray-500/5',
  ring: 'ring-gray-500',
}

export function getCategoryStyle(name: string | null | undefined): CategoryStyle {
  return (name && categoryStyles[name]) || defaultStyle
}
