import { Brain, Mic, Target } from 'lucide-react';

export function ProblemSolution() {
  return (
    <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className='mb-4 font-medium text-2xl text-white lg:text-4xl'>
            Always be prepared for that 1 on 1 or scrum meeting.
          </h2>
          <p className="mx-auto max-w-4xl text-gray-400 text-xl">
            ❌ Scrambling before meetings ❌ Complex systems get abandoned
            ❌ Can't communicate impact
          </p>
          <p className="mx-auto mt-6 max-w-2xl font-medium text-blue-400 text-xl">
            Capture effortlessly, organize intelligently, report confidently.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Mic className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-3 font-medium text-white text-xl">
              🎤 Friction-Free Capture
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Voice input for busy professionals. Quick manual entry when
              preferred. AI categorization reduces manual work.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-3 font-medium text-white text-xl">
              🧠 AI-Powered Insights
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Smart activity categorization and suggestions. Pattern recognition
              for productivity insights. Related task discovery and connections.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-3 font-medium text-white text-xl">
              🎯 Built for Real Life & Work
            </h3>
            <p className="text-gray-400 leading-relaxed">
              No rigid productivity frameworks to maintain. Adapts to your
              workflow, not the other way around. Professional focus with
              personal life flexibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
