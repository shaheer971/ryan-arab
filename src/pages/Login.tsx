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

  const validateSignupForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!firstName || !lastName) {
      setError("Please fill in all required fields");
      return false;
    }
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number");
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
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
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
          title: "Login successful",
          description: "Welcome back!",
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
          title: "Account created",
          description: "Welcome to Ryan Arab!",
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
                <h1 className="font-jakarta text-3xl font-bold text-primary">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="mt-2 text-gray-600 font-satoshi">
                  {isLogin
                    ? "Sign in to your account to continue"
                    : "Create a new account to get started"}
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up [animation-delay:200ms]">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-base">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-base">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 rounded-lg"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-lg"
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={areaCode} onValueChange={setAreaCode}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Area Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {areaCodes.map((ac) => (
                            <SelectItem key={ac.code} value={ac.code}>
                              {ac.code} {ac.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 rounded-lg flex-1"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-lg"
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full h-12 text-base bg-primary hover:bg-primary-light animate-scale">
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center animate-slide-up [animation-delay:400ms]">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setEmail("");
                    setPassword("");
                    setFirstName("");
                    setLastName("");
                    setPhoneNumber("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-primary hover:text-primary-light font-satoshi transition-colors"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  updated_at: string;
  created_at: string;
}

export default Login;