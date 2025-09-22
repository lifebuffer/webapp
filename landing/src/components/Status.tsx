import { Globe, Terminal, Smartphone } from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  platform: string;
  status: 'available' | 'in_progress' | 'planned';
}

function StatusItem({ icon, platform, status }: StatusItemProps) {
  const statusConfig = {
    available: {
      label: 'Available',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    planned: {
      label: 'Planned',
      color: 'bg-gray-500',
      textColor: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-80`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-white">{platform}</h3>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${config.color}`} />
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Status() {
  const platforms: StatusItemProps[] = [
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      platform: 'Web UI',
      status: 'available',
    },
    {
      icon: <Terminal className="h-6 w-6 text-purple-400" />,
      platform: 'Terminal CLI',
      status: 'available',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-blue-400" />,
      platform: 'iOS',
      status: 'in_progress',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-gray-400" />,
      platform: 'Android',
      status: 'planned',
    },
  ];

  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-8" id="status">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-medium text-3xl text-white lg:text-4xl">
            Platform Availability
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xl">
            Track your activities across multiple platforms with seamless sync
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform, index) => (
            <StatusItem key={index} {...platform} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            All platforms sync in real-time • Data stays consistent everywhere
          </p>
        </div>
      </div>
    </section>
  );
}