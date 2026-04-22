import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getCurrentStudentProfile, logoutStudent } from "@/lib/auth/studentAuthService";
import { toast } from "@/hooks/use-toast";

const StudentPortalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getCurrentStudentProfile();
        if (!mounted) return;
        setProfile(data);
      } catch (err: any) {
        if (!mounted) return;
        toast({ title: "Profile load failed", description: err?.message || "Please login again.", variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutStudent();
    navigate("/student/login", { replace: true });
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading student portal...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-royal-blue">Student Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {profile?.full_name || "N/A"}</p>
            <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
            <p><strong>Mobile:</strong> {profile?.mobile || "N/A"}</p>
            <p><strong>Status:</strong> {profile?.status || "N/A"}</p>
            <p><strong>Last Login:</strong> {profile?.last_login_at || "N/A"}</p>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => void handleLogout()}>
          Logout
        </Button>
      </div>
    </section>
  );
};

export default StudentPortalPage;
