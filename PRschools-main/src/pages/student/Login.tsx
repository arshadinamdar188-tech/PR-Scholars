import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { loginWithEmailPassword } from "@/lib/auth/studentAuthService";

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location?.state?.from || "/student/portal";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmailPassword(formData.email, formData.password);
      toast({ title: "Login successful", description: "Welcome back." });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Student Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
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
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>

              <div className="text-right">
                <a href="/student/forgot-password" className="text-sm text-royal-blue underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Login
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                New student? <a href="/student/register" className="text-royal-blue underline">Create account</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StudentLoginPage;
