import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { t } = useTranslation();
  
  const wishlistItems = [
    {
      id: '1',
      name: 'Classic Oxford',
      price: 295,
      color: 'Brown',
      availability: 'In Stock',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    },
    {
      id: '2',
      name: 'Leather Loafer',
      price: 275,
      color: 'Black',
      availability: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509',
    },
  ];

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
            {t('navigation.wishlist')}
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {wishlistItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-6 border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
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
                <p className="text-gray-600 mt-1">Color: {item.color}</p>
                <p className="text-primary font-medium mt-1">${item.price}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                  item.availability === 'In Stock' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.availability}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="bg-primary hover:bg-primary-dark">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Wishlist;