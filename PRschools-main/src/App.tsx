import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AskPRSchoolChatbot from "@/components/AskPRSchoolChatbot";

// Main PRScholars Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Padma Maths Pro Pages
import PadmaHome from "./pages/padma/Home";
import PadmaAbout from "./pages/padma/About";
import PadmaFounders from "./pages/padma/Founders";
import PadmaAchievers from "./pages/padma/Achievers";
import PadmaMentors from "./pages/padma/Mentors";
import PadmaCourses from "./pages/padma/Courses";
import PadmaCourseDetail from "./pages/padma/CourseDetail";
import PadmaGallery from "./pages/padma/Gallery";
import PadmaAuth from "./pages/padma/Auth";
import PadmaCreatePassword from "./pages/padma/CreatePassword";
import PadmaStudentPortal from "./pages/padma/StudentPortal";
import PadmaTeacherPortal from "./pages/padma/TeacherPortal";
import PadmaAdminPortal from "./pages/padma/AdminPortal";

// Colonel R's Academy Pages
import RAcademyHome from "./pages/racademy/Home";
import RAcademyAbout from "./pages/racademy/About";
import RAcademyEligibility from "./pages/racademy/Eligibility";
import RAcademyGallery from "./pages/racademy/Gallery";
import RAcademyMentors from "./pages/racademy/Mentors";
import RAcademyCourses from "./pages/racademy/Courses";
import RAcademyCourseDetail from "./pages/racademy/CourseDetail";
import RAcademyModuleDetail from "./pages/racademy/ModuleDetail";
import RAcademyAuth from "./pages/racademy/Auth";

// Teachers Pages
import TeachersLogin from "./pages/teachers/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentRegisterPage from "./pages/student/Register";
import StudentVerifyEmailPage from "./pages/student/VerifyEmail";
import StudentCreatePasswordPage from "./pages/student/CreatePassword";
import StudentLoginPage from "./pages/student/Login";
import StudentForgotPasswordPage from "./pages/student/ForgotPassword";
import StudentResetPasswordPage from "./pages/student/ResetPassword";
import StudentPortalPage from "./pages/student/Portal";

// Policy Pages
import AboutUs from "./pages/policies/AboutUs";
import ContactUs from "./pages/policies/ContactUs";
import RefundPolicy from "./pages/policies/RefundPolicy";
import TermsAndConditions from "./pages/policies/TermsAndConditions";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import BannerManager from "./pages/admin/BannerManager";
import GalleryManager from "./pages/admin/GalleryManager";
import CourseManager from "./pages/admin/CourseManager";
import CourseEditor from "./pages/admin/CourseEditor";
import CouponManager from "./pages/admin/CouponManager";
import OrderManager from "./pages/admin/OrderManager";
import PadmaConfigManager from "./pages/admin/PadmaConfigManager";
import RAcademyConfigManager from "./pages/admin/RAcademyConfigManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* PRScholars Main Landing */}
          <Route path="/" element={<Index />} />
          
          {/* Padma Maths Pro Routes */}
          <Route path="/padma" element={<PadmaHome />} />
          <Route path="/padma/about" element={<PadmaAbout />} />
          <Route path="/padma/founders" element={<PadmaFounders />} />
          <Route path="/padma/achievers" element={<PadmaAchievers />} />
          <Route path="/padma/mentors" element={<PadmaMentors />} />
          <Route path="/padma/courses" element={<PadmaCourses />} />
          <Route path="/padma/courses/:slug" element={<PadmaCourseDetail />} />
          <Route path="/padma/gallery" element={<PadmaGallery />} />
          <Route path="/padma/auth" element={<PadmaAuth />} />
          <Route path="/padma/login" element={<PadmaAuth />} />
          <Route path="/padma/create-password" element={<PadmaCreatePassword />} />
          <Route path="/padma/student-portal" element={<PadmaStudentPortal />} />
          <Route path="/padma/teacher-portal" element={<PadmaTeacherPortal />} />
          <Route path="/padma/admin" element={<PadmaAdminPortal />} />
          
          {/* Colonel R's Academy Routes */}
          <Route path="/racademy" element={<RAcademyHome />} />
          <Route path="/racademy/about" element={<RAcademyAbout />} />
          <Route path="/racademy/eligibility" element={<RAcademyEligibility />} />
          <Route path="/racademy/gallery" element={<RAcademyGallery />} />
          <Route path="/racademy/mentors" element={<RAcademyMentors />} />
          <Route path="/racademy/courses" element={<RAcademyCourses />} />
          <Route path="/racademy/courses/:slug" element={<RAcademyModuleDetail />} />
          <Route path="/racademy/auth" element={<RAcademyAuth />} />
          <Route path="/racademy/login" element={<RAcademyAuth />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/banners" element={<BannerManager />} />
          <Route path="/admin/gallery" element={<GalleryManager />} />
          <Route path="/admin/courses" element={<CourseManager />} />
          <Route path="/admin/courses/:id" element={<CourseEditor />} />
          <Route path="/admin/coupons" element={<CouponManager />} />
          <Route path="/admin/orders" element={<OrderManager />} />
          <Route path="/admin/padma-config" element={<PadmaConfigManager />} />
          <Route path="/admin/racademy-config" element={<RAcademyConfigManager />} />

          {/* Teachers Routes */}
          <Route path="/teachers/login" element={<TeachersLogin />} />

          {/* Student Auth (Supabase Auth based) */}
          <Route path="/student/register" element={<StudentRegisterPage />} />
          <Route path="/student/verify-email" element={<StudentVerifyEmailPage />} />
          <Route path="/student/create-password" element={<StudentCreatePasswordPage />} />
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student/forgot-password" element={<StudentForgotPasswordPage />} />
          <Route path="/student/reset-password" element={<StudentResetPasswordPage />} />
          <Route
            path="/student/portal"
            element={
              <ProtectedRoute>
                <StudentPortalPage />
              </ProtectedRoute>
            }
          />
          
          {/* Policy Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AskPRSchoolChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;