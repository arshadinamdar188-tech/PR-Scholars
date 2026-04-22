import { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth/studentAuthService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccessMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err?.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div className="space-y-2">
                <Label htmlFor="email">Registered Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Send Reset Link
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Back to <a href="/student/login" className="text-royal-blue underline">login</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
