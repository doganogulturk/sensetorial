const dateFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
const numberFormatter = new Intl.NumberFormat('tr-TR')

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))
export const formatNumber = (n: number) => numberFormatter.format(n)

/** Bu tarihten sonra eklenen dokümanlar "Yeni" olarak işaretlenir */
export function getNewSince(days = 30) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}
