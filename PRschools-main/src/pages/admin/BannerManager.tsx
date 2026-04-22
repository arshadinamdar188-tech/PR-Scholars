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
  Image,
  Video,
  Upload,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import AdminLayout from "@/components/layouts/AdminLayout";

interface Banner {
  id: string;
  title: string | null;
  media_url: string;
  media_type: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
}

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    media_type: "image" as "image" | "video",
    link_url: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch banners");
      return;
    }
    setBanners(data || []);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/");
      setNewBanner({
        ...newBanner,
        file,
        media_type: isVideo ? "video" : "image",
      });
    }
  };

  const handleAddBanner = async () => {
    if (!newBanner.file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = newBanner.file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(fileName, newBanner.file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName);

      const maxOrder = banners.length > 0 
        ? Math.max(...banners.map(b => b.display_order)) 
        : 0;

      const { error: insertError } = await supabase.from("banners").insert({
        title: newBanner.title || null,
        media_url: urlData.publicUrl,
        media_type: newBanner.media_type,
        link_url: newBanner.link_url || null,
        display_order: maxOrder + 1,
        is_active: true,
      });

      if (insertError) throw insertError;

      toast.success("Banner added successfully");
      setNewBanner({ title: "", media_type: "image", link_url: "", file: null });
      setShowAddForm(false);
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || "Failed to add banner");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (banner: Banner) => {
    try {
      // Extract filename from URL
      const urlParts = banner.media_url.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage if it's our bucket
      if (banner.media_url.includes("banners")) {
        await supabase.storage.from("banners").remove([fileName]);
      }

      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", banner.id);

      if (error) throw error;

      toast.success("Banner deleted");
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);

    if (error) {
      toast.error("Failed to update banner");
      return;
    }

    fetchBanners();
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[index];
    updatedBanners[index] = updatedBanners[newIndex];
    updatedBanners[newIndex] = temp;

    // Update display orders
    const updates = updatedBanners.map((b, i) => ({
      id: b.id,
      display_order: i + 1,
    }));

    for (const update of updates) {
      await supabase
        .from("banners")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    fetchBanners();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-blue" />
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
            <h1 className="text-2xl font-bold text-foreground">Banner Manager</h1>
            <p className="text-muted-foreground text-sm">
              Manage homepage carousel banners
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-royal-blue hover:bg-royal-blue/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </Button>
        </div>

        {/* Add Banner Form */}
        {showAddForm && (
          <Card className="mb-8 border-royal-blue/20">
            <CardHeader>
              <CardTitle className="text-lg">Add New Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (optional)</Label>
                  <Input
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    placeholder="Banner title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link URL (optional)</Label>
                  <Input
                    value={newBanner.link_url}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, link_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Media File (Image or Video)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-royal-blue/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {newBanner.file
                        ? newBanner.file.name
                        : "Click to upload image or video"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBanner({ title: "", media_type: "image", link_url: "", file: null });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBanner}
                  disabled={uploading || !newBanner.file}
                  className="bg-royal-blue hover:bg-royal-blue/90"
                >
                  {uploading ? "Uploading..." : "Add Banner"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Banners List */}
        <div className="space-y-4">
          {banners.length === 0 ? (
            <Card className="p-12 text-center">
              <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No banners yet</p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="mt-4"
              >
                Add your first banner
              </Button>
            </Card>
          ) : (
            banners.map((banner, index) => (
              <Card
                key={banner.id}
                className={`overflow-hidden ${!banner.is_active ? "opacity-60" : ""}`}
              >
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="w-48 h-32 bg-muted flex-shrink-0 relative">
                    {banner.media_type === "video" ? (
                      <video
                        src={banner.media_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={banner.media_url}
                        alt={banner.title || "Banner"}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      {banner.media_type === "video" ? (
                        <Video className="w-4 h-4 text-white drop-shadow" />
                      ) : (
                        <Image className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {banner.title || "Untitled Banner"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Order: {banner.display_order}
                      </p>
                      {banner.link_url && (
                        <p className="text-xs text-royal-blue truncate max-w-xs">
                          {banner.link_url}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(index, "down")}
                          disabled={index === banners.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Toggle Active */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(banner)}
                        title={banner.is_active ? "Hide banner" : "Show banner"}
                      >
                        {banner.is_active ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the banner. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBanner(banner)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannerManager;
