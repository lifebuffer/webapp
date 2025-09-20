import { ArrowRight, Mic } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black px-4 pt-32 pb-20 text-white sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-green-300">Now in Beta - Everything Free!</span>
            </div>

            <h1 className="font-medium text-5xl leading-tight tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                The life & work tracking app
              </span>{' '}
              that actually gets used.
            </h1>

            <p className="mx-auto max-w-2xl text-gray-400 text-xl leading-relaxed">
              Stop dreading your 1-on-1s. Flexible tracking powered by AI to help you
              capture, organize, and recall what you've accomplished. <span className="text-green-400 font-semibold">Free during Beta!</span> <span className="text-purple-400 font-semibold">Open Source!</span>
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-black shadow-lg transition-all duration-200 hover:bg-gray-100"
              href="https://app.lifebuffer.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Start Free Beta Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            {/* <button
              className='inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-all duration-200 hover:bg-white/5'
              type="button"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </button> */}
          </div>

          {/* <div className="space-y-4 pt-8">
            <p className='text-gray-500 text-sm'>Trusted by teams at</p>
            <div className="flex items-center justify-center space-x-12 opacity-40">
              <div className='font-medium text-white text-xl'>GitHub</div>
              <div className='font-medium text-white text-xl'>Stripe</div>
              <div className='font-medium text-white text-xl'>Vercel</div>
              <div className='font-medium text-white text-xl'>Linear</div>
            </div>
          </div> */}
        </div>

        {/* Hero visual */}
        <div className="relative mt-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      Today's Activities
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Friday, Jan 27 • 5 activities
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-gray-400 text-sm">Voice ready</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-sm">
                  <div className="mb-2 text-purple-400">✅ Work</div>
                  <div className="mb-2 text-gray-300">
                    Completed code review for the authentication feature
                  </div>
                  <div className="mb-2 text-green-400">
                    ✅ Meetings: Led sprint planning for Q1 goals
                  </div>
                  <div className="text-yellow-400">
                    🎤 "Finished user testing session for mobile app"
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Last activity 2 minutes ago
                  </span>
                  <span className="text-gray-400">🎯 Ready for weekly report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}