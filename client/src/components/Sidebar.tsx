import { Link, useLocation } from "wouter";
import { Home, Star, Users, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { User } from "../shared/schema";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Featured",
    href: "/featured",
    icon: Star,
  },
  {
    title: "My Cases",
    href: "/my-cases",
    icon: FileText,
  },
  {
    title: "Colleagues",
    href: "/colleagues",
    icon: Users,
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div
      className={cn(
        "flex flex-col w-64 bg-white dark:bg-card border-r border-slate-200 dark:border-border",
        className
      )}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-medical-blue">
          ClinicalCaseHub
        </h1>
      </div>

      {user && (
        <div className="px-6 py-4 border-y border-slate-200 dark:border-border">
          <div className="flex items-center gap-3">
            <img
              src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=2563eb&color=fff`}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-foreground">
                Dr. {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-slate-600 dark:text-muted-foreground">
                {user.specialty}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    location === item.href
                      ? "bg-medical-blue text-white"
                      : "text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-accent"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200 dark:border-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-accent rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
