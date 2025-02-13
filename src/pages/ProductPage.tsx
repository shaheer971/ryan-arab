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
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { cn } from "@/lib/utils";

interface ProductVariant {
  id: string;
  variant_type: string;
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
  product_description: string;
  product_description_arabic: string;
  product_type: string;
  collection: string;
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
            id,
            name,
            name_arabic,
            price,
            match_at_price,
            product_type,
            collection,
            product_description,
            product_description_arabic,
            slug,
            product_images!inner (
              id,
              url,
              is_thumbnail
            ),
            product_variants!inner (
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
        return null;
      }
    },
    retry: false
  });

  // Fetch recommended products with proper filtering
  const { data: recommendedProducts } = useQuery({
    queryKey: ['recommendedProducts', product?.id, product?.product_type, product?.collection],
    queryFn: async () => {
      if (!product) return [];
      
      try {
        // First get products from same type and collection
        const { data: sameTypeAndCollection } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            slug,
            product_images!inner (
              id,
              url,
              is_thumbnail
            )
          `)
          .eq('product_type', product.product_type)
          .eq('collection', product.collection)
          .neq('id', product.id)
          .limit(8);

        // If we don't have enough products, get more from same type
        if (!sameTypeAndCollection || sameTypeAndCollection.length < 8) {
          const { data: sameType } = await supabase
            .from('products')
            .select(`
              id,
              name,
              price,
              slug,
              product_images!inner (
                id,
                url,
                is_thumbnail
              )
            `)
            .eq('product_type', product.product_type)
            .neq('id', product.id)
            .neq('collection', product.collection)
            .limit(8 - (sameTypeAndCollection?.length || 0));

          return [...(sameTypeAndCollection || []), ...(sameType || [])];
        }

        return sameTypeAndCollection;
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        return [];
      }
    },
    enabled: !!product,
  });

  const getSizeVariants = () => {
    return product?.product_variants?.filter(v => v.variant_type.toLowerCase() === 'size') || [];
  };

  const getColorVariants = () => {
    return product?.product_variants?.filter(v => v.variant_type.toLowerCase() === 'color') || [];
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (product) {
      // Set default image to thumbnail
      const thumbnail = product.product_images.find(img => img.is_thumbnail);
      setSelectedImage(thumbnail?.url || product.product_images[0]?.url);
    }
  }, [product]);

  useEffect(() => {
    if (product && user) {
      checkWishlistStatus();
    }
  }, [product, user]);

  const checkWishlistStatus = async () => {
    if (!user || !product) return;
    
    const { data } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();
    
    setIsInWishlist(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage your wishlist",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist",
        });
      } else {
        await supabase
          .from('wishlists')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
            }
          ]);
        
        toast({
          title: "Added to wishlist",
          description: "Product has been added to your wishlist",
        });
      }
      
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
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
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {isLoading ? (
          <ProductPageSkeleton />
        ) : !product ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold">Product not found</h2>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="md:block hidden">
                  <ProductImageGallery images={product.product_images} />
                </div>
                <div className="md:hidden block">
                  <div className="space-y-4">
                    <img
                      src={selectedImage || product.product_images[0]?.url}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {product.product_images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(image.url)}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2",
                            selectedImage === image.url
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent"
                          )}
                        >
                          <img
                            src={image.url}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <h2 className="text-2xl text-gray-600 mt-1">{product.name_arabic}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10",
                      isInWishlist && "text-red-500 hover:text-red-600"
                    )}
                    onClick={toggleWishlist}
                  >
                    <Heart className={cn("h-6 w-6", isInWishlist && "fill-current")} />
                  </Button>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {formatCurrency(product.price)}
                  </span>
                  {product.match_at_price && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.match_at_price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {product.product_description}
                  </p>
                </div>

                {/* Return Policy Link */}
                <div>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-primary hover:underline"
                    onClick={() => navigate('/return-policy')}
                  >
                    View Return Policy
                  </Button>
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
                          className="min-w-[60px]"
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
                          className="min-w-[60px]"
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

                {/* Wishlist Button */}
                <Button
                  className="w-full mt-4"
                  size="lg"
                  variant={isInWishlist ? "default" : "outline"}
                  onClick={toggleWishlist}
                >
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>

            {/* Recommended Products Section */}
            <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              {recommendedProducts && recommendedProducts.length > 0 ? (
                <RecommendedProducts products={recommendedProducts} />
              ) : (
                <p className="text-gray-500 text-center py-4">No recommended products available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;