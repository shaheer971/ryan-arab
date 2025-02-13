import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ProductCard from "@/components/ProductCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
  position: number;
}

interface ProductVariant {
  id: string;
  variant_type: string;
  variant_value: string;
  stock_quantity: number;
  variant_sku: string;
}

interface Product {
  id: string;
  name: string;
  name_arabic: string;
  price: number;
  match_at_price: number | null;
  product_type: string;
  collection: string;
  product_description: string;
  product_description_arabic: string;
  status: string;
  slug: string;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

interface FeaturedProduct {
  id: string;
  product_id: string;
  section: 'featured' | 'sale';
  position: number;
  product: Product;
}

const WebsiteEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Fetch all products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          name_arabic,
          price,
          match_at_price,
          product_type,
          collection,
          product_description,
          product_description_arabic,
          status,
          slug,
          product_images (
            id,
            url,
            is_thumbnail,
            position
          ),
          product_variants (
            id,
            variant_type,
            variant_value,
            stock_quantity,
            variant_sku
          )
        `)
        .eq('status', 'published')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return data as Product[];
    }
  });

  // Fetch featured and sale products
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_products')
        .select(`
          id,
          product_id,
          section,
          position,
          product:products (
            id,
            name,
            name_arabic,
            price,
            match_at_price,
            product_type,
            collection,
            product_description,
            product_description_arabic,
            status,
            slug,
            product_images (
              id,
              url,
              is_thumbnail,
              position
            ),
            product_variants (
              id,
              variant_type,
              variant_value,
              stock_quantity,
              variant_sku
            )
          )
        `)
        .order('position');

      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }
      return data as FeaturedProduct[];
    }
  });

  // Add product to featured/sale section
  const addProductMutation = useMutation({
    mutationFn: async ({ productId, section }: { productId: string; section: 'featured' | 'sale' }) => {
      const position = featuredProducts?.filter(fp => fp.section === section).length || 0;
      const { error } = await supabase
        .from('featured_products')
        .insert({
          product_id: productId,
          section,
          position
        });

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['featured-products']);
      toast({
        title: t('admin.websiteEditor.success'),
        description: t('admin.websiteEditor.productAddedSuccess'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.websiteEditor.error'),
        description: t('admin.websiteEditor.productAddError'),
        variant: "destructive",
      });
    }
  });

  // Remove product from featured/sale section
  const removeProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['featured-products']);
      toast({
        title: t('admin.websiteEditor.success'),
        description: t('admin.websiteEditor.productRemovedSuccess'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.websiteEditor.error'),
        description: t('admin.websiteEditor.productRemoveError'),
        variant: "destructive",
      });
    }
  });

  const getFeaturedProducts = () => {
    return featuredProducts?.filter(fp => fp.section === 'featured') || [];
  };

  const getSaleProducts = () => {
    return featuredProducts?.filter(fp => fp.section === 'sale') || [];
  };

  const getAvailableProducts = (section: 'featured' | 'sale') => {
    const sectionProducts = section === 'featured' ? getFeaturedProducts() : getSaleProducts();
    const sectionProductIds = new Set(sectionProducts.map(fp => fp.product_id));
    return products?.filter(p => !sectionProductIds.has(p.id)) || [];
  };

  const handleAddToFeatured = (product: Product) => {
    addProductMutation.mutate({ productId: product.id, section: 'featured' });
  };

  const handleAddToSale = (product: Product) => {
    addProductMutation.mutate({ productId: product.id, section: 'sale' });
  };

  if (isLoadingProducts || isLoadingFeatured) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className={cn("ml-2", isArabic && "font-noto-kufi-arabic")}>
          {t('admin.websiteEditor.loading')}
        </span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className={cn("text-3xl font-bold", isArabic && "font-noto-kufi-arabic")}>
          {t('admin.websiteEditor.title')}
        </h1>
        <p className={cn("text-gray-500 mt-1", isArabic && "font-noto-kufi-arabic")}>
          {t('admin.websiteEditor.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList>
          <TabsTrigger value="featured" className={cn(isArabic && "font-noto-kufi-arabic")}>
            {t('admin.websiteEditor.sections.featuredProducts')}
          </TabsTrigger>
          <TabsTrigger value="sale" className={cn(isArabic && "font-noto-kufi-arabic")}>
            {t('admin.websiteEditor.sections.saleProducts')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.websiteEditor.sections.featuredProducts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFeaturedProducts().map((fp, index) => (
                  <div key={fp.id} className="relative group">
                    <ProductCard
                      id={fp.product.id}
                      name={isArabic ? fp.product.name_arabic : fp.product.name}
                      price={fp.product.price}
                      match_at_price={fp.product.match_at_price}
                      product_images={fp.product.product_images}
                      slug={fp.product.slug}
                      category={fp.product.product_type}
                      hideAddToCart
                      onActionClick={() => removeProductMutation.mutate(fp.id)}
                      actionLabel={t('admin.websiteEditor.removeFromFeatured')}
                      actionVariant="destructive"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className={cn("text-lg font-semibold mb-2", isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.websiteEditor.addProducts')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAvailableProducts('featured').map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        id={product.id}
                        name={isArabic ? product.name_arabic : product.name}
                        price={product.price}
                        match_at_price={product.match_at_price}
                        product_images={product.product_images}
                        slug={product.slug}
                        category={product.product_type}
                        hideAddToCart
                        onActionClick={() => handleAddToFeatured(product)}
                        actionLabel={t('admin.websiteEditor.addToFeatured')}
                        actionVariant="default"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sale">
          <Card>
            <CardHeader>
              <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
                {t('admin.websiteEditor.sections.saleProducts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSaleProducts().map((fp, index) => (
                  <div key={fp.id} className="relative group">
                    <ProductCard
                      id={fp.product.id}
                      name={isArabic ? fp.product.name_arabic : fp.product.name}
                      price={fp.product.price}
                      match_at_price={fp.product.match_at_price}
                      product_images={fp.product.product_images}
                      slug={fp.product.slug}
                      category={fp.product.product_type}
                      hideAddToCart
                      onActionClick={() => removeProductMutation.mutate(fp.id)}
                      actionLabel={t('admin.websiteEditor.removeFromSale')}
                      actionVariant="destructive"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className={cn("text-lg font-semibold mb-2", isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.websiteEditor.addProducts')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAvailableProducts('sale').map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        id={product.id}
                        name={isArabic ? product.name_arabic : product.name}
                        price={product.price}
                        match_at_price={product.match_at_price}
                        product_images={product.product_images}
                        slug={product.slug}
                        category={product.product_type}
                        hideAddToCart
                        onActionClick={() => handleAddToSale(product)}
                        actionLabel={t('admin.websiteEditor.addToSale')}
                        actionVariant="default"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoadingProducts && <LoadingSpinner />}
    </div>
  );
};

export default WebsiteEditor;