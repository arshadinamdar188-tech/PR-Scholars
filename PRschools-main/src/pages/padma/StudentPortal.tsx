import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, Trophy, FolderOpen, PlayCircle, PlusCircle, Loader2, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TopTab = "courses" | "resources" | "data-challenges";

type PortalLocationState = {
  studentName?: string;
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

type ResolvedRecording = {
  metadata: ZoomRecording;
  videoUrl: string;
  thumbnailUrl: string | null;
};

const VIDEO_BUCKET = "padma-recorded-videos";
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60;

const StudentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TopTab>("courses");
  const [courseTab, setCourseTab] = useState("my-courses");
  const [resolvedRecordings, setResolvedRecordings] = useState<ResolvedRecording[]>([]);
  const [isFetchingRecordings, setIsFetchingRecordings] = useState(false);
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);

  const studentName = useMemo(() => {
    const locationState = (location.state as PortalLocationState | null) ?? null;
    const fromState = locationState?.studentName;
    const fromStorage = window.sessionStorage.getItem("padmaStudentName");
    return fromState || fromStorage || "Student";
  }, [location.state]);

  const handleLogout = () => {
    window.sessionStorage.removeItem("padmaStudentName");
    navigate("/padma/login");
  };

  const loadRecordings = async () => {
    setIsFetchingRecordings(true);

    const { data, error } = await supabase
      .from("padma_zoom_recordings")
      .select("id,title,description,subject,uploaded_by,upload_date,storage_path,duration,thumbnail")
      .order("upload_date", { ascending: false })
      .limit(100);

    if (error) {
      setIsFetchingRecordings(false);
      toast({ title: "Failed to load recordings", description: error.message, variant: "destructive" });
      return;
    }

    const rows = (data ?? []) as ZoomRecording[];

    const resolved = await Promise.all(
      rows.map(async (row) => {
        const { data: signedVideo, error: videoError } = await supabase.storage
          .from(VIDEO_BUCKET)
          .createSignedUrl(row.storage_path, SIGNED_URL_EXPIRY_SECONDS);

        if (videoError || !signedVideo?.signedUrl) {
          return null;
        }

        let thumbnailUrl: string | null = null;
        if (row.thumbnail) {
          const { data: signedThumb } = await supabase.storage
            .from(VIDEO_BUCKET)
            .createSignedUrl(row.thumbnail, SIGNED_URL_EXPIRY_SECONDS);
          thumbnailUrl = signedThumb?.signedUrl ?? null;
        }

        return {
          metadata: row,
          videoUrl: signedVideo.signedUrl,
          thumbnailUrl,
        } as ResolvedRecording;
      })
    );

    const cleaned = resolved.filter((item): item is ResolvedRecording => Boolean(item));
    setResolvedRecordings(cleaned);
    setSelectedRecordingId((current) => current ?? cleaned[0]?.metadata.id ?? null);
    setIsFetchingRecordings(false);
  };

  useEffect(() => {
    void loadRecordings();
  }, []);

  const selectedRecording =
    resolvedRecordings.find((recording) => recording.metadata.id === selectedRecordingId) ?? resolvedRecordings[0];

  return (
    <PadmaLayout>
      <section className="bg-muted/20 min-h-[80vh] pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b bg-background px-5 md:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("courses")}
                  className={`inline-flex items-center gap-1.5 text-base font-semibold whitespace-nowrap transition-colors ${
                    activeTab === "courses" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Courses
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("resources")}
                  className={`inline-flex items-center gap-1.5 text-base font-semibold whitespace-nowrap transition-colors ${
                    activeTab === "resources" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("data-challenges")}
                  className={`inline-flex items-center gap-1.5 text-base font-semibold whitespace-nowrap transition-colors ${
                    activeTab === "data-challenges" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Data Challenges
                </button>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{studentName}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-royal-blue text-white font-semibold">
                      {studentName.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {activeTab === "courses" && (
                <Card variant="padma">
                  <CardHeader>
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={courseTab} onValueChange={setCourseTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="my-courses" className="flex items-center gap-1.5">
                          <FolderOpen className="w-4 h-4" />
                          My Courses
                        </TabsTrigger>
                        <TabsTrigger value="enroll-course" className="flex items-center gap-1.5">
                          <PlusCircle className="w-4 h-4" />
                          Enroll Course
                        </TabsTrigger>
                        <TabsTrigger value="recorded-classes" className="flex items-center gap-1.5">
                          <PlayCircle className="w-4 h-4" />
                          Recorded Classes
                        </TabsTrigger>
                        <TabsTrigger value="live-class" className="flex items-center gap-1.5">
                          <Video className="w-4 h-4" />
                          Zoom Classes
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="my-courses">
                        <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                          Your enrolled courses will be listed here.
                        </div>
                      </TabsContent>

                      <TabsContent value="enroll-course">
                        <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                          Available courses to enroll will appear here.
                        </div>
                      </TabsContent>

                      <TabsContent value="recorded-classes">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-muted-foreground">
                              Watch Zoom recordings uploaded by teacher/admin from secure private storage.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => void loadRecordings()} disabled={isFetchingRecordings}>
                              {isFetchingRecordings ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Refresh Recordings
                            </Button>
                          </div>

                          {isFetchingRecordings ? (
                            <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading Zoom recordings...
                            </div>
                          ) : resolvedRecordings.length === 0 ? (
                            <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                              No recordings available yet.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div className="lg:col-span-2 rounded-lg border p-3 bg-black/90">
                                {selectedRecording ? (
                                  <video
                                    key={selectedRecording.metadata.id}
                                    controls
                                    className="w-full rounded-md max-h-[420px]"
                                    src={selectedRecording.videoUrl}
                                  />
                                ) : (
                                  <div className="text-sm text-slate-200 p-6">Select a recording to play</div>
                                )}
                              </div>
                              <div className="rounded-lg border p-2 bg-muted/20 max-h-[420px] overflow-auto space-y-2">
                                {resolvedRecordings.map((recording) => (
                                  <button
                                    key={recording.metadata.id}
                                    type="button"
                                    onClick={() => setSelectedRecordingId(recording.metadata.id)}
                                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                                      selectedRecording?.metadata.id === recording.metadata.id
                                        ? "bg-royal-blue text-white"
                                        : "hover:bg-muted text-foreground"
                                    }`}
                                  >
                                    <p className="font-semibold">{recording.metadata.title}</p>
                                    <p className="text-xs opacity-90">{recording.metadata.subject}</p>
                                    <p className="text-xs opacity-90">Duration: {recording.metadata.duration}</p>
                                    <p className="text-xs opacity-90">
                                      Uploaded: {new Date(recording.metadata.upload_date).toLocaleDateString("en-IN")}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="live-class">
                        <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                          Live Jitsi classes are discontinued. Use Recorded Classes to watch Zoom session uploads.
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {activeTab === "resources" && (
                <Card variant="padma">
                  <CardHeader>
                    <CardTitle className="text-royal-blue">Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                      Notes, PDFs, and practice sheets will be available here.
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "data-challenges" && (
                <Card variant="padma">
                  <CardHeader>
                    <CardTitle className="text-royal-blue flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Data Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
                      Challenge tasks and leaderboard will be visible here.
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

export default StudentPortal;
