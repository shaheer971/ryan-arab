import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  match_at_price: number | null;
  product_images: ProductImage[];
  category: string;
  tags?: string[];
  hideAddToCart?: boolean;
  onActionClick?: () => void;
  actionLabel?: string;
  actionVariant?: "default" | "destructive" | "outline";
}

const ProductCard = ({
  id,
  slug,
  name,
  price,
  match_at_price,
  product_images,
  category,
  tags = [],
  hideAddToCart = false,
  onActionClick,
  actionLabel,
  actionVariant = "default",
}: ProductCardProps) => {
  const isOnSale = match_at_price && match_at_price > price;
  const discount = isOnSale ? Math.round(((match_at_price - price) / match_at_price) * 100) : undefined;
  
  // Get the thumbnail image or the first image
  const displayImage = product_images?.find(img => img.is_thumbnail)?.url || 
                      product_images?.[0]?.url ||
                      'https://via.placeholder.com/400x400?text=No+Image';

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden hover-lift">
        <CardHeader className="p-0">
          <Link to={`/product/${slug}`} className="relative block">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={displayImage}
                alt={name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Tags Overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-2">
              {isOnSale && (
                <Badge className="bg-red-500 text-white">
                  {discount}% OFF
                </Badge>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-4">
          <Link
            to={`/product/${slug}`}
            className="block font-medium hover:text-primary transition-colors text-sm sm:text-base line-clamp-2"
          >
            {name}
          </Link>
          {category && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{category}</p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <div className="space-x-2">
            {isOnSale ? (
              <>
                <span className="text-base sm:text-lg font-bold text-primary">
                  ${(price || 0).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ${(match_at_price || 0).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-primary">
                ${(price || 0).toFixed(2)}
              </span>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {!hideAddToCart && (
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
              >
                Add to Cart
              </Button>
            )}
            {onActionClick && actionLabel && (
              <Button
                variant={actionVariant}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  onActionClick();
                }}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
