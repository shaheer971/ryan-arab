import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminLayout = ({ mobileMenuOpen, setMobileMenuOpen }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile, setMobileMenuOpen]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Palette, label: "Website Editor", path: "/admin/website-editor" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
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
                    isActive ? "text-current" : "text-gray-700"
                  )}
                >
                  {item.label}
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
      {!isMobile && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute -right-4 top-6 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 z-50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-700" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          )}
        </Button>
      )}

      <div className="p-4">
        <motion.h2
          animate={{
            opacity: collapsed ? 0 : 1,
            transition: { duration: 0.2 }
          }}
          className="font-jakarta text-xl font-bold pt-6 mb-10 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent"
        >
          Admin Panel
        </motion.h2>
        <AdminMenu onClose={() => setMobileMenuOpen(false)} />
      </div>
    </motion.aside>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Show sidebar based on screen size and menu state */}
      {(!isMobile || (isMobile && mobileMenuOpen)) && <Sidebar />}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;