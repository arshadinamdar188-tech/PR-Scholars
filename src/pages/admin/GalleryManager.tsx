import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";

interface GalleryItem {
  id: string;
  institute: string;
  gallery_type: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<"padma" | "racademy">("padma");
  const [selectedType, setSelectedType] = useState<"founders" | "achievers">("founders");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { toast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("institute", selectedInstitute)
      .eq("gallery_type", selectedType)
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch gallery items", variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [selectedInstitute, selectedType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${selectedInstitute}/${selectedType}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("galleries")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("galleries").getPublicUrl(fileName);

    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 1;

    const { error: insertError } = await supabase.from("gallery_items").insert({
      institute: selectedInstitute,
      gallery_type: selectedType,
      title: newTitle || null,
      description: newDescription || null,
      image_url: publicUrl.publicUrl,
      display_order: maxOrder,
    });

    if (insertError) {
      toast({ title: "Error", description: "Failed to add gallery item", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Gallery item added successfully" });
      setNewTitle("");
      setNewDescription("");
      fetchItems();
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (item: GalleryItem) => {
    const fileName = item.image_url.split("/").pop();
    if (fileName && item.image_url.includes("galleries")) {
      await supabase.storage.from("galleries").remove([`${selectedInstitute}/${selectedType}/${fileName}`]);
    }

    const { error } = await supabase.from("gallery_items").delete().eq("id", item.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Gallery item deleted" });
      fetchItems();
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    const { error } = await supabase
      .from("gallery_items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    } else {
      fetchItems();
    }
  };

  const handleReorder = async (item: GalleryItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= items.length) return;

    const swapItem = items[swapIndex];
    const currentOrder = item.display_order;
    const swapOrder = swapItem.display_order;

    await supabase.from("gallery_items").update({ display_order: swapOrder }).eq("id", item.id);
    await supabase.from("gallery_items").update({ display_order: currentOrder }).eq("id", swapItem.id);

    fetchItems();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gallery Manager</h1>
            <p className="text-muted-foreground text-sm">
              Manage gallery images for both institutes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/padma/gallery">View Padma</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/racademy/gallery">View R Academy</Link>
            </Button>
          </div>
        </div>
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Institute</label>
                <Select value={selectedInstitute} onValueChange={(v) => setSelectedInstitute(v as "padma" | "racademy")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padma">Padma Maths Pro</SelectItem>
                    <SelectItem value="racademy">Colonel R's Defence Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Gallery Type</label>
                <Select value={selectedType} onValueChange={(v) => setSelectedType(v as "founders" | "achievers")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founders">Founders' Gallery</SelectItem>
                    <SelectItem value="achievers">Achievers' Gallery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Item */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Gallery Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title (Optional)</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter image description"
                  rows={1}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Image</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              {selectedInstitute === "padma" ? "Padma Maths Pro" : "R Academy"} - {selectedType === "founders" ? "Founders'" : "Achievers'"} Gallery
              <span className="text-muted-foreground font-normal text-sm">({items.length} items)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No gallery items yet. Upload your first image above.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative group rounded-lg overflow-hidden border ${!item.is_active ? "opacity-50" : ""}`}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery item"}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                            onClick={() => handleReorder(item, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                            onClick={() => handleReorder(item, "down")}
                            disabled={index === items.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                            onClick={() => handleToggleActive(item)}
                          >
                            {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-red-500/80 hover:bg-red-500 text-white"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-white">
                        {item.title && <p className="font-medium text-sm">{item.title}</p>}
                        {item.description && <p className="text-xs text-white/70">{item.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default GalleryManager;
