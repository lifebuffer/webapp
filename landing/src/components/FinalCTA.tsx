import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-32 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="font-medium text-4xl text-white leading-tight lg:text-6xl">
              Ready to stop scrambling{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                before meetings?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 text-xl leading-relaxed">
              Transform your professional reporting in minutes, not hours.
              <span className="text-green-400 font-semibold">All features free during Beta!</span>
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-600"
              href="https://app.lifebuffer.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get Free Beta Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-white/5"
              href="mailto:hello@lifebuffer.com"
            >
              Contact us
            </a>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 pt-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-green-400" />
              <p className="text-gray-400 text-sm">No credit card</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-blue-400" />
              <p className="text-gray-400 text-sm">Full Beta access</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-purple-400" />
              <p className="text-gray-400 text-sm">Export everything</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-yellow-400" />
              <p className="text-gray-400 text-sm">Be an early adopter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}