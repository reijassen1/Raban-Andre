import { ReactNode } from 'react';
import { Page } from '../App';
import { Mic, Video, Zap, Menu, X, MonitorPlay, Sprout, Map } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navGroups = [
    {
      title: '常规主持实训',
      items: [
        { id: 'master' as Page, label: '文本跟读评测', icon: Mic, description: '发音与语态' },
        { id: 'training' as Page, label: '技巧语言训练', icon: Mic, description: '绕口令与易混音' },
      ]
    },
    {
      title: '模拟赛程实训',
      items: [
        { id: 'impromptu' as Page, label: '90s即兴考核', icon: Zap, description: '链接多场景' },
        { id: 'presentation' as Page, label: '3min自我展示', icon: MonitorPlay, description: '打造个人IP' },
      ]
    },
    {
      title: '情景直播实战',
      items: [
        { id: 'live-agriculture' as Page, label: '直播助农', icon: Sprout, description: '助力乡村振兴' },
        { id: 'live-tourism' as Page, label: '直播文旅', icon: Map, description: '助力文旅融合' },
        { id: 'live' as Page, label: '直播带货', icon: Video, description: '助力消费升级' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">融媒智播</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[73px] bg-neutral-950 z-40 border-b border-neutral-800"
          >
            <nav className="flex flex-col p-4 gap-6 overflow-y-auto max-h-[calc(100vh-73px)]">
              {navGroups.map((group, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 mb-1">{group.title}</div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                          isActive
                            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                            : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-neutral-800 bg-neutral-950/50 backdrop-blur-xl p-6">
        <nav className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 mb-1">{group.title}</div>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 relative group ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          className="absolute inset-0 border border-indigo-500/30 rounded-2xl bg-indigo-500/5"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className={`relative z-10 p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-800 group-hover:bg-neutral-700'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left relative z-10">
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-xs opacity-60 mt-0.5">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                融媒智播
              </h1>
              <p className="text-[10px] text-neutral-500 font-medium tracking-tight mt-0.5 whitespace-nowrap">《直播与融媒主持》课程实时赋分APP</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-neutral-950">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
