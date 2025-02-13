import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  match_at_price: number | null;
  product_images: { id: string; url: string; is_thumbnail: boolean }[];
  slug: string;
  product_type: string;
}

interface InfiniteProductScrollProps {
  products: Product[];
}

export const InfiniteProductScroll = ({ products }: InfiniteProductScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || products.length === 0) return;

    // Clone products to create a seamless loop
    const scrollContainer = scrollRef.current;
    const scrollContent = scrollContainer.firstElementChild as HTMLElement;
    
    if (!scrollContent) return;

    // Calculate the total width of all products
    const productWidth = scrollContent.children[0]?.clientWidth || 0;
    const totalWidth = productWidth * products.length;

    // Set the animation duration based on the content width
    const duration = totalWidth * 0.02; // Adjust this multiplier to control speed

    // Create and inject the keyframe animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes scrollProducts {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    // Apply the animation
    scrollContent.style.animation = `scrollProducts ${duration}s linear infinite`;

    return () => {
      styleSheet.remove();
    };
  }, [products]);

  if (!products.length) return null;

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-hidden"
    >
      <motion.div
        className="flex gap-4"
        style={{
          minWidth: 'max-content', // Ensures content doesn't wrap
        }}
      >
        {/* Original products */}
        {products.map((product) => (
          <div key={product.id} className="w-[300px] flex-shrink-0">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              match_at_price={product.match_at_price}
              product_images={product.product_images}
              slug={product.slug}
              category={product.product_type}
            />
          </div>
        ))}
        {/* Cloned products for seamless loop */}
        {products.map((product) => (
          <div key={`${product.id}-clone`} className="w-[300px] flex-shrink-0">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              match_at_price={product.match_at_price}
              product_images={product.product_images}
              slug={product.slug}
              category={product.product_type}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
