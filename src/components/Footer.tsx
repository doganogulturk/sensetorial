export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8 transition-colors dark:border-gray-800">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Bu web sitesi ve tüm içerikler{' '}
          <a
            href="https://tr.linkedin.com/in/doğan-oğultürk-39b3a662"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Doğan Oğultürk
          </a>
          {' '}tarafından oluşturulmuştur.
        </p>
      </div>
    </footer>
  )
}
