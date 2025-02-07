import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const isMobile = useIsMobile();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const featuredProducts = [
    {
      id: "1",
      name: "Classic Leather Oxford",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      category: "Men's Shoes",
      isNew: true,
      tags: ["Leather", "Formal"]
    },
    {
      id: "2",
      name: "Elegant Heels",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      category: "Women's Shoes",
      isSale: true,
      discount: 20,
      tags: ["Evening", "Heels"]
    },
    {
      id: "3",
      name: "Kids Sport Sneakers",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
      category: "Kids' Shoes",
      tags: ["Sport", "Casual"]
    },
    {
      id: "4",
      name: "Casual Loafers",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
      category: "Men's Shoes",
      tags: ["Casual", "Comfort"]
    }
  ];

  const scrollAnimation = {
    x: [0, -1400],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
        repeatDelay: 0
      }
    }
  };

  const categories = [
    {
      title: "Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      menLink: "/men/sneakers",
      womenLink: "/women/sneakers"
    },
    {
      title: "Casual",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
      menLink: "/men/casual",
      womenLink: "/women/casual"
    },
    {
      title: "Dress Shoes",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      menLink: "/men/dress-shoes",
      womenLink: "/women/dress-shoes"
    },
    {
      title: "Sandals and Slippers",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      menLink: "/men/sandals",
      womenLink: "/women/sandals"
    }
  ];

  return (
    <div className="animate-fadeIn">
      <section className="h-screen relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1549298916-b41d501d3772')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white space-y-6 max-w-3xl mx-auto px-4"
        >
          <h1 className="font-jakarta text-5xl md:text-7xl font-bold">
            Step into Luxury
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-satoshi">
            Discover our curated collection of premium footwear
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link to="/men">Shop Now</Link>
          </Button>
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="font-jakarta text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.title}
                {...fadeInUp}
                className="group relative h-96 overflow-hidden rounded-2xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                </div>
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4 font-jakarta">
                      {category.title}
                    </h3>
                    <div className="space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-32 bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                      >
                        <Link to={category.menLink}>
                          Men
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-32 bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                      >
                        <Link to={category.womenLink}>
                          Women
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-0 gradient-premium overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-12">
            <motion.div {...fadeInUp} className="max-w-2xl text-center md:text-left">
              <span className="text-primary font-medium mb-2 block">Limited Time Offer</span>
              <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4">
                New Year Sale 2025
              </h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                Start the year in style with up to 50% off on selected items. Limited stock available.
              </p>
              <div className="md:hidden mt-4">
                <Button
                  asChild
                  variant="default"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Link to="/sale" className="group">
                    View All Sales
                    <ArrowRight className="ml-2 h-4 w-6 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="hidden md:block">
              <Button
                asChild
                variant="default"
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link to="/sale" className="group">
                  View All Sales
                  <ArrowRight className="ml-2 h-4 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="relative overflow-hidden px-2 md:px-4">
            <motion.div 
              className="flex gap-4 md:gap-6 product-scroll group/list"
              animate={scrollAnimation}
              style={{ 
                willChange: "transform",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...Array(2)].map((_, index) => (
                <div key={`row-${index}`} className="flex gap-4 md:gap-6">
                  {[
                    {
                      id: "sale1",
                      name: "Premium Leather Derby",
                      price: 299.99,
                      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
                      category: "Men's Shoes",
                      isSale: true,
                      discount: 30,
                      tags: ["Leather", "Formal"]
                    },
                    {
                      id: "sale2",
                      name: "Designer High Heels",
                      price: 249.99,
                      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
                      category: "Women's Shoes",
                      isSale: true,
                      discount: 40,
                      tags: ["Designer", "Evening"]
                    },
                    {
                      id: "sale3",
                      name: "Comfort Sport Shoes",
                      price: 179.99,
                      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
                      category: "Sport Shoes",
                      isSale: true,
                      discount: 25,
                      tags: ["Sport", "Comfort"]
                    },
                    {
                      id: "sale4",
                      name: "Classic Suede Boots",
                      price: 329.99,
                      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
                      category: "Men's Shoes",
                      isSale: true,
                      discount: 35,
                      tags: ["Suede", "Winter"]
                    },
                    {
                      id: "sale5",
                      name: "Limited Edition Sneakers",
                      price: 289.99,
                      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
                      category: "Men's Shoes",
                      isSale: true,
                      discount: 45,
                      tags: ["Limited", "Casual"]
                    }
                  ].map((product) => (
                    <div 
                      key={`${product.id}-${index}`} 
                      className={`min-w-[280px] w-[280px] transform ${isMobile ? 'scale-90' : ''}`}
                    >
                      <ProductCard {...product} />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            {...fadeInUp}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">Sale Ends In</p>
            <div className="flex justify-center gap-4">
              {[
                { value: "13", label: "Days" },
                { value: "09", label: "Hours" },
                { value: "04", label: "Minutes" },
                { value: "32", label: "Seconds" }
              ].map(({ value, label }) => (
                <div key={label} className="bg-white rounded-lg shadow-md p-4 min-w-[80px]">
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <motion.h2 
              {...fadeInUp}
              className="font-jakarta text-3xl md:text-4xl font-bold"
            >
              Featured Products
            </motion.h2>
            <motion.div {...fadeInUp}>
              <Button
                asChild
                variant="ghost"
                className="text-primary hover:text-primary-600"
              >
                <Link to="/men" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="relative overflow-hidden px-2 md:px-4">
            <motion.div 
              className="flex gap-6 product-scroll group/list"
              animate={scrollAnimation}
              style={{ 
                willChange: "transform",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...Array(2)].map((_, index) => (
                <div key={`featured-row-${index}`} className="flex gap-6">
                  {featuredProducts.map((product) => (
                    <div 
                      key={`${product.id}-${index}`} 
                      className={`min-w-[280px] w-[280px] transform ${isMobile ? 'scale-90' : ''}`}
                    >
                      <ProductCard {...product} />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-gray-300 font-satoshi">
              Subscribe to get special offers, free giveaways, and updates on new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button
                size="lg"
                className="bg-white text-primary-900 hover:bg-white/90"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
