import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "@/components/admin/AddProductForm";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  status: string;
  collection: string;
  product_description?: string;
  images: {
    url: string;
    alt_text?: string;
  }[];
  product_type: string;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          quantity,
          sku,
          status,
          collection,
          product_description,
          product_images (
            url,
            alt_text
          ),
          product_type
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const productsWithImages = data?.map(product => ({
        ...product,
        images: product.product_images || []
      })) || [];

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error fetching products",
        description: "There was an error loading the products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .rpc('delete_product_with_cleanup', {
          p_product_id: id
        });

      if (error) throw error;

      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (showAddForm) {
    return <AddProductForm onSuccess={() => {
      setShowAddForm(false);
      fetchProducts();
    }} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setShowAddForm(true)}>Add New Product</Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Images</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex gap-1">
                  {product.images && product.images.length > 0 ? (
                    <div className="flex gap-1 overflow-x-auto max-w-[100px]">
                      {product.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={image.alt_text || `Product image ${index + 1}`}
                          className="w-8 h-8 object-cover rounded-md"
                        />
                      ))}
                      {product.images.length > 3 && (
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{product.images.length - 3}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.product_description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {product.product_description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">{product.collection}</span>
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </TableCell>
              <TableCell>
                <span className="capitalize">{product.product_type}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product
                          and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Products;
