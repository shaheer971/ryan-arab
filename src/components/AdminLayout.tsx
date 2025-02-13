import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminLayout = ({ mobileMenuOpen, setMobileMenuOpen }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile, setMobileMenuOpen]);

  const menuItems = [
    { icon: LayoutDashboard, label: "dashboard", path: "/admin" },
    { icon: Package, label: "products", path: "/admin/products" },
    { icon: ShoppingCart, label: "orders", path: "/admin/orders" },
    { icon: Users, label: "customers", path: "/admin/customers" },
    { icon: Users, label: "users", path: "/admin/users" },
    { icon: Palette, label: "websiteEditorMenu", path: "/admin/website-editor" },
  ];

  const AdminMenu = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 transition-all duration-300 hover:bg-gray-100",
              isActive && "bg-primary text-white hover:bg-primary/90",
              collapsed && "px-2 justify-center"
            )}
            asChild
            onClick={() => onClose?.()}
          >
            <Link to={item.path}>
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-current" : "text-gray-500"
                )}
              />
              {!collapsed && (
                <span
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-current" : "text-gray-700",
                    isArabic && "font-noto-kufi-arabic"
                  )}
                >
                  {t(`admin.${item.label}`)}
                </span>
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );

  const Sidebar = () => (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? "5rem" : "16rem",
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className={cn(
        "bg-white/80 backdrop-blur-md border-r border-gray-200/50 relative card-shadow h-screen",
        isMobile && "fixed inset-y-0 left-0 z-50"
      )}
    >
      <div className="p-4">
        <motion.h2
          animate={{
            opacity: collapsed ? 0 : 1,
            transition: { duration: 0.2 }
          }}
          className={cn(
            "text-xl font-semibold mb-6 truncate",
            isArabic && "font-noto-kufi-arabic"
          )}
        >
          {t('admin.adminPanel')}
        </motion.h2>
        <AdminMenu />
      </div>
    </motion.aside>
  );

  return (
    <div className="flex min-h-screen">
      {isMobile ? (
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.2 }}
                className="relative z-50"
              >
                <Sidebar />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 -right-12 bg-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      ) : (
        <Sidebar />
      )}
      <main className="flex-1 bg-gray-50/50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;