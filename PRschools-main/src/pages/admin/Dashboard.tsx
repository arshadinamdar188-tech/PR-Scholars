import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  BookOpen,
  ShoppingCart,
  IndianRupee,
  Tag,
  Image,
  Images,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/layouts/AdminLayout";

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCoupons: number;
  activeCoupons: number;
  totalBanners: number;
  totalGalleryItems: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  final_amount: number;
  payment_status: string;
  created_at: string;
  institute: string;
}

interface RecentCourse {
  id: string;
  title: string;
  institute: string;
  price: number;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    totalBanners: 0,
    totalGalleryItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchDashboardData();
    }
  }, [authLoading, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch courses stats
      const { data: courses } = await supabase
        .from("courses")
        .select("id, is_active, title, institute, price, created_at")
        .order("created_at", { ascending: false });

      // Fetch orders stats
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, final_amount, payment_status, created_at, institute")
        .order("created_at", { ascending: false });

      // Fetch coupons stats
      const { data: coupons } = await supabase
        .from("coupons")
        .select("id, is_active");

      // Fetch banners count
      const { count: bannersCount } = await supabase
        .from("banners")
        .select("id", { count: "exact", head: true });

      // Fetch gallery items count
      const { count: galleryCount } = await supabase
        .from("gallery_items")
        .select("id", { count: "exact", head: true });

      const paidOrders = orders?.filter((o) => o.payment_status === "paid") || [];
      const pendingOrders = orders?.filter((o) => o.payment_status === "pending") || [];

      setStats({
        totalCourses: courses?.length || 0,
        activeCourses: courses?.filter((c) => c.is_active).length || 0,
        totalOrders: orders?.length || 0,
        paidOrders: paidOrders.length,
        pendingOrders: pendingOrders.length,
        totalRevenue: paidOrders.reduce((acc, o) => acc + o.final_amount, 0),
        totalCoupons: coupons?.length || 0,
        activeCoupons: coupons?.filter((c) => c.is_active).length || 0,
        totalBanners: bannersCount || 0,
        totalGalleryItems: galleryCount || 0,
      });

      setRecentOrders((orders || []).slice(0, 5));
      setRecentCourses(
        (courses || []).slice(0, 5).map((c) => ({
          id: c.id,
          title: c.title,
          institute: c.institute,
          price: Number(c.price),
          created_at: c.created_at,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    {
      title: "Banners",
      description: "Manage homepage carousel",
      icon: Image,
      href: "/admin/banners",
      count: stats.totalBanners,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Gallery",
      description: "Manage gallery images",
      icon: Images,
      href: "/admin/gallery",
      count: stats.totalGalleryItems,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Courses",
      description: "Manage course content",
      icon: BookOpen,
      href: "/admin/courses",
      count: stats.totalCourses,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Coupons",
      description: "Manage discount codes",
      icon: Tag,
      href: "/admin/coupons",
      count: stats.activeCoupons,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Orders",
      description: "View purchases",
      icon: ShoppingCart,
      href: "/admin/orders",
      count: stats.totalOrders,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <IndianRupee className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                From {stats.paidOrders} paid orders
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  {stats.paidOrders} paid
                </Badge>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                  {stats.pendingOrders} pending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">{stats.activeCourses}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalCourses} total courses
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Coupons</p>
                  <p className="text-2xl font-bold">{stats.activeCoupons}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Tag className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalCoupons} total coupons
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {action.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {action.count} items
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Orders
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/orders" className="gap-1">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold">
                            {order.order_number}
                          </code>
                          {order.payment_status === "paid" ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.customer_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatCurrency(order.final_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                Courses
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/courses" className="gap-1">
                  Manage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentCourses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No courses yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/admin/courses/${course.id}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {course.title}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {course.institute === "padma" ? "Padma" : "R's Academy"}
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm text-primary">
                        {formatCurrency(course.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
