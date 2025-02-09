import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ProductImageGallery from "@/components/ProductImageGallery";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface ProductVariant {
  id: string;
  variant_type: 'size' | 'color';
  variant_value: string;
  stock_quantity: number;
  variant_sku: string;
}

interface Product {
  id: string;
  name: string;
  name_arabic: string;
  price: number;
  match_at_price: number | null;
  description: string;
  product_images: { url: string; is_thumbnail: boolean }[];
  product_variants: ProductVariant[];
}

const ProductPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              url,
              is_thumbnail
            ),
            product_variants (
              id,
              variant_type,
              variant_value,
              stock_quantity,
              variant_sku
            )
          `)
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      }
    },
    retry: false
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (product) {
      // Set default image to thumbnail
      const thumbnail = product.product_images.find(img => img.is_thumbnail);
      setSelectedImage(thumbnail?.url || product.product_images[0]?.url);
    }
  }, [product]);

  const getSizeVariants = () => {
    return product?.product_variants.filter(v => v.variant_type === 'size') || [];
  };

  const getColorVariants = () => {
    return product?.product_variants.filter(v => v.variant_type === 'color') || [];
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "You must select both size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    const sizeVariant = getSizeVariants().find(v => v.variant_value === selectedSize);
    const colorVariant = getColorVariants().find(v => v.variant_value === selectedColor);

    if (!sizeVariant || !colorVariant) {
      toast({
        title: "Error",
        description: "Selected variants are not available",
        variant: "destructive",
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product?.id)
        .eq('size_variant_id', sizeVariant.id)
        .eq('color_variant_id', colorVariant.id)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('carts')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insert new cart item
        const { error: insertError } = await supabase
          .from('carts')
          .insert({
            user_id: user.id,
            product_id: product?.id,
            size_variant_id: sizeVariant.id,
            color_variant_id: colorVariant.id,
            quantity
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
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
                <h1 className="font-jakarta text-3xl font-bold">{product.name}</h1>
              </div>

              {/* Variant Selection */}
              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getSizeVariants().map((variant) => (
                      <Button
                        key={variant.id}
                        variant={selectedSize === variant.variant_value ? "default" : "outline"}
                        onClick={() => setSelectedSize(variant.variant_value)}
                        disabled={variant.stock_quantity === 0}
                      >
                        {variant.variant_value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getColorVariants().map((variant) => (
                      <Button
                        key={variant.id}
                        variant={selectedColor === variant.variant_value ? "default" : "outline"}
                        onClick={() => setSelectedColor(variant.variant_value)}
                        disabled={variant.stock_quantity === 0}
                      >
                        {variant.variant_value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !selectedColor}
              >
                {addingToCart ? "Adding to Cart..." : "Add to Cart"}
              </Button>

              {/* Product Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Description</h3>
                <p>{product.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;