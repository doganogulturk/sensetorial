// Türkçe karakterlerden bağımsız arama: "nasil" -> "Nasıl Yapılır" ile eşleşir.
export function normalizeForSearch(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function matchesSearch(text: string, query: string) {
  const normalizedText = normalizeForSearch(text)
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter(Boolean)
    .every(word => normalizedText.includes(word))
}
