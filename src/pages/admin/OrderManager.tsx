import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ShoppingCart,
  IndianRupee,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Eye,
  RefreshCw,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/layouts/AdminLayout";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_type: string;
  institute: string;
  course_id: string;
  amount: number;
  discount_amount: number | null;
  final_amount: number;
  coupon_code: string | null;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

const OrderManager = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [instituteFilter, setInstituteFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchData();
    }
  }, [authLoading, isAdmin]);

  const fetchData = async () => {
    await Promise.all([fetchOrders(), fetchCourses()]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
      return;
    }
    setOrders(data || []);
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug");

    if (error) {
      console.error(error);
      return;
    }

    const courseMap: Record<string, Course> = {};
    data?.forEach((course) => {
      courseMap[course.id] = course;
    });
    setCourses(courseMap);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success("Orders refreshed");
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success("Status updated");
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: newStatus });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.payment_status === statusFilter;

    const matchesInstitute =
      instituteFilter === "all" || order.institute === instituteFilter;

    return matchesSearch && matchesStatus && matchesInstitute;
  });

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    pending: orders.filter((o) => o.payment_status === "pending").length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((acc, o) => acc + o.final_amount, 0),
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
            <h1 className="text-2xl font-bold text-foreground">Order Manager</h1>
            <p className="text-muted-foreground text-sm">
              View and manage course purchases
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-royal-blue">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-royal-blue" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.paid}</p>
                  <p className="text-sm text-muted-foreground">Paid Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-8 h-8 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={instituteFilter} onValueChange={setInstituteFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutes</SelectItem>
                  <SelectItem value="padma">Padma</SelectItem>
                  <SelectItem value="racademy">R's Academy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <code className="text-sm font-mono font-semibold">
                              {order.order_number}
                            </code>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {order.institute === "padma" ? "Padma" : "R's Academy"}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer_email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer_phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {courses[order.course_id]?.title || "Unknown Course"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              {formatCurrency(order.final_amount)}
                            </p>
                            {order.discount_amount && order.discount_amount > 0 && (
                              <p className="text-xs text-green-600">
                                -{formatCurrency(order.discount_amount)} off
                              </p>
                            )}
                            {order.coupon_code && (
                              <code className="text-xs bg-muted px-1 rounded">
                                {order.coupon_code}
                              </code>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <code className="text-lg font-mono font-bold">
                      {selectedOrder.order_number}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedOrder.payment_status)}
                      <Select
                        value={selectedOrder.payment_status}
                        onValueChange={(value) =>
                          handleUpdateStatus(selectedOrder.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Customer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{selectedOrder.user_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Course & Payment Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Course</h4>
                    <p className="font-medium">
                      {courses[selectedOrder.course_id]?.title || "Unknown Course"}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {selectedOrder.institute === "padma" ? "Padma Maths Pro" : "R's Academy"}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Payment</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original Amount</span>
                        <span>{formatCurrency(selectedOrder.amount)}</span>
                      </div>
                      {selectedOrder.discount_amount && selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}</span>
                          <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Final Amount</span>
                        <span>{formatCurrency(selectedOrder.final_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Razorpay Details */}
                {(selectedOrder.razorpay_order_id || selectedOrder.razorpay_payment_id) && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Razorpay Details</h4>
                    <div className="space-y-2 text-sm font-mono">
                      {selectedOrder.razorpay_order_id && (
                        <div>
                          <span className="text-muted-foreground">Order ID: </span>
                          <span>{selectedOrder.razorpay_order_id}</span>
                        </div>
                      )}
                      {selectedOrder.razorpay_payment_id && (
                        <div>
                          <span className="text-muted-foreground">Payment ID: </span>
                          <span>{selectedOrder.razorpay_payment_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Created: {formatDate(selectedOrder.created_at)}</span>
                  <span>Updated: {formatDate(selectedOrder.updated_at)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default OrderManager;
