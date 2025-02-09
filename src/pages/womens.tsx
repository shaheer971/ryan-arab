import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Womens = () => {
  const { t } = useTranslation();

  const { data: products, isLoading } = useQuery({
    queryKey: ['womens-products'],
    queryFn: async () => {
      console.log("Fetching women's products...");
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          name_arabic,
          slug,
          title,
          price,
          match_at_price,
          product_type,
          quantity,
          inventory_count,
          sku,
          collection,
          product_description,
          product_description_arabic,
          status,
          created_at,
          updated_at,
          product_images (
            id,
            url,
            filename,
            original_filename,
            size_bytes,
            mime_type,
            position,
            is_thumbnail
          )
        `)
        .eq('product_type', 'women')
        .eq('status', 'published');

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Fetched products:", data);
      return data || [];
    },
  });

  const categories = [
    {
      title: "Sneakers",
      collection: "sneakers",
    },
    {
      title: "Casual",
      collection: "casual",
    },
    {
      title: "Dress Shoes",
      collection: "dress shoes",
    },
    {
      title: "Sandals and Slippers",
      collection: "sandals",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white font-jakarta mb-6">
                Women's Collection
              </h1>
              <p className="text-xl text-gray-200 font-satoshi mb-8">
                Discover our premium selection of women's footwear, crafted for style and comfort.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="space-y-24">
            {categories.map((category, index) => {
              const categoryProducts = products?.filter(
                product => product.collection.toLowerCase() === category.collection.toLowerCase()
              ) || [];

              return (
                <div 
                  key={category.title} 
                  className="bg-white shadow-lg rounded-xl overflow-hidden"
                >
                  <div className="bg-primary/5 px-4 sm:px-8 py-6 border-b border-primary/10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <h2 className="text-3xl font-bold font-jakarta text-gray-900">
                        {category.title}
                      </h2>
                      <p className="text-gray-600 mt-2 font-satoshi">
                        {categoryProducts.length > 0 
                          ? `Discover our collection of ${categoryProducts.length} ${category.title.toLowerCase()}`
                          : `No ${category.title.toLowerCase()} available at the moment`
                        }
                      </p>
                    </motion.div>
                  </div>

                  <div className="p-4 sm:p-8">
                    {categoryProducts.length > 0 ? (
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                        {categoryProducts.map((product, productIndex) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: productIndex * 0.1 }}
                          >
                            <ProductCard
                              key={product.id}
                              id={product.id}
                              slug={product.slug}
                              name={product.name}
                              price={product.price}
                              match_at_price={product.match_at_price}
                              image={product.product_images?.[0]?.url || '/placeholder.svg'}
                              category={product.collection}
                              tags={[product.collection]}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No products available in this collection yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Womens;
