import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Github } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleSectionClick = (sectionId: string) => {
    setIsMenuOpen(false);
    if (isHomePage) {
      // If on homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-white/10 border-b bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Link
                className="font-semibold text-lg text-white transition-colors hover:text-gray-300"
                to="/"
              >
                LifeBuffer
              </Link>
              <span className="rounded-full bg-green-500/20 border border-green-500/30 px-2 py-0.5 text-xs font-semibold text-green-400">
                BETA
              </span>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('features')}
                type="button"
              >
                Features
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('use-cases')}
                type="button"
              >
                Use Cases
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('status')}
                type="button"
              >
                Status
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('privacy')}
                type="button"
              >
                Privacy
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('open-source')}
                type="button"
              >
                Open Source
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('pricing')}
                type="button"
              >
                Pricing
              </button>
              <button
                className="text-gray-300 text-sm transition-colors hover:text-white"
                onClick={() => handleSectionClick('faq')}
                type="button"
              >
                FAQ
              </button>
            </div>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <a
              href="https://github.com/gmoigneu/lifebuffer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-white"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 font-medium text-white text-sm transition-all hover:from-green-600 hover:to-emerald-600"
              href="https://app.lifebuffer.com"
              rel="noopener noreferrer"
            >
              Get Beta Access
            </a>
          </div>

          <button
            className="text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 right-0 left-0 border-white/10 border-b bg-black/90 backdrop-blur-md md:hidden">
            <div className="space-y-4 px-4 py-6">
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('features')}
                type="button"
              >
                Features
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('use-cases')}
                type="button"
              >
                Use Cases
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('status')}
                type="button"
              >
                Status
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('privacy')}
                type="button"
              >
                Privacy
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('open-source')}
                type="button"
              >
                Open Source
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('pricing')}
                type="button"
              >
                Pricing
              </button>
              <button
                className="block text-gray-300 transition-colors hover:text-white"
                onClick={() => handleSectionClick('faq')}
                type="button"
              >
                FAQ
              </button>
              <div className="space-y-2 border-white/10 border-t pt-4">
                <button
                  className="block w-full text-left text-gray-300 transition-colors hover:text-white"
                  type="button"
                >
                  Sign in
                </button>
                <a
                  className="block w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-center font-medium text-white text-sm transition-all hover:from-green-600 hover:to-emerald-600"
                  href="https://app.lifebuffer.com"
                  rel="noopener noreferrer"
                >
                  Get Beta Access
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
