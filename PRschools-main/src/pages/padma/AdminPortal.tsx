import { useMemo, useState } from "react";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import StudentAccessManager from "@/components/padma/StudentAccessManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardCheck,
  Layers,
  CalendarDays,
  Upload,
  IndianRupee,
  FileBarChart,
  Bell,
  Image,
  SplitSquareHorizontal,
  UserPlus,
  Clock,
  Timer,
  Video,
  ShieldCheck,
  Plus,
  FileSpreadsheet,
  LucideIcon,
} from "lucide-react";

type AdminFeature = {
  key: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  stats: Array<{
    label: string;
    value: string;
    trend?: string;
  }>;
};

const studentManagementFeatures: AdminFeature[] = [
  {
    key: "manage-students-teachers",
    label: "Manage students & teachers",
    title: "Manage Students & Teachers",
    description:
      "Create, update, and organize student and teacher profiles in one place. Assign roles and keep account details centralized.",
    icon: Users,
    stats: [
      { label: "Total Students", value: "3,842", trend: "+12%" },
      { label: "Active Teachers", value: "128", trend: "+4%" },
      { label: "New This Month", value: "264", trend: "+18%" },
    ],
  },
  {
    key: "approve-enrollments",
    label: "Approve enrollments",
    title: "Approve Enrollments",
    description:
      "Review pending enrollment requests, validate eligibility, and approve admissions with complete visibility.",
    icon: ClipboardCheck,
    stats: [
      { label: "Pending", value: "47", trend: "-3%" },
      { label: "Approved Today", value: "12", trend: "+8%" },
      { label: "Total Enrolled", value: "3,421", trend: "+15%" },
    ],
  },
  {
    key: "create-batches",
    label: "Create batches",
    title: "Create Batches",
    description: "Create and configure class batches by grade, subject, faculty, and schedule windows.",
    icon: Layers,
    stats: [
      { label: "Active Batches", value: "36", trend: "+2%" },
      { label: "Avg Batch Size", value: "28", trend: "0%" },
      { label: "Upcoming", value: "8", trend: "+5%" },
    ],
  },
  {
    key: "schedule-classes-tests",
    label: "Schedule classes & tests",
    title: "Schedule Classes & Tests",
    description: "Plan class calendars and assessment schedules with reminders for both teachers and students.",
    icon: CalendarDays,
    stats: [
      { label: "Classes Today", value: "14", trend: "+3%" },
      { label: "Tests This Week", value: "6", trend: "+1%" },
      { label: "Completion Rate", value: "94%", trend: "+2%" },
    ],
  },
  {
    key: "upload-manage-content",
    label: "Upload or manage content",
    title: "Upload or Manage Content",
    description: "Upload notes, assignments, tests, and recordings with structured content controls.",
    icon: Upload,
    stats: [
      { label: "Total Files", value: "2,194", trend: "+22%" },
      { label: "Videos", value: "418", trend: "+10%" },
      { label: "Storage Used", value: "128 GB", trend: "+5%" },
    ],
  },
  {
    key: "fee-collection-summary",
    label: "View fee collection summary",
    title: "View Fee Collection Summary",
    description: "Track fee collections, pending dues, and payment health across all running batches.",
    icon: IndianRupee,
    stats: [
      { label: "Collected (Month)", value: "INR 8.4L", trend: "+9%" },
      { label: "Pending Dues", value: "INR 1.2L", trend: "-6%" },
      { label: "Collection Rate", value: "87%", trend: "+3%" },
    ],
  },
  {
    key: "generate-reports",
    label: "Generate reports",
    title: "Generate Reports",
    description: "Export academic, attendance, and performance reports with scheduled automation.",
    icon: FileBarChart,
    stats: [
      { label: "Reports Generated", value: "342", trend: "+14%" },
      { label: "Scheduled", value: "18", trend: "+2%" },
      { label: "Average Score", value: "74%", trend: "+5%" },
    ],
  },
  {
    key: "notifications-reminders",
    label: "Send notifications & reminders",
    title: "Send Notifications & Reminders",
    description: "Broadcast announcements, schedule reminders, and send targeted communication instantly.",
    icon: Bell,
    stats: [
      { label: "Sent Today", value: "1,284", trend: "+30%" },
      { label: "Open Rate", value: "68%", trend: "+4%" },
      { label: "Pending", value: "24", trend: "-12%" },
    ],
  },
  {
    key: "website-banners-pages",
    label: "Manage website banners/pages",
    title: "Manage Website Banners & Pages",
    description: "Update homepage banners, announcements, and critical website pages without friction.",
    icon: Image,
    stats: [
      { label: "Live Banners", value: "6" },
      { label: "Pages Managed", value: "14", trend: "+1%" },
      { label: "Last Published", value: "2h ago" },
    ],
  },
  {
    key: "manage-sections",
    label: "Manage Maths, NDA/CDS and SSB sections separately",
    title: "Manage Maths, NDA/CDS and SSB Sections Separately",
    description: "Operate each program stream independently with dedicated controls and tracking.",
    icon: SplitSquareHorizontal,
    stats: [
      { label: "Maths Streams", value: "12", trend: "+1%" },
      { label: "NDA/CDS Streams", value: "7", trend: "+2%" },
      { label: "SSB Streams", value: "5", trend: "+1%" },
    ],
  },
  {
    key: "manage-mock-tests",
    label: "Manage mock tests",
    title: "Manage Mock Tests",
    description:
      "Create subjects, upload Excel question sheets, and instantly sync the mock test question bank for students.",
    icon: FileSpreadsheet,
    actionLabel: "Open Mock Test Manager",
    actionHref: "/mock-test.html?openAdmin=1",
    stats: [
      { label: "Import Format", value: "Excel/CSV" },
      { label: "Question Types", value: "Single Correct" },
      { label: "Sync Mode", value: "Instant" },
    ],
  },
];

const teacherManagementFeatures: AdminFeature[] = [
  {
    key: "teacher-onboarding",
    label: "Teacher onboarding",
    title: "Teacher Onboarding",
    description: "Register and activate teachers with role-based access and proper batch mapping.",
    icon: UserPlus,
    stats: [
      { label: "Onboarded", value: "42", trend: "+6%" },
      { label: "Pending Verification", value: "5", trend: "-2%" },
      { label: "This Month", value: "9", trend: "+28%" },
    ],
  },
  {
    key: "teacher-attendance",
    label: "Teacher attendance",
    title: "Teacher Attendance",
    description: "Track teacher attendance, punctuality, and leave trends for better scheduling.",
    icon: Clock,
    stats: [
      { label: "Present Today", value: "31", trend: "+3%" },
      { label: "On Leave", value: "2", trend: "-1%" },
      { label: "Attendance Rate", value: "96%", trend: "+2%" },
    ],
  },
  {
    key: "class-hours-tracking",
    label: "Class hours tracking",
    title: "Class Hours Tracking",
    description: "Track delivered hours against planned weekly and monthly teaching targets.",
    icon: Timer,
    stats: [
      { label: "Hours This Week", value: "286", trend: "+7%" },
      { label: "Hours Planned", value: "302", trend: "0%" },
      { label: "Completion", value: "95%", trend: "+2%" },
    ],
  },
  {
    key: "session-recording-archive",
    label: "Session recording archive",
    title: "Session Recording Archive",
    description: "Access and organize recorded sessions by teacher, class, chapter, and date.",
    icon: Video,
    stats: [
      { label: "Recordings", value: "1,124", trend: "+10%" },
      { label: "New Uploads", value: "24", trend: "+20%" },
      { label: "Archive Size", value: "1.8 TB", trend: "+6%" },
    ],
  },
];

const StatCard = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) => {
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  return (
    <div className="rounded-xl border border-teal-100 bg-white/85 p-4 md:p-5 min-w-[170px] flex-1 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500 font-semibold mb-1.5">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-3xl leading-none font-extrabold text-slate-900">{value}</span>
        {trend && (
          <span
            className={`mb-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-teal-100 text-teal-700"
                : isNegative
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-200 text-slate-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

const FeaturePanel = ({ feature }: { feature: AdminFeature }) => {
  const Icon = feature.icon;

  return (
    <Card className="rounded-2xl border-slate-200 bg-slate-50/90 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            {feature.actionHref && feature.actionLabel && (
              <div className="mt-4">
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                  <a href={feature.actionHref}>{feature.actionLabel}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminPortal = () => {
  const [studentTab, setStudentTab] = useState(studentManagementFeatures[0].key);
  const [teacherTab, setTeacherTab] = useState(teacherManagementFeatures[0].key);

  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const activeStudentFeature = useMemo(
    () => studentManagementFeatures.find((feature) => feature.key === studentTab) ?? studentManagementFeatures[0],
    [studentTab],
  );

  const activeTeacherFeature = useMemo(
    () => teacherManagementFeatures.find((feature) => feature.key === teacherTab) ?? teacherManagementFeatures[0],
    [teacherTab],
  );

  return (
    <PadmaLayout>
      <section className="py-10 md:py-14 bg-gradient-to-br from-slate-50 via-teal-50/50 to-slate-100 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 space-y-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="bg-teal-100 text-teal-900 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Padma Admin Control Center
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Admin Management Dashboard</h1>
              <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">
                Control students, teachers, schedules, content, fees, and platform operations from a single panel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
                {todayDate}
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 gap-2">
                <Plus className="w-4 h-4" />
                Quick Add
              </Button>
            </div>
          </div>

          <Tabs defaultValue="students-management" className="w-full">
            <TabsList className="w-full md:w-auto h-auto p-1.5 gap-1 bg-slate-200/80 rounded-xl shadow-inner">
              <TabsTrigger
                value="students-management"
                className="py-2.5 px-5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700"
              >
                Student&apos;s Management
              </TabsTrigger>
              <TabsTrigger
                value="teacher-management"
                className="py-2.5 px-5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700"
              >
                Teacher Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students-management" className="mt-7">
              <Card className="rounded-3xl border-slate-200/90 bg-white/85 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
                <CardHeader className="pb-3">
                  <div className="w-1 h-8 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.3)]" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={studentTab} onValueChange={setStudentTab} className="w-full">
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-2 p-3 rounded-xl border border-teal-200 bg-teal-50/60">
                      {studentManagementFeatures.map((feature) => (
                        <TabsTrigger
                          key={feature.key}
                          value={feature.key}
                          className="text-xs md:text-sm rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                        >
                          {feature.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="mt-4 flex flex-wrap gap-4">
                      {activeStudentFeature.stats.map((stat) => (
                        <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} />
                      ))}
                    </div>

                    {studentManagementFeatures.map((feature) => (
                      <TabsContent key={feature.key} value={feature.key} className="mt-5">
                        {feature.key === "manage-students-teachers" ? (
                          <StudentAccessManager />
                        ) : (
                          <FeaturePanel feature={feature} />
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teacher-management" className="mt-7">
              <Card className="rounded-3xl border-slate-200/90 bg-white/85 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
                <CardHeader className="pb-3">
                  <div className="w-1 h-8 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.3)]" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={teacherTab} onValueChange={setTeacherTab} className="w-full">
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-2 p-3 rounded-xl border border-teal-200 bg-teal-50/60">
                      {teacherManagementFeatures.map((feature) => (
                        <TabsTrigger
                          key={feature.key}
                          value={feature.key}
                          className="text-xs md:text-sm rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                        >
                          {feature.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="mt-4 flex flex-wrap gap-4">
                      {activeTeacherFeature.stats.map((stat) => (
                        <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} />
                      ))}
                    </div>

                    {teacherManagementFeatures.map((feature) => (
                      <TabsContent key={feature.key} value={feature.key} className="mt-5">
                        <FeaturePanel feature={feature} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default AdminPortal;
