import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2, CheckCircle, CreditCard, ArrowLeft, ArrowRight,
  User, Mail, Phone, GraduationCap, Calendar, Award,
  BookOpen, Monitor, MapPin, Building, Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { initiateRegistration } from "@/lib/registration/registrationApi";
import { registerStudent, VerificationMode } from "@/lib/auth/studentAuthService";

interface PadmaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClass?: string;
}

type Step = "details" | "board" | "grade" | "subject" | "mode" | "slot" | "plan" | "payment" | "success";

interface Board { id: string; name: string; code: string; }
interface Grade { id: string; board_id: string; grade_number: number; }
interface Subject { id: string; grade_id: string; name: string; }
interface PricingPlan {
  id: string; grade_id: string; mode: string; plan_type: string;
  plan_label: string; fee_amount: number; savings_percent: string | null;
  payment_frequency: string; days: string | null; timing: string | null;
  duration_period: string | null;
}
interface OfflineLocation { id: string; name: string; address: string; google_maps_url: string | null; }

interface SlotOption {
  days: string;
  timing: string;
  key: string;
}

const basicSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
});

declare global {
  interface Window { Razorpay: any; }
}

const PadmaBookingModal = ({ isOpen, onClose, preselectedClass }: PadmaBookingModalProps) => {
  const navigate = useNavigate();
  const registrationFlowEnabled = String(import.meta.env.VITE_ENABLE_REGISTRATION_FLOW ?? "true").trim().toLowerCase() !== "false";
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");

  // Dynamic data from DB
  const [boards, setBoards] = useState<Board[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allPlansForMode, setAllPlansForMode] = useState<PricingPlan[]>([]);
  const [offlineLocations, setOfflineLocations] = useState<OfflineLocation[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [orderCourseId, setOrderCourseId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    boardId: "",
    boardCode: "",
    gradeId: "",
    gradeNumber: 0,
    subjectId: "",
    subjectName: "",
    mode: "" as "" | "online" | "offline",
    slotKey: "",
    slotDays: "",
    slotTiming: "",
    planId: "",
    planType: "",
    address: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Extract unique slots from plans
  const availableSlots = useMemo<SlotOption[]>(() => {
    const slotMap = new Map<string, SlotOption>();
    allPlansForMode.forEach(p => {
      if (p.days && p.timing) {
        const key = `${p.days}|${p.timing}`;
        if (!slotMap.has(key)) {
          slotMap.set(key, { days: p.days, timing: p.timing, key });
        }
      }
    });
    return Array.from(slotMap.values());
  }, [allPlansForMode]);

  // Filter plans for selected slot
  const filteredPlans = useMemo(() => {
    if (!formData.slotKey) return [];
    const [days, timing] = formData.slotKey.split("|");
    return allPlansForMode.filter(p => p.days === days && p.timing === timing);
  }, [allPlansForMode, formData.slotKey]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setFormData({
        name: "", email: "", phone: "",
        boardId: "", boardCode: "", gradeId: "", gradeNumber: 0,
        subjectId: "", subjectName: "", mode: "",
        slotKey: "", slotDays: "", slotTiming: "",
        planId: "", planType: "",
        address: "", consent: false,
      });
      setErrors({});
      setSuccessEmail("");
      fetchBoards();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !orderCourseId) {
      fetchOrderCourseId();
    }
  }, [isOpen, orderCourseId]);

  useEffect(() => {
    if (formData.boardId) fetchGrades(formData.boardId);
  }, [formData.boardId]);

  useEffect(() => {
    if (formData.gradeId) fetchSubjects(formData.gradeId);
  }, [formData.gradeId]);

  // Fetch ALL plans for grade+mode (we extract slots from them)
  useEffect(() => {
    if (formData.gradeId && formData.mode) {
      fetchPricingPlans(formData.gradeId, formData.mode);
    }
  }, [formData.gradeId, formData.mode]);

  useEffect(() => {
    if (formData.mode === "offline") fetchOfflineLocations();
  }, [formData.mode]);

  // Auto-select slot if only one available
  useEffect(() => {
    if (availableSlots.length === 1) {
      const slot = availableSlots[0];
      setFormData(prev => ({ ...prev, slotKey: slot.key, slotDays: slot.days, slotTiming: slot.timing }));
    }
  }, [availableSlots]);

  const fetchBoards = async () => {
    const { data } = await supabase
      .from("padma_boards")
      .select("id, name, code")
      .eq("is_active", true)
      .order("display_order");
    if (data) setBoards(data);
  };

  const fetchOrderCourseId = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id")
      .eq("institute", "padma")
      .eq("is_active", true)
      .order("display_order")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to resolve Padma course id:", error);
      return "";
    }

    const courseId = data?.id || "";
    setOrderCourseId(courseId);
    return courseId;
  };

  const fetchGrades = async (boardId: string) => {
    setDataLoading(true);
    const { data } = await supabase
      .from("padma_grades")
      .select("id, board_id, grade_number")
      .eq("board_id", boardId)
      .eq("is_active", true)
      .order("display_order");
    if (data) setGrades(data);
    setDataLoading(false);
  };

  const fetchSubjects = async (gradeId: string) => {
    setDataLoading(true);
    const { data } = await supabase
      .from("padma_subjects")
      .select("id, grade_id, name")
      .eq("grade_id", gradeId)
      .eq("is_active", true)
      .order("display_order");
    if (data) setSubjects(data);
    setDataLoading(false);
  };

  const fetchPricingPlans = async (gradeId: string, mode: string) => {
    setDataLoading(true);
    const { data } = await supabase
      .from("padma_pricing_plans")
      .select("*")
      .eq("grade_id", gradeId)
      .eq("mode", mode)
      .eq("is_active", true)
      .order("display_order");
    if (data) setAllPlansForMode(data as PricingPlan[]);
    setDataLoading(false);
  };

  const fetchOfflineLocations = async () => {
    const { data } = await supabase
      .from("padma_offline_locations")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (data) setOfflineLocations(data as OfflineLocation[]);
  };

  const getStepLabels = () => [
    { label: "Details", icon: User },
    { label: "Board", icon: GraduationCap },
    { label: "Grade", icon: BookOpen },
    { label: "Subject", icon: BookOpen },
    { label: "Mode", icon: Monitor },
  ];

  const allSteps: Step[] = ["details", "board", "grade", "subject", "mode"];

  const getCurrentStepIndex = () => allSteps.indexOf(step);

  const validateStep = () => {
    setErrors({});
    if (step === "details") {
      const result = basicSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }
    if (step === "board" && !formData.boardId) {
      toast({ title: "Please select a board", variant: "destructive" });
      return false;
    }
    if (step === "grade" && !formData.gradeId) {
      toast({ title: "Please select a grade", variant: "destructive" });
      return false;
    }
    if (step === "subject" && !formData.subjectId) {
      toast({ title: "Please select a subject", variant: "destructive" });
      return false;
    }
    if (step === "mode" && !formData.mode) {
      toast({ title: "Please select a mode", variant: "destructive" });
      return false;
    }
    if (step === "mode" && formData.mode === "offline") {
      if (!formData.address.trim()) {
        setErrors({ address: "Address is required for offline classes" });
        return false;
      }
      if (!formData.consent) {
        setErrors({ consent: "Please accept the consent" });
        return false;
      }
    }
    if (step === "slot" && !formData.slotKey) {
      toast({ title: "Please select a slot", variant: "destructive" });
      return false;
    }
    if (step === "plan" && !formData.planId) {
      toast({ title: "Please select a plan", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    const stepOrder: Step[] = ["details", "board", "grade", "subject", "mode"];
    const currentIdx = stepOrder.indexOf(step);
    if (currentIdx < stepOrder.length - 1) {
      setStep(stepOrder[currentIdx + 1]);
    } else if (step === "mode") {
      handleSubmitFromMode();
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["details", "board", "grade", "subject", "mode"];
    const currentIdx = stepOrder.indexOf(step);
    if (currentIdx > 0) {
      setStep(stepOrder[currentIdx - 1]);
    }
  };

  const handleSubmitFromMode = async () => {
    if (!registrationFlowEnabled) {
      setSuccessEmail(formData.email);
      setStep("success");
      return;
    }

    setLoading(true);
    try {
      const result = await initiateRegistration({
        fullName: formData.name,
        email: formData.email,
        mobile: formData.phone,
        institute: "padma",
        metadata: {
          boardCode: formData.boardCode,
          gradeNumber: formData.gradeNumber,
          subjectName: formData.subjectName,
          mode: formData.mode,
          offlineAddress: formData.address,
        },
      });

      toast({
        title: "Registration Successful",
        description: result.message || "Please check your email to create password.",
      });

      onClose();
      navigate(result.redirectPath);
    } catch (error: any) {
      const message = String(error?.message || "");
      if (
        /Failed to send a request to the Edge Function|FunctionsFetchError|404/i.test(message)
      ) {
        const verificationMode =
          ((import.meta.env.VITE_AUTH_EMAIL_VERIFICATION_MODE as VerificationMode | undefined) || "otp") as VerificationMode;

        const fallback = await registerStudent({
          fullName: formData.name,
          email: formData.email,
          mobile: formData.phone,
          institute: "padma",
          verificationMode,
        });

        toast({
          title: "Verification sent",
          description: fallback.message,
        });

        onClose();
        if (verificationMode === "otp") {
          navigate(`/student/verify-email?email=${encodeURIComponent(fallback.email)}`);
        } else {
          navigate(`/student/verify-email?email=${encodeURIComponent(fallback.email)}&mode=link`);
        }
        return;
      }

      toast({
        title: "Registration Failed",
        description: error?.message || "Could not complete registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const continueWithLegacyPaymentFlow = async () => {
    if (!allPlansForMode.length) {
      toast({
        title: "No plans available",
        description: "No active pricing plans found for this selection.",
        variant: "destructive",
      });
      return;
    }

    const firstSlot = availableSlots[0];
    const [slotDaysFromKey = "", slotTimingFromKey = ""] = (firstSlot?.key || "").split("|");

    const planPriority = ["platinum", "gold", "regular"];
    const selectedPlan = [...allPlansForMode].sort((a, b) => {
      const aPriority = planPriority.indexOf(a.plan_type);
      const bPriority = planPriority.indexOf(b.plan_type);
      if (aPriority === -1 && bPriority === -1) return 0;
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    })[0];

    const nextFormData = {
      ...formData,
      slotKey: firstSlot?.key || "",
      slotDays: firstSlot?.days || slotDaysFromKey || selectedPlan.days || "",
      slotTiming: firstSlot?.timing || slotTimingFromKey || selectedPlan.timing || "",
      planId: selectedPlan.id,
      planType: selectedPlan.plan_type,
    };

    setFormData(nextFormData);
    await handlePayment(selectedPlan, nextFormData);
  };

  const handlePayment = async (planOverride?: PricingPlan, formDataOverride?: typeof formData) => {
    setLoading(true);
    try {
      if (!window.Razorpay) await loadRazorpayScript();

      const paymentFormData = formDataOverride || formData;
      const selectedPlan = planOverride || filteredPlans.find(p => p.id === paymentFormData.planId);
      if (!selectedPlan) throw new Error("Invalid plan");

      const resolvedCourseId = orderCourseId || await fetchOrderCourseId();
      if (!resolvedCourseId) {
        throw new Error("Course mapping not found. Please contact admin.");
      }

      const amount = selectedPlan.fee_amount;
      const courseTitle = `Grade ${paymentFormData.gradeNumber} ${paymentFormData.subjectName} - ${selectedPlan.plan_label}`;

      const { data, error } = await supabase.functions.invoke("razorpay/create-order", {
        body: {
          courseId: resolvedCourseId,
          customerName: paymentFormData.name,
          customerEmail: paymentFormData.email,
          customerPhone: paymentFormData.phone,
          amount: Math.round(amount * 100) / 100,
          institute: "padma",
          userType: "student",
          metadata: {
            board: paymentFormData.boardCode,
            grade: paymentFormData.gradeNumber,
            subject: paymentFormData.subjectName,
            mode: paymentFormData.mode,
            slot: paymentFormData.slotKey,
            plan: selectedPlan.plan_type,
            planLabel: selectedPlan.plan_label,
          }
        },
      });

      if (error) throw error;

      setStep("payment");

      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Padma Maths Pro",
        description: courseTitle,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          await handlePaymentSuccess(response, data.order.id);
        },
        prefill: {
          name: paymentFormData.name,
          email: paymentFormData.email,
          contact: paymentFormData.phone,
        },
        theme: { color: "#3A6FF8" },
        modal: {
          ondismiss: function () {
            setStep("mode");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({ title: "Error", description: error.message || "Failed to create order", variant: "destructive" });
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      const { error } = await supabase.functions.invoke("razorpay/verify-payment", {
        body: {
          orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        },
      });
      if (error) throw error;
      setSuccessEmail(formData.email);
      setStep("success");
      toast({ title: "Payment Successful!", description: "You have been enrolled successfully." });
    } catch (error: any) {
      toast({ title: "Payment Verification Failed", description: "Please contact support if amount was deducted", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleClose = () => {
    setStep("details");
    setFormData({
      name: "", email: "", phone: "",
      boardId: "", boardCode: "", gradeId: "", gradeNumber: 0,
      subjectId: "", subjectName: "", mode: "",
      slotKey: "", slotDays: "", slotTiming: "",
      planId: "", planType: "",
      address: "", consent: false,
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  const renderProgressIndicator = () => {
    const currentIndex = getCurrentStepIndex();
    const stepLabels = getStepLabels();
    
    return (
      <div className="mb-6 pt-2">
        <div className="relative">
          <div className="absolute left-[5%] right-[5%] top-5 h-1 bg-muted rounded-full" />
          <div 
            className="absolute left-[5%] top-5 h-1 rounded-full transition-all duration-700 ease-out bg-royal-blue"
            style={{ 
              width: `${currentIndex === 0 ? 0 : (currentIndex / (stepLabels.length - 1)) * 90}%`,
              boxShadow: '0 0 12px hsl(var(--royal-blue) / 0.4)'
            }}
          />
          
          <div className="relative flex items-start justify-between px-1">
            {stepLabels.map((stepItem, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={index} className="flex flex-col items-center" style={{ width: `${100 / stepLabels.length}%` }}>
                  <div className="relative transition-all duration-500">
                    <div 
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500",
                        isCompleted && "bg-royal-blue text-white shadow-lg",
                        isCurrent && "bg-royal-blue text-white shadow-xl scale-110 ring-4 ring-royal-blue/30",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-border"
                      )}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                    </div>
                  </div>
                  <span className={cn(
                    "mt-2 text-[10px] font-semibold transition-all duration-500 whitespace-nowrap uppercase tracking-wide",
                    (isCompleted || isCurrent) ? "text-royal-blue" : "text-muted-foreground/60"
                  )}>
                    {stepItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderNavigationButtons = (nextLabel = "Continue", showBack = true) => (
    <div className="flex gap-3 pt-3">
      {showBack && (
        <Button 
          variant="outline" 
          className="flex-1 h-12 rounded-xl border-2 hover:border-royal-blue/50 transition-all" 
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      )}
      <Button 
        className={cn(
          "h-12 rounded-xl bg-royal-blue hover:bg-royal-blue/90 transition-all shadow-lg shadow-royal-blue/25",
          showBack ? "flex-1" : "w-full"
        )}
        onClick={handleNext}
        disabled={loading || dataLoading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {nextLabel} <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderInputField = ({ id, label, icon: Icon, value, onChange, placeholder, error, type = "text", maxLength }: any) => (
    <div className="group">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold mb-2">
        <div className="p-1.5 rounded-lg bg-royal-blue/10">
          <Icon className="w-4 h-4 text-royal-blue" />
        </div>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "h-12 rounded-xl border-2 bg-background/50",
          "focus-visible:border-royal-blue focus-visible:ring-0",
          error ? "border-destructive" : "border-muted hover:border-royal-blue/50"
        )}
      />
      {error && <p className="text-xs text-destructive mt-1.5">⚠️ {error}</p>}
    </div>
  );

  // Plan comparison table
  const renderPlanComparison = () => {
    if (filteredPlans.length < 2) return null;

    const planOrder = ["platinum", "gold", "regular"];
    const sortedPlans = [...filteredPlans].sort(
      (a, b) => planOrder.indexOf(a.plan_type) - planOrder.indexOf(b.plan_type)
    );

    const planColors: Record<string, string> = {
      platinum: "from-royal-blue to-blue-600",
      gold: "from-amber-500 to-yellow-500",
      regular: "from-gray-500 to-gray-600",
    };

    return (
      <div className="mt-6">
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 text-center">
          📊 Plan Comparison
        </h4>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left text-muted-foreground font-medium">Feature</th>
                {sortedPlans.map(plan => (
                  <th key={plan.id} className="p-3 text-center">
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r",
                      planColors[plan.plan_type] || "from-gray-500 to-gray-600"
                    )}>
                      {plan.plan_type === "platinum" ? "⭐ " : ""}{plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-3 text-muted-foreground font-medium">Base Price</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center font-bold text-foreground">
                    ₹{plan.fee_amount.toLocaleString("en-IN")}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border bg-muted/30">
                <td className="p-3 text-muted-foreground font-medium">Payment Type</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center text-foreground capitalize">
                    {plan.payment_frequency.replace("_", " ")}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 text-muted-foreground font-medium">GST (18%)</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center text-muted-foreground">
                    ₹{Math.round(plan.fee_amount * 0.18).toLocaleString("en-IN")}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border bg-muted/30">
                <td className="p-3 text-muted-foreground font-medium">Total Payable</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center font-bold text-royal-blue text-base">
                    ₹{Math.round(plan.fee_amount * 1.18).toLocaleString("en-IN")}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 text-muted-foreground font-medium">Savings</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center">
                    {plan.savings_percent ? (
                      <span className="text-emerald-600 font-bold">{plan.savings_percent}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border bg-muted/30">
                <td className="p-3 text-muted-foreground font-medium">Duration</td>
                {sortedPlans.map(plan => (
                  <td key={plan.id} className="p-3 text-center text-foreground text-xs">
                    {plan.duration_period || "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-royal-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-royal-blue/5 rounded-full blur-3xl" />
          
          <div className="relative p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-royal-blue">
                {step === "success" ? "🎉 Registration Complete!" : "Book Your Course"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground mt-1">
                {step === "details" && "Enter your details to get started"}
                {step === "board" && "Select your educational board"}
                {step === "grade" && "Choose your grade"}
                {step === "subject" && "Select your subject"}
                {step === "mode" && "Choose online or offline classes"}
                {step === "slot" && "Select your preferred class schedule"}
                {step === "plan" && "Select a pricing plan"}
                {step === "payment" && "Complete payment to confirm enrollment"}
                {step === "success" && "Your registration has been confirmed"}
              </DialogDescription>
            </DialogHeader>

            {step !== "success" && step !== "payment" && renderProgressIndicator()}

            {/* Step 1: Details */}
            {step === "details" && (
              <div className="space-y-4">
                {renderInputField({ id: "name", label: "Full Name", icon: User, value: formData.name,
                  onChange: (e: any) => setFormData({ ...formData, name: e.target.value }),
                  placeholder: "Enter student's full name", error: errors.name })}
                {renderInputField({ id: "email", label: "Email", icon: Mail, value: formData.email, type: "email",
                  onChange: (e: any) => setFormData({ ...formData, email: e.target.value }),
                  placeholder: "Enter email address", error: errors.email })}
                {renderInputField({ id: "phone", label: "Phone Number", icon: Phone, value: formData.phone,
                  onChange: (e: any) => setFormData({ ...formData, phone: e.target.value }),
                  placeholder: "10-digit mobile number", error: errors.phone, maxLength: 10 })}
                {renderNavigationButtons("Continue to Board Selection", false)}
              </div>
            )}

            {/* Step 2: Board Selection */}
            {step === "board" && (
              <div className="space-y-5">
                <RadioGroup
                  value={formData.boardId}
                  onValueChange={(value) => {
                    const board = boards.find(b => b.id === value);
                    setFormData({ ...formData, boardId: value, boardCode: board?.code || "", gradeId: "", gradeNumber: 0, subjectId: "", subjectName: "", slotKey: "", slotDays: "", slotTiming: "", planId: "", planType: "" });
                  }}
                  className="grid gap-4"
                >
                  {boards.map((board) => (
                    <div key={board.id}>
                      <RadioGroupItem value={board.id} id={`board-${board.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`board-${board.id}`}
                        className={cn(
                          "group flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300",
                          "hover:border-royal-blue/50 hover:-translate-y-1 hover:shadow-xl",
                          formData.boardId === board.id
                            ? "border-royal-blue bg-royal-blue/10 shadow-xl shadow-royal-blue/20"
                            : "border-muted bg-background/50"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-2xl transition-all shrink-0",
                          formData.boardId === board.id ? "bg-royal-blue shadow-lg" : "bg-muted group-hover:bg-royal-blue/10"
                        )}>
                          <GraduationCap className={cn(
                            "w-8 h-8 transition-colors",
                            formData.boardId === board.id ? "text-white" : "text-muted-foreground group-hover:text-royal-blue"
                          )} />
                        </div>
                        <div>
                          <span className="text-lg font-bold block">{board.name}</span>
                          <span className="text-xs text-muted-foreground">({board.code.toUpperCase()})</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 3: Grade Selection */}
            {step === "grade" && (
              <div className="space-y-5">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
                  </div>
                ) : (
                  <RadioGroup
                    value={formData.gradeId}
                    onValueChange={(value) => {
                      const grade = grades.find(g => g.id === value);
                      setFormData({ ...formData, gradeId: value, gradeNumber: grade?.grade_number || 0, subjectId: "", subjectName: "", slotKey: "", slotDays: "", slotTiming: "", planId: "", planType: "" });
                    }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    {grades.map((grade) => (
                      <div key={grade.id}>
                        <RadioGroupItem value={grade.id} id={`grade-${grade.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`grade-${grade.id}`}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all duration-300",
                            "hover:border-royal-blue/50 hover:-translate-y-1 hover:shadow-lg",
                            formData.gradeId === grade.id
                              ? "border-royal-blue bg-royal-blue/10 shadow-lg"
                              : "border-muted bg-background/50"
                          )}
                        >
                          <span className={cn(
                            "text-2xl font-bold",
                            formData.gradeId === grade.id ? "text-royal-blue" : "text-foreground"
                          )}>
                            {grade.grade_number}
                          </span>
                          <span className="text-xs text-muted-foreground">Grade</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 4: Subject Selection */}
            {step === "subject" && (
              <div className="space-y-5">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
                  </div>
                ) : (
                  <>
                    {formData.gradeNumber === 10 && (
                      <div className="p-3 rounded-xl bg-royal-blue/5 border border-royal-blue/20 text-sm text-muted-foreground">
                        <span className="font-semibold text-royal-blue">({formData.gradeNumber}th Grade)</span> — Choose your Mathematics variant
                      </div>
                    )}
                    <RadioGroup
                      value={formData.subjectId}
                      onValueChange={(value) => {
                        const subject = subjects.find(s => s.id === value);
                        setFormData({ ...formData, subjectId: value, subjectName: subject?.name || "", slotKey: "", slotDays: "", slotTiming: "", planId: "", planType: "" });
                      }}
                      className="grid gap-3"
                    >
                      {subjects.map((subject, idx) => (
                        <div key={subject.id}>
                          <RadioGroupItem value={subject.id} id={`subject-${subject.id}`} className="peer sr-only" />
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300",
                              "hover:border-royal-blue/50 hover:-translate-y-0.5 hover:shadow-lg",
                              formData.subjectId === subject.id
                                ? "border-royal-blue bg-royal-blue/10 shadow-lg"
                                : "border-muted bg-background/50"
                            )}
                          >
                            <BookOpen className={cn(
                              "w-5 h-5 shrink-0",
                              formData.subjectId === subject.id ? "text-royal-blue" : "text-muted-foreground"
                            )} />
                            <div>
                              <span className={cn(
                                "font-medium text-sm",
                                formData.subjectId === subject.id ? "text-royal-blue" : ""
                              )}>
                                {subjects.length > 1 && `(${String.fromCharCode(97 + idx)}) `}{subject.name}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </>
                )}
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 5: Mode Selection */}
            {step === "mode" && (
              <div className="space-y-5">
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(value) => setFormData({ ...formData, mode: value as "online" | "offline", slotKey: "", slotDays: "", slotTiming: "", planId: "", planType: "", address: "", consent: false })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="online" id="mode-online" className="peer sr-only" />
                    <Label
                      htmlFor="mode-online"
                      className={cn(
                        "group flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300",
                        "hover:border-royal-blue/50 hover:-translate-y-1 hover:shadow-xl",
                        formData.mode === "online"
                          ? "border-royal-blue bg-royal-blue/10 shadow-xl"
                          : "border-muted bg-background/50"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl mb-3 transition-all",
                        formData.mode === "online" ? "bg-royal-blue shadow-lg" : "bg-muted group-hover:bg-royal-blue/10"
                      )}>
                        <Monitor className={cn(
                          "w-8 h-8",
                          formData.mode === "online" ? "text-white" : "text-muted-foreground group-hover:text-royal-blue"
                        )} />
                      </div>
                      <span className="text-lg font-bold">Online</span>
                      <span className="text-xs text-muted-foreground mt-1">Learn from anywhere</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="offline" id="mode-offline" className="peer sr-only" />
                    <Label
                      htmlFor="mode-offline"
                      className={cn(
                        "group flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300",
                        "hover:border-royal-blue/50 hover:-translate-y-1 hover:shadow-xl",
                        formData.mode === "offline"
                          ? "border-royal-blue bg-royal-blue/10 shadow-xl"
                          : "border-muted bg-background/50"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl mb-3 transition-all",
                        formData.mode === "offline" ? "bg-royal-blue shadow-lg" : "bg-muted group-hover:bg-royal-blue/10"
                      )}>
                        <Building className={cn(
                          "w-8 h-8",
                          formData.mode === "offline" ? "text-white" : "text-muted-foreground group-hover:text-royal-blue"
                        )} />
                      </div>
                      <span className="text-lg font-bold">Offline</span>
                      <span className="text-xs text-muted-foreground mt-1">In-person classes</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Offline address & consent form */}
                {formData.mode === "offline" && (
                  <div className="space-y-4 p-4 rounded-xl border-2 border-royal-blue/20 bg-royal-blue/5">
                    {offlineLocations.length > 0 && (
                      <div className="p-3 rounded-lg bg-background border border-border">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-royal-blue mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">{offlineLocations[0].name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{offlineLocations[0].address}</p>
                            {offlineLocations[0].google_maps_url && (
                              <a href={offlineLocations[0].google_maps_url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-royal-blue hover:underline mt-1 inline-block">
                                View on Google Maps →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="offline-address" className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <MapPin className="w-4 h-4 text-royal-blue" />
                        Your Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="offline-address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter your full address for offline class coordination"
                        className={cn(
                          "rounded-xl border-2 bg-background/50 transition-all min-h-[80px]",
                          errors.address ? "border-destructive" : "border-muted hover:border-royal-blue/50"
                        )}
                      />
                      {errors.address && <p className="text-xs text-destructive mt-1">⚠️ {errors.address}</p>}
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: !!checked })}
                        className="mt-0.5"
                      />
                      <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        I consent to attend offline classes at the mentioned center and agree to the terms and conditions of Padma Maths Pro.
                      </Label>
                    </div>
                    {errors.consent && <p className="text-xs text-destructive">⚠️ {errors.consent}</p>}
                  </div>
                )}

                {renderNavigationButtons("Submit")}
              </div>
            )}

            {/* Step 6: Slot Selection */}
            {step === "slot" && (
              <div className="space-y-5">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No slots available for this selection.</p>
                    <p className="text-sm text-muted-foreground mt-2">Please contact us at <strong>6361474764</strong></p>
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={formData.slotKey}
                      onValueChange={(value) => {
                        const slot = availableSlots.find(s => s.key === value);
                        setFormData({ ...formData, slotKey: value, slotDays: slot?.days || "", slotTiming: slot?.timing || "", planId: "", planType: "" });
                      }}
                      className="grid gap-3"
                    >
                      {availableSlots.map((slot) => (
                        <div key={slot.key}>
                          <RadioGroupItem value={slot.key} id={`slot-${slot.key}`} className="peer sr-only" />
                          <Label
                            htmlFor={`slot-${slot.key}`}
                            className={cn(
                              "flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300",
                              "hover:border-royal-blue/50 hover:-translate-y-0.5 hover:shadow-lg",
                              formData.slotKey === slot.key
                                ? "border-royal-blue bg-royal-blue/10 shadow-lg"
                                : "border-muted bg-background/50"
                            )}
                          >
                            <div className={cn(
                              "p-2.5 rounded-xl transition-all",
                              formData.slotKey === slot.key ? "bg-royal-blue" : "bg-muted"
                            )}>
                              <Calendar className={cn(
                                "w-6 h-6",
                                formData.slotKey === slot.key ? "text-white" : "text-muted-foreground"
                              )} />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-base">{slot.days}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{slot.timing}</span>
                              </div>
                            </div>
                            {formData.slotKey === slot.key && (
                              <CheckCircle className="w-5 h-5 text-royal-blue" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {availableSlots.length === 1 && (
                      <p className="text-xs text-muted-foreground text-center">Currently one slot available. More slots coming soon!</p>
                    )}
                  </>
                )}
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 7: Plan Selection */}
            {step === "plan" && (
              <div className="space-y-5">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pricing plans available for this selection.</p>
                    <p className="text-sm text-muted-foreground mt-2">Please contact us at <strong>6361474764</strong> for details.</p>
                  </div>
                ) : (
                  <>
                    {/* Schedule info */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-royal-blue" />
                        <span className="font-medium">{formData.slotDays}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">|</span>
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{formData.slotTiming}</span>
                      </div>
                      {filteredPlans[0]?.duration_period && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">|</span>
                          <span className="text-muted-foreground">{filteredPlans[0].duration_period}</span>
                        </div>
                      )}
                    </div>

                    <RadioGroup
                      value={formData.planId}
                      onValueChange={(value) => {
                        const plan = filteredPlans.find(p => p.id === value);
                        setFormData({ ...formData, planId: value, planType: plan?.plan_type || "" });
                      }}
                      className="space-y-3"
                    >
                      {filteredPlans.map((plan) => {
                        const isPlatinum = plan.plan_type === "platinum";
                        return (
                          <div key={plan.id}>
                            <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="peer sr-only" />
                            <Label
                              htmlFor={`plan-${plan.id}`}
                              className={cn(
                                "block rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 relative overflow-hidden",
                                "hover:-translate-y-1 hover:shadow-xl",
                                formData.planId === plan.id
                                  ? "border-royal-blue bg-royal-blue/10 shadow-xl ring-2 ring-royal-blue/30"
                                  : "border-muted bg-background/50 hover:border-royal-blue/50"
                              )}
                            >
                              {isPlatinum && (
                                <div className="absolute -top-0.5 -right-0.5">
                                  <span className="bg-royal-blue text-white text-[10px] px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold uppercase tracking-wider shadow">
                                    ⭐ Best Value
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-lg font-bold">{plan.plan_label}</span>
                                  <p className="text-xs text-muted-foreground capitalize">{plan.payment_frequency.replace("_", " ")} payment</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-royal-blue">₹{plan.fee_amount.toLocaleString("en-IN")}</span>
                                  {plan.savings_percent && (
                                    <p className="text-xs text-emerald-600 font-semibold mt-1">Save {plan.savings_percent}</p>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>

                    {/* Comparison Table */}
                    {renderPlanComparison()}
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-2 hover:border-royal-blue/50 transition-all" 
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-xl bg-royal-blue hover:bg-royal-blue/90 transition-all shadow-lg shadow-royal-blue/25 text-base font-semibold" 
                    onClick={handleNext}
                    disabled={loading || !formData.planId}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                    Proceed to Pay
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Processing */}
            {step === "payment" && (
              <div className="text-center py-12">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full bg-royal-blue/20 animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-royal-blue flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                  </div>
                </div>
                <p className="text-lg font-medium">Processing payment...</p>
                <p className="text-sm text-muted-foreground mt-1">Please complete the payment in the popup window</p>
              </div>
            )}

            {/* Success */}
            {step === "success" && (
              <div className="text-center py-10">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-2xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-3">Congratulations! 🎉</h3>
                <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
                  You have successfully registered for Grade {formData.gradeNumber} {formData.subjectName} ({formData.mode}).
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive your student login credentials on <strong>{successEmail}</strong>
                </p>
                <Button 
                  className="mt-8 h-12 px-8 rounded-xl bg-royal-blue hover:bg-royal-blue/90 shadow-lg" 
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PadmaBookingModal;
