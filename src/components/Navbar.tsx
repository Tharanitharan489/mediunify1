import React from 'react';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Search,
  PlusCircle,
  FileText,
  AlertTriangle,
  Layers,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { StaffUser, UserRole, Patient } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'patient-record' | 'register' | 'security-audit' | 'presentation-overview';
  setCurrentTab: (tab: 'dashboard' | 'patient-record' | 'register' | 'security-audit' | 'presentation-overview') => void;
  currentUser: StaffUser;
  setCurrentUser: (user: StaffUser) => void;
  allStaffUsers: StaffUser[];
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  selectedPatientId: string;
  onOpenRegister: () => void;
  onOpenDemoTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  allStaffUsers,
  patients,
  onSelectPatient,
  selectedPatientId,
  onOpenRegister,
  onOpenDemoTour,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.diagnoses.some((d) => d.condition.toLowerCase().includes(q))
    );
  }, [searchQuery, patients]);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'doctor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'nurse':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top emergency / affiliation bar */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 flex flex-wrap items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">MediUnify v2.4</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">HealthTech · Electronic Health Records (EHR) · Full Stack Architecture</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            HIPAA & NDHM Compliant
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">SNS College of Technology · AI Campus</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Name */}
          <div
            id="nav-logo"
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                  Medi<span className="text-teal-400">Unify</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Unified EHR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight hidden sm:block">
                Unified Records · Smarter Clinical Decisions
              </p>
            </div>
          </div>

          {/* Quick Patient Search input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="global-patient-search"
                type="text"
                placeholder="Search patient by name or ID (e.g., PT-20481, Arun)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                <div className="p-2 text-[11px] font-semibold text-slate-400 bg-slate-850 uppercase tracking-wider border-b border-slate-700">
                  Found {searchResults.length} Matching Patient(s)
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/60">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPatient(p.id);
                        setCurrentTab('patient-record');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-700/80 transition-colors flex items-center justify-between text-sm"
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {p.name}
                          <span className="text-xs font-mono text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800">
                            {p.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {p.age}y · {p.gender} · Blood {p.bloodGroup} · Last Visit: {p.lastVisit}
                        </div>
                      </div>
                      {p.allergies.length > 0 && (
                        <span className="text-[10px] bg-rose-950/70 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Allergy: {p.allergies[0].allergen}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Register & Demo buttons */}
          <div className="flex items-center gap-2">
            {onOpenDemoTour && (
              <button
                id="btn-demo-tour-nav"
                onClick={onOpenDemoTour}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-md shadow-amber-950/40 animate-pulse cursor-pointer"
                title="Launch guided interactive clinical demonstration"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Live Demo Tour</span>
                <span className="sm:hidden">Tour</span>
              </button>
            )}

            <button
              id="btn-register-patient-nav"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              title="Register new patient into unified database"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Register Patient</span>
            </button>

            {/* Role-Based Access Switcher */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
              <div className="flex items-center gap-2 px-2 py-1">
                <UserCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div className="hidden lg:block text-left mr-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Role</div>
                  <div className="text-xs font-bold text-slate-100 truncate max-w-[130px]">{currentUser.name}</div>
                </div>
                <select
                  id="role-switcher-select"
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = allStaffUsers.find((u) => u.id === e.target.value);
                    if (found) setCurrentUser(found);
                  }}
                  className={`text-xs font-semibold py-1 px-2 rounded cursor-pointer border ${getRoleBadgeColor(
                    currentUser.role
                  )} focus:outline-none focus:ring-1 focus:ring-teal-400`}
                >
                  {allStaffUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                      {u.role.toUpperCase()}: {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center space-x-1 border-t border-slate-800 py-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-btn-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Staff Dashboard
          </button>

          <button
            id="tab-btn-patient-record"
            onClick={() => setCurrentTab('patient-record')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'patient-record'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Patient Record View (Arun Kumar)
          </button>

          <button
            id="tab-btn-security-audit"
            onClick={() => setCurrentTab('security-audit')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'security-audit'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Security & Audit Logs
          </button>

          <button
            id="tab-btn-architecture"
            onClick={() => setCurrentTab('presentation-overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'presentation-overview'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Problem & Architecture (Slides)
          </button>
        </div>
      </div>
    </header>
  );
};
