import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { registerStudent, VerificationMode } from "@/lib/auth/studentAuthService";

const RegisterStudentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState<VerificationMode>(
    ((import.meta.env.VITE_AUTH_EMAIL_VERIFICATION_MODE as VerificationMode | undefined) || "otp") as VerificationMode,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    institute: "PR Scholar",
  });

  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(formData.fullName.trim() && formData.email.trim() && formData.mobile.trim());
  }, [formData]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await registerStudent({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        institute: formData.institute,
        verificationMode,
      });

      toast({ title: "Verification sent", description: result.message });

      if (verificationMode === "otp") {
        navigate(`/student/verify-email?email=${encodeURIComponent(result.email)}`);
      } else {
        navigate(`/student/verify-email?email=${encodeURIComponent(result.email)}&mode=link`);
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed.");
      toast({ title: "Registration failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Student Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Phone Number *</Label>
                <Input
                  id="mobile"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))}
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institute">Institute</Label>
                <Input
                  id="institute"
                  value={formData.institute}
                  onChange={(e) => setFormData((prev) => ({ ...prev, institute: e.target.value }))}
                  placeholder="PR Scholar"
                />
              </div>

              <div className="space-y-2">
                <Label>Verification Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={verificationMode === "otp" ? "default" : "outline"}
                    onClick={() => setVerificationMode("otp")}
                  >
                    Email OTP
                  </Button>
                  <Button
                    type="button"
                    variant={verificationMode === "link" ? "default" : "outline"}
                    onClick={() => setVerificationMode("link")}
                  >
                    Email Link
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Register & Verify Email
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Already have an account? <a href="/student/login" className="text-royal-blue underline">Login</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegisterStudentPage;
