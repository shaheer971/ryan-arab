import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingSpinner from "./components/ui/loading-spinner";
import EditProductForm from "./components/admin/EditProductForm";
import { supabase } from "./integrations/supabase/client";
import { useAuthStore } from "./store/useAuthStore";

// Lazy load pages with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyLoad = (importFn: () => Promise<any>) => {
  return lazy(() => importFn().catch(error => {
    console.error("Error loading module:", error);
    return { default: () => <div>Error loading page. Please try again.</div> };
  }));
};

// Lazy load pages
const Home = lazyLoad(() => import("./pages/Home"));
const Index = lazyLoad(() => import("./pages/Index"));
const About = lazyLoad(() => import("./pages/About"));
const Contact = lazyLoad(() => import("./pages/Contact"));
const CategoryPage = lazyLoad(() => import("./pages/CategoryPage"));
const Login = lazyLoad(() => import("./pages/Login"));
const Cart = lazyLoad(() => import("./pages/Cart"));
const Checkout = lazyLoad(() => import("./pages/Checkout"));
const Wishlist = lazyLoad(() => import("./pages/Wishlist"));
const ProductPage = lazyLoad(() => import("./pages/ProductPage"));
const AdminLayout = lazyLoad(() => import("./components/AdminLayout"));
const Dashboard = lazyLoad(() => import("./pages/admin/Dashboard"));
const Products = lazyLoad(() => import("./pages/admin/Products"));
const Orders = lazyLoad(() => import("./pages/admin/Orders"));
const Customers = lazyLoad(() => import("./pages/admin/Customers"));
const Users = lazyLoad(() => import("./pages/admin/Users"));
const WebsiteEditor = lazyLoad(() => import("./pages/admin/WebsiteEditor"));
const Settings = lazyLoad(() => import("./pages/admin/Settings"));
const Mens = lazyLoad(() => import("./pages/mens"));
const Womens = lazyLoad(() => import("./pages/womens"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// Simplified preloader that only loads the most critical routes
const RoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    const preloadCriticalRoutes = async () => {
      try {
        if (location.pathname === '/') {
          await Promise.all([
            import("./pages/Home"),
            import("./pages/mens"),
            import("./pages/womens"),
          ]);
        }
      } catch (error) {
        console.error("Error preloading routes:", error);
      }
    };

    preloadCriticalRoutes();
  }, [location]);

  return null;
};

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setUser, isAdmin } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await setUser(session.user);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await setUser(session?.user || null);
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navigation 
              onAdminMenuClick={() => setMobileMenuOpen(true)} 
              isAdmin={isAdmin}
            />
            <RoutePreloader />
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <main className="flex-1 pt-20">
                <Routes>
                  <Route path="/index" element={<Index />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/mens" element={<Mens />} />
                  <Route path="/womens" element={<Womens />} />
                  <Route path="/admin" element={<AdminLayout mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/edit/:productId" element={<EditProductForm />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="users" element={<Users />} />
                    <Route path="website-editor" element={<WebsiteEditor />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </main>
            </Suspense>
            <Footer />
            <Toaster />
            <Sonner />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
