import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProductFormFields } from "./product/ProductFormFields";
import { ProductImagesSection } from "./product/ProductImagesSection";
import { validateProductForm, uploadProductImages } from "./utils/product-form-utils";
import { ProductFormData, EditProductFormProps, ProductImage, VariantOption } from "./types/product-form";

interface ProductResponse {
  id: string;
  name: string;
  name_arabic: string;
  price: number;
  match_at_price: number | null;
  product_type: string;
  quantity: number;
  sku: string;
  collection: string;
  product_description: string;
  product_description_arabic: string;
  status: string;
  product_images: ProductImage[];
  product_variants: {
    id: string;
    variant_type: string;
    variant_value: string;
    stock_quantity: number;
    variant_sku: string;
  }[];
}

const EditProductForm = ({ onSuccess }: EditProductFormProps) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    status: "published",
    title: "",
    sizeVariants: [],
    colorVariants: [],
  });

  const fetchProductData = useCallback(async () => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          name_arabic,
          price,
          match_at_price,
          product_type,
          quantity,
          sku,
          collection,
          product_description,
          product_description_arabic,
          status,
          product_images (
            id,
            url,
            filename,
            original_filename,
            size_bytes,
            mime_type,
            position,
            is_thumbnail,
            product_id
          ),
          product_variants (
            id,
            variant_type,
            variant_value,
            stock_quantity,
            variant_sku
          )
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (product) {
        const typedProduct = product as ProductResponse;
        setFormData({
          name: typedProduct.name || "",
          name_arabic: typedProduct.name_arabic || "",
          price: typedProduct.price?.toString() || "",
          match_at_price: typedProduct.match_at_price?.toString() || "",
          product_type: typedProduct.product_type as "men" | "women",
          quantity: typedProduct.quantity?.toString() || "",
          sku: typedProduct.sku || "",
          collection: typedProduct.collection as "casual" | "sneakers" | "dress shoes" | "sandals and slippers",
          product_description: typedProduct.product_description || "",
          product_description_arabic: typedProduct.product_description_arabic || "",
          status: typedProduct.status as "published" | "draft",
          title: typedProduct.name || "",
          sizeVariants: typedProduct.product_variants
            .filter((v: any) => v.variant_type === 'size')
            .map((v: any) => ({
              value: v.variant_value,
              stock_quantity: v.stock_quantity,
              sku: v.variant_sku,
            })),
          colorVariants: typedProduct.product_variants
            .filter((v: any) => v.variant_type === 'color')
            .map((v: any) => ({
              value: v.variant_value,
              stock_quantity: v.stock_quantity,
              sku: v.variant_sku,
            })),
        });
        setExistingImages(typedProduct.product_images || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error fetching product",
        description: "Could not load product data. Please try again.",
        variant: "destructive",
      });
    }
  }, [productId, toast]);

  useEffect(() => {
    if (productId) {
      void fetchProductData();
    }
  }, [productId, fetchProductData]);

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
    
    const validationErrors = validateProductForm(formData, selectedImages, existingImages);
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
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: formData.name.trim(),
          name_arabic: formData.name_arabic.trim(),
          title: formData.name.trim(),
          price: parseFloat(formData.price),
          match_at_price: formData.match_at_price ? parseFloat(formData.match_at_price) : null,
          product_type: formData.product_type,
          quantity: parseInt(formData.quantity),
          inventory_count: parseInt(formData.quantity),
          sku: formData.sku.trim(),
          collection: formData.collection,
          product_description: formData.product_description.trim(),
          product_description_arabic: formData.product_description_arabic.trim(),
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (productError) throw productError;

      // Delete existing variants
      const { error: deleteVariantsError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", productId);

      if (deleteVariantsError) throw deleteVariantsError;

      // Insert new variants
      if (formData.sizeVariants.length > 0) {
        const { error: sizeError } = await supabase
          .from("product_variants")
          .insert(
            formData.sizeVariants.map((variant) => ({
              product_id: productId,
              variant_type: 'size',
              variant_value: variant.value,
              stock_quantity: Number(variant.stock_quantity),
              variant_sku: variant.sku || `${formData.sku}-${variant.value}`,
            }))
          );
        if (sizeError) throw sizeError;
      }

      if (formData.colorVariants.length > 0) {
        const { error: colorError } = await supabase
          .from("product_variants")
          .insert(
            formData.colorVariants.map((variant) => ({
              product_id: productId,
              variant_type: 'color',
              variant_value: variant.value,
              stock_quantity: Number(variant.stock_quantity),
              variant_sku: variant.sku || `${formData.sku}-${variant.value.toLowerCase()}`,
            }))
          );
        if (colorError) throw colorError;
      }

      if (selectedImages.length > 0) {
        await uploadProductImages(productId!, selectedImages, existingImages);
      }

      await fetchProductData();

      toast({
        title: "Success",
        description: "Product updated successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <p className="text-gray-500">Fields marked with * are required.</p>
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
        productId={productId!}
        existingImages={existingImages}
        setExistingImages={setExistingImages}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/products')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
};

export default EditProductForm;