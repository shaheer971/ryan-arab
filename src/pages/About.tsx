import { Award, Heart, ShieldCheck, Gem, Factory, Leaf, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        <div className="absolute inset-0 bg-[url('/patterns/texture.svg')] opacity-[0.15]" />
        <div className="container relative mx-auto px-4 text-center">
          <img
            src="/logo.png"
            alt="Ryan Arab Logo"
            className="mx-auto mb-6 h-24 w-auto"
          />
          <h1 className="font-jakarta text-6xl md:text-5xl font-bold mb-6 text-black">
            Luxury, Innovation, and Saudi Excellence.
          </h1>
          <a
            href="https://ryanarab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-8 py-3 bg-black text-white font-bold rounded-lg shadow hover:bg-gray-800 transition"
          >
            Visit Our Store
        </a>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 px-4 relative bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Vision Statement */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <p className="text-2xl leading-relaxed text-gray-800 font-satoshi">
              Ryan Arab is not just a brand, it's the product of years of fashion research and development. Owned by RAHG (Ryan Arab Holding Group), our journey began with a commitment to redefining luxury through technology, craftsmanship, and ethical sourcing.
            </p>
            <p className="text-2xl leading-relaxed text-gray-800 font-satoshi mt-8">
              Based in Riyadh, we design many of our shoes in Saudi Arabia while partnering with the finest shoemakers across Italy, Turkey, Vietnam, China, and Pakistan. Some of our creations are even designed by AI, blending the power of artificial intelligence with human artistry to create truly unique footwear.
            </p>
            <p className="text-2xl leading-relaxed text-gray-800 font-satoshi mt-8">
              We believe luxury is not just about materials—it's about integrity, innovation, and excellence.
            </p>
          </div>

          {/* Key Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-black mb-4 font-jakarta">A Saudi Vision, A Global Standard</h3>
              <p className="text-gray-700 text-lg">Emphasize Saudi-led design with international craftsmanship.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-black mb-4 font-jakarta">Years of Research, One Goal</h3>
              <p className="text-gray-700 text-lg">Introduce RAHG's fashion R&D expertise.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-black mb-4 font-jakarta">AI Meets Artisanship</h3>
              <p className="text-gray-700 text-lg">Highlight the ChatGPT-designed shoes as a luxury-tech breakthrough.</p>
            </div>
          </div>

          {/* Craftsmanship & Materials Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-32">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-5xl font-bold mb-6 text-black font-jakarta mx-auto max-w-3xl">
                Where Tradition Meets Technology
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto font-satoshi">
                Every Ryan Arab shoe is a result of meticulous craftsmanship and cutting-edge innovation. Whether designed by Saudi artisans or AI, each pair undergoes a strict auditing process to ensure perfection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                  <Factory className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black font-jakarta">Designed by Saudis, Crafted Worldwide</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We collaborate with top-tier manufacturers in Italy, Turkey, Vietnam, China, and Pakistan. Each factory specializes in either men's or women's footwear, ensuring expert craftsmanship at every level.
                </p>
              </div>

              <div className="space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black font-jakarta">Luxury Without Harm</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We only use high-quality, ethical materials. No PVC. No pigskin. Just premium, safe, and responsibly sourced leather.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
