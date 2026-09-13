import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Plus,
  Search,
  MessageSquare,
  Folder,
  BookOpen,
  Cpu,
  Wrench,
  Zap,
  ScrollText,
  Lock,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  ChevronRight,
  Activity,
  Clock,
  ArrowRight,
  Users,
  Building2,
  Bell,
  HeartPulse,
  LayoutDashboard,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, onOpenSearch, onOpenTelemetry }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const {
    conversations,
    currentSessionId,
    createNewConversation,
    switchConversation,
    deleteConversation,
  } = useWorkspace();
  const { connectionStatus } = useWebSocket();

  const mainNav = [
    { to: '/', label: 'Workspace', icon: <MessageSquare size={16} /> },
    { to: '/documents', label: 'Documents', icon: <Folder size={16} /> },
    { to: '/knowledge-base', label: 'Knowledge Base', icon: <BookOpen size={16} /> },
    ...(!hasRole('admin') ? [{ to: '/notices', label: 'Notices', icon: <Bell size={16} /> }] : []),
  ];

  const engineNav = [
    { to: '/models', label: 'Models', icon: <Cpu size={16} /> },
    { to: '/tools', label: 'Tools', icon: <Wrench size={16} /> },
    { to: '/tasks', label: 'Tasks', icon: <Zap size={16} /> },
  ];

  const governanceNav = [
    { to: '/audit-logs', label: 'Audit Logs', icon: <ScrollText size={16} /> },
    { to: '/security', label: 'Security', icon: <Lock size={16} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  const adminNav = [
    { to: '/admin/dashboard', label: 'Admin Portal', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/users', label: 'Users & Access', icon: <Users size={16} /> },
    { to: '/admin/departments', label: 'Departments', icon: <Building2 size={16} /> },
    { to: '/admin/notices', label: 'Notices', icon: <Bell size={16} /> },
    { to: '/admin/system-health', label: 'System Health', icon: <HeartPulse size={16} /> },
  ];

  const handleNewTask = () => {
    createNewConversation();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Extract the top 3 most recent tasks
  const recentTasks = conversations.slice(0, 3);

  return (
    <aside
      className={`h-screen bg-[#080a0e] border-r border-slate-800/80 flex flex-col justify-between select-none transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Scrollable Container for Top & Middle Hierarchy */}
      <div className="flex flex-col min-h-0 flex-1 overflow-y-auto">
        {/* 1. Brand & Collapse Header */}
        <div className="flex items-center justify-between px-3.5 py-3.5 border-b border-slate-800/80 flex-shrink-0 bg-[#080a0e] sticky top-0 z-10">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm flex-shrink-0">
                <Shield size={16} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
                  <span>YantraAI</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    v1.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Sovereign Workbench
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Shield size={18} />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        {/* 2. New Task & 3. Search Actions */}
        <div className="p-3 space-y-1.5 flex-shrink-0">
          {/* New Task Button */}
          <button
            onClick={handleNewTask}
            className={`w-full flex items-center gap-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition-all ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
            }`}
            title="Create New Task"
          >
            <Plus size={15} className="flex-shrink-0" />
            {!isCollapsed && <span>New Task</span>}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center justify-between rounded-lg bg-[#0e121a] hover:bg-[#141924] text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
            }`}
            title="Search Workspace (Ctrl+K)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search size={14} className="flex-shrink-0" />
              {!isCollapsed && <span>Search</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/50">
                Ctrl+K
              </span>
            )}
          </button>
        </div>

        {/* 4. RECENT TASKS (Top Area Hierarchy) */}
        {!isCollapsed ? (
          <div className="px-3 pb-2 pt-1 border-b border-slate-800/60">
            <div className="flex items-center justify-between px-1 py-1 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                <Clock size={11} className="text-sky-400" /> Recent Tasks
              </span>
              <button
                onClick={() => navigate('/tasks')}
                className="text-[10px] font-mono text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-0.5"
                title="View All Tasks"
              >
                <span>View All</span>
                <ChevronRight size={11} />
              </button>
            </div>

            {recentTasks.length === 0 ? (
              <div className="px-2 py-2 text-[11px] text-slate-400 italic">
                No recent tasks yet
              </div>
            ) : (
              <div className="space-y-1">
                {recentTasks.map((conv) => {
                  const isActive = conv.id === currentSessionId && location.pathname === '/';
                  return (
                    <div
                      key={conv.id}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#141b29] text-sky-200 border border-sky-500/30 shadow-xs'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-[#0f131c] border border-transparent'
                      }`}
                      onClick={() => {
                        switchConversation(conv.id);
                        if (location.pathname !== '/') navigate('/');
                      }}
                      title={conv.title}
                    >
                      <div className="truncate min-w-0 pr-1 text-[11px] font-mono">
                        {conv.title}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 transition-opacity flex-shrink-0"
                        title="Delete task"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed Recent Tasks Shortcut */
          <div className="px-3 pb-2 border-b border-slate-800/60 flex justify-center">
            <button
              onClick={() => navigate('/tasks')}
              className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-[#0f131c] transition-colors"
              title="Recent Tasks / View All Tasks"
            >
              <Clock size={16} />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-4">
          {/* 5. WORKSPACE */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1 font-semibold">
                Workspace
              </div>
            )}
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#151c28] text-sky-300 border border-sky-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f131c]'
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {/* 6. ENGINE & TOOLS */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1 font-semibold">
                Engine & Tools
              </div>
            )}
            {engineNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#151c28] text-sky-300 border border-sky-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f131c]'
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {/* 7. GOVERNANCE */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1 font-semibold">
                Governance
              </div>
            )}
            {governanceNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#151c28] text-sky-300 border border-sky-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f131c]'
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {/* 8. ADMIN MANAGEMENT (Admin RBAC Only) */}
          {hasRole('admin') && (
            <div className="space-y-0.5 pt-1 border-t border-slate-800/60">
              {!isCollapsed && (
                <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 px-2.5 py-1 font-semibold flex items-center justify-between">
                  <span>Administration</span>
                  <span className="text-[9px] px-1 rounded bg-sky-500/10 border border-sky-500/20">RBAC</span>
                </div>
              )}
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                    } ${
                      isActive
                        ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f131c]'
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 8. Bottom Section: System Local / Offline Secure Status (Pinned) */}
      <div className="p-3 border-t border-slate-800/80 bg-[#06080c] flex-shrink-0">
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 mb-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}

        {/* User clearance and department banner */}
        {!isCollapsed && user && (
          <div className="mb-2.5 px-2.5 py-2 rounded-lg bg-[#0a0d14] border border-slate-800/80 font-mono text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Department:</span>
              <span className="text-sky-300 font-semibold truncate max-w-[110px]">{user.department}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Clearance:</span>
              <span className="text-emerald-400">{user.clearanceLevel || 'RESTRICTED'}</span>
            </div>
          </div>
        )}

        {/* <button
          onClick={onOpenTelemetry}
          className={`w-full flex items-center rounded-lg bg-[#0e121a] hover:bg-[#141924] border border-slate-800/80 transition-all ${
            isCollapsed ? 'justify-center p-2' : 'p-2.5 justify-between'
          }`}
          title="Inspect Local Hardware & Telemetry"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {!isCollapsed && (
              <div className="text-left min-w-0">
                <div className="text-[11px] font-mono font-medium text-slate-200">
                  System Local
                </div>
                <div className="text-[10px] font-mono text-emerald-400/90">
                  Offline Secure
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <Activity size={13} className="text-slate-400 hover:text-sky-400" />
          )}
        </button> */}
      </div>
    </aside>
  );
};

export default Sidebar;
