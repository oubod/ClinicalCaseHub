import { useAuth } from "@/hooks/useAuth";
import { Stethoscope, Home, FileText, Users, Star, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: FileText, label: "My Cases", href: "/my-cases" },
    { icon: Users, label: "Colleagues", href: "/colleagues" },
    { icon: Star, label: "Featured Cases", href: "/featured" },
    { icon: Search, label: "Search Cases", href: "/search" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-card shadow-sm border-r border-slate-200 dark:border-border flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-slate-200 dark:border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
            <Stethoscope className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">MedCase</h1>
            <p className="text-sm text-slate-500 dark:text-muted-foreground">Clinical Connect</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start ${
              item.active 
                ? "bg-medical-blue text-white hover:bg-medical-blue-dark" 
                : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-50 dark:hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-medical-error text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200 dark:border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start p-3 hover:bg-slate-50 dark:hover:bg-muted"
          onClick={() => window.location.href = '/api/logout'}
        >
          <img 
            src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName || 'User')}&background=2563eb&color=fff`}
            alt={`${user?.firstName} ${user?.lastName}` || 'User'}
            className="w-10 h-10 rounded-full object-cover mr-3" 
          />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-foreground truncate">
              Dr. {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-muted-foreground truncate">
              {user?.specialty || 'General Medicine'}
            </p>
          </div>
          <i className="fas fa-chevron-right text-slate-400 text-xs ml-2"></i>
        </Button>
      </div>
    </aside>
  );
}
