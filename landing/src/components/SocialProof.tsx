export function SocialProof() {
  const testimonials = [
    {
      quote: "Finally, tracking that doesn't feel like work. LifeBuffer fits into my routine instead of disrupting it.",
      author: "Sarah Chen",
      role: "Product Manager",
    },
    {
      quote: "Cut my 1-on-1 prep time to zero. I actually look forward to showing my manager what I've accomplished.",
      author: "Marcus Rodriguez", 
      role: "Software Developer",
    },
    {
      quote: "The voice input is a game-changer. I can log activities while walking between meetings.",
      author: "Jennifer Kim",
      role: "Consultant",
    },
  ];

  const stats = [
    { number: "10,000+", label: "professionals tracking" },
    { number: "95%", label: "still active after 30 days" },
    { number: "500K+", label: "activities captured" },
    { number: "98%", label: "report better meeting preparation" },
  ];

  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-medium text-4xl text-white lg:text-5xl">
            Trusted by professionals worldwide
          </h2>
        </div>

        {/* Statistics */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 font-bold text-4xl text-blue-400 lg:text-5xl">
                {stat.number}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
              <div>
                <div className="font-medium text-white">{testimonial.author}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}