import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { GraduationCap, UserCheck, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "student" | "teacher" | "admin";

// Admin still uses hardcoded credentials. Teacher login is now DB-backed.
const staffCredentials: Record<"admin", { username: string; password: string }> = {
  admin: { username: "Admin", password: "password1" },
};

const PadmaAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    const fieldErrors: Record<string, string> = {};
    if (!formData.username.trim()) fieldErrors.username = "Username is required";
    if (!formData.password.trim()) fieldErrors.password = "Password is required";
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // ── Student: check padma_students table with tenure validation ──
    if (activeTab === "student") {
      const { data, error } = await supabase
        .from("padma_students")
        .select("id, name, access_code, access_start_date, access_end_date, is_active")
        .ilike("name", formData.username.trim())
        .eq("access_code", formData.password.trim())
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid name or access code. Contact your admin.",
          variant: "destructive",
        });
        return;
      }

      if (!data.is_active) {
        setLoading(false);
        toast({
          title: "Access Disabled",
          description: "Your account has been disabled. Contact your admin.",
          variant: "destructive",
        });
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(data.access_start_date);
      const end = new Date(data.access_end_date);

      if (today < start) {
        setLoading(false);
        toast({
          title: "Access Not Started",
          description: `Your access begins on ${data.access_start_date}. Contact admin.`,
          variant: "destructive",
        });
        return;
      }

      if (today > end) {
        setLoading(false);
        toast({
          title: "Access Expired",
          description: `Your access expired on ${data.access_end_date}. Please renew with admin.`,
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Login Successful", description: `Welcome, ${data.name}!` });
      window.sessionStorage.setItem("padmaStudentName", data.name);
      setLoading(false);
      navigate("/padma/student-portal", { state: { studentName: data.name } });
      return;
    }

    if (activeTab === "teacher") {
      // Supabase codegen types are not regenerated yet for the new table,
      // so this query is intentionally typed as any for compatibility.
      const teacherQuery = (supabase as any)
        .from("padma_teachers")
        .select("id, username, display_name, password, is_active")
        .ilike("username", formData.username.trim())
        .eq("password", formData.password)
        .eq("is_active", true)
        .maybeSingle();

      const { data: teacherData, error: teacherError } = await teacherQuery;

      if (!teacherError && teacherData) {
        const displayName = teacherData.display_name || teacherData.username;
        window.sessionStorage.setItem("padmaTeacherId", teacherData.id);
        window.sessionStorage.setItem("padmaTeacherName", displayName);
        setLoading(false);
        toast({ title: "Login Successful", description: `Welcome ${displayName}!` });
        navigate("/padma/teacher-portal", { state: { teacherName: displayName } });
        return;
      }

      // Fallback for old deployments until migration is applied everywhere.
      const isLegacyTeacher =
        formData.username.trim().toLowerCase() === "teacher" &&
        formData.password === "password1";

      if (!isLegacyTeacher) {
        setLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid teacher username or password.",
          variant: "destructive",
        });
        return;
      }

      window.sessionStorage.setItem("padmaTeacherName", "Teacher");
      window.sessionStorage.removeItem("padmaTeacherId");
      setLoading(false);
      toast({ title: "Login Successful", description: "Welcome Teacher!" });
      navigate("/padma/teacher-portal", { state: { teacherName: "Teacher" } });
      return;
    }

    // ── Admin: hardcoded credentials ──
    const roleCredentials = staffCredentials.admin;
    const isValidUser = formData.username.trim().toLowerCase() === roleCredentials.username.toLowerCase();
    const isValidPassword = formData.password === roleCredentials.password;

    if (!isValidUser || !isValidPassword) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Login Successful", description: `Welcome ${roleCredentials.username}!` });

    setLoading(false);
    navigate("/admin/courses");
  };

  const renderAuthForm = (userType: string) => (
    <Card variant="padma">
      <CardHeader>
        <CardTitle className="text-royal-blue">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${userType}-username`}>Username</Label>
          <Input
            id={`${userType}-username`}
            placeholder={`Enter ${userType} username`}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={errors.username ? "border-destructive" : ""}
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
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
        <Button variant="padma" className="w-full" onClick={() => void handleLogin()} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Login
        </Button>
        <p className="text-center text-sm text-muted-foreground">Use username and password as provided by admin</p>
      </CardContent>
    </Card>
  );

  return (
    <PadmaLayout>
      <section className="py-24 bg-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-royal-blue mb-2">
                Welcome to Padma Maths Pro
              </h1>
              <p className="text-muted-foreground">Access your learning portal</p>
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
    </PadmaLayout>
  );
};

export default PadmaAuth;