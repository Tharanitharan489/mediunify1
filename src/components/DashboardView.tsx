import React from 'react';
import {
  Users,
  Calendar,
  FileCheck2,
  Activity,
  Search,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Stethoscope,
  Pill,
  Syringe,
} from 'lucide-react';
import { Patient, PendingReport, RecentActivity, StaffUser } from '../types';

interface DashboardViewProps {
  patients: Patient[];
  pendingReports: PendingReport[];
  recentActivities: RecentActivity[];
  currentUser: StaffUser;
  onSelectPatient: (patientId: string) => void;
  onViewPatientRecord: (patientId: string) => void;
  onResolveReport: (reportId: string) => void;
  onOpenRegisterModal: () => void;
  onOpenDemoTour?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  pendingReports,
  recentActivities,
  currentUser,
  onSelectPatient,
  onViewPatientRecord,
  onResolveReport,
  onOpenRegisterModal,
  onOpenDemoTour,
}) => {
  const [searchFilter, setSearchFilter] = React.useState('');

  const filteredPatients = React.useMemo(() => {
    if (!searchFilter.trim()) return patients.slice(0, 5);
    const q = searchFilter.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.diagnoses.some((d) => d.condition.toLowerCase().includes(q))
    );
  }, [searchFilter, patients]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <FileCheck2 className="w-4 h-4 text-sky-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'discharge':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner with Slide 8 layout branding */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-['Outfit'] tracking-tight">
              MediUnify — Staff Dashboard
            </h1>
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              Live Connected EHR
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.title}). All 4 former data silos (EMR A, Metropolis Lab, Central Pharmacy, Paper Records) are synchronized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-950/20 transition-all cursor-pointer animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              Start Interactive Demo Tour
            </button>
          )}

          <button
            onClick={() => onViewPatientRecord('PT-20481')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-teal-400" />
            Open Arun Kumar (PT-20481)
          </button>
        </div>
      </div>

      {/* Quick Interactive Demo strip */}
      {onOpenDemoTour && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 border border-teal-500/30 rounded-xl p-4 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-['Outfit']">
                  Interactive Evaluation Demo: Problem Statement & Clinical Safety
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ready to test
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Explore real-time Penicillin allergy prevention, Arun Kumar's Slide 9 unified chart, RBAC role switches, and HIPAA audit trails.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDemoTour}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch 6-Step Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Metric Cards - Directly matching Slide 8 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Patients */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Patients</span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">1,248</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12 this week</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">All departments consolidated</p>
        </div>

        {/* Card 2: Today's Appointments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Appointments</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">36</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">6 in progress</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">OPD & Specialist clinics</p>
        </div>

        {/* Card 3: Pending Reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Reports</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">9</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">3 urgent</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pathology, Ortho, Neuro</p>
        </div>

        {/* Card 4: Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">18</span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Past 4 hours</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cross-department syncs</p>
        </div>
      </div>

      {/* Main 2-Column Section matching Slide 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Patient Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recent Patient Activity</h2>
              <p className="text-xs text-slate-500">Live feed of uploads, prescriptions, and status updates across departments</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Real-time feed
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => onViewPatientRecord(act.patientId)}
                className="px-5 py-3.5 hover:bg-teal-50/40 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    {getActivityIcon(act.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                        {act.patientName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">({act.patientId})</span>
                    </div>
                    <p className="text-xs text-slate-600">{act.action}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {act.timeAgo}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing verified activity events from all 4 connected subsystems</span>
            <button
              onClick={() => onViewPatientRecord('PT-20481')}
              className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              Inspect Patient Record (Arun Kumar) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Patient Search & Pending Reports */}
        <div className="space-y-6">
          {/* Quick Patient Search Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Quick Patient Search</h3>
            <p className="text-xs text-slate-500 mb-3">Find patient records fast using key identifiers.</p>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="quick-patient-search-input"
                type="text"
                placeholder="Enter name, ID or phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            {/* Matching Patient quick list */}
            <div className="space-y-1.5">
              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onViewPatientRecord(p.id)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-900 group-hover:text-teal-700">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {p.id} · {p.age}y · Blood {p.bloodGroup}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={onOpenRegisterModal}
                className="w-full text-center py-2 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
              >
                + Register New Patient Intake
              </button>
            </div>
          </div>

          {/* Pending Reports Widget (Slide 8 exact items) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pending Reports</h3>
                <p className="text-xs text-slate-500">Awaiting sign-off into unified records</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {pendingReports.length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        {report.testName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Location: <span className="font-medium text-slate-700">{report.roomOrLocation}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Patient: <span className="font-semibold">{report.patientName}</span> ({report.patientId})
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        report.priority === 'Stat'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : report.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onViewPatientRecord(report.patientId)}
                      className="text-teal-700 hover:text-teal-900 font-medium text-[11px]"
                    >
                      Open Patient Record
                    </button>
                    <button
                      onClick={() => onResolveReport(report.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                      title="Sync and sign off this diagnostic report into patient EHR"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Sign Off & Sync
                    </button>
                  </div>
                </div>
              ))}

              {pendingReports.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  All diagnostic lab reports have been reviewed and signed off into the unified records!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 & 4 Architectural Solution Comparison bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-base text-white">
                "The information exists — but it is not always available in one place when it is needed."
              </h3>
            </div>
            <p className="text-xs text-teal-200/90 mt-1 max-w-3xl">
              MediUnify replaces 5 scattered logins (EMR A, Metropolis Lab Sys, Central Pharmacy, and Paper Archive Folders) with a single, consolidated clinical view — preventing repeated tests and medical errors.
            </p>
          </div>
          <button
            onClick={() => onViewPatientRecord('PT-20481')}
            className="whitespace-nowrap px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md"
          >
            View Slide 9: Arun Kumar Record →
          </button>
        </div>
      </div>
    </div>
  );
};
