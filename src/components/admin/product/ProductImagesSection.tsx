import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ProductImagesSectionProps {
  selectedImages: File[];
  onImagesSelected: (images: File[]) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
  title: string;
  uploadButtonText: string;
}

export const ProductImagesSection = ({
  selectedImages,
  onImagesSelected,
  onRemoveImage,
  error,
  title,
  uploadButtonText
}: ProductImagesSectionProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onImagesSelected(files);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className={cn("text-2xl", isArabic && "font-noto-kufi-arabic")}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              className={cn("flex flex-col items-center gap-2", isArabic && "font-noto-kufi-arabic")}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-6 w-6" />
              <span>{uploadButtonText}</span>
            </Button>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
};
