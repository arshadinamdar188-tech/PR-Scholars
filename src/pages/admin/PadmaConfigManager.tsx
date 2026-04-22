import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  GraduationCap, BookOpen, IndianRupee, MapPin, Plus, Pencil, Trash2, Loader2, Save, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link } from "react-router-dom";

interface Board { id: string; name: string; code: string; is_active: boolean; display_order: number; }
interface Grade { id: string; board_id: string; grade_number: number; is_active: boolean; display_order: number; }
interface Subject { id: string; grade_id: string; name: string; is_active: boolean; display_order: number; }
interface PricingPlan {
  id: string; grade_id: string; mode: string; plan_type: string; plan_label: string;
  fee_amount: number; savings_percent: string | null; payment_frequency: string | null;
  days: string | null; timing: string | null; duration_period: string | null;
  is_active: boolean; display_order: number;
}
interface OfflineLocation {
  id: string; name: string; address: string; google_maps_url: string | null;
  is_active: boolean; display_order: number;
}

const PadmaConfigManager = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [locations, setLocations] = useState<OfflineLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");

  // Dialogs
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<OfflineLocation | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) fetchAll();
    if (!authLoading && !isAdmin) setLoading(false);
  }, [authLoading, isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [boardsRes, gradesRes, subjectsRes, plansRes, locationsRes] = await Promise.all([
      supabase.from("padma_boards").select("*").order("display_order"),
      supabase.from("padma_grades").select("*").order("display_order"),
      supabase.from("padma_subjects").select("*").order("display_order"),
      supabase.from("padma_pricing_plans").select("*").order("display_order"),
      supabase.from("padma_offline_locations").select("*").order("display_order"),
    ]);
    if (boardsRes.data) setBoards(boardsRes.data as Board[]);
    if (gradesRes.data) setGrades(gradesRes.data as Grade[]);
    if (subjectsRes.data) setSubjects(subjectsRes.data as Subject[]);
    if (plansRes.data) setPlans(plansRes.data as PricingPlan[]);
    if (locationsRes.data) setLocations(locationsRes.data as OfflineLocation[]);

    if (boardsRes.data?.length) setSelectedBoardId(boardsRes.data[0].id);
    setLoading(false);
  };

  // Set default grade when board changes
  useEffect(() => {
    const boardGrades = grades.filter(g => g.board_id === selectedBoardId);
    if (boardGrades.length > 0 && !boardGrades.find(g => g.id === selectedGradeId)) {
      setSelectedGradeId(boardGrades[0].id);
    }
  }, [selectedBoardId, grades]);

  const filteredGrades = grades.filter(g => g.board_id === selectedBoardId);
  const filteredSubjects = subjects.filter(s => s.grade_id === selectedGradeId);
  const filteredPlans = plans.filter(p => p.grade_id === selectedGradeId);

  const getBoardName = (id: string) => boards.find(b => b.id === id)?.name || "";
  const getGradeNumber = (id: string) => grades.find(g => g.id === id)?.grade_number || 0;

  // Toggle active status
  const toggleGradeActive = async (grade: Grade) => {
    const { error } = await supabase.from("padma_grades").update({ is_active: !grade.is_active }).eq("id", grade.id);
    if (error) { toast.error("Failed to update"); return; }
    setGrades(prev => prev.map(g => g.id === grade.id ? { ...g, is_active: !g.is_active } : g));
    toast.success(`Grade ${grade.grade_number} ${!grade.is_active ? "activated" : "deactivated"}`);
  };

  const toggleSubjectActive = async (subject: Subject) => {
    const { error } = await supabase.from("padma_subjects").update({ is_active: !subject.is_active }).eq("id", subject.id);
    if (error) { toast.error("Failed to update"); return; }
    setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, is_active: !s.is_active } : s));
  };

  const togglePlanActive = async (plan: PricingPlan) => {
    const { error } = await supabase.from("padma_pricing_plans").update({ is_active: !plan.is_active }).eq("id", plan.id);
    if (error) { toast.error("Failed to update"); return; }
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, is_active: !p.is_active } : p));
  };

  // CRUD Pricing Plans
  const openPlanDialog = (plan?: PricingPlan) => {
    setEditingPlan(plan || {
      id: "", grade_id: selectedGradeId, mode: "online", plan_type: "regular",
      plan_label: "Regular (Monthly)", fee_amount: 0, savings_percent: null,
      payment_frequency: "monthly", days: "MWF", timing: "", duration_period: "",
      is_active: true, display_order: filteredPlans.length,
    });
    setIsPlanDialogOpen(true);
  };

  const savePlan = async () => {
    if (!editingPlan) return;
    setSaving(true);
    const payload = {
      grade_id: editingPlan.grade_id,
      mode: editingPlan.mode,
      plan_type: editingPlan.plan_type,
      plan_label: editingPlan.plan_label,
      fee_amount: editingPlan.fee_amount,
      savings_percent: editingPlan.savings_percent || null,
      payment_frequency: editingPlan.payment_frequency,
      days: editingPlan.days,
      timing: editingPlan.timing,
      duration_period: editingPlan.duration_period,
      is_active: editingPlan.is_active,
      display_order: editingPlan.display_order,
    };

    if (editingPlan.id) {
      const { error } = await supabase.from("padma_pricing_plans").update(payload).eq("id", editingPlan.id);
      if (error) { toast.error("Failed to update plan"); setSaving(false); return; }
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...editingPlan, ...payload } : p));
      toast.success("Plan updated");
    } else {
      const { data, error } = await supabase.from("padma_pricing_plans").insert(payload).select().single();
      if (error) { toast.error("Failed to create plan"); setSaving(false); return; }
      setPlans(prev => [...prev, data as PricingPlan]);
      toast.success("Plan created");
    }
    setSaving(false);
    setIsPlanDialogOpen(false);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this pricing plan?")) return;
    const { error } = await supabase.from("padma_pricing_plans").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.success("Plan deleted");
  };

  // CRUD Subjects
  const openSubjectDialog = (subject?: Subject) => {
    setEditingSubject(subject || {
      id: "", grade_id: selectedGradeId, name: "", is_active: true, display_order: filteredSubjects.length,
    });
    setIsSubjectDialogOpen(true);
  };

  const saveSubject = async () => {
    if (!editingSubject) return;
    setSaving(true);
    const payload = { grade_id: editingSubject.grade_id, name: editingSubject.name, is_active: editingSubject.is_active, display_order: editingSubject.display_order };
    if (editingSubject.id) {
      const { error } = await supabase.from("padma_subjects").update(payload).eq("id", editingSubject.id);
      if (error) { toast.error("Failed to update"); setSaving(false); return; }
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...editingSubject, ...payload } : s));
      toast.success("Subject updated");
    } else {
      const { data, error } = await supabase.from("padma_subjects").insert(payload).select().single();
      if (error) { toast.error("Failed to create"); setSaving(false); return; }
      setSubjects(prev => [...prev, data as Subject]);
      toast.success("Subject created");
    }
    setSaving(false);
    setIsSubjectDialogOpen(false);
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    const { error } = await supabase.from("padma_subjects").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("Subject deleted");
  };

  // CRUD Locations
  const openLocationDialog = (loc?: OfflineLocation) => {
    setEditingLocation(loc || { id: "", name: "", address: "", google_maps_url: null, is_active: true, display_order: locations.length });
    setIsLocationDialogOpen(true);
  };

  const saveLocation = async () => {
    if (!editingLocation) return;
    setSaving(true);
    const payload = { name: editingLocation.name, address: editingLocation.address, google_maps_url: editingLocation.google_maps_url, is_active: editingLocation.is_active, display_order: editingLocation.display_order };
    if (editingLocation.id) {
      const { error } = await supabase.from("padma_offline_locations").update(payload).eq("id", editingLocation.id);
      if (error) { toast.error("Failed to update"); setSaving(false); return; }
      setLocations(prev => prev.map(l => l.id === editingLocation.id ? { ...editingLocation, ...payload } : l));
      toast.success("Location updated");
    } else {
      const { data, error } = await supabase.from("padma_offline_locations").insert(payload).select().single();
      if (error) { toast.error("Failed to create"); setSaving(false); return; }
      setLocations(prev => [...prev, data as OfflineLocation]);
      toast.success("Location created");
    }
    setSaving(false);
    setIsLocationDialogOpen(false);
  };

  const deleteLocation = async (id: string) => {
    if (!confirm("Delete this location?")) return;
    const { error } = await supabase.from("padma_offline_locations").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setLocations(prev => prev.filter(l => l.id !== id));
    toast.success("Location deleted");
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have admin privileges.</p>
            <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-royal-blue" />
            Padma Maths Pro Config
          </h1>
          <p className="text-muted-foreground">Manage boards, grades, subjects, pricing plans, and locations.</p>
        </div>

        {/* Board & Grade Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-60">
            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Board</Label>
            <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {boards.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name} ({b.code.toUpperCase()})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Grade</Label>
            <Select value={selectedGradeId} onValueChange={setSelectedGradeId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {filteredGrades.map(g => (
                  <SelectItem key={g.id} value={g.id}>Grade {g.grade_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="grades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" /> Grades for {getBoardName(selectedBoardId)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Plans</TableHead>
                      <TableHead className="text-right">Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map(grade => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-bold">Grade {grade.grade_number}</TableCell>
                        <TableCell>
                          <Badge variant={grade.is_active ? "default" : "secondary"}>
                            {grade.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{subjects.filter(s => s.grade_id === grade.id).length}</TableCell>
                        <TableCell>{plans.filter(p => p.grade_id === grade.id).length}</TableCell>
                        <TableCell className="text-right">
                          <Switch checked={grade.is_active} onCheckedChange={() => toggleGradeActive(grade)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" /> Subjects — Grade {getGradeNumber(selectedGradeId)}
                </CardTitle>
                <Button size="sm" onClick={() => openSubjectDialog()}>
                  <Plus className="w-4 h-4 mr-1" /> Add Subject
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.map(subject => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>
                          <Switch checked={subject.is_active} onCheckedChange={() => toggleSubjectActive(subject)} />
                        </TableCell>
                        <TableCell>{subject.display_order}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => openSubjectDialog(subject)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteSubject(subject.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSubjects.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No subjects for this grade</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Plans Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IndianRupee className="w-5 h-5" /> Pricing Plans — Grade {getGradeNumber(selectedGradeId)}
                </CardTitle>
                <Button size="sm" onClick={() => openPlanDialog()}>
                  <Plus className="w-4 h-4 mr-1" /> Add Plan
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Savings</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlans.map(plan => (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <Badge variant={plan.plan_type === "platinum" ? "default" : plan.plan_type === "gold" ? "secondary" : "outline"}>
                              {plan.plan_label}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{plan.mode}</TableCell>
                          <TableCell className="font-semibold">₹{plan.fee_amount.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="capitalize text-xs">{plan.payment_frequency?.replace("_", " ")}</TableCell>
                          <TableCell className="text-xs">{plan.days}</TableCell>
                          <TableCell className="text-xs">{plan.timing}</TableCell>
                          <TableCell className="text-emerald-600 font-medium">{plan.savings_percent || "—"}</TableCell>
                          <TableCell>
                            <Switch checked={plan.is_active} onCheckedChange={() => togglePlanActive(plan)} />
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" onClick={() => openPlanDialog(plan)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deletePlan(plan.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredPlans.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No pricing plans</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" /> Offline Locations
                </CardTitle>
                <Button size="sm" onClick={() => openLocationDialog()}>
                  <Plus className="w-4 h-4 mr-1" /> Add Location
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Maps</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map(loc => (
                      <TableRow key={loc.id}>
                        <TableCell className="font-medium">{loc.name}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{loc.address}</TableCell>
                        <TableCell>{loc.google_maps_url ? <a href={loc.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-royal-blue text-xs underline">View</a> : "—"}</TableCell>
                        <TableCell><Switch checked={loc.is_active} onCheckedChange={async () => {
                          await supabase.from("padma_offline_locations").update({ is_active: !loc.is_active }).eq("id", loc.id);
                          setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, is_active: !l.is_active } : l));
                        }} /></TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="icon" variant="ghost" onClick={() => openLocationDialog(loc)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteLocation(loc.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {locations.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No locations</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Plan Edit Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? "Edit" : "Add"} Pricing Plan</DialogTitle>
            <DialogDescription>Configure the pricing plan details.</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan Type</Label>
                  <Select value={editingPlan.plan_type} onValueChange={v => setEditingPlan({ ...editingPlan, plan_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select value={editingPlan.mode} onValueChange={v => setEditingPlan({ ...editingPlan, mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Plan Label</Label>
                <Input value={editingPlan.plan_label} onChange={e => setEditingPlan({ ...editingPlan, plan_label: e.target.value })} placeholder="e.g. Platinum (One Time)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fee Amount (₹)</Label>
                  <Input type="number" value={editingPlan.fee_amount} onChange={e => setEditingPlan({ ...editingPlan, fee_amount: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Payment Frequency</Label>
                  <Select value={editingPlan.payment_frequency || "monthly"} onValueChange={v => setEditingPlan({ ...editingPlan, payment_frequency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Days</Label>
                  <Input value={editingPlan.days || ""} onChange={e => setEditingPlan({ ...editingPlan, days: e.target.value })} placeholder="e.g. MWF" />
                </div>
                <div>
                  <Label>Timing</Label>
                  <Input value={editingPlan.timing || ""} onChange={e => setEditingPlan({ ...editingPlan, timing: e.target.value })} placeholder="e.g. 4pm – 5pm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Savings %</Label>
                  <Input value={editingPlan.savings_percent || ""} onChange={e => setEditingPlan({ ...editingPlan, savings_percent: e.target.value })} placeholder="e.g. 10%" />
                </div>
                <div>
                  <Label>Duration Period</Label>
                  <Input value={editingPlan.duration_period || ""} onChange={e => setEditingPlan({ ...editingPlan, duration_period: e.target.value })} placeholder="e.g. 01 Mar – 31 Dec" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={savePlan} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Edit Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject?.id ? "Edit" : "Add"} Subject</DialogTitle>
            <DialogDescription>Configure subject for Grade {getGradeNumber(selectedGradeId)}.</DialogDescription>
          </DialogHeader>
          {editingSubject && (
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input value={editingSubject.name} onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })} placeholder="e.g. Mathematics Standard" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={editingSubject.display_order} onChange={e => setEditingSubject({ ...editingSubject, display_order: Number(e.target.value) })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSubject} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Edit Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLocation?.id ? "Edit" : "Add"} Location</DialogTitle>
            <DialogDescription>Configure offline class location.</DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-4">
              <div>
                <Label>Location Name</Label>
                <Input value={editingLocation.name} onChange={e => setEditingLocation({ ...editingLocation, name: e.target.value })} placeholder="Center name" />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={editingLocation.address} onChange={e => setEditingLocation({ ...editingLocation, address: e.target.value })} placeholder="Full address" />
              </div>
              <div>
                <Label>Google Maps URL (optional)</Label>
                <Input value={editingLocation.google_maps_url || ""} onChange={e => setEditingLocation({ ...editingLocation, google_maps_url: e.target.value || null })} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLocation} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PadmaConfigManager;
