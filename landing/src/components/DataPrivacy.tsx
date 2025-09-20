import { Shield, MapPin, Eye, Users } from 'lucide-react';

interface PrivacyFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function PrivacyFeature({ icon, title, description }: PrivacyFeatureProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-white/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
        {icon}
      </div>
      <h3 className="mb-3 font-medium text-lg text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export function DataPrivacy() {
  const privacyFeatures: PrivacyFeatureProps[] = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-400" />,
      title: 'Swiss Data Hosting',
      description:
        'All your data is securely stored in Switzerland, benefiting from some of the world\'s strongest data protection laws and privacy regulations.',
    },
    {
      icon: <Shield className="h-6 w-6 text-green-400" />,
      title: 'GDPR Compliant',
      description:
        'We fully comply with GDPR regulations, ensuring your rights to data access, portability, and deletion are always respected.',
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: 'No Third-Party Sharing',
      description:
        'Your personal data is never sold, traded, or shared with third parties. Your activities and notes remain completely private to you.',
    },
    {
      icon: <Eye className="h-6 w-6 text-yellow-400" />,
      title: 'Transparent AI Processing',
      description:
        'Voice recordings are transcribed using OpenAI Whisper, then immediately deleted. Only the resulting text is stored, never the audio.',
    },
  ];

  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-8" id="privacy">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Privacy First</span>
          </div>
          <h2 className="mb-4 font-medium text-3xl text-white lg:text-4xl">
            Your Data, Your Privacy
          </h2>
          <p className="mx-auto max-w-3xl text-gray-400 text-xl leading-relaxed">
            We believe privacy is a fundamental right. That's why we've built LifeBuffer
            with privacy by design, using Swiss hosting and transparent data practices.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {privacyFeatures.map((feature, index) => (
            <PrivacyFeature key={index} {...feature} />
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="mb-4 font-medium text-xl text-white">
              🇨🇭 Hosted in Switzerland by Upsun
            </h3>
            <p className="mx-auto max-w-3xl text-gray-400 leading-relaxed">
              Switzerland's Federal Act on Data Protection (FADP) provides exceptional privacy protections.
              Our hosting partner Upsun ensures your data never leaves Swiss borders, giving you peace of mind
              that your professional activities remain completely confidential.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                GDPR Compliant
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-blue-400">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Swiss Privacy Laws
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-purple-400">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                No Third-Party Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}