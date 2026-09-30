// Kategorilere ait görsel/metin ayarları tek yerde.
// Veritabanına yeni bir kategori eklenirse burada tanımı yoksa varsayılan stil kullanılır.
import { BookOpen, ChartColumn, Folder, ListChecks, SquareFunction, type LucideIcon } from 'lucide-react'

export type CategoryStyle = {
  icon: LucideIcon
  description: string
  /** Küçük renkli nokta */
  dot: string
  /** İkon kutusu ve etiket */
  soft: string
}

const categoryStyles: Record<string, CategoryStyle> = {
  Fonksiyonlar: {
    icon: SquareFunction,
    description: 'Fonksiyonların sözdizimi ve kullanım örnekleri',
    dot: 'bg-sky-500',
    soft: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
  },
  Konular: {
    icon: BookOpen,
    description: 'Temel kavramlar ve önemli konular',
    dot: 'bg-violet-500',
    soft: 'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
  },
  'Nasıl Yapılır': {
    icon: ListChecks,
    description: 'Adım adım rehberler ve çözüm yöntemleri',
    dot: 'bg-amber-500',
    soft: 'bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300',
  },
  Görseller: {
    icon: ChartColumn,
    description: 'Görselleştirme türleri ve kullanım örnekleri',
    dot: 'bg-rose-500',
    soft: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
  },
}

const defaultStyle: CategoryStyle = {
  icon: Folder,
  description: '',
  dot: 'bg-zinc-400',
  soft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-300',
}

export function getCategoryStyle(name: string | null | undefined): CategoryStyle {
  return (name && categoryStyles[name]) || defaultStyle
}
