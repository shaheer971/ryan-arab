import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Heart, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wishlist items only if user is logged in
  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          products (
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
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (wishlistError) throw wishlistError;
      return wishlistData || [];
    },
    enabled: !!user,
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async (wishlistId: string) => {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist.",
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

  // Show loading state while checking authentication and fetching data
  if (user && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login prompt for unauthenticated users
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

        {wishlistItems?.length === 0 ? (
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
              {wishlistItems?.map((item) => (
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
                      onClick={() => removeFromWishlist.mutate(item.id)}
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