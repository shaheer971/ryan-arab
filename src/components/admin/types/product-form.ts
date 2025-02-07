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

export interface ProductFormData {
  name: string;
  name_arabic: string;
  price: string;
  match_at_price: string;
  product_type: "men" | "women";
  quantity: string;
  sku: string;
  collection: "casual" | "sneakers" | "dress shoes" | "sandals and slippers";
  product_description: string;
  product_description_arabic: string;
  status: "published" | "draft";
  title: string;
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
  productId: string;
  existingImages: ProductImage[];
  setExistingImages: (images: ProductImage[]) => void;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
}
