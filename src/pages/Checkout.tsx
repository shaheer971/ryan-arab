import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, MapPin, User, Lock } from "lucide-react";

const Checkout = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the payment
    toast({
      title: "Order Placed Successfully",
      description: "Thank you for your purchase!",
    });
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-gray-100" />
        <div className="absolute inset-0 bg-[url('/patterns/texture.svg')] opacity-[0.15]" />
        <div className="container relative mx-auto px-4">
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent animate-slide-up">
            Checkout
          </h1>
          <p className="text-xl text-gray-600 font-satoshi text-center max-w-2xl mx-auto mb-8 animate-slide-up [animation-delay:200ms]">
            Complete your purchase securely
          </p>
        </div>
      </section>

      {/* Checkout Form Section */}
      <section className="py-8 px-4 relative">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.1]" />
        <div className="container relative mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 card-shadow animate-slide-up [animation-delay:300ms]">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="font-jakarta text-xl font-semibold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-base">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-base">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="font-jakarta text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-base">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-base">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="font-jakarta text-xl font-semibold">Payment Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardNumber" className="text-base">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, cardNumber: e.target.value })
                        }
                        className="h-12 rounded-lg pl-12"
                        required
                      />
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-base">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-base">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      maxLength={4}
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-12 text-base gradient-bg-primary animate-scale">
                Complete Purchase
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;

