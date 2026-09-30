'use client'

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
      className="rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Açık/koyu tema değiştir"
      title="Açık/koyu tema"
    >
      <span className="dark:hidden" aria-hidden>🌙</span>
      <span className="hidden dark:inline" aria-hidden>☀️</span>
    </button>
  )
}
