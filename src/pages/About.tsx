import { Award, Heart, ShieldCheck, Gem } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-gray-100" />
        <div className="absolute inset-0 bg-[url('/patterns/texture.svg')] opacity-[0.15]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-jakarta text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent animate-slide-up">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
            Crafting excellence since 1990
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.1]" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Quality */}
            <div className="bg-white rounded-2xl p-6 card-shadow hover-lift animate-slide-up [animation-delay:300ms]">
              <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-jakarta text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 font-satoshi">Crafted with the finest materials and attention to detail</p>
            </div>

            {/* Comfort */}
            <div className="bg-white rounded-2xl p-6 card-shadow hover-lift animate-slide-up [animation-delay:400ms]">
              <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-jakarta text-lg font-semibold mb-2">Ultimate Comfort</h3>
              <p className="text-gray-600 font-satoshi">Designed for all-day comfort and support</p>
            </div>

            {/* Durability */}
            <div className="bg-white rounded-2xl p-6 card-shadow hover-lift animate-slide-up [animation-delay:500ms]">
              <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-jakarta text-lg font-semibold mb-2">Built to Last</h3>
              <p className="text-gray-600 font-satoshi">Durable construction for long-lasting wear</p>
            </div>

            {/* Style */}
            <div className="bg-white rounded-2xl p-6 card-shadow hover-lift animate-slide-up [animation-delay:600ms]">
              <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <Gem className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-jakarta text-lg font-semibold mb-2">Timeless Style</h3>
              <p className="text-gray-600 font-satoshi">Classic designs that never go out of fashion</p>
            </div>
          </div>

          {/* Story Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 card-shadow animate-slide-up [animation-delay:700ms]">
            <div className="prose prose-lg mx-auto">
              <div className="space-y-6 text-gray-600 font-satoshi">
                <p className="text-xl">
                  Founded with a passion for exceptional footwear, our journey began
                  in a small workshop where every stitch was crafted with precision
                  and care. Today, we continue to honor that tradition while
                  embracing innovation and contemporary design.
                </p>
                <p>
                  Our commitment to quality remains unwavering. We source the finest
                  materials from around the world and work with skilled artisans who
                  share our dedication to craftsmanship. Each pair of shoes is a
                  testament to our heritage and vision for the future of luxury
                  footwear.
                </p>
                <p>
                  We believe that exceptional shoes are more than just accessories;
                  they're a reflection of personal style and a foundation for
                  confidence. This belief drives us to create footwear that not only
                  looks beautiful but feels extraordinary with every step.
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
