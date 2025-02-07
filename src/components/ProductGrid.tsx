import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

interface ProductGridProps {
  products: Product[];
  category: string;
}

const ProductGrid = ({ products, category }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/${category}/${product.id}`}
          className="group"
        >
          <div className="bg-white rounded-2xl p-4 card-shadow hover-lift transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="rounded-full">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags */}
              <div className="absolute top-2 left-2 flex gap-2">
                {product.isNew && (
                  <span className="bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-jakarta font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="text-right">
                  {product.isSale && product.salePrice ? (
                    <div className="space-x-1">
                      <span className="text-red-500 font-medium">${product.salePrice}</span>
                      <span className="text-sm text-gray-400 line-through">${product.price}</span>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-900">${product.price}</span>
                  )}
                </div>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.rating!)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  {product.reviews && (
                    <span className="text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  )}
                </div>
              )}

              {/* Colors */}
              {product.colors && (
                <div className="flex items-center gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {/* Sizes */}
              {product.sizes && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  {product.sizes.map((size) => (
                    <span key={size}>{size}</span>
                  )).reduce((prev, curr) => (
                    <>{prev} • {curr}</>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
