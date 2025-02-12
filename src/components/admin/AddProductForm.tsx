import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ProductFormFields } from "./product/ProductFormFields";
import { ProductImagesSection } from "./product/ProductImagesSection";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ProductFormData, VariantOption } from "./types/product-form";

interface AddProductFormProps {
  onSuccess?: () => void;
}

const generateSlug = (name: string) => {
  const timestamp = new Date().getTime();
  return `${name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-')}-${timestamp}`; // Replace multiple hyphens with single hyphen
};

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
    sizeVariants: [],
    colorVariants: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.name_arabic.trim()) newErrors.name_arabic = "Product name in Arabic is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.product_description.trim()) {
      newErrors.product_description = "Product description is required";
    }
    if (!formData.product_description_arabic.trim()) {
      newErrors.product_description_arabic = "Product description in Arabic is required";
    }
    if (selectedImages.length === 0) {
      newErrors.images = "At least one product image is required";
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    // Validate variants
    if (formData.sizeVariants.length === 0) {
      newErrors.sizeVariants = "At least one size variant is required";
    } else {
      const invalidSizes = formData.sizeVariants.some(v => !v.value || !v.stock_quantity);
      if (invalidSizes) {
        newErrors.sizeVariants = "All size variants must have a size number and stock quantity";
      }
    }

    if (formData.colorVariants.length === 0) {
      newErrors.colorVariants = "At least one color variant is required";
    } else {
      const invalidColors = formData.colorVariants.some(v => !v.value || !v.stock_quantity);
      if (invalidColors) {
        newErrors.colorVariants = "All color variants must have a color name and stock quantity";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSku = async (sku: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("sku")
      .eq("sku", sku)
      .single();

    if (error && error.code === 'PGRST116') {
      // No data found, SKU is unique
      return true;
    }
    
    if (data) {
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (type: 'size' | 'color', index: number, value: string, field: string) => {
    setFormData((prev) => {
      const variants = type === 'size' ? [...prev.sizeVariants] : [...prev.colorVariants];
      variants[index] = {
        ...variants[index],
        [field]: field === 'stock_quantity' ? Number(value) : value,
      };
      return {
        ...prev,
        [type === 'size' ? 'sizeVariants' : 'colorVariants']: variants,
      };
    });
  };

  const handleAddVariant = (type: 'size' | 'color') => {
    setFormData((prev) => {
      const newVariant: VariantOption = {
        value: '',
        stock_quantity: 0,
        sku: '',
      };
      return {
        ...prev,
        [type === 'size' ? 'sizeVariants' : 'colorVariants']: [
          ...(type === 'size' ? prev.sizeVariants : prev.colorVariants),
          newVariant,
        ],
      };
    });
  };

  const handleRemoveVariant = (type: 'size' | 'color', index: number) => {
    setFormData((prev) => {
      const variants = type === 'size' ? [...prev.sizeVariants] : [...prev.colorVariants];
      variants.splice(index, 1);
      return {
        ...prev,
        [type === 'size' ? 'sizeVariants' : 'colorVariants']: variants,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if SKU is unique
      const isSkuUnique = await validateSku(formData.sku.trim());
      if (!isSkuUnique) {
        toast({
          title: "Error",
          description: "This SKU already exists. Please use a unique SKU.",
          variant: "destructive",
        });
        setErrors(prev => ({ ...prev, sku: "This SKU already exists" }));
        return;
      }

      // Generate slug from product name
      const slug = generateSlug(formData.name);

      // Insert the product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name: formData.name.trim(),
            name_arabic: formData.name_arabic.trim(),
            slug,
            price: Number(formData.price),
            match_at_price: formData.match_at_price ? Number(formData.match_at_price) : null,
            product_type: formData.product_type,
            quantity: Number(formData.quantity),
            sku: formData.sku.trim(),
            collection: formData.collection,
            product_description: formData.product_description.trim(),
            product_description_arabic: formData.product_description_arabic.trim(),
            status: 'published',
            inventory_count: Number(formData.quantity),
            title: formData.name.trim(),
          },
        ])
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw new Error(productError.message);
      }

      if (!productData) {
        throw new Error('Failed to create product');
      }

      // Insert variants
      if (formData.sizeVariants.length > 0) {
        const sizeVariants = formData.sizeVariants.map((variant) => ({
          product_id: productData.id,
          variant_type: 'size',
          variant_value: variant.value,
          stock_quantity: Number(variant.stock_quantity),
          variant_sku: variant.sku || `${productData.sku}-${variant.value.toLowerCase()}`,
          name: formData.name,
          option_values: [variant.value],
          price: Number(formData.price)
        }));

        const { error: sizeError } = await supabase
          .from("product_variants")
          .insert(sizeVariants);

        if (sizeError) {
          console.error('Size variant error:', sizeError);
          throw new Error(sizeError.message);
        }
      }

      if (formData.colorVariants.length > 0) {
        const colorVariants = formData.colorVariants.map((variant) => ({
          product_id: productData.id,
          variant_type: 'color',
          variant_value: variant.value,
          stock_quantity: Number(variant.stock_quantity),
          variant_sku: variant.sku || `${productData.sku}-${variant.value.toLowerCase()}`,
          name: formData.name,
          option_values: [variant.value],
          price: Number(formData.price)
        }));

        const { error: colorError } = await supabase
          .from("product_variants")
          .insert(colorVariants);

        if (colorError) {
          console.error('Color variant error:', colorError);
          throw new Error(colorError.message);
        }
      }

      // Upload images
      for (const [index, file] of selectedImages.entries()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productData.id}-${index}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        const { error: imageError } = await supabase
          .from('product_images')
          .insert([
            {
              product_id: productData.id,
              url: publicUrl,
              filename: fileName,
              original_filename: file.name,
              size_bytes: file.size,
              mime_type: file.type,
              position: index,
              is_thumbnail: index === 0,
            },
          ]);

        if (imageError) throw new Error(imageError.message);
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      onSuccess?.();
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500 mt-1">Create a new product with variants</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </div>

      <ProductFormFields
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleVariantChange={handleVariantChange}
        handleAddVariant={handleAddVariant}
        handleRemoveVariant={handleRemoveVariant}
      />

      <ProductImagesSection
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        error={errors.images}
      />
    </form>
  );
};

export default AddProductForm;