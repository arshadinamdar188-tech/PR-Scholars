import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, BookOpen, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tables } from "@/integrations/supabase/types";
import AdminLayout from "@/components/layouts/AdminLayout";

type Course = Tables<"courses">;

const CourseManager = () => {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("padma");

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to access admin panel");
      navigate("/padma/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (course: Course) => {
    const { error } = await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);

    if (error) {
      toast.error("Failed to update course status");
      return;
    }

    toast.success(`Course ${course.is_active ? "hidden" : "shown"}`);
    fetchCourses();
  };

  const handleDeleteCourse = async (course: Course) => {
    // Delete related data first
    await supabase.from("course_features").delete().eq("course_id", course.id);
    await supabase.from("course_faqs").delete().eq("course_id", course.id);
    
    // Delete units and chapters
    const { data: units } = await supabase
      .from("course_units")
      .select("id")
      .eq("course_id", course.id);
    
    if (units) {
      for (const unit of units) {
        await supabase.from("course_chapters").delete().eq("unit_id", unit.id);
      }
    }
    await supabase.from("course_units").delete().eq("course_id", course.id);

    // Finally delete the course
    const { error } = await supabase.from("courses").delete().eq("id", course.id);

    if (error) {
      toast.error("Failed to delete course");
      return;
    }

    toast.success("Course deleted successfully");
    fetchCourses();
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitute = course.institute === activeTab;
    return matchesSearch && matchesInstitute;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
              <p className="text-muted-foreground mb-4">
                You need admin privileges to access this page.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </CardContent>
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
            <h1 className="text-2xl font-bold text-foreground">Course Manager</h1>
            <p className="text-muted-foreground text-sm">
              Manage courses for both institutes
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/admin/courses/new">
              <Plus className="w-4 h-4" />
              Add Course
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs for Institutes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="padma" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Padma Maths Pro
            </TabsTrigger>
            <TabsTrigger value="racademy" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Colonel R's Academy
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses found</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/admin/courses/new">Add your first course</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className={`${!course.is_active ? "opacity-60" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {course.title}
                            </h3>
                            {course.is_featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {course.subtitle || course.slug}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-primary">
                              {formatPrice(Number(course.price))}
                            </span>
                            {course.duration && (
                              <span className="text-sm text-muted-foreground">
                                {course.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(course)}
                            title={course.is_active ? "Hide course" : "Show course"}
                          >
                            {course.is_active ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>

                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/courses/${course.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{course.title}" and all related data (syllabus, FAQs, features). This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCourse(course)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CourseManager;
