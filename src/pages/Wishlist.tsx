import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Heart, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database as GeneratedDatabase } from "@/integrations/supabase/types";

type ExtendedDatabase = GeneratedDatabase & {
  public: {
    Tables: {
      wishlists: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          name_arabic: string;
          slug: string;
          price: number;
          match_at_price: number | null;
          product_type: string;
          collection: string;
          product_images: {
            id: string;
            url: string;
            is_thumbnail: boolean;
          }[];
        };
      };
    } & GeneratedDatabase["public"]["Tables"];
  };
};

interface WishlistProduct {
  id: string;
  name: string;
  name_arabic: string;
  slug: string;
  price: number;
  match_at_price: number | null;
  product_type: string;
  collection: string;
  product_images: {
    id: string;
    url: string;
    is_thumbnail: boolean;
  }[];
}

interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  products: WishlistProduct;
}

interface WishlistData {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  products: WishlistProduct;
}

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems, isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const supabaseTyped = supabase as unknown as SupabaseClient<ExtendedDatabase>;
      
      // First fetch the wishlist items
      const { data: wishlistData, error: wishlistError } = await supabaseTyped
        .from('wishlists')
        .select('id, product_id, user_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (wishlistError) throw wishlistError;
      if (!wishlistData) return [];

      // Then fetch the product details for each wishlist item
      const productPromises = wishlistData.map(async (item) => {
        const { data: productData, error: productError } = await supabaseTyped
          .from('products')
          .select(`
            id,
            name,
            name_arabic,
            slug,
            price,
            match_at_price,
            product_type,
            collection,
            product_images (
              id,
              url,
              is_thumbnail
            )
          `)
          .eq('id', item.product_id)
          .single();

        if (productError || !productData) {
          console.error("Error fetching product:", productError);
          return null;
        }

        return {
          id: item.id,
          product_id: item.product_id,
          user_id: item.user_id,
          created_at: item.created_at,
          products: {
            id: productData.id,
            name: productData.name,
            name_arabic: productData.name_arabic || '',
            slug: productData.slug,
            price: productData.price,
            match_at_price: productData.match_at_price,
            product_type: productData.product_type,
            collection: productData.collection,
            product_images: productData.product_images || []
          }
        };
      });

      const results = await Promise.all(productPromises);
      return results.filter((item): item is WishlistItem => item !== null);
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const supabaseTyped = supabase as unknown as SupabaseClient<ExtendedDatabase>;
      
      const { error } = await supabaseTyped
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
      toast({
        title: "Success",
        description: "Product removed from wishlist",
      });
    },
    onError: (error) => {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeMutation.mutateAsync(productId);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-4">Sign in to view your wishlist</h2>
            <p className="text-gray-600 mb-6">
              Create an account or sign in to save your favorite items and access them from any device.
            </p>
            <Button onClick={() => navigate("/login")} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Add items to your wishlist to keep track of products you love.
            </p>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.products.product_images?.[0]?.url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-medium mb-2 hover:text-primary cursor-pointer"
                      onClick={() => navigate(`/product/${item.products.slug}`)}
                    >
                      {item.products.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        ${item.products.price.toFixed(2)}
                      </span>
                      {item.products.match_at_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.products.match_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;