import { Link } from '@tanstack/react-router';
// import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-white/10 border-t bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* <div className='grid gap-8 md:grid-cols-4'>
          <div>
            <h3 className='mb-4 font-medium text-white'>Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-medium text-white'>Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-medium text-white'>Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Tutorials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-medium text-white'>Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Status
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 text-sm transition-colors hover:text-white'
                  href="#"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="mt-12 border-white/10 border-t pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-6 md:mb-0">
              <div className="font-medium text-white">LifeBuffer</div>
              <div className="text-gray-400 text-sm">
                © 2025 nlsio LLC. All rights reserved.
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                className="text-gray-400 text-sm transition-colors hover:text-white"
                to="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-gray-400 text-sm transition-colors hover:text-white"
                to="/terms"
              >
                Terms of Service
              </Link>
              <Link
                className="text-gray-400 text-sm transition-colors hover:text-white"
                to="/security"
              >
                Security
              </Link>
            </div>
          </div>

          {/* <div className="mt-8 flex items-center justify-center space-x-8 text-xs">
            <span className="flex items-center text-gray-500">
              <Shield className="mr-1 h-3 w-3" />
              SOC2 Type II Compliant
            </span>
            <span className="text-gray-500">GDPR Ready</span>
            <span className="text-gray-500">Enterprise Grade Security</span>
          </div> */}

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              LifeBuffer helps professionals track accomplishments and prepare
              for meetings with confidence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
