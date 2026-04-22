import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { GraduationCap, UserCheck, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RAcademyAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email: formData.email, password: formData.password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({ title: "Login Successful", description: "Welcome back!" });
      
      // Check user role for admin
      if (activeTab === "admin") {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .single();
        
        if (!roleData) {
          await supabase.auth.signOut();
          toast({ title: "Access Denied", description: "You are not an admin", variant: "destructive" });
          return;
        }
        navigate("/admin/courses");
      } else {
        navigate("/racademy");
      }
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/racademy`,
          data: {
            full_name: formData.name,
            phone: formData.phone,
            user_type: activeTab,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account",
      });
      setIsLogin(true);
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = (userType: string) => (
    <Card variant="racademy">
      <CardHeader>
        <CardTitle className="text-olive">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLogin ? (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-email`}>Email</Label>
              <Input
                id={`${userType}-email`}
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-password`}>Password</Label>
              <div className="relative">
                <Input
                  id={`${userType}-password`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? "border-destructive" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button variant="racademy" className="w-full" onClick={handleLogin} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Login
            </Button>
            {userType !== "admin" && (
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-olive hover:underline">
                  Register
                </button>
              </p>
            )}
            {userType === "teacher" && (
              <p className="text-center text-sm text-muted-foreground">Contact admin for account setup</p>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-name`}>Full Name</Label>
              <Input
                id={`${userType}-name`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-reg-email`}>Email</Label>
              <Input
                id={`${userType}-reg-email`}
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-phone`}>Phone Number</Label>
              <Input
                id={`${userType}-phone`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength={10}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${userType}-reg-password`}>Password</Label>
              <div className="relative">
                <Input
                  id={`${userType}-reg-password`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? "border-destructive" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button variant="racademy" className="w-full" onClick={handleRegister} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-olive hover:underline">
                Login
              </button>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <RAcademyLayout>
      <section className="py-24 bg-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-olive mb-2">
                Welcome to Colonel R's Academy
              </h1>
              <p className="text-muted-foreground">Access your training portal</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">{renderAuthForm("student")}</TabsContent>
              <TabsContent value="teacher">{renderAuthForm("teacher")}</TabsContent>
              <TabsContent value="admin">{renderAuthForm("admin")}</TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </RAcademyLayout>
  );
};

export default RAcademyAuth;