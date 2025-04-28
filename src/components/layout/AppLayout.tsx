
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  BarChart2, 
  Bell, 
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Logo component
const Logo: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div className={cn(
    "flex items-center h-14 px-4 font-semibold text-sidebar-foreground",
    collapsed ? "justify-center" : "justify-start"
  )}>
    {collapsed ? (
      <span className="text-xl">ISV</span>
    ) : (
      <>
        <span className="text-xl">Index</span>
        <span className="text-sidebar-primary ml-1 text-xl">Alert</span>
      </>
    )}
  </div>
);

// Sidebar link component
interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  collapsed,
  active 
}) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground",
      collapsed ? "justify-center" : ""
    )}
  >
    <Icon className="h-5 w-5" />
    {!collapsed && <span>{label}</span>}
  </Link>
);

// Main AppLayout component
interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPath }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <Logo collapsed={collapsed} />

        {/* Main Navigation */}
        <div className="flex-1 overflow-auto scrollbar-thin py-4">
          <nav className="flex flex-col gap-1 px-2">
            <SidebarLink 
              to="/" 
              icon={Home} 
              label="Dashboard" 
              collapsed={collapsed} 
              active={currentPath === "/"}
            />
            <SidebarLink 
              to="/indices" 
              icon={BarChart2} 
              label="Indices" 
              collapsed={collapsed}
              active={currentPath === "/indices"}
            />
            <SidebarLink 
              to="/alerts" 
              icon={Bell} 
              label="Alerts" 
              collapsed={collapsed}
              active={currentPath === "/alerts"}
            />
            <SidebarLink 
              to="/settings" 
              icon={Settings} 
              label="Settings" 
              collapsed={collapsed}
              active={currentPath === "/settings"}
            />
          </nav>
        </div>
        
        {/* User Section */}
        <div className="p-2 border-t border-sidebar-border">
          {/* User profile */}
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-md mb-2",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">User</p>
              </div>
            )}
          </div>
          
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
