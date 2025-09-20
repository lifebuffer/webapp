import { FileBarChart, Mic, Smartphone, Terminal } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

function FeatureBlock({
  icon,
  title,
  description,
  features,
  image,
  imageAlt,
}: FeatureProps) {
  return (
    <div className="grid items-center gap-16 lg:grid-cols-2">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
            {icon}
          </div>
          <h3 className="font-medium text-3xl text-white leading-tight lg:text-4xl">
            {title}
          </h3>
          <p className="text-gray-400 text-xl leading-relaxed">{description}</p>
        </div>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li className="flex items-center" key={index}>
              <div className="mr-4 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
        {/** biome-ignore lint/performance/noImgElement: <What else?> */}
        <img
          alt={imageAlt}
          className='h-full w-full rounded-3xl object-cover'
          src={image}
        />
      </div>
    </div>
  );
}

export function Features() {
  const features: FeatureProps[] = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: 'Speak it, track it, find it',
      description:
        'Quick voice logging meets smart AI categorization. Capture activities in seconds while AI learns your patterns and suggests the right contexts.',
      features: [
        'Voice-to-text activity capture',
        'Smart context suggestions',
        'Learns your categorization patterns',
        'Hands-free logging on the go',
      ],
      image: '/mainscreen.png',
      imageAlt: 'Voice input interface with AI suggestions',
    },
    {
      icon: <Terminal className="h-6 w-6" />,
      title: 'Terminal CLI for power users',
      description:
        'Command-line interface for developers and power users. Script activities, automate reports, and integrate with your existing development workflow.',
      features: [
        'Native terminal dashboard and commands',
        'Scriptable activity logging and reporting',
        'Git integration and commit tracking',
        'API access for custom integrations',
      ],
      image: '/cli.png',
      imageAlt: 'Terminal CLI interface showing activity dashboard',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Your workflow, your contexts',
      description:
        'No rigid frameworks or forced methodologies. Create contexts that match how you actually work — from client projects to personal goals.',
      features: [
        'User-defined contexts (Work, Projects, Personal)',
        'Cross-context insights and patterns',
        'Flexible activity status tracking',
        'Daily notes with markdown support',
      ],
      image: '/task.png',
      imageAlt: 'Context organization and daily view',
    },
    // {
    //   icon: <Search className="h-6 w-6" />,
    //   title: "Find what you've accomplished",
    //   description:
    //     'Full-text search across all activities plus AI-powered insights. Discover patterns, find related tasks, and surface forgotten accomplishments.',
    //   features: [
    //     'Full-text search across activities and notes',
    //     'AI-powered related task suggestions',
    //     'Context and time period filtering',
    //     'Pattern recognition for productivity insights',
    //   ],
    //   image: '/mainscreen.png',
    //   imageAlt: 'Search results and AI insights',
    // },
    {
      icon: <FileBarChart className="h-6 w-6" />,
      title: 'From activities to accomplishments',
      description:
        'Generate professional reports in seconds. Multiple formats, custom templates, and time period selection for any meeting or review.',
      features: [
        'Multiple export formats (text, CSV, formatted)',
        'Customizable report templates',
        'Time period and context selection',
        'Professional formatting for stakeholders',
      ],
      image: '/export.png',
      imageAlt: 'Report generation and export options',
    },
  ];

  return (
    <section
      className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8"
      id="features"
    >
      <div className="mx-auto max-w-7xl space-y-24">
        {features.map((feature, index) => (
          <div
            className={index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
            key={index}
          >
            <FeatureBlock {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
}
