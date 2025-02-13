import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

// Area codes for common countries
const areaCodes = [
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+965", country: "Kuwait" },
  { code: "+973", country: "Bahrain" },
  { code: "+974", country: "Qatar" },
  { code: "+968", country: "Oman" },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [areaCode, setAreaCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setIsAdmin } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const validateSignupForm = () => {
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsMismatch'));
      return false;
    }
    if (password.length < 6) {
      setError(t('auth.errors.passwordTooShort'));
      return false;
    }
    if (!firstName || !lastName) {
      setError(t('auth.errors.requiredFields'));
      return false;
    }
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError(t('auth.errors.invalidPhone'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (isLogin) {
      // Check for admin credentials
      if (email === "captainryanarab@gmail.com" && password === "Itis2025@") {
        setIsAdmin(true);
        toast({
          title: t('auth.toast.adminLoginSuccess'),
          description: t('auth.toast.adminWelcome'),
        });
        navigate("/admin");
        return;
      }
      
      // Handle regular user login here
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (signInData.user) {
        setUser(signInData.user);
        toast({
          title: t('auth.toast.loginSuccess'),
          description: t('auth.toast.welcome'),
        });
        navigate("/");
      }
    } else {
      // Handle signup
      if (!validateSignupForm()) {
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: `${areaCode}${phoneNumber}`,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (signUpData.user) {
        // Save to profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: `${areaCode}${phoneNumber}`,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          setError(profileError.message);
          return;
        }

        setUser(signUpData.user);
        toast({
          title: t('auth.toast.signupSuccess'),
          description: t('auth.toast.signupWelcome'),
        });
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-start justify-center animate-fade-in">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-light/5 -z-10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8 animate-slide-up">
                <h1 className={cn(
                  "font-jakarta text-3xl font-bold text-primary",
                  isArabic && "font-noto-kufi-arabic"
                )}>
                  {isLogin ? t('auth.login.title') : t('auth.signup.title')}
                </h1>
                <p className={cn(
                  "mt-2 text-gray-600 font-satoshi",
                  isArabic && "font-noto-kufi-arabic"
                )}>
                  {isLogin ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription className={cn(isArabic && "font-noto-kufi-arabic")}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up [animation-delay:200ms]">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                        {t('auth.fields.firstName')}
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={cn("h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                        {t('auth.fields.lastName')}
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={cn("h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                    {t('auth.fields.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn("h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                    {t('auth.fields.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                        {t('auth.fields.confirmPassword')}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn("h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className={cn("text-base", isArabic && "font-noto-kufi-arabic")}>
                        {t('auth.fields.phone')}
                      </Label>
                      <div className="flex gap-2">
                        <Select value={areaCode} onValueChange={setAreaCode}>
                          <SelectTrigger className={cn("w-[140px]", isArabic && "font-noto-kufi-arabic")}>
                            <SelectValue placeholder={t('auth.fields.areaCode')} />
                          </SelectTrigger>
                          <SelectContent>
                            {areaCodes.map((ac) => (
                              <SelectItem
                                key={ac.code}
                                value={ac.code}
                                className={cn(isArabic && "font-noto-kufi-arabic")}
                              >
                                {ac.country} ({ac.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={cn("flex-1 h-12 rounded-lg", isArabic && "font-noto-kufi-arabic")}
                          placeholder={t('auth.placeholders.phone')}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className={cn("w-full h-12 text-base", isArabic && "font-noto-kufi-arabic")}
                >
                  {isLogin ? t('auth.buttons.login') : t('auth.buttons.signup')}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className={cn(
                      "text-primary hover:underline",
                      isArabic && "font-noto-kufi-arabic"
                    )}
                  >
                    {isLogin ? t('auth.buttons.createAccount') : t('auth.buttons.haveAccount')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;