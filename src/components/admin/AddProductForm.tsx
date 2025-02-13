import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ProductFormFields } from "./product/ProductFormFields";
import { ProductImagesSection } from "./product/ProductImagesSection";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ProductFormData, VariantOption } from "./types/product-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
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
    
    if (!formData.name.trim()) newErrors.name = t('admin.addProduct.errors.nameRequired');
    if (!formData.name_arabic.trim()) newErrors.name_arabic = t('admin.addProduct.errors.nameArabicRequired');
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('admin.addProduct.errors.validPriceRequired');
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = t('admin.addProduct.errors.validQuantityRequired');
    }
    if (!formData.product_description.trim()) {
      newErrors.product_description = t('admin.addProduct.errors.descriptionRequired');
    }
    if (!formData.product_description_arabic.trim()) {
      newErrors.product_description_arabic = t('admin.addProduct.errors.descriptionArabicRequired');
    }
    if (selectedImages.length === 0) {
      newErrors.images = t('admin.addProduct.errors.imageRequired');
    }
    if (!formData.sku.trim()) {
      newErrors.sku = t('admin.addProduct.errors.skuRequired');
    }

    // Validate variants
    if (formData.sizeVariants.length === 0) {
      newErrors.sizeVariants = t('admin.addProduct.errors.sizeVariantRequired');
    } else {
      const invalidSizes = formData.sizeVariants.some(v => !v.value || !v.stock_quantity);
      if (invalidSizes) {
        newErrors.sizeVariants = t('admin.addProduct.errors.invalidSizeVariants');
      }
    }

    if (formData.colorVariants.length === 0) {
      newErrors.colorVariants = t('admin.addProduct.errors.colorVariantRequired');
    } else {
      const invalidColors = formData.colorVariants.some(v => !v.value || !v.stock_quantity);
      if (invalidColors) {
        newErrors.colorVariants = t('admin.addProduct.errors.invalidColorVariants');
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: t('admin.addProduct.toast.validationError'),
        description: t('admin.addProduct.toast.fillRequiredFields'),
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
          title: t('admin.addProduct.toast.error'),
          description: t('admin.addProduct.toast.skuExists'),
          variant: "destructive",
        });
        setErrors(prev => ({ ...prev, sku: t('admin.addProduct.errors.skuExists') }));
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
            status: "draft",
            product_description: formData.product_description.trim(),
            product_description_arabic: formData.product_description_arabic.trim(),
          },
        ])
        .select()
        .single();

      if (productError) throw productError;
      if (!productData) throw new Error(t('admin.addProduct.errors.productCreateFailed'));

      // Upload images
      const imagePromises = selectedImages.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productData.id}-${index}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return {
          product_id: productData.id,
          url: publicUrl,
          is_thumbnail: index === 0,
          position: index,
        };
      });

      const imageResults = await Promise.all(imagePromises);

      // Insert image records
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imageResults);

      if (imagesError) throw imagesError;

      // Insert variants
      const variants = [
        ...formData.sizeVariants.map((v, i) => ({
          product_id: productData.id,
          variant_type: 'size' as const,
          variant_value: v.value,
          stock_quantity: v.stock_quantity,
          variant_sku: `${formData.sku}-S${i + 1}`,
        })),
        ...formData.colorVariants.map((v, i) => ({
          product_id: productData.id,
          variant_type: 'color' as const,
          variant_value: v.value,
          stock_quantity: v.stock_quantity,
          variant_sku: `${formData.sku}-C${i + 1}`,
        })),
      ];

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants);

      if (variantsError) throw variantsError;

      toast({
        title: t('admin.addProduct.toast.success'),
        description: t('admin.addProduct.toast.productCreated'),
      });

      onSuccess?.();
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: t('admin.addProduct.toast.error'),
        description: t('admin.addProduct.toast.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
        <h1 className={cn(
          "text-3xl font-bold",
          isArabic && "font-noto-kufi-arabic"
        )}>
          {t('admin.addProduct.title')}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className={cn(isArabic && "font-noto-kufi-arabic")}
          >
            {t('admin.addProduct.buttons.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(isArabic && "font-noto-kufi-arabic")}
          >
            {t('admin.addProduct.buttons.create')}
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <ProductFormFields
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onVariantChange={handleVariantChange}
          onAddVariant={handleAddVariant}
          onRemoveVariant={handleRemoveVariant}
        />

        <div className="p-6">
          <ProductImagesSection
            selectedImages={selectedImages}
            onImagesSelected={(images) => setSelectedImages(images)}
            onRemoveImage={(index) => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
            error={errors.images}
            title={t('admin.addProduct.fields.productImages')}
            uploadButtonText={t('admin.addProduct.buttons.uploadImages')}
          />
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;