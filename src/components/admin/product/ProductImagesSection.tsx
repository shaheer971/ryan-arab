import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage, ProductImagesSectionProps } from "../types/product-form";

export const ProductImagesSection = ({
  productId,
  existingImages,
  setExistingImages,
  selectedImages,
  setSelectedImages
}: ProductImagesSectionProps) => {
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const imageToDelete = existingImages.find(img => img.id === imageId);
      if (!imageToDelete) return;

      const filename = imageToDelete.url.split('/').pop();
      if (filename) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([`${productId}/${filename}`]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      setExistingImages(existingImages.filter(img => img.id !== imageId));
      
      toast({
        title: "Image removed",
        description: "Image has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error removing image",
        description: "Could not remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Label>Product Images *</Label>
      <div className="mt-2 space-y-4">
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {existingImages.map((image: ProductImage) => (
              <div key={image.id} className="relative group bg-gray-50 rounded-lg p-2 border border-gray-200">
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-32 object-cover rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className={`w-full flex items-center justify-center py-6 border-2 border-dashed ${
              existingImages.length === 0 && selectedImages.length === 0
                ? "border-red-500 hover:border-red-600"
                : "hover:border-primary/50"
            } transition-colors`}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload New Images
          </Button>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            required={existingImages.length === 0 && selectedImages.length === 0}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((file: File, index: number) => (
              <div key={index} className="relative group bg-gray-50 rounded-lg p-2 border border-gray-200">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {existingImages.length === 0 && selectedImages.length === 0 && (
          <p className="text-red-500 text-sm mt-1">At least one product image is required</p>
        )}
      </div>
    </div>
  );
};
