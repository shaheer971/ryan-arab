import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const handleSave = () => {
    toast({
      title: t('admin.settingsPage.toast.success'),
      description: t('admin.settingsPage.toast.description'),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-3xl font-bold",
          isArabic && "font-noto-kufi-arabic"
        )}>
          {t('admin.settingsPage.title')}
        </h1>
        <Button 
          onClick={handleSave}
          className={cn(isArabic && "font-noto-kufi-arabic")}
        >
          {t('admin.settingsPage.saveChanges')}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.settingsPage.account.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                className={cn(isArabic && "font-noto-kufi-arabic")}
              >
                {t('admin.settingsPage.account.email')}
              </Label>
              <Input id="email" type="email" defaultValue="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="name"
                className={cn(isArabic && "font-noto-kufi-arabic")}
              >
                {t('admin.settingsPage.account.displayName')}
              </Label>
              <Input id="name" defaultValue="Admin User" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.settingsPage.notifications.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.settingsPage.notifications.emailNotifications.title')}
                </Label>
                <div className={cn(
                  "text-sm text-muted-foreground",
                  isArabic && "font-noto-kufi-arabic"
                )}>
                  {t('admin.settingsPage.notifications.emailNotifications.description')}
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.settingsPage.notifications.orderUpdates.title')}
                </Label>
                <div className={cn(
                  "text-sm text-muted-foreground",
                  isArabic && "font-noto-kufi-arabic"
                )}>
                  {t('admin.settingsPage.notifications.orderUpdates.description')}
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.settingsPage.security.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="currentPassword"
                className={cn(isArabic && "font-noto-kufi-arabic")}
              >
                {t('admin.settingsPage.security.currentPassword')}
              </Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="newPassword"
                className={cn(isArabic && "font-noto-kufi-arabic")}
              >
                {t('admin.settingsPage.security.newPassword')}
              </Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword"
                className={cn(isArabic && "font-noto-kufi-arabic")}
              >
                {t('admin.settingsPage.security.confirmPassword')}
              </Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn(isArabic && "font-noto-kufi-arabic")}>
              {t('admin.settingsPage.preferences.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={cn(isArabic && "font-noto-kufi-arabic")}>
                  {t('admin.settingsPage.preferences.darkMode.title')}
                </Label>
                <div className={cn(
                  "text-sm text-muted-foreground",
                  isArabic && "font-noto-kufi-arabic"
                )}>
                  {t('admin.settingsPage.preferences.darkMode.description')}
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;