import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Layers, Upload, Loader2, Video, FolderOpen, ExternalLink, Copy, Play, Square, Circle } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TeacherTab = "students-enrolled" | "batches" | "live-class-panel" | "zoom-recordings";

type TeacherPortalLocationState = {
  teacherName?: string;
};

type ZoomRecording = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  uploaded_by: string;
  upload_date: string;
  storage_path: string;
  duration: string;
  thumbnail: string | null;
};

const VIDEO_BUCKET = "padma-recorded-videos";
const VIDEO_FOLDER = "padma/zoom-recordings";
const THUMBNAIL_FOLDER = "padma/zoom-thumbnails";
const MAX_VIDEO_SIZE_BYTES = 1024 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;
const SUBJECT_OPTIONS = ["Mathematics", "Science", "English", "Social Studies", "General Studies", "Other"];
const ZOOM_PERSONAL_MEETING_ID = import.meta.env.VITE_PADMA_ZOOM_PERSONAL_MEETING_ID || "369 394 5085";
const ZOOM_JOIN_LINK =
  import.meta.env.VITE_PADMA_ZOOM_JOIN_LINK ||
  "https://us04web.zoom.us/j/3693945085?pwd=HgWaomMcXRE29FnpctaPMmiHXbwAa8.1";
const ZOOM_DEFAULT_PASSCODE = import.meta.env.VITE_PADMA_ZOOM_PASSCODE || "Configured in join URL";

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");

const toPathToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

const TeacherPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TeacherTab>("students-enrolled");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);
  const [isLiveClassActive, setIsLiveClassActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveClassStartedAt, setLiveClassStartedAt] = useState<number | null>(null);
  const [liveClock, setLiveClock] = useState(Date.now());
  const [zoomEmbedState, setZoomEmbedState] = useState<"loading" | "loaded" | "blocked">("loading");
  const [zoomEmbedKey, setZoomEmbedKey] = useState(0);

  const teacherName = useMemo(() => {
    const locationState = (location.state as TeacherPortalLocationState | null) ?? null;
    const fromState = locationState?.teacherName;
    const fromStorage = window.sessionStorage.getItem("padmaTeacherName");
    return fromState || fromStorage || "Teacher";
  }, [location.state]);

  const handleLogout = () => {
    window.sessionStorage.removeItem("padmaTeacherName");
    window.sessionStorage.removeItem("padmaTeacherId");
    window.sessionStorage.removeItem("padmaLiveClassActive");
    window.sessionStorage.removeItem("padmaLiveClassStartedAt");
    navigate("/padma/login");
  };

  const formatDuration = (startedAt: number | null) => {
    if (!startedAt) return "00:00";
    const totalSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(ZOOM_JOIN_LINK);
      toast({ title: "Join link copied", description: "Zoom join URL copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy Zoom link", variant: "destructive" });
    }
  };

  const startLiveClass = () => {
    const startedAt = Date.now();
    setIsLiveClassActive(true);
    setLiveClassStartedAt(startedAt);
    window.sessionStorage.setItem("padmaLiveClassActive", "true");
    window.sessionStorage.setItem("padmaLiveClassStartedAt", String(startedAt));
    toast({ title: "Class started", description: "Live class status is now active" });
  };

  const endLiveClass = () => {
    setIsLiveClassActive(false);
    setIsRecording(false);
    window.sessionStorage.setItem("padmaLiveClassActive", "false");
    window.sessionStorage.removeItem("padmaIsRecording");
    toast({ title: "Class ended", description: "Live class status updated to ended" });
  };

  const toggleRecording = () => {
    if (!isLiveClassActive) return;
    const next = !isRecording;
    setIsRecording(next);
    window.sessionStorage.setItem("padmaIsRecording", next ? "true" : "false");
    if (next) {
      toast({
        title: "Recording started",
        // Zoom cloud recording is controlled from within the Zoom meeting itself.
        // This status tracks the intent on our side; the teacher must also press
        // Record inside Zoom (or cloud recording must be auto-enabled on the account).
        description: "Mark your Zoom meeting as recording. Start recording inside Zoom too.",
      });
    } else {
      toast({ title: "Recording stopped", description: "Recording status updated" });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const loadRecordings = async () => {
    setIsLoadingRecordings(true);
    const { data, error } = await supabase
      .from("padma_zoom_recordings")
      .select("id,title,description,subject,uploaded_by,upload_date,storage_path,duration,thumbnail")
      .order("upload_date", { ascending: false })
      .limit(100);

    if (error) {
      setIsLoadingRecordings(false);
      toast({ title: "Failed to load uploads", description: error.message, variant: "destructive" });
      return;
    }

    setRecordings((data ?? []) as ZoomRecording[]);
    setIsLoadingRecordings(false);
  };

  const onVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (file.type !== "video/mp4") {
      toast({ title: "Only MP4 allowed", description: "Please upload a Zoom MP4 file", variant: "destructive" });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      toast({
        title: "Video too large",
        description: "Upload a file smaller than 1 GB",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setVideoFile(file);
  };

  const onThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid thumbnail", description: "Select an image file", variant: "destructive" });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      toast({ title: "Thumbnail too large", description: "Keep thumbnail under 5 MB", variant: "destructive" });
      event.target.value = "";
      return;
    }

    setThumbnailFile(file);
  };

  const uploadZoomRecording = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !videoFile) {
      toast({
        title: "Missing required details",
        description: "Title, subject and MP4 file are required",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const now = Date.now();
    const safeTitle = toPathToken(title);
    const videoName = sanitizeFileName(videoFile.name || `${safeTitle || "session"}.mp4`);
    const videoPath = `${VIDEO_FOLDER}/${now}-${safeTitle || "session"}-${videoName}`;

    let uploadedVideoPath: string | null = null;
    let uploadedThumbnailPath: string | null = null;

    try {
      const { error: uploadVideoError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .upload(videoPath, videoFile, {
          upsert: false,
          contentType: "video/mp4",
          cacheControl: "3600",
        });

      if (uploadVideoError) {
        throw new Error(uploadVideoError.message);
      }

      uploadedVideoPath = videoPath;

      if (thumbnailFile) {
        const thumbName = sanitizeFileName(thumbnailFile.name || `${safeTitle || "session"}.jpg`);
        const thumbPath = `${THUMBNAIL_FOLDER}/${now}-${safeTitle || "session"}-${thumbName}`;
        const { error: uploadThumbError } = await supabase.storage
          .from(VIDEO_BUCKET)
          .upload(thumbPath, thumbnailFile, {
            upsert: false,
            contentType: thumbnailFile.type,
            cacheControl: "3600",
          });

        if (uploadThumbError) {
          throw new Error(uploadThumbError.message);
        }

        uploadedThumbnailPath = thumbPath;
      }

      const { data: finalizeData, error: finalizeError } = await supabase.functions.invoke("padma-zoom-recordings", {
        body: {
          title: title.trim(),
          description: description.trim() || null,
          subject: subject.trim(),
          uploadedBy: teacherName,
          storagePath: videoPath,
          thumbnail: uploadedThumbnailPath,
        },
      });

      if (finalizeError) {
        let detailedError = finalizeError.message;

        const maybeContext = (finalizeError as any)?.context;
        if (maybeContext && typeof maybeContext.json === "function") {
          try {
            const payload = await maybeContext.json();
            if (payload?.error) {
              detailedError = payload.error;
            }
          } catch {
            // Keep original finalizeError message.
          }
        }

        throw new Error(detailedError);
      }

      if (!finalizeData?.success) {
        throw new Error(finalizeData?.error || "Could not finalize recording metadata");
      }

      toast({
        title: "Zoom recording uploaded",
        description: `Video saved. Detected duration: ${finalizeData.data?.duration ?? "N/A"}`,
      });
      resetForm();
      await loadRecordings();
    } catch (error: any) {
      if (uploadedVideoPath) {
        await supabase.storage.from(VIDEO_BUCKET).remove([uploadedVideoPath]);
      }
      if (uploadedThumbnailPath) {
        await supabase.storage.from(VIDEO_BUCKET).remove([uploadedThumbnailPath]);
      }
      toast({
        title: "Upload failed",
        description: error?.message || "Could not upload Zoom recording",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    void loadRecordings();
  }, []);

  useEffect(() => {
    const savedActive = window.sessionStorage.getItem("padmaLiveClassActive") === "true";
    const savedStartAt = Number(window.sessionStorage.getItem("padmaLiveClassStartedAt") || "0");
    const savedRecording = window.sessionStorage.getItem("padmaIsRecording") === "true";
    setIsLiveClassActive(savedActive);
    setIsRecording(savedRecording);
    setLiveClassStartedAt(savedStartAt > 0 ? savedStartAt : null);
  }, []);

  useEffect(() => {
    if (!isLiveClassActive) return;
    const intervalId = window.setInterval(() => {
      setLiveClock(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isLiveClassActive]);

  useEffect(() => {
    if (activeTab !== "live-class-panel") return;

    setZoomEmbedState("loading");
    const timeoutId = window.setTimeout(() => {
      setZoomEmbedState((current) => (current === "loaded" ? current : "blocked"));
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [activeTab, zoomEmbedKey]);

  const liveStatusLabel = isLiveClassActive ? "Live" : "Ended";
  const liveStatusVariant = isLiveClassActive ? "default" : "secondary";

  return (
    <PadmaLayout>
      <section className="bg-muted/20 min-h-[80vh] pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b bg-background px-5 md:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("students-enrolled")}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    activeTab === "students-enrolled"
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Students Enrolled
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("batches")}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    activeTab === "batches"
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Batches
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("live-class-panel")}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    activeTab === "live-class-panel"
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Live Class Panel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("zoom-recordings")}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    activeTab === "zoom-recordings"
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Zoom Recordings
                </button>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{teacherName}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-royal-blue text-white font-semibold">
                      {teacherName.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {activeTab === "students-enrolled" && (
                <Card variant="padma">
                  <CardHeader>
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Students Enrolled
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                      Enrolled students list will appear here.
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "batches" && (
                <Card variant="padma">
                  <CardHeader>
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Batches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                      Batch schedule and student grouping will appear here.
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "live-class-panel" && (
                <Card variant="padma">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Class Panel
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Embedded Zoom class view for teacher operations. If Zoom blocks iframe on your browser, use Open in Zoom.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Meeting ID</p>
                        <p className="text-sm font-semibold">{ZOOM_PERSONAL_MEETING_ID}</p>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Passcode</p>
                        <p className="text-sm font-semibold break-all">{ZOOM_DEFAULT_PASSCODE}</p>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={liveStatusVariant}>{liveStatusLabel}</Badge>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-semibold" data-live-clock={liveClock}>
                          {isLiveClassActive ? formatDuration(liveClassStartedAt) : "00:00"}
                        </p>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20 md:col-span-2">
                        <p className="text-xs text-muted-foreground">Join Link</p>
                        <a
                          href={ZOOM_JOIN_LINK}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-royal-blue break-all hover:underline"
                        >
                          {ZOOM_JOIN_LINK}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="padma" onClick={startLiveClass} disabled={isLiveClassActive}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Class
                      </Button>
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={toggleRecording}
                        disabled={!isLiveClassActive}
                        title={!isLiveClassActive ? "Start class first to enable recording" : undefined}
                      >
                        <Circle
                          className={`w-4 h-4 mr-2 ${isRecording ? "fill-white animate-pulse" : "fill-transparent"}`}
                        />
                        {isRecording ? "Stop Recording" : "Record Class"}
                      </Button>
                      <Button variant="destructive" onClick={endLiveClass} disabled={!isLiveClassActive}>
                        <Square className="w-4 h-4 mr-2" />
                        End Class
                      </Button>
                      <Button variant="outline" onClick={() => void copyJoinLink()}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Join Link
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={ZOOM_JOIN_LINK} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Zoom
                        </a>
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                        Recording in progress — also press Record inside your Zoom meeting to capture to cloud
                      </div>
                    )}

                    <div className="rounded-lg border bg-black/90 overflow-hidden">
                      {zoomEmbedState === "blocked" ? (
                        <div className="h-[500px] p-6 flex flex-col items-center justify-center gap-4 bg-muted/20 text-center">
                          <p className="text-sm font-semibold text-foreground">Embedded Zoom view is blocked in this environment.</p>
                          <p className="text-xs text-muted-foreground max-w-md">
                            Your browser, network, or Zoom security policy is preventing iframe rendering. Use Open in Zoom or retry embed.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button variant="outline" onClick={() => setZoomEmbedKey((prev) => prev + 1)}>
                              Retry Embed
                            </Button>
                            <Button variant="padma" asChild>
                              <a href={ZOOM_JOIN_LINK} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in Zoom
                              </a>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <iframe
                            key={zoomEmbedKey}
                            src={ZOOM_JOIN_LINK}
                            title="Padma Zoom Live Class"
                            className="w-full h-[500px]"
                            allow="camera; microphone; fullscreen; display-capture"
                            onLoad={() => setZoomEmbedState("loaded")}
                          />
                          {zoomEmbedState === "loading" && (
                            <div className="px-4 py-3 text-xs text-muted-foreground border-t bg-muted/30">
                              Loading embedded Zoom view. If it does not appear, use Open in Zoom.
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Zoom browser security policies may block direct iframe rendering in some environments. Use Open in Zoom when embedded rendering is blocked.
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "zoom-recordings" && (
                <Card variant="padma">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Zoom Recording Uploads
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Upload Zoom MP4 recordings to Supabase private storage. Duration is auto-detected from MP4 metadata on server.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={uploadZoomRecording} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="zoom-title">Title *</Label>
                        <Input
                          id="zoom-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Algebra Revision Session 3"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zoom-subject">Subject *</Label>
                        <Select value={subject} onValueChange={setSubject}>
                          <SelectTrigger id="zoom-subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECT_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="zoom-description">Description</Label>
                        <Textarea
                          id="zoom-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Add short summary for students"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zoom-video">Zoom MP4 file *</Label>
                        <Input id="zoom-video" type="file" accept="video/mp4" onChange={onVideoChange} required />
                        <p className="text-xs text-muted-foreground">Max size: 1 GB</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zoom-thumbnail">Thumbnail (optional)</Label>
                        <Input id="zoom-thumbnail" type="file" accept="image/*" onChange={onThumbnailChange} />
                        <p className="text-xs text-muted-foreground">Max size: 5 MB</p>
                      </div>

                      <div className="md:col-span-2 flex items-center gap-3">
                        <Button type="submit" variant="padma" disabled={isUploading}>
                          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                          {isUploading ? "Uploading..." : "Upload Recording"}
                        </Button>
                        <Badge variant="secondary">Private bucket: {VIDEO_BUCKET}</Badge>
                      </div>
                    </form>

                    <div className="rounded-lg border p-4 bg-muted/20">
                      <div className="flex items-center gap-2 mb-3">
                        <FolderOpen className="w-4 h-4 text-royal-blue" />
                        <p className="text-sm font-semibold">Recent Uploads</p>
                      </div>

                      {isLoadingRecordings ? (
                        <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading uploads...
                        </div>
                      ) : recordings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No recordings uploaded yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-auto">
                          {recordings.map((recording) => (
                            <div key={recording.id} className="rounded-md border bg-background px-3 py-2 text-sm">
                              <p className="font-semibold text-foreground">{recording.title}</p>
                              <p className="text-muted-foreground">
                                {recording.subject} | {recording.duration} | {new Date(recording.upload_date).toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-muted-foreground">Uploaded by: {recording.uploaded_by}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default TeacherPortal;
