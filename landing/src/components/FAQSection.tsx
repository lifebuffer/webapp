interface FAQProps {
  question: string;
  answer: string;
}

function FAQ({ question, answer }: FAQProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
      <h3 className="mb-3 font-medium text-lg text-white">{question}</h3>
      <p className="text-gray-400 leading-relaxed">{answer}</p>
    </div>
  );
}

export function FAQSection() {
  const faqs: FAQProps[] = [
    {
      question: 'How is this different from other productivity apps?',
      answer:
        'LifeBuffer focuses specifically on tracking and reporting accomplishments, not managing tasks or projects. It\'s designed for professionals who need to remember and communicate what they\'ve done, not plan what to do next.',
    },
    {
      question: 'Do I need to track everything?',
      answer:
        'Not at all. LifeBuffer works with whatever level of tracking fits your life. Some users log 2-3 major activities per day, others capture everything. The AI adapts to your patterns.',
    },
    {
      question: 'How accurate is the voice recognition?',
      answer:
        'Very accurate for normal speech patterns. The AI also learns your vocabulary and commonly used terms, improving accuracy over time.',
    },
    {
      question: 'Can I use this for personal life tracking too?',
      answer:
        'Absolutely. While LifeBuffer has a professional focus, the flexible context system works perfectly for personal goals, health tracking, hobbies, and life activities.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer:
        'You can export everything in multiple formats. Your data is always yours - LifeBuffer just helps you organize and recall it better.',
    },
    {
      question: 'Is my voice data stored?',
      answer:
        'Voice recordings are processed for transcription only and then deleted. We store the resulting text, not the audio.',
    },
    {
      question: 'Is there a CLI for developers?',
      answer:
        'Yes! LifeBuffer includes a powerful terminal CLI for power users. Script your activities, automate reports, and integrate with your development workflow.',
    },
    {
      question: 'Where is my data stored?',
      answer:
        'All your data is securely hosted in Switzerland by Upsun, benefiting from some of the world\'s strongest data protection laws. Your data never leaves Swiss borders.',
    },
    {
      question: 'Are you GDPR compliant?',
      answer:
        'Yes, we fully comply with GDPR regulations. You have complete rights to access, correct, delete, or export your data at any time. We respect your privacy choices and never share your data with third parties.',
    },
    {
      question: 'Do you share my data with third parties?',
      answer:
        'Never. Your personal data, activities, and notes are never sold, traded, or shared with third parties. The only exception is using OpenAI Whisper for voice transcription, where only audio is processed and immediately deleted.',
    },
    {
      question: 'How do you handle voice transcription?',
      answer:
        'We use OpenAI Whisper to transcribe your voice recordings. The audio is sent for transcription and immediately deleted afterward. Only the resulting text is stored in your account, never the original audio.',
    },
    {
      question: 'Can I trust LifeBuffer with sensitive work information?',
      answer:
        'Absolutely. With Swiss hosting, GDPR compliance, and our no-third-party-sharing policy, your professional activities remain completely confidential. Many users track sensitive client work and internal company activities with confidence.',
    },
    {
      question: 'Is LifeBuffer open source?',
      answer:
        'Yes! Both the web application and CLI are completely open source. You can review our code, contribute improvements, or even self-host your own instance. Find us on GitHub at github.com/gmoigneu/lifebuffer.',
    },
    {
      question: 'Can I self-host LifeBuffer?',
      answer:
        'Absolutely. Since LifeBuffer is open source, you can deploy and run your own instance with complete control over your data and infrastructure. Perfect for organizations with strict data sovereignty requirements.',
    },
    {
      question: 'How can I contribute to LifeBuffer?',
      answer:
        'We welcome contributions! Report bugs, suggest features, submit pull requests, or help with documentation. Both repositories (web app and CLI) are on GitHub with contribution guidelines.',
    },
  ];

  return (
    <section id="faq" className="bg-black px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-medium text-4xl text-white lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-xl">
            Everything you need to know about LifeBuffer
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <FAQ key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}