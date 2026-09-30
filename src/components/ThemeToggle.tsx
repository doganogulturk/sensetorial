'use client'

import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch {
      // Gizli sekme vb. durumlarda tercih kaydedilemeyebilir
    }
  }

  // İkon, <html> üzerindeki "dark" sınıfına göre CSS ile seçilir;
  // böylece sunucu ve istemci çıktısı aynı kalır.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
      aria-label="Açık/koyu tema değiştir"
      title="Açık/koyu tema"
    >
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden />
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden />
    </button>
  )
}
