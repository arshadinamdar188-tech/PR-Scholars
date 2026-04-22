import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { resendVerificationCode, verifyEmailOtp } from "@/lib/auth/studentAuthService";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const mode = searchParams.get("mode") || "otp";

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    if (mode === "link") {
      toast({
        title: "Check your inbox",
        description: "Click the verification link in your email. You will be redirected automatically.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmailOtp({ email, otp });
      toast({ title: "Email verified", description: "Now create your password." });
      navigate("/student/create-password");
    } catch (err: any) {
      setError(err?.message || "Verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError("");
    try {
      await resendVerificationCode(email);
      toast({ title: "Code resent", description: "Check your inbox for a new verification email." });
    } catch (err: any) {
      setError(err?.message || "Could not resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Verify Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Verification target: <strong>{email || "N/A"}</strong></p>

            {mode === "link" ? (
              <Alert>
                <AlertDescription>
                  Link verification is enabled. Click the verification link in your email. After verification, you will be redirected to create password.
                </AlertDescription>
              </Alert>
            ) : (
              <form className="space-y-4" onSubmit={(e) => void handleVerify(e)}>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={submitting || otp.length !== 6}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Verify OTP
                </Button>
              </form>
            )}

            <Button type="button" variant="outline" className="w-full" onClick={() => void handleResend()} disabled={resending}>
              {resending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Resend Verification Email
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Back to <a href="/student/register" className="text-royal-blue underline">registration</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VerifyEmailPage;
