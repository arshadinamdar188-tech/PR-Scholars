import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Image,
  Images,
  BookOpen,
  Tag,
  ShoppingCart,
  Home,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    title: "Banners",
    url: "/admin/banners",
    icon: Image,
    description: "Manage homepage carousel",
  },
  {
    title: "Gallery",
    url: "/admin/gallery",
    icon: Images,
    description: "Manage gallery images",
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: BookOpen,
    description: "Manage course content",
  },
  {
    title: "Coupons",
    url: "/admin/coupons",
    icon: Tag,
    description: "Manage discount codes",
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    description: "View purchases",
  },
  {
    title: "Padma Config",
    url: "/admin/padma-config",
    icon: BookOpen,
    description: "Boards, grades, pricing",
  },
  {
    title: "R's Academy Config",
    url: "/admin/racademy-config",
    icon: Shield,
    description: "Modules & subjects",
  },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(path);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-secondary">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-royal-blue flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">PRScholars</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        <span>Back to Site</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                      >
                        <Link
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 transition-colors",
                            isActive(item.url)
                              ? "text-royal-blue font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-secondary border-b border-border p-2 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
