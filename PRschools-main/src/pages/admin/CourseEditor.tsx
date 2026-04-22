import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical, Upload, X, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tables } from "@/integrations/supabase/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Course = Tables<"courses">;
type CourseFeature = Tables<"course_features">;
type CourseFaq = Tables<"course_faqs">;
type CourseUnit = Tables<"course_units">;
type CourseChapter = Tables<"course_chapters">;

interface UnitWithChapters extends CourseUnit {
  chapters: CourseChapter[];
}

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const isNew = id === "new";

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Course data
  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    institute: "padma",
    price: 0,
    original_price: null,
    duration: "",
    batch_size: 20,
    success_rate: "90%+",
    mentor_name: "",
    mentor_title: "",
    mentor_image: "",
    thumbnail_url: "",
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  // Related data
  const [features, setFeatures] = useState<Partial<CourseFeature>[]>([]);
  const [faqs, setFaqs] = useState<Partial<CourseFaq>[]>([]);
  const [units, setUnits] = useState<UnitWithChapters[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to access admin panel");
      navigate("/padma/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isNew && id && user) {
      fetchCourseData();
    }
  }, [id, isNew, user]);

  const fetchCourseData = async () => {
    setLoading(true);

    // Fetch course
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (courseError || !courseData) {
      toast.error("Course not found");
      navigate("/admin/courses");
      return;
    }

    setCourse(courseData);

    // Fetch features
    const { data: featuresData } = await supabase
      .from("course_features")
      .select("*")
      .eq("course_id", id)
      .order("display_order");

    setFeatures(featuresData || []);

    // Fetch FAQs
    const { data: faqsData } = await supabase
      .from("course_faqs")
      .select("*")
      .eq("course_id", id)
      .order("display_order");

    setFaqs(faqsData || []);

    // Fetch units with chapters
    const { data: unitsData } = await supabase
      .from("course_units")
      .select("*")
      .eq("course_id", id)
      .order("display_order");

    if (unitsData) {
      const unitsWithChapters: UnitWithChapters[] = [];
      for (const unit of unitsData) {
        const { data: chaptersData } = await supabase
          .from("course_chapters")
          .select("*")
          .eq("unit_id", unit.id)
          .order("display_order");

        unitsWithChapters.push({
          ...unit,
          chapters: chaptersData || [],
        });
      }
      setUnits(unitsWithChapters);
    }

    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSave = async () => {
    if (!course.title || !course.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);

    try {
      let courseId = id;

      if (isNew) {
        const { data: newCourse, error } = await supabase
          .from("courses")
          .insert({
            ...course,
            price: course.price || 0,
          } as Tables<"courses">)
          .select()
          .single();

        if (error) throw error;
        courseId = newCourse.id;
      } else {
        const { error } = await supabase
          .from("courses")
          .update(course as Tables<"courses">)
          .eq("id", id);

        if (error) throw error;
      }

      // Save features
      if (!isNew) {
        await supabase.from("course_features").delete().eq("course_id", courseId);
      }
      if (features.length > 0) {
        const featuresToInsert = features.map((f, i) => ({
          course_id: courseId,
          feature: f.feature || "",
          display_order: i,
        }));
        await supabase.from("course_features").insert(featuresToInsert);
      }

      // Save FAQs
      if (!isNew) {
        await supabase.from("course_faqs").delete().eq("course_id", courseId);
      }
      if (faqs.length > 0) {
        const faqsToInsert = faqs.map((f, i) => ({
          course_id: courseId,
          question: f.question || "",
          answer: f.answer || "",
          display_order: i,
        }));
        await supabase.from("course_faqs").insert(faqsToInsert);
      }

      // Save units and chapters
      if (!isNew) {
        // Delete existing chapters and units
        const { data: existingUnits } = await supabase
          .from("course_units")
          .select("id")
          .eq("course_id", courseId);

        if (existingUnits) {
          for (const unit of existingUnits) {
            await supabase.from("course_chapters").delete().eq("unit_id", unit.id);
          }
        }
        await supabase.from("course_units").delete().eq("course_id", courseId);
      }

      // Insert units and chapters
      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const { data: newUnit } = await supabase
          .from("course_units")
          .insert({
            course_id: courseId,
            name: unit.name,
            display_order: i,
          })
          .select()
          .single();

        if (newUnit && unit.chapters.length > 0) {
          const chaptersToInsert = unit.chapters.map((c, j) => ({
            unit_id: newUnit.id,
            name: c.name,
            topics: c.topics || [],
            display_order: j,
          }));
          await supabase.from("course_chapters").insert(chaptersToInsert);
        }
      }

      toast.success(isNew ? "Course created successfully" : "Course updated successfully");
      navigate("/admin/courses");
    } catch (error: any) {
      toast.error(error.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Feature handlers
  const addFeature = () => {
    setFeatures([...features, { feature: "", display_order: features.length }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // FAQ handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", display_order: faqs.length }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Unit handlers
  const addUnit = () => {
    setUnits([
      ...units,
      {
        id: `temp-${Date.now()}`,
        course_id: id || "",
        name: "",
        display_order: units.length,
        chapters: [],
      },
    ]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  // Chapter handlers
  const addChapter = (unitIndex: number) => {
    const newUnits = [...units];
    newUnits[unitIndex].chapters.push({
      id: `temp-${Date.now()}`,
      unit_id: units[unitIndex].id,
      name: "",
      topics: [],
      display_order: newUnits[unitIndex].chapters.length,
    });
    setUnits(newUnits);
  };

  const removeChapter = (unitIndex: number, chapterIndex: number) => {
    const newUnits = [...units];
    newUnits[unitIndex].chapters = newUnits[unitIndex].chapters.filter(
      (_, i) => i !== chapterIndex
    );
    setUnits(newUnits);
  };

  // Thumbnail upload handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingThumbnail(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${course.institute || "courses"}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("course-thumbnails")
        .getPublicUrl(filePath);

      setCourse({ ...course, thumbnail_url: urlData.publicUrl });
      toast.success("Thumbnail uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    }
  };

  const removeThumbnail = () => {
    setCourse({ ...course, thumbnail_url: "" });
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
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Add New Course" : "Edit Course"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isNew ? "Create a new course" : course.title}
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Course"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Details</TabsTrigger>
            <TabsTrigger value="mentor">Mentor</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institute *</Label>
                    <Select
                      value={course.institute}
                      onValueChange={(value) => setCourse({ ...course, institute: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="padma">Padma Maths Pro</SelectItem>
                        <SelectItem value="racademy">Colonel R's Academy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={course.display_order || 0}
                      onChange={(e) =>
                        setCourse({ ...course, display_order: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Course Title *</Label>
                  <Input
                    value={course.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      setCourse({
                        ...course,
                        title,
                        slug: isNew ? generateSlug(title) : course.slug,
                      });
                    }}
                    placeholder="e.g., 11th Maths CBSE"
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL Slug *</Label>
                  <Input
                    value={course.slug || ""}
                    onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                    placeholder="e.g., 11th-cbse"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /{course.institute}/courses/{course.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={course.subtitle || ""}
                    onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
                    placeholder="Short description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={course.description || ""}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    placeholder="Full course description..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  
                  {/* Thumbnail Preview */}
                  {course.thumbnail_url && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={course.thumbnail_url}
                        alt="Course thumbnail"
                        className="w-full aspect-video object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeThumbnail}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Section */}
                  <div className="flex gap-2">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                      className="gap-2"
                    >
                      {uploadingThumbnail ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    {!course.thumbnail_url && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <ImageIcon className="w-4 h-4" />
                        No thumbnail set
                      </div>
                    )}
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">or paste URL:</span>
                    <Input
                      value={course.thumbnail_url || ""}
                      onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={course.is_active}
                      onCheckedChange={(checked) => setCourse({ ...course, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={course.is_featured}
                      onCheckedChange={(checked) => setCourse({ ...course, is_featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Details */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹) *</Label>
                    <Input
                      type="number"
                      value={course.price || 0}
                      onChange={(e) =>
                        setCourse({ ...course, price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Original Price (₹)</Label>
                    <Input
                      type="number"
                      value={course.original_price || ""}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          original_price: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="Strike-through price"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={course.duration || ""}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                      placeholder="e.g., 6 Months"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      value={course.batch_size || ""}
                      onChange={(e) =>
                        setCourse({ ...course, batch_size: parseInt(e.target.value) || null })
                      }
                      placeholder="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Success Rate</Label>
                    <Input
                      value={course.success_rate || ""}
                      onChange={(e) => setCourse({ ...course, success_rate: e.target.value })}
                      placeholder="90%+"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentor */}
          <TabsContent value="mentor">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mentor Name</Label>
                    <Input
                      value={course.mentor_name || ""}
                      onChange={(e) => setCourse({ ...course, mentor_name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mentor Title</Label>
                    <Input
                      value={course.mentor_title || ""}
                      onChange={(e) => setCourse({ ...course, mentor_title: e.target.value })}
                      placeholder="e.g., Senior Mathematics Faculty"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mentor Image URL</Label>
                  <Input
                    value={course.mentor_image || ""}
                    onChange={(e) => setCourse({ ...course, mentor_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Features</CardTitle>
                <Button onClick={addFeature} size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add Feature
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No features added yet
                  </p>
                ) : (
                  features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Input
                        value={feature.feature || ""}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index] = { ...feature, feature: e.target.value };
                          setFeatures(newFeatures);
                        }}
                        placeholder="Feature description"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syllabus */}
          <TabsContent value="syllabus">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Syllabus (Units & Chapters)</CardTitle>
                <Button onClick={addUnit} size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add Unit
                </Button>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No units added yet
                  </p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {units.map((unit, unitIndex) => (
                      <AccordionItem key={unit.id} value={unit.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-medium">
                              Unit {unitIndex + 1}:
                            </span>
                            <Input
                              value={unit.name}
                              onChange={(e) => {
                                const newUnits = [...units];
                                newUnits[unitIndex].name = e.target.value;
                                setUnits(newUnits);
                              }}
                              placeholder="Unit name"
                              className="flex-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUnit(unitIndex);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          {unit.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter.id} className="flex items-center gap-2 pl-4">
                              <span className="text-sm text-muted-foreground w-8">
                                {chapterIndex + 1}.
                              </span>
                              <Input
                                value={chapter.name}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[unitIndex].chapters[chapterIndex].name = e.target.value;
                                  setUnits(newUnits);
                                }}
                                placeholder="Chapter name"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeChapter(unitIndex, chapterIndex)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addChapter(unitIndex)}
                            className="ml-4 gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Chapter
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Frequently Asked Questions</CardTitle>
                <Button onClick={addFaq} size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No FAQs added yet
                  </p>
                ) : (
                  faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <Label>Question</Label>
                          <Input
                            value={faq.question || ""}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[index] = { ...faq, question: e.target.value };
                              setFaqs(newFaqs);
                            }}
                            placeholder="Question"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFaq(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea
                          value={faq.answer || ""}
                          onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[index] = { ...faq, answer: e.target.value };
                            setFaqs(newFaqs);
                          }}
                          placeholder="Answer"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CourseEditor;
