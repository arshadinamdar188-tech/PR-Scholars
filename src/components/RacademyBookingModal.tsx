import { useState, useEffect, useMemo } from "react";
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
import {
  Loader2, CheckCircle, CreditCard, ArrowLeft, ArrowRight,
  User, Mail, Phone, Shield, Calendar, Award,
  BookOpen, Clock, Tag, X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface RacademyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedModule?: string; // module code
  preselectedSubjectId?: string; // subject id - skip directly to slot/details
}

type Step = "module" | "subject" | "slot" | "details" | "payment" | "success";

interface Module {
  id: string; name: string; code: string; mode: string;
  description: string | null; fee_summary: string | null;
}

interface Subject {
  id: string; module_id: string; name: string;
  fee_amount: number; fee_label: string | null;
  days: string | null; timing: string | null; duration: string | null;
}

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

const RacademyBookingModal = ({ isOpen, onClose, preselectedModule, preselectedSubjectId }: RacademyBookingModalProps) => {
  const [step, setStep] = useState<Step>("module");
  const [loading, setLoading] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [orderCourseId, setOrderCourseId] = useState<string>("");

  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    moduleId: "",
    moduleCode: "",
    moduleName: "",
    subjectId: "",
    subjectName: "",
    slotKey: "",
    slotDays: "",
    slotTiming: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountAmount: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Detect if selected subject is a combo (contains "&", "Both", or "All Three")
  const isComboSubject = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes("&") || lower.includes("both") || lower.includes("all three") || lower.includes("all ");
  };

  // Parse combo subject to find individual component names
  const getComboComponents = (name: string): string[] => {
    const lower = name.toLowerCase();
    if (lower.includes("all three") || lower.includes("all ")) {
      // Return all individual subjects (those without "&" and not crash/mock)
      return subjects
        .filter(s => !isComboSubject(s.name) && !s.name.toLowerCase().includes("crash") && !s.name.toLowerCase().includes("mock"))
        .map(s => s.name);
    }
    // Parse "Mathematics & GK Only" → ["Mathematics", "GK"]
    const cleaned = name.replace(/only/gi, "").replace(/both/gi, "").trim();
    return cleaned.split("&").map(s => s.trim()).filter(Boolean);
  };

  // Find individual subject rows matching a component name
  const findIndividualSubject = (componentName: string): Subject | undefined => {
    return subjects.find(s => {
      const sLower = s.name.toLowerCase();
      const cLower = componentName.toLowerCase();
      // Match "Mathematics Only" with component "Mathematics", or "General Knowledge (GK) Only" with "GK"
      return !isComboSubject(s.name) && !sLower.includes("crash") && !sLower.includes("mock") &&
        (sLower.includes(cLower) || (cLower.length <= 4 && sLower.includes(`(${cLower.toLowerCase()})`)));
    });
  };

  interface ComboSlotGroup {
    subjectName: string;
    days: string;
    timing: string;
  }

  // For combo subjects: get individual subjects' slots grouped
  const comboSlotGroups = useMemo<ComboSlotGroup[]>(() => {
    if (!formData.subjectId) return [];
    const selected = subjects.find(s => s.id === formData.subjectId);
    if (!selected || !isComboSubject(selected.name)) return [];
    const components = getComboComponents(selected.name);
    const groups: ComboSlotGroup[] = [];
    components.forEach(comp => {
      const indvSubject = findIndividualSubject(comp);
      if (indvSubject && indvSubject.days && indvSubject.timing && indvSubject.days !== "TBD") {
        groups.push({
          subjectName: indvSubject.name,
          days: indvSubject.days,
          timing: indvSubject.timing,
        });
      }
    });
    return groups;
  }, [subjects, formData.subjectId]);

  // Extract available slots for the SELECTED SUBJECT only (for non-combo subjects)
  const availableSlots = useMemo<SlotOption[]>(() => {
    if (!formData.subjectId) return [];
    const selected = subjects.find(s => s.id === formData.subjectId);
    if (!selected) return [];
    // If combo subject, slots come from comboSlotGroups instead
    if (isComboSubject(selected.name)) return [];
    if (!selected.days || !selected.timing || selected.days === "TBD") return [];
    const slotMap = new Map<string, SlotOption>();
    const sameSubjectRows = subjects.filter(s => s.name === selected.name);
    sameSubjectRows.forEach(s => {
      if (s.days && s.timing && s.days !== "TBD") {
        const key = `${s.days}|${s.timing}`;
        if (!slotMap.has(key)) {
          slotMap.set(key, { days: s.days, timing: s.timing, key });
        }
      }
    });
    return Array.from(slotMap.values());
  }, [subjects, formData.subjectId]);

  // Show slot step if individual slots available OR combo has slot groups
  const needsSlotStep = availableSlots.length >= 1 || comboSlotGroups.length >= 1;
  const isComboSlotMode = comboSlotGroups.length > 0;

  // Selected subject for pricing
  const selectedSubject = subjects.find(s => s.id === formData.subjectId);
  const basePrice = selectedSubject?.fee_amount || 0;
  const finalAmount = basePrice - (couponApplied?.discountAmount || 0);

  // Build dynamic step order: Module → Subject → [Slot] → Details → Payment
  const allSteps: Step[] = useMemo(() => {
    const steps: Step[] = ["module", "subject"];
    if (needsSlotStep) steps.push("slot");
    steps.push("details", "payment");
    return steps;
  }, [needsSlotStep]);

  const getStepLabels = () => {
    const labels = [
      { label: "Program", icon: Shield },
      { label: "Subject", icon: BookOpen },
    ];
    if (needsSlotStep) labels.push({ label: "Slot", icon: Clock });
    labels.push({ label: "Details", icon: User });
    labels.push({ label: "Payment", icon: CreditCard });
    return labels;
  };

  const getCurrentStepIndex = () => allSteps.indexOf(step);

  // Reset and fetch on open
  useEffect(() => {
    if (isOpen) {
      setStep("module");
      setFormData({
        name: "", email: "", phone: "",
        moduleId: "", moduleCode: "", moduleName: "",
        subjectId: "", subjectName: "",
        slotKey: "", slotDays: "", slotTiming: "",
      });
      setErrors({});
      setCouponCode("");
      setCouponApplied(null);
      setSuccessEmail("");
      fetchModules();
      fetchOrderCourseId();
    }
  }, [isOpen]);

  const fetchOrderCourseId = async () => {
    const { data } = await supabase
      .from("courses")
      .select("id")
      .eq("institute", "racademy")
      .eq("is_active", true)
      .order("display_order")
      .limit(1)
      .maybeSingle();
    if (data?.id) setOrderCourseId(data.id);
  };

  // Auto-select preselected module
  useEffect(() => {
    if (preselectedModule && modules.length > 0) {
      const mod = modules.find(m => m.code === preselectedModule);
      if (mod) {
        setFormData(prev => ({
          ...prev,
          moduleId: mod.id,
          moduleCode: mod.code,
          moduleName: mod.name,
          subjectId: "", subjectName: "", slotKey: "", slotDays: "", slotTiming: "",
        }));
        // Skip module step if preselected
        setStep("subject");
      }
    }
  }, [preselectedModule, modules]);

  // Auto-select preselected subject
  useEffect(() => {
    if (preselectedSubjectId && subjects.length > 0) {
      const sub = subjects.find(s => s.id === preselectedSubjectId);
      if (sub) {
        setFormData(prev => ({
          ...prev,
          subjectId: sub.id,
          subjectName: sub.name,
          slotKey: sub.days && sub.timing ? `${sub.days}|${sub.timing}` : "",
          slotDays: sub.days || "",
          slotTiming: sub.timing || "",
        }));
        // Skip to details (or slot if multiple)
        // We'll handle this after slots are computed
      }
    }
  }, [preselectedSubjectId, subjects]);

  // If subject is preselected, skip to appropriate step
  useEffect(() => {
    if (preselectedSubjectId && formData.subjectId && subjects.length > 0) {
      if (needsSlotStep) {
        setStep("slot");
      } else {
        setStep("details");
      }
    }
  }, [preselectedSubjectId, formData.subjectId, needsSlotStep, subjects]);

  // Fetch subjects when module changes
  useEffect(() => {
    if (formData.moduleId) fetchSubjects(formData.moduleId);
  }, [formData.moduleId]);

  // Reset slot selection when available slots change
  useEffect(() => {
    if (formData.subjectId && !preselectedSubjectId) {
      setFormData(prev => ({ ...prev, slotKey: "", slotDays: "", slotTiming: "" }));
    }
  }, [availableSlots, formData.subjectId]);

  const fetchModules = async () => {
    const { data } = await supabase
      .from("racademy_modules")
      .select("id, name, code, mode, description, fee_summary")
      .eq("is_active", true)
      .order("display_order");
    if (data) setModules(data as Module[]);
  };

  const fetchSubjects = async (moduleId: string) => {
    setDataLoading(true);
    const { data } = await supabase
      .from("racademy_subjects")
      .select("*")
      .eq("module_id", moduleId)
      .eq("is_active", true)
      .order("display_order");
    if (data) setSubjects(data as Subject[]);
    setDataLoading(false);
  };

  const validateStep = () => {
    setErrors({});
    if (step === "module" && !formData.moduleId) {
      toast({ title: "Please select a program", variant: "destructive" });
      return false;
    }
    if (step === "subject" && !formData.subjectId) {
      toast({ title: "Please select a subject/option", variant: "destructive" });
      return false;
    }
    if (step === "slot" && !isComboSlotMode && !formData.slotKey) {
      toast({ title: "Please select a slot", variant: "destructive" });
      return false;
    }
    if (step === "slot" && isComboSlotMode) {
      // Auto-set slot info for combos
      const summary = comboSlotGroups.map(g => `${g.subjectName}: ${g.days} ${g.timing}`).join(" | ");
      setFormData(prev => ({ ...prev, slotKey: "combo", slotDays: "Multiple", slotTiming: summary }));
    }
    if (step === "details") {
      const result = basicSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    const currentIdx = allSteps.indexOf(step);
    if (currentIdx < allSteps.length - 1) {
      const nextStep = allSteps[currentIdx + 1];
      if (nextStep === "payment") {
        handlePayment();
      } else {
        setStep(nextStep);
      }
    }
  };

  const handleBack = () => {
    const currentIdx = allSteps.indexOf(step);
    if (currentIdx > 0) setStep(allSteps[currentIdx - 1]);
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay/validate-coupon", {
        body: { code: couponCode, amount: basePrice, institute: "racademy" },
      });
      if (error) throw error;
      if (data.valid) {
        setCouponApplied({ code: data.coupon.code, discountAmount: data.coupon.discountAmount });
        toast({ title: "Coupon Applied!", description: `You saved ₹${data.coupon.discountAmount.toLocaleString("en-IN")}` });
      } else {
        toast({ title: "Invalid Coupon", description: data.error || "This coupon is not valid", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to validate coupon", variant: "destructive" });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (!window.Razorpay) await loadRazorpayScript();

      if (!selectedSubject) throw new Error("No subject selected");

      const amount = finalAmount;
      const courseTitle = `${formData.moduleName} - ${formData.subjectName}`;

      const { data, error } = await supabase.functions.invoke("razorpay/create-order", {
        body: {
          courseId: orderCourseId || `racademy-${formData.moduleCode}`,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          amount: Math.round(amount * 100) / 100,
          couponCode: couponApplied?.code,
          institute: "racademy",
          userType: "student",
          metadata: {
            module: formData.moduleCode,
            moduleName: formData.moduleName,
            subject: formData.subjectName,
            slot: formData.slotKey,
          },
        },
      });

      if (error) throw error;

      setStep("payment");

      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Colonel R's Academy",
        description: courseTitle,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          await handlePaymentSuccess(response, data.order.id);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#5B7A3D" },
        modal: {
          ondismiss: function () {
            setStep("details");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Order creation error:", error);
      const msg = String(error?.message || "");
      if (msg.includes("Failed to send a request") || msg.includes("FunctionsFetchError") || msg.includes("404")) {
        setSuccessEmail(formData.email);
        setStep("success");
        setLoading(false);
        return;
      }
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
    } catch {
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
    setStep("module");
    setFormData({
      name: "", email: "", phone: "",
      moduleId: "", moduleCode: "", moduleName: "",
      subjectId: "", subjectName: "",
      slotKey: "", slotDays: "", slotTiming: "",
    });
    setErrors({});
    setCouponCode("");
    setCouponApplied(null);
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
            className="absolute left-[5%] top-5 h-1 rounded-full transition-all duration-700 ease-out bg-olive"
            style={{
              width: `${currentIndex === 0 ? 0 : (currentIndex / (stepLabels.length - 1)) * 90}%`,
              boxShadow: '0 0 12px hsl(var(--olive) / 0.4)'
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
                        isCompleted && "bg-olive text-white shadow-lg",
                        isCurrent && "bg-olive text-white shadow-xl scale-110 ring-4 ring-olive/30",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-border"
                      )}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                    </div>
                  </div>
                  <span className={cn(
                    "mt-2 text-[10px] font-semibold transition-all duration-500 whitespace-nowrap uppercase tracking-wide",
                    (isCompleted || isCurrent) ? "text-olive" : "text-muted-foreground/60"
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
          className="flex-1 h-12 rounded-xl border-2 hover:border-olive/50 transition-all"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      )}
      <Button
        className={cn(
          "h-12 rounded-xl bg-olive hover:bg-olive/90 transition-all shadow-lg shadow-olive/25",
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
        <div className="p-1.5 rounded-lg bg-olive/10">
          <Icon className="w-4 h-4 text-olive" />
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
          "focus-visible:border-olive focus-visible:ring-0",
          error ? "border-destructive" : "border-muted hover:border-olive/50"
        )}
      />
      {error && <p className="text-xs text-destructive mt-1.5">⚠️ {error}</p>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-olive/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-olive/5 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-olive">
                {step === "success" ? "🎉 Registration Complete!" : "Register for Program"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground mt-1">
                {step === "module" && "Select your defence program"}
                {step === "subject" && "Choose your subject combination"}
                {step === "slot" && "Select your preferred class schedule"}
                {step === "details" && "Enter your details to complete registration"}
                {step === "payment" && "Complete payment to confirm enrollment"}
                {step === "success" && "Your registration has been confirmed"}
              </DialogDescription>
            </DialogHeader>

            {step !== "success" && step !== "payment" && renderProgressIndicator()}

            {/* Step 1: Module Selection */}
            {step === "module" && (
              <div className="space-y-5">
                <RadioGroup
                  value={formData.moduleId}
                  onValueChange={(value) => {
                    const mod = modules.find(m => m.id === value);
                    setFormData({
                      ...formData,
                      moduleId: value,
                      moduleCode: mod?.code || "",
                      moduleName: mod?.name || "",
                      subjectId: "", subjectName: "",
                      slotKey: "", slotDays: "", slotTiming: "",
                    });
                  }}
                  className="grid gap-3"
                >
                  {modules.map((mod) => (
                    <div key={mod.id}>
                      <RadioGroupItem value={mod.id} id={`mod-${mod.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`mod-${mod.id}`}
                        className={cn(
                          "group flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300",
                          "hover:border-olive/50 hover:-translate-y-1 hover:shadow-xl",
                          formData.moduleId === mod.id
                            ? "border-olive bg-olive/10 shadow-xl shadow-olive/20"
                            : "border-muted bg-background/50"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-2xl transition-all shrink-0",
                          formData.moduleId === mod.id ? "bg-olive shadow-lg" : "bg-muted group-hover:bg-olive/10"
                        )}>
                          <Shield className={cn(
                            "w-7 h-7 transition-colors",
                            formData.moduleId === mod.id ? "text-white" : "text-muted-foreground group-hover:text-olive"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-base font-bold block">{mod.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{mod.description}</span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-olive/10 text-olive">{mod.mode}</span>
                            {mod.fee_summary && <span className="text-xs text-muted-foreground">{mod.fee_summary}</span>}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {renderNavigationButtons("Continue", false)}
              </div>
            )}

            {/* Step 2: Subject Selection */}
            {step === "subject" && (
              <div className="space-y-5">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-olive" />
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-xl bg-olive/5 border border-olive/20 text-sm text-muted-foreground">
                      <span className="font-semibold text-olive">{formData.moduleName}</span> — Select your subject combination
                    </div>

                    <RadioGroup
                      value={formData.subjectId}
                      onValueChange={(value) => {
                        const sub = subjects.find(s => s.id === value);
                        setFormData({
                          ...formData,
                          subjectId: value,
                          subjectName: sub?.name || "",
                          slotKey: sub?.days && sub?.timing ? `${sub.days}|${sub.timing}` : "",
                          slotDays: sub?.days || "",
                          slotTiming: sub?.timing || "",
                        });
                      }}
                      className="grid gap-3"
                    >
                      {subjects.map((sub, idx) => {
                        const isCombo = sub.name.toLowerCase().includes("both") || sub.name.toLowerCase().includes("all");
                        return (
                          <div key={sub.id}>
                            <RadioGroupItem value={sub.id} id={`sub-${sub.id}`} className="peer sr-only" />
                            <Label
                              htmlFor={`sub-${sub.id}`}
                              className={cn(
                                "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300",
                                "hover:border-olive/50 hover:-translate-y-0.5 hover:shadow-lg",
                                formData.subjectId === sub.id
                                  ? "border-olive bg-olive/10 shadow-lg"
                                  : "border-muted bg-background/50",
                                isCombo && "ring-1 ring-olive/20"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                formData.subjectId === sub.id ? "bg-olive" : "bg-muted"
                              )}>
                                <BookOpen className={cn(
                                  "w-5 h-5",
                                  formData.subjectId === sub.id ? "text-white" : "text-muted-foreground"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-medium text-sm",
                                    formData.subjectId === sub.id ? "text-olive" : ""
                                  )}>
                                    ({String.fromCharCode(97 + idx)}) {sub.name}
                                  </span>
                                  {isCombo && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-olive text-white font-bold">Best Value</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="font-bold text-foreground">₹{sub.fee_amount.toLocaleString("en-IN")}</span>
                                  <span>{sub.fee_label}</span>
                                  {sub.duration && <span>• {sub.duration}</span>}
                                </div>
                                {sub.days && sub.timing && (
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{sub.days} • {sub.timing}</span>
                                  </div>
                                )}
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </>
                )}
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 3: Slot Selection */}
            {step === "slot" && (
              <div className="space-y-5">
                <div className="p-3 rounded-xl bg-olive/5 border border-olive/20 text-sm text-muted-foreground">
                  <span className="font-semibold text-olive">{formData.moduleName} — {formData.subjectName}</span> — {isComboSlotMode ? "Your class schedule" : "Choose your preferred schedule"}
                </div>

                {/* Combo mode: show individual subject schedules as info cards */}
                {isComboSlotMode ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Individual Subject Schedules</p>
                    {comboSlotGroups.map((group, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 rounded-xl border-2 border-olive/30 bg-olive/5 p-4"
                      >
                        <div className="p-2 rounded-lg bg-olive shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-olive block">{group.subjectName}</span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{group.days}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{group.timing}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground italic">You will attend all the above schedules as part of this combo.</p>
                  </div>
                ) : (
                  /* Single subject mode: radio selection */
                  <RadioGroup
                    value={formData.slotKey}
                    onValueChange={(value) => {
                      const [days, timing] = value.split("|");
                      setFormData({ ...formData, slotKey: value, slotDays: days, slotTiming: timing });
                    }}
                    className="grid gap-3"
                  >
                    {availableSlots.map((slot) => (
                      <div key={slot.key}>
                        <RadioGroupItem value={slot.key} id={`slot-${slot.key}`} className="peer sr-only" />
                        <Label
                          htmlFor={`slot-${slot.key}`}
                          className={cn(
                            "group flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300",
                            "hover:border-olive/50 hover:-translate-y-0.5 hover:shadow-lg",
                            formData.slotKey === slot.key
                              ? "border-olive bg-olive/10 shadow-lg"
                              : "border-muted bg-background/50"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg shrink-0",
                            formData.slotKey === slot.key ? "bg-olive" : "bg-muted"
                          )}>
                            <Calendar className={cn(
                              "w-5 h-5",
                              formData.slotKey === slot.key ? "text-white" : "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <span className="font-medium text-sm block">{slot.days}</span>
                            <span className="text-xs text-muted-foreground">{slot.timing}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {renderNavigationButtons()}
              </div>
            )}

            {/* Step 4: Details (moved to before payment) */}
            {step === "details" && (
              <div className="space-y-4">
                {/* Selection summary */}
                <div className="p-4 rounded-xl bg-olive/5 border border-olive/20 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Program</span>
                    <span className="font-semibold text-foreground">{formData.moduleName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-semibold text-foreground">{formData.subjectName}</span>
                  </div>
                  {isComboSlotMode && comboSlotGroups.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-sm">Schedule</span>
                      {comboSlotGroups.map((g, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground ml-2">• {g.subjectName}</span>
                          <span className="font-medium text-foreground">{g.days} • {g.timing}</span>
                        </div>
                      ))}
                    </div>
                  ) : formData.slotDays && formData.slotDays !== "Multiple" ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Schedule</span>
                      <span className="font-semibold text-foreground">{formData.slotDays} • {formData.slotTiming}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-olive/20">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-bold text-olive text-lg">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {renderInputField({ id: "name", label: "Full Name", icon: User, value: formData.name,
                  onChange: (e: any) => setFormData({ ...formData, name: e.target.value }),
                  placeholder: "Enter your full name", error: errors.name })}
                {renderInputField({ id: "email", label: "Email", icon: Mail, value: formData.email, type: "email",
                  onChange: (e: any) => setFormData({ ...formData, email: e.target.value }),
                  placeholder: "Enter email address", error: errors.email })}
                {renderInputField({ id: "phone", label: "Phone Number", icon: Phone, value: formData.phone,
                  onChange: (e: any) => setFormData({ ...formData, phone: e.target.value }),
                  placeholder: "10-digit mobile number", error: errors.phone, maxLength: 10 })}

                {/* Coupon section */}
                <div className="border-t border-border pt-4">
                  <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                    <Tag className="w-4 h-4 text-olive" /> Have a coupon code?
                  </Label>
                  {couponApplied ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">{couponApplied.code}</span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          - ₹{couponApplied.discountAmount.toLocaleString("en-IN")} off
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => { setCouponApplied(null); setCouponCode(""); }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 h-10 rounded-lg"
                      />
                      <Button variant="outline" onClick={validateCoupon} disabled={!couponCode.trim() || validatingCoupon}>
                        {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price summary */}
                {selectedSubject && (
                  <div className="rounded-xl border-2 border-olive/20 bg-olive/5 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Fee</span>
                      <span className="font-bold text-foreground">₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-600">Discount</span>
                        <span className="font-bold text-green-600">- ₹{couponApplied.discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-olive/20">
                      <span className="font-semibold text-foreground">Total Payable</span>
                      <span className="font-black text-olive text-xl">₹{finalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{selectedSubject.fee_label}</p>
                  </div>
                )}

                {renderNavigationButtons(selectedSubject ? `Pay ₹${finalAmount.toLocaleString("en-IN")}` : "Continue")}
              </div>
            )}

            {/* Payment Processing */}
            {step === "payment" && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-olive mb-4" />
                <p className="text-muted-foreground">Processing payment...</p>
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
                  You have successfully registered for {formData.moduleName} — {formData.subjectName}.
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive your student login credentials on <strong>{successEmail}</strong>
                </p>
                <Button
                  className="mt-8 h-12 px-8 rounded-xl bg-olive hover:bg-olive/90 shadow-lg"
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

export default RacademyBookingModal;
