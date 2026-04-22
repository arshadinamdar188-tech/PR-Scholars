import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getCurrentSession,
  setInitialPassword,
  syncCurrentUserProfile,
  validatePasswordStrength,
} from "@/lib/auth/studentAuthService";

const CreatePasswordPage = () => {
  const navigate = useNavigate();

  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => validatePasswordStrength(formData.password), [formData.password]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await syncCurrentUserProfile();
        const session = await getCurrentSession();
        if (!mounted) return;

        if (!session?.user) {
          setError("No verified session found. Please verify your email first.");
          setLoadingSession(false);
          return;
        }

        setEmail(session.user.email || "");
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Could not validate verification session.");
        }
      } finally {
        if (mounted) {
          setLoadingSession(false);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    setSubmitting(true);
    try {
      await setInitialPassword(formData.password, formData.confirmPassword);
      toast({ title: "Password created", description: "Your account is now active." });
      navigate("/student/login", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Could not set password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Create Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSession ? (
              <div className="text-sm text-muted-foreground inline-flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Validating verification session...
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Verified email: <strong>{email || "N/A"}</strong></p>

                <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a strong password"
                    />
                    <p className={`text-xs ${passwordStrength.valid ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {passwordStrength.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Re-enter password"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting || loadingSession}>
                    {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Activate Account
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CreatePasswordPage;
