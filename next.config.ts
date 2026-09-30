import type { NextConfig } from "next";

// PDF.js'in standart sürümü çok yeni tarayıcı özellikleri gerektiriyor
// (ör. Map.prototype.getOrInsertComputed). Eski iOS/Android tarayıcılarında da
// çalışması için polyfill içeren "legacy" sürüm kullanılır.
const pdfjsLegacy = {
  "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
  "pdfjs-dist/web/pdf_viewer.mjs": "pdfjs-dist/legacy/web/pdf_viewer.mjs",
};

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: pdfjsLegacy,
  },
};

export default nextConfig;
