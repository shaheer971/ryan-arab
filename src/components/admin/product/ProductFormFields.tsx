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

interface ProductFormFieldsProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleVariantChange: (type: 'size' | 'color', index: number, value: string, field: string) => void;
  handleAddVariant: (type: 'size' | 'color') => void;
  handleRemoveVariant: (type: 'size' | 'color', index: number) => void;
}

export const ProductFormFields = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
  handleVariantChange,
  handleAddVariant,
  handleRemoveVariant
}: ProductFormFieldsProps) => {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name English *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_arabic">Product Name Arabic *</Label>
            <Input
              id="name_arabic"
              name="name_arabic"
              value={formData.name_arabic}
              onChange={handleInputChange}
              className={errors.name_arabic ? "border-red-500" : ""}
              required
              dir="rtl"
            />
            {errors.name_arabic && <p className="text-red-500 text-sm">{errors.name_arabic}</p>}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="product_description">Product Description English</Label>
            <Textarea
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              className={errors.product_description ? "border-red-500" : ""}
              rows={4}
            />
            {errors.product_description && (
              <p className="text-red-500 text-sm">{errors.product_description}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="product_description_arabic">Product Description Arabic</Label>
            <Textarea
              id="product_description_arabic"
              name="product_description_arabic"
              value={formData.product_description_arabic}
              onChange={handleInputChange}
              className={errors.product_description_arabic ? "border-red-500" : ""}
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
          <CardTitle className="text-2xl">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (SAR) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? "border-red-500" : ""}
              required
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="match_at_price">Compare At Price (SAR)</Label>
            <Input
              id="match_at_price"
              name="match_at_price"
              type="number"
              step="0.01"
              value={formData.match_at_price}
              onChange={handleInputChange}
              className={errors.match_at_price ? "border-red-500" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Organization</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
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
                <SelectItem value="sandals">Sandals and Slippers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Inventory</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={errors.sku ? "border-red-500" : ""}
            />
            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Stock Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              className={errors.quantity ? "border-red-500" : ""}
              required
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Product Variants */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Product Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Size Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Sizes</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddVariant('size')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Size
              </Button>
            </div>
            <div className="space-y-4">
              {formData.sizeVariants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Size Number</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g. 42"
                      value={variant.value}
                      onChange={(e) => handleVariantChange('size', index, e.target.value, 'value')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Stock quantity"
                      value={variant.stock_quantity}
                      onChange={(e) => handleVariantChange('size', index, e.target.value, 'stock_quantity')}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label>SKU</Label>
                      <Input
                        placeholder="Variant SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange('size', index, e.target.value, 'sku')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={() => handleRemoveVariant('size', index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Colors</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddVariant('color')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Color
              </Button>
            </div>
            <div className="space-y-4">
              {formData.colorVariants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Color Name</Label>
                    <Input
                      placeholder="e.g. Black"
                      value={variant.value}
                      onChange={(e) => handleVariantChange('color', index, e.target.value, 'value')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Stock quantity"
                      value={variant.stock_quantity}
                      onChange={(e) => handleVariantChange('color', index, e.target.value, 'stock_quantity')}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 space-y-2">
                      <Label>SKU</Label>
                      <Input
                        placeholder="Variant SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange('color', index, e.target.value, 'sku')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={() => handleRemoveVariant('color', index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
