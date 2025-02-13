import { ProductFormData, VariantOption } from "../types/product-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ProductFormFieldsProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onVariantChange: (type: 'size' | 'color', index: number, value: string, field: string) => void;
  onAddVariant: (type: 'size' | 'color') => void;
  onRemoveVariant: (type: 'size' | 'color', index: number) => void;
}

export const ProductFormFields = ({
  formData,
  errors,
  onInputChange,
  onSelectChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant
}: ProductFormFieldsProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="space-y-8 p-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.basicInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.nameEnglish')}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className={cn(errors.name ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_arabic" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.nameArabic')}
            </Label>
            <Input
              id="name_arabic"
              name="name_arabic"
              value={formData.name_arabic}
              onChange={onInputChange}
              className={cn(errors.name_arabic ? "border-red-500" : "", "font-noto-kufi-arabic")}
              required
              dir="rtl"
            />
            {errors.name_arabic && <p className="text-red-500 text-sm">{errors.name_arabic}</p>}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="product_description" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.descriptionEnglish')}
            </Label>
            <Textarea
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={onInputChange}
              className={cn(errors.product_description ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
              rows={4}
            />
            {errors.product_description && (
              <p className="text-red-500 text-sm">{errors.product_description}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="product_description_arabic" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.descriptionArabic')}
            </Label>
            <Textarea
              id="product_description_arabic"
              name="product_description_arabic"
              value={formData.product_description_arabic}
              onChange={onInputChange}
              className={cn(errors.product_description_arabic ? "border-red-500" : "", "font-noto-kufi-arabic")}
              rows={4}
              dir="rtl"
            />
            {errors.product_description_arabic && (
              <p className="text-red-500 text-sm">{errors.product_description_arabic}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.pricing')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.price')}
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={onInputChange}
              className={cn(errors.price ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
              required
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="match_at_price" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.compareAtPrice')}
            </Label>
            <Input
              id="match_at_price"
              name="match_at_price"
              type="number"
              step="0.01"
              value={formData.match_at_price}
              onChange={onInputChange}
              className={cn(errors.match_at_price ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.organization')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="product_type" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.productType')}
            </Label>
            <Select
              name="product_type"
              value={formData.product_type}
              onValueChange={(value) => onSelectChange("product_type", value)}
            >
              <SelectTrigger className={cn(isArabic && "font-noto-kufi-arabic")}>
                <SelectValue placeholder={t('admin.addProduct.placeholders.selectProductType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.productType.men')}
                </SelectItem>
                <SelectItem value="women" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.productType.women')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.collection')}
            </Label>
            <Select
              name="collection"
              value={formData.collection}
              onValueChange={(value) => onSelectChange("collection", value)}
            >
              <SelectTrigger className={cn(isArabic && "font-noto-kufi-arabic")}>
                <SelectValue placeholder={t('admin.addProduct.placeholders.selectCollection')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sneakers" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.collection.sneakers')}
                </SelectItem>
                <SelectItem value="casual" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.collection.casual')}
                </SelectItem>
                <SelectItem value="dress shoes" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.collection.dressShoes')}
                </SelectItem>
                <SelectItem value="sandals" className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.options.collection.sandals')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.inventory')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sku" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.sku')}
            </Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={onInputChange}
              className={cn(errors.sku ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
              required
            />
            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.addProduct.fields.quantity')}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={onInputChange}
              className={cn(errors.quantity ? "border-red-500" : "", isArabic && "font-noto-kufi-arabic")}
              required
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Size Variants */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.sizeVariants')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.sizeVariants.map((variant, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.fields.size')}
                </Label>
                <Input
                  value={variant.value}
                  onChange={(e) => onVariantChange('size', index, e.target.value, 'value')}
                  className={cn(isArabic && "font-noto-kufi-arabic")}
                  placeholder={t('admin.addProduct.placeholders.enterSize')}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.fields.stockQuantity')}
                </Label>
                <Input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) => onVariantChange('size', index, e.target.value, 'stock_quantity')}
                  className={cn(isArabic && "font-noto-kufi-arabic")}
                  placeholder={t('admin.addProduct.placeholders.enterQuantity')}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveVariant('size', index)}
                className="mb-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddVariant('size')}
            className={cn("mt-2", isArabic && "font-noto-kufi-arabic")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.addProduct.buttons.addSize')}
          </Button>
          {errors.sizeVariants && (
            <p className="text-red-500 text-sm mt-2">{errors.sizeVariants}</p>
          )}
        </CardContent>
      </Card>

      {/* Color Variants */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
            {t('admin.addProduct.sections.colorVariants')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.colorVariants.map((variant, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.fields.color')}
                </Label>
                <Input
                  value={variant.value}
                  onChange={(e) => onVariantChange('color', index, e.target.value, 'value')}
                  className={cn(isArabic && "font-noto-kufi-arabic")}
                  placeholder={t('admin.addProduct.placeholders.enterColor')}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.addProduct.fields.stockQuantity')}
                </Label>
                <Input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) => onVariantChange('color', index, e.target.value, 'stock_quantity')}
                  className={cn(isArabic && "font-noto-kufi-arabic")}
                  placeholder={t('admin.addProduct.placeholders.enterQuantity')}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveVariant('color', index)}
                className="mb-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddVariant('color')}
            className={cn("mt-2", isArabic && "font-noto-kufi-arabic")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.addProduct.buttons.addColor')}
          </Button>
          {errors.colorVariants && (
            <p className="text-red-500 text-sm mt-2">{errors.colorVariants}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
