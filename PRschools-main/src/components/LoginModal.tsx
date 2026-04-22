import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Users, BookOpen, Shield, Settings, CreditCard, BarChart3, ArrowRight } from "lucide-react";
import padmaLogo from "@/assets/padma-logo.png";
import racademyLogo from "@/assets/racademy-logo.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginStep = "main" | "students" | "admin";

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("main");

  const handleStudentPortalSelect = (portal: string) => {
    onClose();
    if (portal === "padma") {
      navigate("/padma/login");
    } else if (portal === "racademy") {
      navigate("/racademy/login");
    }
  };

  const handleTeacherLogin = () => {
    onClose();
    // Route to teacher portal - can be enhanced later
    navigate("/teachers/login");
  };

  const handleAdminSubOption = (option: string) => {
    onClose();
    switch (option) {
      case "cms":
        navigate("/admin");
        break;
      case "fee":
        navigate("/admin");
        break;
      case "mock":
        navigate("/admin");
        break;
      default:
        navigate("/admin");
    }
  };

  const handleBack = () => {
    setStep("main");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        {step === "main" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Welcome to PRScholars</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Select your portal to login
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-6">
              {/* Students Portal */}
              <Button
                onClick={() => setStep("students")}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-royal-blue hover:bg-royal-blue/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-royal-blue/10 rounded-lg">
                      <Users className="w-5 h-5 text-royal-blue" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Students Portal</p>
                      <p className="text-xs text-muted-foreground">Access courses and learning materials</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>

              {/* Teachers Portal */}
              <Button
                onClick={handleTeacherLogin}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-olive hover:bg-olive/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-olive/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-olive" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Teachers Portal</p>
                    <p className="text-xs text-muted-foreground">Manage classes and track performance</p>
                  </div>
                </div>
              </Button>

              {/* Admins Panel */}
              <Button
                onClick={() => setStep("admin")}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-red-600 hover:bg-red-50/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100/30 rounded-lg">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Admins Panel</p>
                      <p className="text-xs text-muted-foreground">Access admin management tools</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </div>
          </>
        ) : step === "students" ? (
          <>
            <DialogHeader>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <DialogTitle className="text-2xl font-bold text-center">Students Portal</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Select your institute to login
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-6">
              {/* Padma Maths Pro */}
              <Button
                onClick={() => handleStudentPortalSelect("padma")}
                variant="outline"
                className="w-full h-auto py-4 flex items-center gap-4 border-2 hover:border-[#1B2A4E] hover:bg-[#1B2A4E]/5 transition-all"
              >
                <img src={padmaLogo} alt="Padma" className="w-10 h-10 rounded-lg object-cover" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">Padma Maths Pro</p>
                  <p className="text-xs text-muted-foreground">Mathematics Excellence Coaching</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>

              {/* R's Academy */}
              <Button
                onClick={() => handleStudentPortalSelect("racademy")}
                variant="outline"
                className="w-full h-auto py-4 flex items-center gap-4 border-2 hover:border-[#8B0000] hover:bg-red-50/5 transition-all"
              >
                <img src={racademyLogo} alt="R's Academy" className="w-10 h-10 rounded-lg object-cover" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">R's Academy</p>
                  <p className="text-xs text-muted-foreground">Defence Career Preparation</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <DialogTitle className="text-2xl font-bold text-center">Admins Panel</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Select the management system you need
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-6">
              {/* CMS */}
              <Button
                onClick={() => handleAdminSubOption("cms")}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-blue-600 hover:bg-blue-50/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/30 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">CMS</p>
                      <p className="text-xs text-muted-foreground">Content Management System</p>
                    </div>
                  </div>
                </div>
              </Button>

              {/* Fee & Payment Management */}
              <Button
                onClick={() => handleAdminSubOption("fee")}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-green-600 hover:bg-green-50/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100/30 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Fee & Payment Management</p>
                      <p className="text-xs text-muted-foreground">Manage fees and payments</p>
                    </div>
                  </div>
                </div>
              </Button>

              {/* Mock Test & Results System */}
              <Button
                onClick={() => handleAdminSubOption("mock")}
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-start gap-2 border-2 hover:border-purple-600 hover:bg-purple-50/5 transition-all"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100/30 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Mock Test & Results</p>
                      <p className="text-xs text-muted-foreground">Manage tests and analyze results</p>
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
