import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InfiniteProductScroll } from "@/components/InfiniteProductScroll";

const Home = () => {
  const isMobile = useIsMobile();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Fetch featured and sale products
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featured-products-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_products')
        .select(`
          product:products (
            id,
            name,
            price,
            match_at_price,
            slug,
            product_type,
            product_images (
              id,
              url,
              is_thumbnail,
              position
            )
          )
        `)
        .eq('section', 'featured')
        .order('position');

      if (error) throw error;
      return data?.map(fp => fp.product) || [];
    }
  });

  const { data: saleProducts, isLoading: isLoadingSale } = useQuery({
    queryKey: ['sale-products-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_products')
        .select(`
          product:products (
            id,
            name,
            price,
            match_at_price,
            slug,
            product_type,
            product_images (
              id,
              url,
              is_thumbnail,
              position
            )
          )
        `)
        .eq('section', 'sale')
        .order('position');

      if (error) throw error;
      return data?.map(fp => fp.product) || [];
    }
  });

  const categories = [
    {
      title: "Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      menLink: "/mens?collection=sneakers",
      womenLink: "/womens?collection=sneakers"
    },
    {
      title: "Casual",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
      menLink: "/mens?collection=casual",
      womenLink: "/womens?collection=casual"
    },
    {
      title: "Dress Shoes",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      menLink: "/mens?collection=dress-shoes",
      womenLink: "/womens?collection=dress-shoes"
    },
    {
      title: "Sandals and Slippers",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      menLink: "/mens?collection=sandals",
      womenLink: "/womens?collection=sandals"
    }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1549298916-b41d501d3772')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white space-y-6 max-w-3xl mx-auto px-4"
        >
          <h1 className="font-jakarta text-5xl md:text-7xl font-bold">
            The Future of Luxury. Rooted in Heritage.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-satoshi">
            Designed by Saudis. Crafted by the world's finest shoemakers. Engineered through years of research. Some of our shoes? Fully designed by AI. Welcome to the next era of luxury footwear.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link to="/collection">Discover the Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/about">Explore the Craft</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-2 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="font-jakarta text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

      {/* Sale Products Section */}
      <section className="py-24 px-4 gradient-premium overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-12">
            <motion.div {...fadeInUp} className="max-w-2xl text-center md:text-left">
              <span className="text-primary font-medium mb-2 block">Limited Time Offer</span>
              <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4">
                Special Sale
              </h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                Discover our exclusive collection of sale items at unbeatable prices.
              </p>
            </motion.div>
            <Button
              asChild
              variant="outline"
              className="group"
            >
              <Link to="/sale">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          {isLoadingSale ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <InfiniteProductScroll products={saleProducts || []} />
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-12">
            <motion.div {...fadeInUp} className="max-w-2xl text-center md:text-left">
              <span className="text-primary font-medium mb-2 block">Handpicked Collection</span>
              <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                Explore our curated selection of premium footwear.
              </p>
            </motion.div>
            <Button
              asChild
              variant="outline"
              className="group"
            >
              <Link to="/featured">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          {isLoadingFeatured ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <InfiniteProductScroll products={featuredProducts || []} />
          )}
        </div>
      </section>

      {/* Newsletter Section */}
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
                className="bg-white text-primary hover:bg-white/70"
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
