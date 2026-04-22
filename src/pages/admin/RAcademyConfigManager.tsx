import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield, BookOpen, IndianRupee, Plus, Pencil, Trash2, Loader2, Save, Clock, Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link } from "react-router-dom";

interface Module {
  id: string; name: string; code: string; mode: string; description: string | null;
  target_audience: string | null; duration: string | null; fee_summary: string | null;
  highlights: string[] | null; is_active: boolean; display_order: number;
}

interface Subject {
  id: string; module_id: string; name: string; fee_amount: number; fee_label: string | null;
  days: string | null; timing: string | null; duration: string | null;
  is_active: boolean; display_order: number;
}

const RAcademyConfigManager = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  // Dialogs
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [highlightsText, setHighlightsText] = useState("");

  useEffect(() => {
    if (!authLoading && isAdmin) fetchAll();
    if (!authLoading && !isAdmin) setLoading(false);
  }, [authLoading, isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [modulesRes, subjectsRes] = await Promise.all([
      supabase.from("racademy_modules").select("*").order("display_order"),
      supabase.from("racademy_subjects").select("*").order("display_order"),
    ]);
    if (modulesRes.data) {
      setModules(modulesRes.data as Module[]);
      if (modulesRes.data.length && !selectedModuleId) setSelectedModuleId(modulesRes.data[0].id);
    }
    if (subjectsRes.data) setSubjects(subjectsRes.data as Subject[]);
    setLoading(false);
  };

  const filteredSubjects = subjects.filter(s => s.module_id === selectedModuleId);
  const getModuleName = (id: string) => modules.find(m => m.id === id)?.name || "";

  // Toggle active
  const toggleModuleActive = async (mod: Module) => {
    const { error } = await supabase.from("racademy_modules").update({ is_active: !mod.is_active }).eq("id", mod.id);
    if (error) { toast.error("Failed to update"); return; }
    setModules(prev => prev.map(m => m.id === mod.id ? { ...m, is_active: !m.is_active } : m));
    toast.success(`${mod.name} ${!mod.is_active ? "activated" : "deactivated"}`);
  };

  const toggleSubjectActive = async (sub: Subject) => {
    const { error } = await supabase.from("racademy_subjects").update({ is_active: !sub.is_active }).eq("id", sub.id);
    if (error) { toast.error("Failed to update"); return; }
    setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, is_active: !s.is_active } : s));
  };

  // CRUD Modules
  const openModuleDialog = (mod?: Module) => {
    const m = mod || {
      id: "", name: "", code: "", mode: "online", description: null,
      target_audience: null, duration: null, fee_summary: null,
      highlights: [], is_active: true, display_order: modules.length,
    };
    setEditingModule(m);
    setHighlightsText((m.highlights || []).join("\n"));
    setIsModuleDialogOpen(true);
  };

  const saveModule = async () => {
    if (!editingModule) return;
    setSaving(true);
    const highlights = highlightsText.split("\n").map(h => h.trim()).filter(Boolean);
    const payload = {
      name: editingModule.name, code: editingModule.code, mode: editingModule.mode,
      description: editingModule.description, target_audience: editingModule.target_audience,
      duration: editingModule.duration, fee_summary: editingModule.fee_summary,
      highlights, is_active: editingModule.is_active, display_order: editingModule.display_order,
    };
    if (editingModule.id) {
      const { error } = await supabase.from("racademy_modules").update(payload).eq("id", editingModule.id);
      if (error) { toast.error("Failed to update module"); setSaving(false); return; }
      setModules(prev => prev.map(m => m.id === editingModule.id ? { ...m, ...payload, highlights } : m));
      toast.success("Module updated");
    } else {
      const { data, error } = await supabase.from("racademy_modules").insert(payload).select().single();
      if (error) { toast.error("Failed to create module"); setSaving(false); return; }
      setModules(prev => [...prev, data as Module]);
      toast.success("Module created");
    }
    setSaving(false);
    setIsModuleDialogOpen(false);
  };

  const deleteModule = async (id: string) => {
    if (!confirm("Delete this module and all its subjects?")) return;
    const { error } = await supabase.from("racademy_modules").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setModules(prev => prev.filter(m => m.id !== id));
    setSubjects(prev => prev.filter(s => s.module_id !== id));
    toast.success("Module deleted");
  };

  // CRUD Subjects
  const openSubjectDialog = (sub?: Subject) => {
    setEditingSubject(sub || {
      id: "", module_id: selectedModuleId, name: "", fee_amount: 0, fee_label: "Monthly",
      days: "", timing: "", duration: "", is_active: true, display_order: filteredSubjects.length,
    });
    setIsSubjectDialogOpen(true);
  };

  const saveSubject = async () => {
    if (!editingSubject) return;
    setSaving(true);
    const payload = {
      module_id: editingSubject.module_id, name: editingSubject.name,
      fee_amount: editingSubject.fee_amount, fee_label: editingSubject.fee_label,
      days: editingSubject.days, timing: editingSubject.timing,
      duration: editingSubject.duration, is_active: editingSubject.is_active,
      display_order: editingSubject.display_order,
    };
    if (editingSubject.id) {
      const { error } = await supabase.from("racademy_subjects").update(payload).eq("id", editingSubject.id);
      if (error) { toast.error("Failed to update"); setSaving(false); return; }
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...editingSubject, ...payload } : s));
      toast.success("Subject updated");
    } else {
      const { data, error } = await supabase.from("racademy_subjects").insert(payload).select().single();
      if (error) { toast.error("Failed to create"); setSaving(false); return; }
      setSubjects(prev => [...prev, data as Subject]);
      toast.success("Subject created");
    }
    setSaving(false);
    setIsSubjectDialogOpen(false);
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    const { error } = await supabase.from("racademy_subjects").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("Subject deleted");
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
            <Shield className="w-8 h-8 text-royal-blue" />
            Colonel R's Academy Config
          </h1>
          <p className="text-muted-foreground">Manage modules, subjects, fees, and schedules.</p>
        </div>

        {/* Module Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-72">
            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Module</Label>
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {modules.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name} ({m.code.toUpperCase()})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" /> All Modules
                </CardTitle>
                <Button size="sm" onClick={() => openModuleDialog()}>
                  <Plus className="w-4 h-4 mr-1" /> Add Module
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(mod => (
                        <TableRow key={mod.id}>
                          <TableCell className="font-medium">{mod.name}</TableCell>
                          <TableCell><Badge variant="outline">{mod.code.toUpperCase()}</Badge></TableCell>
                          <TableCell className="capitalize">{mod.mode}</TableCell>
                          <TableCell className="text-sm">{mod.duration || "—"}</TableCell>
                          <TableCell>{subjects.filter(s => s.module_id === mod.id).length}</TableCell>
                          <TableCell>
                            <Switch checked={mod.is_active ?? false} onCheckedChange={() => toggleModuleActive(mod)} />
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" onClick={() => openModuleDialog(mod)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteModule(mod.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {modules.length === 0 && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No modules</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IndianRupee className="w-5 h-5" /> Subjects — {getModuleName(selectedModuleId)}
                </CardTitle>
                <Button size="sm" onClick={() => openSubjectDialog()}>
                  <Plus className="w-4 h-4 mr-1" /> Add Subject
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Fee (₹)</TableHead>
                        <TableHead>Fee Label</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.name}</TableCell>
                          <TableCell className="font-semibold">₹{sub.fee_amount.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-sm">{sub.fee_label || "—"}</TableCell>
                          <TableCell className="text-sm">{sub.days || "—"}</TableCell>
                          <TableCell className="text-sm">{sub.timing || "—"}</TableCell>
                          <TableCell className="text-sm">{sub.duration || "—"}</TableCell>
                          <TableCell>
                            <Switch checked={sub.is_active ?? false} onCheckedChange={() => toggleSubjectActive(sub)} />
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" onClick={() => openSubjectDialog(sub)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteSubject(sub.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredSubjects.length === 0 && (
                        <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No subjects for this module</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Module Edit Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule?.id ? "Edit" : "Add"} Module</DialogTitle>
            <DialogDescription>Configure the program module details.</DialogDescription>
          </DialogHeader>
          {editingModule && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editingModule.name} onChange={e => setEditingModule({ ...editingModule, name: e.target.value })} placeholder="e.g. NDA Entrance Exam Preparation" />
                </div>
                <div>
                  <Label>Code (URL slug)</Label>
                  <Input value={editingModule.code} onChange={e => setEditingModule({ ...editingModule, code: e.target.value })} placeholder="e.g. nda" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mode</Label>
                  <Select value={editingModule.mode} onValueChange={v => setEditingModule({ ...editingModule, mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input value={editingModule.duration || ""} onChange={e => setEditingModule({ ...editingModule, duration: e.target.value })} placeholder="e.g. 6 months" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editingModule.description || ""} onChange={e => setEditingModule({ ...editingModule, description: e.target.value })} placeholder="Program description..." rows={3} />
              </div>
              <div>
                <Label>Target Audience</Label>
                <Input value={editingModule.target_audience || ""} onChange={e => setEditingModule({ ...editingModule, target_audience: e.target.value })} placeholder="e.g. 12th Pass / Graduates" />
              </div>
              <div>
                <Label>Fee Summary</Label>
                <Input value={editingModule.fee_summary || ""} onChange={e => setEditingModule({ ...editingModule, fee_summary: e.target.value })} placeholder="e.g. Starting ₹7,000/month" />
              </div>
              <div>
                <Label>Highlights (one per line)</Label>
                <Textarea value={highlightsText} onChange={e => setHighlightsText(e.target.value)} placeholder={"Batches starting 01 Feb\nMaths, GAT, GK & English\n2 months Crash Course"} rows={4} />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={editingModule.display_order} onChange={e => setEditingModule({ ...editingModule, display_order: Number(e.target.value) })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveModule} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Edit Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSubject?.id ? "Edit" : "Add"} Subject</DialogTitle>
            <DialogDescription>Configure subject for {getModuleName(selectedModuleId)}.</DialogDescription>
          </DialogHeader>
          {editingSubject && (
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input value={editingSubject.name} onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })} placeholder="e.g. Mathematics Only" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fee Amount (₹)</Label>
                  <Input type="number" value={editingSubject.fee_amount} onChange={e => setEditingSubject({ ...editingSubject, fee_amount: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Fee Label</Label>
                  <Input value={editingSubject.fee_label || ""} onChange={e => setEditingSubject({ ...editingSubject, fee_label: e.target.value })} placeholder="e.g. Monthly / One Time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Days</Label>
                  <Input value={editingSubject.days || ""} onChange={e => setEditingSubject({ ...editingSubject, days: e.target.value })} placeholder="e.g. Mon, Wed, Fri" />
                </div>
                <div>
                  <Label>Timing</Label>
                  <Input value={editingSubject.timing || ""} onChange={e => setEditingSubject({ ...editingSubject, timing: e.target.value })} placeholder="e.g. 8:30 AM - 10:00 AM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input value={editingSubject.duration || ""} onChange={e => setEditingSubject({ ...editingSubject, duration: e.target.value })} placeholder="e.g. 6 months" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={editingSubject.display_order} onChange={e => setEditingSubject({ ...editingSubject, display_order: Number(e.target.value) })} />
                </div>
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
    </AdminLayout>
  );
};

export default RAcademyConfigManager;
