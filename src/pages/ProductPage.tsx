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
import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const ProductPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: async () => {
      console.log("Fetching product with slug:", params.slug);
      
      if (!params.slug) throw new Error('Product slug is required');
      
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
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      console.log("Fetched product data:", data);

      if (!data) {
        console.error("No product found with slug:", params.slug);
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

      // After we have the product, fetch its variants
      const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', data.id);

      if (variantsError) {
        console.error("Error fetching variants:", variantsError);
      } else if (variants) {
        data.product_variants = variants;
        
        // Group variants by type
        const variantsByType = variants.reduce((acc, variant) => {
          if (!acc[variant.variant_type]) {
            acc[variant.variant_type] = new Set();
          }
          acc[variant.variant_type].add(variant.variant_value);
          return acc;
        }, {});

        // Convert Sets to arrays
        data.variantOptions = Object.entries(variantsByType).reduce((acc, [type, values]) => {
          acc[type] = Array.from(values);
          return acc;
        }, {});
      }

      return data;
    },
    retry: false
  });

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Find matching variant based on selected options
  useEffect(() => {
    if (!product?.product_variants || !Object.keys(selectedOptions).length) return;

    const matchingVariant = product.product_variants.find(variant => 
      Object.entries(selectedOptions).every(([type, value]) => 
        variant.variant_type === type && variant.variant_value === value
      )
    );

    setSelectedVariant(matchingVariant || null);
  }, [selectedOptions, product?.product_variants]);

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const getCurrentPrice = () => {
    return product.price;
  };

  const getCompareAtPrice = () => {
    return product.match_at_price;
  };

  const getStockQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.stock_quantity;
    }
    return product.quantity;
  };

  const isOnSale = () => {
    const comparePrice = getCompareAtPrice();
    const currentPrice = getCurrentPrice();
    return comparePrice && comparePrice > currentPrice;
  };

  const getDiscount = () => {
    const comparePrice = getCompareAtPrice();
    const currentPrice = getCurrentPrice();
    if (!comparePrice || !currentPrice) return 0;
    return Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  // Check if product is in wishlist
  const { data: isInWishlist } = useQuery({
    queryKey: ["wishlist", user?.id, params.slug],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product?.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!product?.id,
  });

  // Add to wishlist mutation
  const addToWishlist = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: product.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Added to wishlist",
        description: `${product?.name} has been added to your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: `${product?.name} has been removed from your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWishlistClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
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

              {/* Variant Selection */}
              {product.product_variants && product.product_variants.length > 0 && (
                <div className="space-y-4">
                  <Separator className="my-4" />
                  {Object.entries(product.variantOptions || {}).map(([type, values]) => (
                    <div key={type}>
                      <h3 className="font-jakarta text-sm font-semibold mb-2">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <Button
                            key={value}
                            variant={selectedOptions[type] === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleOptionChange(type, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <Separator className="my-4" />
                <h3 className="font-jakarta text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.product_description || "No description available."}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                {isOnSale() ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ${getCurrentPrice().toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${getCompareAtPrice().toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      {getDiscount()}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ${getCurrentPrice().toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                {getStockQuantity() > 0 ? (
                  <span className="text-green-600">In Stock ({getStockQuantity()} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-4">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full h-12 text-lg"
                  size="lg"
                  disabled={
                    (selectedVariant && selectedVariant.stock_quantity === 0) ||
                    (!selectedVariant && product.quantity === 0) ||
                    (product.product_variants && !selectedVariant)
                  }
                >
                  {product.product_variants && !selectedVariant 
                    ? "Select Options" 
                    : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isInWishlist ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={handleWishlistClick}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
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