import { Calendar, Trophy, BarChart, Briefcase, TrendingUp, Scale } from 'lucide-react';

interface UseCaseProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function UseCase({ icon, title, description }: UseCaseProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-200 hover:bg-white/10">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
        {icon}
      </div>
      <h3 className="mb-3 font-medium text-white text-xl">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export function UseCases() {
  const useCases: UseCaseProps[] = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Weekly 1-on-1 Preparation',
      description:
        'Never scramble before your manager meeting. Export this week\'s accomplishments with context and impact.',
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Performance Review Documentation',
      description:
        'Build a comprehensive record of achievements, growth, and contributions over any time period.',
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: 'Project Status Updates',
      description:
        'Track cross-project work and generate stakeholder reports with relevant activities and outcomes.',
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Client Work Organization',
      description:
        'Organize activities by client context and generate professional progress reports for check-ins.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Professional Development',
      description:
        'Track learning, networking, and growth activities to document your career progression.',
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Work-Life Balance Insights',
      description:
        'Gain visibility into time allocation across professional and personal contexts for better boundaries.',
    },
  ];

  return (
    <section id="use-cases" className="bg-black px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-medium text-4xl text-white lg:text-5xl">
            Perfect for professional tracking
          </h2>
          <p className="text-gray-400 text-xl">
            From weekly 1-on-1s to annual reviews — capture and recall your accomplishments 
            with confidence
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <UseCase key={index} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  );
}