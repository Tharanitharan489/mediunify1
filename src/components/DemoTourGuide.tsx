import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileText,
  UserCheck,
  Brain,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Play,
  Stethoscope,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { StaffUser } from '../types';

interface DemoTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'dashboard' | 'patient-record' | 'register' | 'security-audit' | 'presentation-overview') => void;
  onSelectPatient: (patientId: string) => void;
  onOpenMedicationModalWithPreload?: (medName: string) => void;
  onSwitchUser: (userRole: 'doctor' | 'nurse' | 'admin') => void;
  onTriggerAiInsights?: () => void;
  currentUser: StaffUser;
}

interface DemoStep {
  id: number;
  title: string;
  badge: string;
  category: 'Clinical Safety' | 'Unified Chart' | 'RBAC' | 'AI Assistant' | 'Diagnostics' | 'Audit & Compliance';
  icon: any;
  headline: string;
  problemSolved: string;
  whatHappens: string;
  actionText: string;
  action: () => void;
}

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectPatient,
  onOpenMedicationModalWithPreload,
  onSwitchUser,
  currentUser,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const steps: DemoStep[] = [
    {
      id: 1,
      title: 'Unified Patient Record (Slide 9 Reference Case)',
      badge: 'Step 1 of 6',
      category: 'Unified Chart',
      icon: FileText,
      headline: 'Consolidated Single-Screen Clinical Chart for Arun Kumar (PT-20481)',
      problemSolved:
        'In fragmented systems, clinical data is split across outpatient notes, cardiology clinics, lab PDFs, and pharmacy slips, leading to blind spots and conflicting treatments.',
      whatHappens:
        'MediUnify aggregates demographics, active prescriptions, chronic conditions (Type 2 Diabetes, Hypertension), vitals trends, and allergy shields into one synchronized view.',
      actionText: '1. View Arun Kumar\'s Unified Chart',
      action: () => {
        onSelectPatient('PT-20481');
        onSelectTab('patient-record');
      },
    },
    {
      id: 2,
      title: 'Real-Time Allergy Safety Shield (The Penicillin Test)',
      badge: 'Step 2 of 6',
      category: 'Clinical Safety',
      icon: AlertTriangle,
      headline: 'Instant Detection of Severe Drug Contraindications',
      problemSolved:
        'Medication errors due to overlooked allergy records account for thousands of preventable hospitalizations annually when records are fragmented.',
      whatHappens:
        'Arun Kumar has a severe allergy to Penicillin. When a clinician attempts to order Amoxicillin (a penicillin derivative), the safety shield instantly blocks the unsafe order with an active contraindication alert.',
      actionText: '2. Simulate Ordering Amoxicillin (Trigger Safety Alert)',
      action: () => {
        onSelectPatient('PT-20481');
        onSelectTab('patient-record');
        if (onOpenMedicationModalWithPreload) {
          onOpenMedicationModalWithPreload('Amoxicillin 500mg');
        }
      },
    },
    {
      id: 3,
      title: 'Role-Based Access Control (RBAC)',
      badge: 'Step 3 of 6',
      category: 'RBAC',
      icon: UserCheck,
      headline: 'Enforcing Distinct Permissions for Doctors, Nurses, and Admins',
      problemSolved:
        'Healthcare security requires strict least-privilege access. Unregulated access risks accidental overwriting or regulatory non-compliance.',
      whatHappens:
        'Doctors can prescribe meds and add clinical diagnoses; Nurses record daily telemetry and vitals; Admins manage user security and audit logs.',
      actionText: '3. Toggle to Staff Nurse Rajesh (Vitals & Nursing Flow)',
      action: () => {
        onSwitchUser('nurse');
        onSelectTab('patient-record');
      },
    },
    {
      id: 4,
      title: 'AI-Assisted Clinical Decision Support (Gemini)',
      badge: 'Step 4 of 6',
      category: 'AI Assistant',
      icon: Brain,
      headline: 'Automated Trajectory & Cross-Checking of Clinical Markers',
      problemSolved:
        'Physicians with 5-minute appointment windows struggle to parse through pages of historical lab results to identify deteriorating trends.',
      whatHappens:
        'The clinical engine analyzes longitudinal lab markers (e.g. rising HbA1c to 8.2%), alerts about microvascular risks, and suggests evidence-based recommendations.',
      actionText: '4. Open AI Insights Tab on Arun\'s Record',
      action: () => {
        onSelectPatient('PT-20481');
        onSelectTab('patient-record');
      },
    },
    {
      id: 5,
      title: 'Inbound Silo Reconciliation (Diagnostic Reports)',
      badge: 'Step 5 of 6',
      category: 'Diagnostics',
      icon: Activity,
      headline: 'Synchronizing External Laboratory Feeds into the Master EHR',
      problemSolved:
        'External imaging centers and pathology labs email disconnected PDF reports that are frequently lost or unreviewed by attending physicians.',
      whatHappens:
        'Pending diagnostic reports are queued for review and can be digitally reconciled and signed off directly into the patient\'s permanent timeline.',
      actionText: '5. View Staff Dashboard & Pending Feeds',
      action: () => {
        onSelectTab('dashboard');
      },
    },
    {
      id: 6,
      title: 'Immutable HIPAA Audit Ledger & 8 Security Pillars',
      badge: 'Step 6 of 6',
      category: 'Audit & Compliance',
      icon: ShieldCheck,
      headline: 'Cryptographic Tamper-Evident Trail of All Healthcare Interactions',
      problemSolved:
        'Lack of accountability in paper records or siloed software makes compliance tracking impossible and breaches difficult to detect.',
      whatHappens:
        'Every chart opening, medication check, allergy override, and login is stamped with user ID, role, action, and IP address in an immutable compliance ledger.',
      actionText: '6. Inspect Security & Audit Ledger',
      action: () => {
        onSelectTab('security-audit');
      },
    },
  ];

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl border border-teal-500/40 p-3.5 flex items-center gap-3 animate-fadeIn">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-teal-300">Live Demo Tour Active</div>
          <div className="text-[11px] text-slate-300">
            {currentStep.badge}: {currentStep.title.slice(0, 30)}...
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Expand Demo Tour"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
          title="Exit Demo Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-['Outfit']">
                  Interactive User Demo Tour
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {currentStep.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluating MediUnify against healthcare data fragmentation & clinical decision risks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Minimize to floating pill"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Tabs */}
        <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                idx === currentStepIndex
                  ? 'bg-teal-700 text-white shadow-sm font-bold'
                  : idx < currentStepIndex
                  ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-200'
                  : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[90px] sm:max-w-none">{s.category}</span>
              {idx < currentStepIndex && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-teal-600 mb-0.5">
                {currentStep.category} · Scenario {currentStep.id}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] leading-snug">
                {currentStep.headline}
              </h3>
            </div>
          </div>

          {/* Problem Box */}
          <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              The Problem in Traditional Siloed Healthcare:
            </div>
            <p className="leading-relaxed text-rose-800/90">{currentStep.problemSolved}</p>
          </div>

          {/* Solution & What Happens Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              How MediUnify Solves It:
            </div>
            <p className="leading-relaxed text-emerald-900/90">{currentStep.whatHappens}</p>
          </div>

          {/* Interactive Trigger Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                currentStep.action();
              }}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:from-teal-700 active:to-emerald-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 group transition-all"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>{currentStep.actionText}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              Clicking this will directly interact with the live application in the background!
            </p>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="text-xs text-slate-500 font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-500 transition-all shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-sm"
            >
              Finish Tour
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
