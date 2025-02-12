import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  product_images: { url: string; is_thumbnail: boolean }[];
}

interface RecommendedProductsProps {
  products: Product[];
}

export const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {products.length > 4 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Products Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-none w-[250px] cursor-pointer group"
            style={{ scrollSnapAlign: 'start' }}
            onClick={() => {
              navigate(`/product/${product.slug}`);
              // Scroll to top when navigating to a new product
              window.scrollTo(0, 0);
            }}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.product_images.find(img => img.is_thumbnail)?.url || product.product_images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/default-image.jpg';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
