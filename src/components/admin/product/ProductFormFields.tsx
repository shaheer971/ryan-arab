import { ProductFormData } from "../types/product-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormFieldsProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const ProductFormFields = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange
}: ProductFormFieldsProps) => {
  return (
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
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
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
          {errors.name_arabic && <p className="text-red-500 text-sm mt-1">{errors.name_arabic}</p>}
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
            required
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="match_at_price">Compare At Price</Label>
          <Input
            id="match_at_price"
            name="match_at_price"
            type="number"
            step="0.01"
            value={formData.match_at_price}
            onChange={handleInputChange}
            className={errors.match_at_price ? "border-red-500" : ""}
          />
          {errors.match_at_price && <p className="text-red-500 text-sm mt-1">{errors.match_at_price}</p>}
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

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
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
            className={`resize-none ${errors.product_description ? "border-red-500" : ""}`}
            required
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
            className={`resize-none ${errors.product_description_arabic ? "border-red-500" : ""}`}
            required
            dir="rtl"
          />
          {errors.product_description_arabic && <p className="text-red-500 text-sm mt-1">{errors.product_description_arabic}</p>}
        </div>
      </div>
    </div>
  );
};
