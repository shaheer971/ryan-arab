import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Cart = () => {
  const { t } = useTranslation();
  
  const cartItems = [
    {
      id: '1',
      name: 'Classic Oxford',
      price: 295,
      quantity: 1,
      size: 'US 9',
      color: 'Brown',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    },
    {
      id: '2',
      name: 'Leather Loafer',
      price: 275,
      quantity: 2,
      size: 'US 8',
      color: 'Black',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509',
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-24 pb-16 font-jakarta"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">
            {t('navigation.cart')}
          </h1>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-6 border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium text-lg hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-1">Size: {item.size} | Color: {item.color}</p>
                  <p className="text-primary font-medium mt-1">${item.price}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-6 space-y-4 sticky top-24"
            >
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;