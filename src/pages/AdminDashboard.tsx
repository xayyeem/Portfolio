import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Briefcase, Code2, FolderKanban, Sparkles,
  Link2, Mail, Settings, LogOut, Menu, X, ExternalLink
} from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../lib/auth';
import Overview from '../components/admin/Overview';
import ProfileEditor from '../components/admin/ProfileEditor';
import ExperienceManager from '../components/admin/ExperienceManager';
import SkillsManager from '../components/admin/SkillsManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import ServicesManager from '../components/admin/ServicesManager';
import SocialsManager from '../components/admin/SocialsManager';
import MessagesManager from '../components/admin/MessagesManager';
import SettingsEditor from '../components/admin/SettingsEditor';

const MODULES = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'skills', label: 'Skills', Icon: Code2 },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'services', label: 'Services', Icon: Sparkles },
  { id: 'socials', label: 'Social Links', Icon: Link2 },
  { id: 'messages', label: 'Messages', Icon: Mail },
  { id: 'settings', label: 'Site Settings', Icon: Settings },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const renderModule = () => {
    switch (active) {
      case 'overview': return <Overview onNavigate={setActive} />;
      case 'profile': return <ProfileEditor />;
      case 'experience': return <ExperienceManager />;
      case 'skills': return <SkillsManager />;
      case 'projects': return <ProjectsManager />;
      case 'services': return <ServicesManager />;
      case 'socials': return <SocialsManager />;
      case 'messages': return <MessagesManager />;
      case 'settings': return <SettingsEditor />;
      default: return <Overview onNavigate={setActive} />;
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage portfolio content." />
      <div className="min-h-screen flex bg-ink-950">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-900 border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 border-b border-white/[0.06]">
            <Link to="/" className="font-display text-xl font-bold tracking-tighter text-white">
              KHJ<span className="text-brand-400">.</span>
            </Link>
            <p className="text-xs font-mono text-gray-500 mt-1">Admin Dashboard</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => { setActive(mod.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === mod.id
                    ? 'bg-brand-400/10 text-brand-400 border border-brand-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <mod.Icon className="w-4 h-4 shrink-0" />
                {mod.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/[0.06] space-y-1">
            <a href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ExternalLink className="w-4 h-4 shrink-0" />
              View Site
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-danger-400 hover:bg-danger-500/10 transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-ink-950/80 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden sticky top-0 z-20 bg-ink-900/80 backdrop-blur-xl border-b border-white/[0.06] px-5 h-16 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-display text-sm font-bold text-white">
              {MODULES.find((m) => m.id === active)?.label}
            </span>
            <div className="w-6" />
          </div>

          <div className="p-6 lg:p-10 max-w-5xl">
            {renderModule()}
          </div>
        </main>
      </div>
    </>
  );
}
