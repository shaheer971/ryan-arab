import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import NavLinks from "./navigation/NavLinks";
import UserActions from "./navigation/UserActions";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navigation = ({ onAdminMenuClick, isAdmin }: { onAdminMenuClick?: () => void, isAdmin?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {isAdminRoute && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAdminMenuClick}
                className="md:hidden"
              >
                <LayoutDashboard className="h-6 w-6 text-gray-600" />
              </Button>
            )}
            <Link
              to="/"
              className="font-jakarta text-2xl font-bold tracking-tight text-primary hover:text-primary-600 transition-colors"
              onClick={handleMenuClose}
            >
              RYAN ARAB
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks onLinkClick={handleMenuClose} />
            <UserActions />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b shadow-lg overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <NavLinks onLinkClick={handleMenuClose} />
                <div className="pt-4 border-t">
                  <UserActions />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;