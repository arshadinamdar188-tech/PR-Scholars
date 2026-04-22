import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { completeRegistration, previewRegistration } from "@/lib/registration/registrationApi";
import { validatePasswordRules } from "@/lib/registration/passwordRules";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loadingPreview, setLoadingPreview] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registrationInfo, setRegistrationInfo] = useState<{
    firstName: string;
    lastName: string | null;
    email: string;
    username: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      toast({ title: "Invalid link", description: "Registration token is missing.", variant: "destructive" });
      navigate("/padma", { replace: true });
      return;
    }

    let isMounted = true;

    const loadPreview = async () => {
      setLoadingPreview(true);
      try {
        const result = await previewRegistration(token);
        if (isMounted) {
          setRegistrationInfo(result.data);
        }
      } catch (error: any) {
        toast({
          title: "Link invalid",
          description: error?.message || "Could not validate registration link.",
          variant: "destructive",
        });
        navigate("/padma", { replace: true });
      } finally {
        if (isMounted) setLoadingPreview(false);
      }
    };

    loadPreview();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  const passwordValidation = useMemo(() => validatePasswordRules(formData.password), [formData.password]);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    if (!passwordValidation.valid) {
      nextErrors.password = passwordValidation.errors.join(". ");
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await completeRegistration({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast({ title: "Account Created", description: result.message || "Password created successfully." });
      navigate("/padma/auth", { replace: true });
    } catch (error: any) {
      toast({
        title: "Failed to create password",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PadmaLayout>
      <section className="py-24 bg-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card variant="padma">
              <CardHeader>
                <CardTitle className="text-royal-blue flex items-center gap-2">
                  <LockKeyhole className="w-5 h-5" />
                  Create Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingPreview ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Validating registration link...
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl bg-muted/40 border border-border p-3 text-sm">
                      <p><strong>User ID:</strong> {registrationInfo?.username}</p>
                      <p className="text-muted-foreground"><strong>Email:</strong> {registrationInfo?.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          value={formData.password}
                          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                          className={errors.password ? "border-destructive" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className={errors.confirmPassword ? "border-destructive" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                    </div>

                    <Button className="w-full bg-royal-blue hover:bg-royal-blue/90" onClick={handleSubmit} disabled={submitting}>
                      {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Password
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default CreatePassword;
