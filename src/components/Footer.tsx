import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary to-primary-dark text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="font-jakarta text-2xl font-bold text-white">
              RYAN ARAB
            </Link>
            <p className="text-gray-300 font-satoshi">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-jakarta font-semibold text-lg mb-4 text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 font-satoshi">
              <li>
                <Link to="/men" className="hover:text-white transition-colors">
                  {t('navigation.men')}
                </Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-white transition-colors">
                  {t('navigation.women')}
                </Link>
              </li>
              <li>
                <Link to="/kids" className="hover:text-white transition-colors">
                  {t('navigation.kids')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('navigation.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-jakarta font-semibold text-lg mb-4 text-white">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-2 font-satoshi">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-jakarta font-semibold text-lg mb-4 text-white">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3 font-satoshi">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{t('contact.details.address')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>{t('contact.details.phone')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>{t('contact.details.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {year} Ryan Arab. {t('footer.rights')}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;