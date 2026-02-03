export function BrandStory() {
  const pillars = [
    {
      title: 'Movement is Joy, Not Punishment',
      description: 'Sweat should feel like celebration, not obligation.',
    },
    {
      title: 'Safe Space, Bold Practice',
      description: 'Push your limits in a place that holds you with care.',
    },
    {
      title: 'No Clichés, No Intimidation',
      description: 'Real people. Real bodies. Real transformation.',
    },
    {
      title: 'Leave Feeling Like a Superhero',
      description: 'Every class, every time.',
    },
  ]

  return (
    <section className="section-padding bg-brand-black relative overflow-hidden">
      {/* Decorative Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/fight-flight-studio/Images/WhatsApp Image 2026-02-02 at 7.11.37 PM.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Section Headline */}
        <h2 className="heading-lg text-center mb-16 text-brand-white">
          You Don&apos;t Need Permission to Be <span className="text-gradient-green">Powerful</span>
        </h2>

        {/* Main Story */}
        <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-brand-white/80 mb-20">
          <p>Most of us spend our lives being told what our bodies can&apos;t do.</p>
          
          <p>Too slow. Too weak. Not flexible enough. Not athletic enough.</p>
          
          <p className="text-brand-green font-bold text-2xl">We call bullshit.</p>
          
          <p>
            At Fight & Flight Studio, we believe movement is your birthright — not something you have to earn. 
            Whether you&apos;re throwing your first jab or hanging upside down for the first time, you belong here.
          </p>
          
          <p>
            This isn&apos;t about being the best. It&apos;s about becoming <em className="text-gradient-pink font-semibold not-italic">more</em> — 
            more confident, more capable, more yourself.
          </p>
          
          <p>We don&apos;t train warriors. We train humans who want to feel like superheroes.</p>
          
          <p className="text-brand-white font-bold text-2xl">
            And here&apos;s the secret: <span className="text-gradient-pink">you already are one.</span> You just need the right place to prove it.
          </p>
        </div>

        {/* Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="p-6 border border-brand-white/10 hover:border-brand-green/50 transition-all duration-500 group rounded-3xl hover:rounded-[40px_10px_40px_10px] bg-gradient-to-br from-brand-black/50 to-transparent shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
              style={{ animation: `float ${4 + index}s ease-in-out infinite` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green/0 via-brand-pink/5 to-brand-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animation: 'shimmer 3s infinite' }} />
              <div className="relative z-10">
                <div className="w-12 h-1 bg-brand-green mb-4 group-hover:w-full transition-all duration-500 rounded-full group-hover:bg-gradient-to-r group-hover:from-brand-green group-hover:to-brand-rose" />
              <h3 className="text-xl font-bold mb-3 text-brand-white group-hover:text-gradient-green transition-all duration-300">
                {pillar.title}
              </h3>
              <p className="text-brand-white/70">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
