import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  size_variant_id: string;
  color_variant_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    match_at_price: number | null;
    product_images: { url: string; is_thumbnail: boolean }[];
  };
  size_variant: {
    variant_value: string;
    stock_quantity: number;
  };
  color_variant: {
    variant_value: string;
    stock_quantity: number;
  };
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            match_at_price,
            product_images (url, is_thumbnail)
          ),
          size_variant:product_variants!size_variant_id (
            variant_value,
            stock_quantity
          ),
          color_variant:product_variants!color_variant_id (
            variant_value,
            stock_quantity
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('carts')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some products to your cart and they will show up here</p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              {/* Product Image */}
              <div className="w-24 h-24 overflow-hidden rounded-md">
                <img
                  src={item.product.product_images.find(img => img.is_thumbnail)?.url || item.product.product_images[0]?.url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Size: {item.size_variant.variant_value}</p>
                  <p>Color: {item.color_variant.variant_value}</p>
                </div>
                <div className="mt-2">
                  <span className="font-medium">
                    {formatCurrency(item.product.price)}
                  </span>
                  {item.product.match_at_price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {formatCurrency(item.product.match_at_price)}
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating || item.quantity >= item.size_variant.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;