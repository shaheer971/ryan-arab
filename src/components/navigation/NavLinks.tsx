import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface NavLinksProps {
  onLinkClick?: () => void;
}

const NavLinks = ({ onLinkClick }: NavLinksProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t('navigation.home') },
    { path: "/mens", label: t('navigation.men') },
    { path: "/womens", label: t('navigation.women') },
    { path: "/about", label: t('navigation.about') },
    { path: "/contact", label: t('navigation.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="relative group px-2 py-1"
          onClick={onLinkClick}
        >
          <span
            className={`font-jakarta text-base font-medium transition-colors ${
              isActive(item.path)
                ? "text-primary"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {item.label}
          </span>
          {isActive(item.path) && (
            <motion.div
              layoutId="activeNav"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
