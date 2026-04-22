import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Pencil,
  Loader2,
  ShieldCheck,
  ShieldX,
  CalendarClock,
  RefreshCw,
} from "lucide-react";

type PadmaStudent = {
  id: string;
  name: string;
  access_code: string;
  grade: string | null;
  board: string | null;
  access_start_date: string;
  access_end_date: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
};

type FormState = {
  name: string;
  access_code: string;
  grade: string;
  board: string;
  access_start_date: string;
  access_end_date: string;
  is_active: boolean;
  notes: string;
};

const emptyForm = (): FormState => {
  const today = new Date().toISOString().split("T")[0];
  const threeMonths = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return {
    name: "",
    access_code: "",
    grade: "",
    board: "",
    access_start_date: today,
    access_end_date: threeMonths,
    is_active: true,
    notes: "",
  };
};

function getTenureStatus(student: PadmaStudent): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (!student.is_active) {
    return { label: "Disabled", variant: "secondary" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(student.access_start_date);
  const end = new Date(student.access_end_date);
  if (today < start) {
    return { label: "Not started", variant: "outline" };
  }
  if (today > end) {
    return { label: "Expired", variant: "destructive" };
  }
  return { label: "Active", variant: "default" };
}

function daysRemaining(endDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function StudentAccessManager() {
  const [students, setStudents] = useState<PadmaStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("padma_students")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load students", description: error.message, variant: "destructive" });
    } else {
      setStudents((data ?? []) as PadmaStudent[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchStudents();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (student: PadmaStudent) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      access_code: student.access_code,
      grade: student.grade ?? "",
      board: student.board ?? "",
      access_start_date: student.access_start_date,
      access_end_date: student.access_end_date,
      is_active: student.is_active,
      notes: student.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.access_code.trim()) {
      toast({ title: "Name and Access Code are required", variant: "destructive" });
      return;
    }
    if (!form.access_start_date || !form.access_end_date) {
      toast({ title: "Both tenure dates are required", variant: "destructive" });
      return;
    }
    if (form.access_end_date < form.access_start_date) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      access_code: form.access_code.trim(),
      grade: form.grade.trim() || null,
      board: form.board.trim() || null,
      access_start_date: form.access_start_date,
      access_end_date: form.access_end_date,
      is_active: form.is_active,
      notes: form.notes.trim() || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("padma_students").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("padma_students").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingId ? "Student updated" : "Student added", description: `Access granted to ${form.name}` });
    setDialogOpen(false);
    void fetchStudents();
  };

  const toggleActive = async (student: PadmaStudent) => {
    const { error } = await supabase
      .from("padma_students")
      .update({ is_active: !student.is_active })
      .eq("id", student.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: student.is_active ? "Student disabled" : "Student enabled" });
      void fetchStudents();
    }
  };

  const f = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Card variant="padma">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-royal-blue flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            Student Access Manager
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void fetchStudents()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="padma" size="sm" onClick={openAdd}>
              <UserPlus className="w-4 h-4 mr-1" />
              Add Student
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Add students with a unique access code and tenure dates. Students cannot log in after their
          tenure expires or if disabled.
        </p>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading students…
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-lg border p-6 bg-muted/30 text-center text-sm text-muted-foreground">
            No students yet. Click <strong>Add Student</strong> to grant access to your first student.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Access Code</TableHead>
                  <TableHead>Grade / Board</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => {
                  const { label, variant } = getTenureStatus(s);
                  const days = daysRemaining(s.access_end_date);
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.access_code}</code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {[s.grade, s.board].filter(Boolean).join(" · ") || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{s.access_start_date} → {s.access_end_date}</div>
                        {s.is_active && days >= 0 && days <= 14 && (
                          <div className="text-amber-600 text-xs font-medium mt-0.5">
                            ⚠ {days} day{days !== 1 ? "s" : ""} remaining
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant}>{label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => openEdit(s)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={s.is_active ? "Disable access" : "Enable access"}
                            onClick={() => void toggleActive(s)}
                          >
                            {s.is_active ? (
                              <ShieldX className="w-4 h-4 text-destructive" />
                            ) : (
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Student Access" : "Add New Student"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Student Name *</Label>
                <Input
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => f("name", e.target.value)}
                />
              </div>

              <div className="col-span-2 space-y-1">
                <Label>Access Code (Password) *</Label>
                <Input
                  placeholder="e.g. rahul2025"
                  value={form.access_code}
                  onChange={(e) => f("access_code", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Student logs in with their name + this code.
                </p>
              </div>

              <div className="space-y-1">
                <Label>Grade</Label>
                <Input
                  placeholder="e.g. Class 10"
                  value={form.grade}
                  onChange={(e) => f("grade", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Board</Label>
                <Input
                  placeholder="e.g. CBSE"
                  value={form.board}
                  onChange={(e) => f("board", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Access Start Date *</Label>
                <Input
                  type="date"
                  value={form.access_start_date}
                  onChange={(e) => f("access_start_date", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Access End Date *</Label>
                <Input
                  type="date"
                  value={form.access_end_date}
                  onChange={(e) => f("access_end_date", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Student loses access after this date.
                </p>
              </div>

              <div className="col-span-2 space-y-1">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Batch, contact, fee paid, etc."
                  value={form.notes}
                  onChange={(e) => f("notes", e.target.value)}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => f("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active (student can log in immediately)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="padma" onClick={() => void handleSave()} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Save Changes" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
