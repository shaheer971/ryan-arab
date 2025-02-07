import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface AddProductFormProps {
  onSuccess?: () => void;
}

interface ProductData {
  name: string;
  name_arabic: string;
  slug: string;
  price: number;
  match_at_price: number | null;
  product_type: string;
  quantity: number;
  inventory_count: number;
  sku: string;
  title: string;
  status: string;
  collection: string;
  product_description: string;
  product_description_arabic: string;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  name_arabic: string;
  price: string;
  match_at_price: string;
  product_type: string;
  quantity: string;
  sku: string;
  collection: string;
  product_description: string;
  product_description_arabic: string;
}

interface ProductFormErrors {
  name?: string;
  price?: string;
  quantity?: string;
  sku?: string;
  collection?: string;
  product_description?: string;
  product_description_arabic?: string;
  images?: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  filename: string;
  original_filename: string;
  size_bytes: number;
  mime_type: string;
  position: number;
  is_thumbnail: boolean;
}

const AddProductForm = ({ onSuccess }: AddProductFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    name_arabic: "",
    price: "",
    match_at_price: "",
    product_type: "men",
    quantity: "",
    sku: "",
    collection: "casual",
    product_description: "",
    product_description_arabic: "",
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const validateForm = () => {
    const newErrors: ProductFormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.collection) newErrors.collection = "Collection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProductForm = (data: ProductFormData, images: File[]) => {
    const validationErrors: ProductFormErrors = {};
    
    if (!data.name.trim()) validationErrors.name = "Product name is required";
    if (!data.price || isNaN(Number(data.price)) || Number(data.price) <= 0) {
      validationErrors.price = "Valid price is required";
    }
    if (!data.quantity || isNaN(Number(data.quantity))) {
      validationErrors.quantity = "Valid quantity is required";
    }
    if (!data.sku.trim()) validationErrors.sku = "SKU is required";
    if (!data.collection) validationErrors.collection = "Collection is required";
    if (!data.product_description.trim()) {
      validationErrors.product_description = "Product description is required";
    }
    if (!data.product_description_arabic.trim()) {
      validationErrors.product_description_arabic = "Arabic product description is required";
    }
    if (images.length === 0) {
      validationErrors.images = "At least one product image is required";
    }
    return validationErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const createSlug = (name: string) => {
    const timestamp = new Date().getTime();
    return `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${timestamp}`;
  };

  const uploadProductImages = async (productId: string, images: File[], existingImages: ProductImage[]) => {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = await supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url: urlData.publicUrl,
          filename: file.name,
          original_filename: file.name,
          size_bytes: file.size,
          mime_type: file.type,
          position: index,
          is_thumbnail: index === 0
        });

      if (dbError) {
        console.error('DB error:', dbError);
        throw dbError;
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const validationErrors = validateProductForm(formData, selectedImages);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = createSlug(formData.name);
      
      // Prepare the product data with all fields
      const productData: ProductData = {
        name: formData.name.trim(),
        name_arabic: formData.name_arabic.trim(),
        slug,
        price: parseFloat(formData.price),
        match_at_price: formData.match_at_price ? parseFloat(formData.match_at_price) : null,
        product_type: formData.product_type,
        quantity: parseInt(formData.quantity),
        inventory_count: parseInt(formData.quantity), // Set initial inventory count
        sku: formData.sku.trim(),
        title: formData.name.trim(),
        status: 'published',
        collection: formData.collection,
        product_description: formData.product_description.trim(),
        product_description_arabic: formData.product_description_arabic.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert the product data
      const { data: productResponse, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      // Upload product images
      if (selectedImages.length > 0) {
        await uploadProductImages(productResponse.id, selectedImages, []);
      }

      toast({
        title: "Product created successfully",
        description: "Your product has been added to the catalog.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: "There was an error creating your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add New Product</h2>
        <p className="text-gray-500">Fields marked with * are required.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name English *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="name_arabic">Product Name Arabic</Label>
            <Input
              id="name_arabic"
              name="name_arabic"
              value={formData.name_arabic}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="match_at_price">Match at Price</Label>
            <Input
              id="match_at_price"
              name="match_at_price"
              type="number"
              step="0.01"
              value={formData.match_at_price}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="product_type">Product Type *</Label>
            <Select
              name="product_type"
              value={formData.product_type}
              onValueChange={(value) => handleSelectChange("product_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="collection">Collection *</Label>
            <Select
              name="collection"
              value={formData.collection}
              onValueChange={(value) => handleSelectChange("collection", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sneakers">Sneakers</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="dress shoes">Dress Shoes</SelectItem>
                <SelectItem value="sandals and slippers">Sandals and Slippers</SelectItem>
              </SelectContent>
            </Select>
            {errors.collection && <p className="text-red-500 text-sm mt-1">{errors.collection}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity">Stock Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={errors.sku ? "border-red-500" : ""}
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div>
            <Label htmlFor="product_description">Product Description English *</Label>
            <Textarea
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              rows={4}
              className="resize-none"
            />
            {errors.product_description && <p className="text-red-500 text-sm mt-1">{errors.product_description}</p>}
          </div>

          <div>
            <Label htmlFor="product_description_arabic">Product Description Arabic *</Label>
            <Textarea
              id="product_description_arabic"
              name="product_description_arabic"
              value={formData.product_description_arabic}
              onChange={handleInputChange}
              rows={4}
              className="resize-none"
            />
            {errors.product_description_arabic && <p className="text-red-500 text-sm mt-1">{errors.product_description_arabic}</p>}
          </div>

          <div>
            <Label>Product Images *</Label>
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/products')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;