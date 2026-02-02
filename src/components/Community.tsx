export function Community() {
  const testimonials = [
    {
      quote: "I walked in thinking I'd never be able to do a pull-up. Three months later, I'm flying on silks. This place rewrites what you think is possible.",
      name: "Maya",
      info: "34, Designer",
      discipline: "Aerial Dance",
      color: "pink",
    },
    {
      quote: "Shaleena taught me that being strong doesn't mean being loud. It means being steady. That lesson changed more than just my jab.",
      name: "Raj",
      info: "28, Software Engineer",
      discipline: "Muay Thai",
      color: "neon",
    },
    {
      quote: "I've never been athletic. Ever. But here, nobody cares about your before. They only care about your next step. And they celebrate it like it's the Olympics.",
      name: "Priya",
      info: "41, Entrepreneur",
      discipline: "Both Disciplines",
      color: "white",
    },
  ]

  const captions = [
    { text: "First time upside down 🙃", color: "pink" },
    { text: "Perfecting the clinch 🥊", color: "neon" },
    { text: "Sweat, smiles, repeat.", color: "white" },
    { text: "Finding flow on the lyra ✨", color: "pink" },
    { text: "Stronger than yesterday.", color: "neon" },
    { text: "Community over competition.", color: "white" },
  ]

  return (
    <section className="section-padding bg-gradient-to-b from-brand-white to-brand-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* Section Headline */}
        <h2 className="heading-lg text-center mb-20 text-brand-black">
          Real People. Real Transformations.{' '}
          <span className="text-brand-rose">Real Talk.</span>
        </h2>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-8 border rounded-[30px_10px_30px_10px] bg-brand-white shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 hover:scale-105 relative overflow-hidden ${
                testimonial.color === 'pink'
                  ? 'border-brand-rose/30 hover:border-brand-rose'
                  : testimonial.color === 'neon'
                  ? 'border-brand-green/30 hover:border-brand-green'
                  : 'border-brand-black/20 hover:border-brand-black/40'
              }`}
              style={{ animation: `float ${5 + index}s ease-in-out infinite` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
              <div className="mb-6">
                <svg
                  className={`w-10 h-10 ${
                    testimonial.color === 'pink'
                      ? 'text-brand-rose'
                      : testimonial.color === 'neon'
                      ? 'text-brand-green'
                      : 'text-brand-black'
                  } opacity-30`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-lg text-brand-black/80 mb-6 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              
              <div className="border-t border-brand-black/10 pt-4">
                <p className="font-bold text-brand-black">{testimonial.name}</p>
                <p className="text-sm text-brand-black/60">{testimonial.info}</p>
                <p
                  className={`text-sm mt-1 font-medium ${
                    testimonial.color === 'pink'
                      ? 'text-brand-rose'
                      : testimonial.color === 'neon'
                      ? 'text-brand-green'
                      : 'text-brand-black/70'
                  }`}
                >
                  {testimonial.discipline}
                </p>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
