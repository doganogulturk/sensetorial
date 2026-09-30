export const siteName = 'Sensetorial'
export const siteDescription =
  'Qlik Sense fonksiyonları, konuları, adım adım rehberleri ve görselleştirmeleri hakkında Türkçe eğitim dokümanları.'

/** Yayındaki adres (ör. https://sensetorial.com). Sitemap ve paylaşım linkleri için gereklidir. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || undefined
