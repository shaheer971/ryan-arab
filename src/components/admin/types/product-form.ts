export interface ProductImage {
  id: string;
  url: string;
  filename: string;
  original_filename: string;
  size_bytes: number;
  mime_type: string;
  position: number;
  is_thumbnail: boolean;
  product_id: string;
}

export interface VariantOption {
  value: string;
  stock_quantity: number;
  sku: string;
}

export interface ProductFormData {
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
  sizeVariants: VariantOption[];
  colorVariants: VariantOption[];
}

export interface EditProductFormProps {
  onSuccess?: () => void;
}

export interface ProductFormFieldsProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export interface ProductImagesSectionProps {
  productId?: string;
  existingImages?: ProductImage[];
  setExistingImages?: (images: ProductImage[]) => void;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
  error?: string;
}
