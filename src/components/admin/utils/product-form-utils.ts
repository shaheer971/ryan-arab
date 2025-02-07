import { ProductFormData, ProductImage } from "../types/product-form";
import { supabase } from "@/integrations/supabase/client";

interface ValidationResult {
  [key: string]: string;
}

export const validateProductForm = (formData: ProductFormData, selectedImages: File[] = [], existingImages: ProductImage[] = []): ValidationResult => {
  const errors: ValidationResult = {};
  
  if (!formData.name.trim()) errors.name = "Product name in English is required";
  if (!formData.name_arabic.trim()) errors.name_arabic = "Product name in Arabic is required";
  if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    errors.price = "Valid price is required";
  }
  if (formData.match_at_price && (isNaN(Number(formData.match_at_price)) || Number(formData.match_at_price) < 0)) {
    errors.match_at_price = "Compare at price must be a valid number";
  }
  if (!formData.quantity || isNaN(Number(formData.quantity))) {
    errors.quantity = "Valid quantity is required";
  }
  if (!formData.sku.trim()) errors.sku = "SKU is required";
  if (!formData.collection) errors.collection = "Collection is required";
  if (!formData.product_description.trim()) errors.product_description = "Product description in English is required";
  if (!formData.product_description_arabic.trim()) errors.product_description_arabic = "Product description in Arabic is required";
  if (selectedImages.length === 0 && existingImages.length === 0) {
    errors.images = "At least one product image is required";
  }

  return errors;
};

export const uploadProductImages = async (
  productId: string,
  selectedImages: File[],
  existingImages: ProductImage[]
): Promise<void> => {
  const uploadPromises = selectedImages.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${productId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const { error: imageError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: urlData.publicUrl,
        filename: fileName,
        original_filename: file.name,
        size_bytes: file.size,
        mime_type: file.type,
        position: existingImages.length + index,
        is_thumbnail: index === 0 && existingImages.length === 0
      });

    if (imageError) throw imageError;
  });

  await Promise.all(uploadPromises);
};
