import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Heart, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ProductPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.productId],
    queryFn: async () => {
      console.log("Fetching product with ID:", params.productId);
      
      if (!params.productId) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            url,
            alt_text,
            position,
            is_thumbnail
          )
        `)
        .eq('id', params.productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      console.log("Fetched product data:", data);

      if (!data) {
        console.error("No product found with ID:", params.productId);
        throw new Error('Product not found');
      }

      // Sort images to ensure thumbnails come first
      if (data.product_images) {
        data.product_images.sort((a, b) => {
          if (a.is_thumbnail && !b.is_thumbnail) return -1;
          if (!a.is_thumbnail && b.is_thumbnail) return 1;
          return (a.position || 0) - (b.position || 0);
        });
      }

      return data;
    },
    retry: false // Don't retry on error
  });

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.name} has been added to your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="my-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery images={product.product_images || []} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    {product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)}
                  </Badge>
                  <Badge variant="secondary">{product.collection}</Badge>
                  {product.is_featured && (
                    <Badge variant="default" className="bg-primary">New Arrival</Badge>
                  )}
                </div>
                <h1 className="font-jakarta text-3xl font-bold">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                {product.is_on_sale && product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">(125 reviews)</span>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <Separator className="my-4" />
                <h3 className="font-jakarta text-lg font-semibold mb-2">Product Description English</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.product_description || "No description available."}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-4">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-6">
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">SKU:</span>
                    <span className="ml-2 font-medium">{product.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium">{product.collection}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium">In Stock</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{product.product_type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;