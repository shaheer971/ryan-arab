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

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  tags?: string[];
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  isNew,
  isSale,
  discount,
  tags = [],
}: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group overflow-hidden hover-lift">
        <CardHeader className="p-0">
          <Link to={`/product/${id}`} className="relative block">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={image}
                alt={name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Tags Overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-2">
              {isNew && (
                <Badge className="bg-primary text-white">New Arrival</Badge>
              )}
              {isSale && (
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
            to={`/product/${id}`}
            className="block font-medium hover:text-primary transition-colors text-sm sm:text-base line-clamp-2"
          >
            {name}
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{category}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <div className="space-x-2">
            {isSale ? (
              <>
                <span className="text-base sm:text-lg font-bold text-primary">
                  ${(price * (1 - discount! / 100)).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-primary">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" className="w-full">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
