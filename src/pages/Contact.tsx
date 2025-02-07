import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section with Gradient Background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-gray-100" />
        <div className="absolute inset-0 bg-grid-black/[0.02]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-jakarta text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent animate-slide-up">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 animate-slide-up [animation-delay:400ms]">
              <div className="bg-white rounded-2xl p-8 card-shadow hover-lift">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-jakarta text-lg font-semibold mb-2">{t('contact.details.title')}</h3>
                      <div className="space-y-2 text-gray-600 font-satoshi">
                        <p>{t('contact.details.address')}</p>
                        <p>{t('contact.details.city')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-jakarta text-lg font-semibold mb-2">{t('contact.details.emailTitle')}</h3>
                      <p className="text-gray-600 font-satoshi">{t('contact.details.email')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-jakarta text-lg font-semibold mb-2">{t('contact.details.phoneTitle')}</h3>
                      <p className="text-gray-600 font-satoshi">{t('contact.details.phone')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-jakarta text-lg font-semibold mb-2">{t('contact.hours.title')}</h3>
                      <div className="space-y-2 text-gray-600 font-satoshi">
                        <p>{t('contact.hours.weekdays')}</p>
                        <p>{t('contact.hours.saturday')}</p>
                        <p>{t('contact.hours.sunday')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slide-up [animation-delay:600ms]">
              <div className="bg-white rounded-2xl p-8 card-shadow hover-lift">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">{t('contact.form.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">{t('contact.form.email')}</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base">{t('contact.form.message')}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-[150px] rounded-lg resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full text-base h-12">
                    {t('contact.form.submit')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
