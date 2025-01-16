export default function Footer() {
    return (
      <footer className="mt-16 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Bu web sitesi ve tüm içerikler{' '}
            <a 
              href="https://tr.linkedin.com/in/doğan-oğultürk-39b3a662"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Doğan Oğultürk
            </a>
            {' '}tarafından oluşturulmuştur.
          </p>
        </div>
      </footer>
    );
  }