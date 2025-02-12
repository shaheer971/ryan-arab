import { useState, useEffect, useCallback } from "react";
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
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductVariant {
  id: string;
  variant_type: 'size' | 'color';
  variant_value: string;
  stock_quantity: number;
  variant_sku: string;
}

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  name_arabic: string;
  slug: string;
  price: number;
  match_at_price: number | null;
  product_type: string;
  quantity: number;
  inventory_count: number;
  sku: string;
  collection: string;
  status: string;
  created_at: string;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
  product_description: string;
  product_description_arabic: string;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          name_arabic,
          slug,
          price,
          match_at_price,
          product_type,
          quantity,
          inventory_count,
          sku,
          collection,
          status,
          created_at,
          product_variants (
            id,
            variant_type,
            variant_value,
            stock_quantity,
            variant_sku
          ),
          product_images (
            id,
            url,
            is_thumbnail
          ),
          product_description,
          product_description_arabic
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Type guard to ensure data matches our expected structure
        const typedProducts: Product[] = data.map(item => {
          if (!('id' in item) || !('name' in item)) {
            console.error('Invalid product data structure:', item);
            return null;
          }

          return {
            id: item.id,
            name: item.name || '',
            name_arabic: item.name_arabic || '',
            slug: item.slug || '',
            price: typeof item.price === 'number' ? item.price : 0,
            match_at_price: item.match_at_price ? Number(item.match_at_price) : null,
            product_type: item.product_type || '',
            quantity: typeof item.quantity === 'number' ? item.quantity : 0,
            inventory_count: typeof item.inventory_count === 'number' ? item.inventory_count : 0,
            sku: item.sku || '',
            collection: item.collection || '',
            status: item.status || 'draft',
            created_at: item.created_at || '',
            product_variants: Array.isArray(item.product_variants) ? item.product_variants : [],
            product_images: Array.isArray(item.product_images) ? item.product_images : [],
            product_description: item.product_description || '',
            product_description_arabic: item.product_description_arabic || ''
          };
        }).filter((product): product is Product => product !== null);

        setProducts(typedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const getThumbnailUrl = (images: ProductImage[]) => {
    const thumbnail = images.find(img => img.is_thumbnail);
    return thumbnail?.url || images[0]?.url || '/placeholder-image.jpg';
  };

  const getVariantCount = (variants: ProductVariant[], type: 'size' | 'color') => {
    return variants.filter(v => v.variant_type === type).length;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  const menProducts = filteredProducts.filter(product => product.product_type === 'men');
  const womenProducts = filteredProducts.filter(product => product.product_type === 'women');

  const renderProductTable = (products: Product[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Details</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={getThumbnailUrl(product.product_images)}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.name_arabic}</div>
                    <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.collection}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Total: {product.inventory_count}
                    </div>
                    <div className="text-xs text-gray-500">
                      Available: {product.quantity}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatCurrency(product.price)}
                    </div>
                    {product.match_at_price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.match_at_price)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "published"
                        ? "default"
                        : product.status === "draft"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (showAddForm) {
    return <AddProductForm onSuccess={() => {
      setShowAddForm(false);
      fetchProducts();
    }} />;
  }

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">Manage your products</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <div className="flex gap-4 items-center mb-6">
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

      {renderProductTable(menProducts, "Men's Products")}
      {renderProductTable(womenProducts, "Women's Products")}
    </div>
  );
};

export default Products;
