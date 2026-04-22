import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  X,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/layouts/AdminLayout";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_discount: number | null;
  min_order_amount: number | null;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  institute: string | null;
  created_at: string;
}

const defaultCoupon = {
  code: "",
  discount_type: "percentage",
  discount_value: 10,
  max_discount: null as number | null,
  min_order_amount: null as number | null,
  valid_from: null as string | null,
  valid_until: null as string | null,
  usage_limit: null as number | null,
  is_active: true,
  institute: null as string | null,
};

const CouponManager = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultCoupon);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchCoupons();
    }
  }, [authLoading, isAdmin]);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch coupons");
      console.error(error);
      return;
    }
    setCoupons(data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (formData.discount_value <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        max_discount: formData.max_discount,
        min_order_amount: formData.min_order_amount,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        usage_limit: formData.usage_limit,
        is_active: formData.is_active,
        institute: formData.institute,
      };

      if (editingId) {
        const { error } = await supabase
          .from("coupons")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Coupon updated successfully");
      } else {
        const { error } = await supabase.from("coupons").insert(payload);
        if (error) throw error;
        toast.success("Coupon created successfully");
      }

      resetForm();
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount: coupon.max_discount,
      min_order_amount: coupon.min_order_amount,
      valid_from: coupon.valid_from ? coupon.valid_from.split("T")[0] : null,
      valid_until: coupon.valid_until ? coupon.valid_until.split("T")[0] : null,
      usage_limit: coupon.usage_limit,
      is_active: coupon.is_active,
      institute: coupon.institute,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon");
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) {
      toast.error("Failed to update coupon");
      return;
    }

    fetchCoupons();
  };

  const resetForm = () => {
    setFormData(defaultCoupon);
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-blue" />
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
            <Button asChild className="mt-4">
              <Link to="/">Go Home</Link>
            </Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coupon Manager</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage discount coupons
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-royal-blue hover:bg-royal-blue/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-royal-blue">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-royal-blue" />
                <div>
                  <p className="text-2xl font-bold">{coupons.length}</p>
                  <p className="text-sm text-muted-foreground">Total Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Check className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {coupons.filter((c) => c.is_active && !isExpired(c.valid_until)).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {coupons.reduce((acc, c) => acc + c.used_count, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Redemptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {coupons.filter((c) => isExpired(c.valid_until)).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Expired Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 border-royal-blue/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {editingId ? "Edit Coupon" : "Add New Coupon"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Coupon Code *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., WELCOME10"
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Discount Value *{" "}
                    {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: parseFloat(e.target.value) || 0,
                      })
                    }
                    min={0}
                    max={formData.discount_type === "percentage" ? 100 : undefined}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Max Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.max_discount ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="No limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Order Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.min_order_amount ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_amount: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="No minimum"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={formData.usage_limit ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage_limit: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={formData.valid_from ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valid_from: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={formData.valid_until ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valid_until: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institute (optional)</Label>
                  <Select
                    value={formData.institute ?? "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        institute: value === "all" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutes</SelectItem>
                      <SelectItem value="padma">Padma Maths Pro</SelectItem>
                      <SelectItem value="racademy">R's Academy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>Active</Label>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-royal-blue hover:bg-royal-blue/90"
                >
                  {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              All Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coupons.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No coupons yet</p>
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="mt-4"
                >
                  Create your first coupon
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Limits</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono font-semibold">
                              {coupon.code}
                            </code>
                            {coupon.institute && (
                              <Badge variant="outline" className="text-xs">
                                {coupon.institute === "padma" ? "Padma" : "R's Academy"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {coupon.discount_type === "percentage" ? (
                              <>
                                <Percent className="w-3 h-3 text-muted-foreground" />
                                <span>{coupon.discount_value}%</span>
                              </>
                            ) : (
                              <>
                                <IndianRupee className="w-3 h-3 text-muted-foreground" />
                                <span>{coupon.discount_value}</span>
                              </>
                            )}
                            {coupon.max_discount && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (max ₹{coupon.max_discount})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {coupon.min_order_amount ? (
                              <span>Min: ₹{coupon.min_order_amount}</span>
                            ) : (
                              <span className="text-muted-foreground">No min</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}</p>
                            {isExpired(coupon.valid_until) && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Expired
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{coupon.used_count}</span>
                            <span className="text-muted-foreground">
                              {coupon.usage_limit ? ` / ${coupon.usage_limit}` : " / ∞"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={coupon.is_active}
                            onCheckedChange={() => handleToggleActive(coupon)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(coupon)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the coupon "{coupon.code}".
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(coupon.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CouponManager;
