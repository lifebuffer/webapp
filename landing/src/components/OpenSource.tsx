import { Github, Code, Users, Heart, Smartphone } from 'lucide-react';

interface OpenSourceFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function OpenSourceFeature({ icon, title, description }: OpenSourceFeatureProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-white/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
        {icon}
      </div>
      <h3 className="mb-3 font-medium text-lg text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export function OpenSource() {
  const openSourceFeatures: OpenSourceFeatureProps[] = [
    {
      icon: <Code className="h-6 w-6 text-purple-400" />,
      title: 'Fully Open Source',
      description:
        'Complete transparency with our codebase. Review our code, contribute improvements, or fork for your own needs.',
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: 'Community Driven',
      description:
        'Built with the community in mind. Report issues, suggest features, and help shape the future of LifeBuffer.',
    },
    {
      icon: <Heart className="h-6 w-6 text-red-400" />,
      title: 'No Vendor Lock-in',
      description:
        'Your data and the code that manages it are always accessible. Self-host if you prefer complete control.',
    },
    {
      icon: <Github className="h-6 w-6 text-gray-400" />,
      title: 'Active Development',
      description:
        'Regular updates and improvements. Watch our progress and contribute to making LifeBuffer better for everyone.',
    },
  ];

  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-8" id="open-source">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-2">
            <Github className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Open Source</span>
          </div>
          <h2 className="mb-4 font-medium text-3xl text-white lg:text-4xl">
            Built in the Open
          </h2>
          <p className="mx-auto max-w-3xl text-gray-400 text-xl leading-relaxed">
            LifeBuffer is completely open source. Inspect our code, contribute improvements,
            or even self-host your own instance. Transparency and community are at our core.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {openSourceFeatures.map((feature, index) => (
            <OpenSourceFeature key={index} {...feature} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <Code className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-xl text-white">Web Application</h3>
                <p className="text-gray-400 text-sm">React, TypeScript, Modern Stack</p>
              </div>
            </div>
            <p className="mb-6 text-gray-400 leading-relaxed">
              The main LifeBuffer web application with all features including voice input,
              AI categorization, and professional reporting.
            </p>
            <a
              href="https://github.com/lifebuffer/webapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500/20">
                <Github className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-xl text-white">Terminal CLI</h3>
                <p className="text-gray-400 text-sm">Command-line interface for power users</p>
              </div>
            </div>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Native terminal dashboard, scriptable commands, and API access.
              Perfect for developers and automation enthusiasts.
            </p>
            <a
              href="https://github.com/lifebuffer/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-all hover:bg-gray-700"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Smartphone className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-xl text-white">iOS App</h3>
                <p className="text-gray-400 text-sm">Native mobile app in testing</p>
              </div>
            </div>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Native iOS application currently in beta testing. Full LifeBuffer experience
              optimized for mobile usage patterns.
            </p>
            <a
              href="https://github.com/lifebuffer/ios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            ⭐ Star us on GitHub • 🐛 Report issues • 🚀 Contribute improvements
          </p>
        </div>
      </div>
    </section>
  );
}