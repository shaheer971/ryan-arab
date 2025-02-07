import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

interface CategoryPageProps {
  category: "men" | "women" | "kids";
  title: string;
}

const products: Record<string, any[]> = {
  men: [
    {
      id: "1",
      name: "Classic Oxford",
      price: 295,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      category: "Men's Shoes",
      isNew: true,
      tags: ["Leather", "Formal"]
    },
    {
      id: "2",
      name: "Leather Loafer",
      price: 275,
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
      category: "Men's Shoes",
      tags: ["Casual", "Comfort"]
    },
    {
      id: "3",
      name: "Premium Sneaker",
      price: 225,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      category: "Men's Shoes",
      isSale: true,
      discount: 20,
      tags: ["Sport", "Casual"]
    },
    {
      id: "10",
      name: "Suede Derby",
      price: 265,
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
      category: "Men's Shoes",
      isSale: true,
      discount: 15,
      tags: ["Suede", "Casual"]
    }
  ],
  women: [
    {
      id: "4",
      name: "Elegant Pump",
      price: 285,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      category: "Women's Shoes",
      isNew: true,
      tags: ["Evening", "Formal"]
    },
    {
      id: "5",
      name: "Ballet Flat",
      price: 195,
      image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95",
      category: "Women's Shoes",
      tags: ["Casual", "Comfort"]
    },
    {
      id: "6",
      name: "Ankle Boot",
      price: 345,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      category: "Women's Shoes",
      isSale: true,
      discount: 30,
      tags: ["Winter", "Trendy"]
    },
    {
      id: "11",
      name: "Summer Sandal",
      price: 175,
      image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95",
      category: "Women's Shoes",
      isNew: true,
      tags: ["Summer", "Casual"]
    }
  ],
  kids: [
    {
      id: "7",
      name: "Sport Sneaker",
      price: 125,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782",
      category: "Kids' Shoes",
      isNew: true,
      tags: ["Sport", "Comfort"]
    },
    {
      id: "8",
      name: "School Shoe",
      price: 95,
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
      category: "Kids' Shoes",
      tags: ["School", "Formal"]
    },
    {
      id: "9",
      name: "Casual Slip-on",
      price: 85,
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
      category: "Kids' Shoes",
      isSale: true,
      discount: 15,
      tags: ["Casual", "Easy Wear"]
    },
    {
      id: "12",
      name: "Light-up Sneaker",
      price: 115,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782",
      category: "Kids' Shoes",
      isNew: true,
      tags: ["Fun", "Light-up"]
    }
  ],
};

const CategoryPage = ({ category, title }: CategoryPageProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-premium overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-satoshi">
            Discover our curated collection of premium footwear, designed for style and comfort.
          </p>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="bg-white">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="bg-white">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Showing {products[category].length} products
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products[category].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
