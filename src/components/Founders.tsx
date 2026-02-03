export function Founders() {
  return (
    <section id="founders" className="section-padding bg-gradient-to-b from-brand-cream to-brand-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-rose/5 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '1s' }} />
      
      <div className="container-custom relative z-10">
        {/* Section Headline */}
        <h2 className="heading-lg text-center mb-6 text-brand-black">
          She Teaches You How to <span className="text-brand-green">Fight</span>.
        </h2>
        <h2 className="heading-lg text-center mb-20 text-brand-black">
          She Teaches You How to <span className="text-brand-rose">Fly</span>.
        </h2>

        <div className="space-y-24">
          {/* Shaleena Saraogi */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[3/4] border-2 border-brand-green/40 overflow-hidden relative group rounded-[50px_10px_50px_10px] transform rotate-2 hover:rotate-0 shadow-[0_0_30px_rgba(0,217,163,0.15)] hover:shadow-[0_0_50px_rgba(0,217,163,0.3)] transition-all duration-700 hover:scale-105">
                <img
                  src="/Images/real_girldoingboxing.jpeg"
                  alt="Shaleena Saraogi - Muay Thai Lead"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 border-4 border-brand-green/10 pointer-events-none rounded-[50px_10px_50px_10px] group-hover:border-brand-green/20 transition-all duration-500" />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-green/20 blur-3xl group-hover:bg-brand-green/30 transition-all duration-500" style={{ animation: 'float 6s ease-in-out infinite' }} />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="w-16 h-1 bg-brand-green mb-4 rounded-full" />
              <h3 className="text-3xl md:text-4xl font-bold mb-2 text-brand-black">
                Shaleena Saraogi
              </h3>
              <p className="text-xl text-brand-green mb-6">Muay Thai Lead</p>
              
              <p className="text-2xl font-bold text-brand-black/90 mb-6">
                Professional Fighter. Undefeated Record. Your Biggest Cheerleader.
              </p>
              
              <div className="space-y-4 text-lg text-brand-black/70 mb-8">
                <p>
                  Shaleena didn't pick up Muay Thai to become aggressive. She picked it up to become confident. 
                  And it changed everything.
                </p>
                
                <p>
                  With 8 years of training across Thailand, the USA, and India, and certification from the 
                  legendary Master Toddy's academy, Shaleena brings world-class technique with zero ego.
                </p>
                
                <p>
                  She's here to teach you that discipline isn't about being hard on yourself — it's about 
                  being <em className="text-brand-green font-semibold">good</em> to yourself. That real power 
                  is calm, controlled, and earned through repetition and respect.
                </p>
              </div>

              <div className="space-y-2 text-brand-black/60">
                <p>
                  <strong className="text-brand-green">Fighting Style:</strong> Precision. Patience. Power.
                </p>
                <p>
                  <strong className="text-brand-green">Teaching Style:</strong> Warm. Challenging. Always in your corner.
                </p>
              </div>
            </div>
          </div>

          {/* Tinsley Nulph */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <div className="aspect-[3/4] border-2 border-brand-rose/40 overflow-hidden relative group rounded-[10px_50px_10px_50px] transform -rotate-2 hover:rotate-0 shadow-[0_0_30px_rgba(255,144,194,0.15)] hover:shadow-[0_0_50px_rgba(255,144,194,0.3)] transition-all duration-700 hover:scale-105">
                <img
                  src="/Images/realgirlarieldanceimage.jpeg"
                  alt="Tinsley Nulph - Aerial Dance Lead"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 border-4 border-brand-rose/10 pointer-events-none rounded-[10px_50px_10px_50px] group-hover:border-brand-rose/20 transition-all duration-500" />
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-brand-rose/20 blur-3xl group-hover:bg-brand-rose/30 transition-all duration-500" style={{ animation: 'float 7s ease-in-out infinite' }} />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="w-16 h-1 bg-brand-rose mb-4 rounded-full" />
              <h3 className="text-3xl md:text-4xl font-bold mb-2 text-brand-black">
                Tinsley Nulph
              </h3>
              <p className="text-xl text-brand-rose mb-6">Aerial Dance Lead</p>
              
              <p className="text-2xl font-bold text-brand-black/90 mb-6">
                Certified Instructor. Competitor. Believer in Impossible Things.
              </p>
              
              <div className="space-y-4 text-lg text-brand-black/70 mb-8">
                <p>
                  Tinsley has spent 5+ years in Bangkok's aerial dance scene, competing in three major 
                  competitions and mastering nearly every apparatus you can hang from.
                </p>
                
                <p>
                  But her real superpower? Making the impossible feel possible.
                </p>
                
                <p>
                  She teaches seven aerial disciplines — lyra, silks, hammock, pole, aerial pole, cube, 
                  and straps — with the kind of patience and encouragement that makes you forget you're 
                  upside down for the first time.
                </p>
                
                <p>
                  Tinsley believes aerial isn't about being "naturally flexible" or "already strong." 
                  It's about showing up, trusting the process, and letting yourself play.
                </p>
              </div>

              <div className="space-y-2 text-brand-white/60">
                <p>
                  <strong className="text-brand-pink">Movement Style:</strong> Graceful. Bold. Fearless.
                </p>
                <p>
                  <strong className="text-brand-pink">Teaching Style:</strong> Encouraging. Creative. Ridiculously fun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
