import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const TeachersLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your authentication logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive/5 via-background to-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-olive/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-royal-blue/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <Card className="relative w-full max-w-md border-2 shadow-2xl">
        <CardHeader className="pb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <CardTitle className="text-3xl font-bold text-center">Teachers Portal</CardTitle>
          <CardDescription className="text-center mt-2">
            Sign in to your teaching account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input
                type="email"
                placeholder="teacher@prscholars.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-2 border-border focus:border-olive transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-2 border-border focus:border-olive transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-2 border-border" />
                <span className="text-muted-foreground">Keep me signed in</span>
              </label>
              <a href="#" className="text-olive hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-olive to-gold hover:shadow-lg transition-all h-11 font-semibold"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-background text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Info Notice */}
          <div className="p-4 bg-olive/5 border border-olive/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">First time here?</span> Contact the admin to register your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersLogin;
