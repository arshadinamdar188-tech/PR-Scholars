import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { updatePasswordFromRecovery, validatePasswordStrength } from "@/lib/auth/studentAuthService";
import { toast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => validatePasswordStrength(formData.password), [formData.password]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updatePasswordFromRecovery(formData.password, formData.confirmPassword);
      toast({ title: "Password updated", description: "You can now login with your new password." });
      navigate("/student/login", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div className="space-y-2">
                <Label htmlFor="password">New Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                />
                <p className={`text-xs ${passwordStrength.valid ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {passwordStrength.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
