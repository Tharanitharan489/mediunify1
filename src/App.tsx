import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PatientRecordView } from './components/PatientRecordView';
import { AuditLogsView } from './components/AuditLogsView';
import { ProblemSolutionView } from './components/ProblemSolutionView';
import { DemoTourGuide } from './components/DemoTourGuide';
import { AddNoteModal } from './components/AddNoteModal';
import { AddMedicationModal } from './components/AddMedicationModal';
import { AddVitalsModal } from './components/AddVitalsModal';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import {
  INITIAL_PATIENTS,
  INITIAL_STAFF_USERS,
  INITIAL_PENDING_REPORTS,
  INITIAL_RECENT_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
} from './mockData';
import { Patient, StaffUser, PendingReport, RecentActivity, AuditLog } from './types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-20481');
  const [staffUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [currentUser, setCurrentUser] = useState<StaffUser>(INITIAL_STAFF_USERS[0]); // Dr. Priya Raman
  const [pendingReports, setPendingReports] = useState<PendingReport[]>(INITIAL_PENDING_REPORTS);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(INITIAL_RECENT_ACTIVITIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'patient-record' | 'register' | 'security-audit' | 'presentation-overview'
  >('dashboard');

  // Modals
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [preloadMedName, setPreloadMedName] = useState('');
  const [isAddVitalsOpen, setIsAddVitalsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleOpenMedicationWithPreload = (medName: string) => {
    setPreloadMedName(medName);
    setIsAddMedicationOpen(true);
  };

  const handleSwitchUserRole = (role: 'doctor' | 'nurse' | 'admin') => {
    const user = staffUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched active role to ${user.role.toUpperCase()}: ${user.name}`, 'info');
    }
  };

  // Initial fetch from backend REST API
  useEffect(() => {
    fetch('/api/patients')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        }
      })
      .catch((err) => console.log('Using initial fallback patients:', err));

    fetch('/api/pending-reports')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPendingReports(data);
      })
      .catch(() => {});

    fetch('/api/audit-logs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch(() => {});
  }, []);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || INITIAL_PATIENTS[0];

  // Handlers
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    handleLogAudit('VIEW_RECORD', `Viewed full unified patient chart for patient ID: ${patientId}`);
  };

  const handleLogAudit = async (action: any, details: string) => {
    const payload = {
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      details,
    };

    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newLog = await res.json();
        setAuditLogs((prev) => [newLog, ...prev]);
      }
    } catch (e) {
      // Local fallback
      const fallbackLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ...payload,
        ipAddress: '192.168.1.104',
      };
      setAuditLogs((prev) => [fallbackLog, ...prev]);
    }
  };

  const handleSaveNote = async (content: string, category: string) => {
    const res = await fetch(`/api/patients/${selectedPatient.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: currentUser.name,
        authorRole: currentUser.title,
        department: currentUser.department,
        content,
        category,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to save clinical note');
    }

    const data = await res.json();
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? data.patient : p))
    );
    showToast('Clinical consultation note saved to Unified EHR', 'success');
  };

  const handleSaveMedication = async (medData: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
  }) => {
    const res = await fetch(`/api/patients/${selectedPatient.id}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...medData,
        prescribedBy: currentUser.name,
        department: currentUser.department,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to record medication');
    }

    const data = await res.json();
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? data.patient : p))
    );

    if (data.allergyConflictWarning) {
      showToast(data.allergyConflictWarning, 'warning');
    } else {
      showToast(`Prescription for ${medData.name} dispatched to central pharmacy`, 'success');
    }

    return data;
  };

  const handleSaveVitals = async (vitalsData: any) => {
    const res = await fetch(`/api/patients/${selectedPatient.id}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...vitalsData,
        staffName: currentUser.name,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to save vitals');
    }

    const data = await res.json();
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? data.patient : p))
    );
    showToast('Vitals and clinical markers updated in real-time', 'success');
  };

  const handleRegisterPatient = async (patientData: any): Promise<Patient> => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });

    if (!res.ok) {
      throw new Error('Failed to register patient');
    }

    const newPatient: Patient = await res.json();
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    setCurrentTab('patient-record');
    showToast(`Patient ${newPatient.name} (${newPatient.id}) enrolled into Unified EHR`, 'success');
    return newPatient;
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/pending-reports/${reportId}/resolve`, {
        method: 'POST',
      });
      if (res.ok) {
        setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
        showToast('Diagnostic report signed off and synced into patient chart', 'success');
        handleLogAudit('UPLOAD_LAB', `Signed off pending diagnostic report #${reportId}`);
      }
    } catch (e) {
      setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-800 flex flex-col">
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white ${
              toast.type === 'warning'
                ? 'bg-amber-600'
                : toast.type === 'info'
                ? 'bg-blue-600'
                : 'bg-emerald-600'
            }`}
          >
            {toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        setCurrentUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched active role to ${u.role.toUpperCase()}: ${u.name}`, 'info');
        }}
        allStaffUsers={staffUsers}
        patients={patients}
        onSelectPatient={handleSelectPatient}
        selectedPatientId={selectedPatientId}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Main View Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1">
        {currentTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            pendingReports={pendingReports}
            recentActivities={recentActivities}
            currentUser={currentUser}
            onSelectPatient={handleSelectPatient}
            onViewPatientRecord={(id) => {
              handleSelectPatient(id);
              setCurrentTab('patient-record');
            }}
            onResolveReport={handleResolveReport}
            onOpenRegisterModal={() => setIsRegisterOpen(true)}
          />
        )}

        {currentTab === 'patient-record' && (
          <PatientRecordView
            patient={selectedPatient}
            allPatients={patients}
            onSelectPatient={handleSelectPatient}
            currentUser={currentUser}
            onOpenAddNote={() => setIsAddNoteOpen(true)}
            onOpenAddMedication={() => setIsAddMedicationOpen(true)}
            onOpenAddVitals={() => setIsAddVitalsOpen(true)}
            onLogAudit={handleLogAudit}
          />
        )}

        {currentTab === 'security-audit' && (
          <AuditLogsView auditLogs={auditLogs} currentUser={currentUser} />
        )}

        {currentTab === 'presentation-overview' && <ProblemSolutionView />}
      </main>

      {/* Modals */}
      <AddNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        patient={selectedPatient}
        currentUser={currentUser}
        onSaveNote={handleSaveNote}
      />

      <AddMedicationModal
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
        patient={selectedPatient}
        currentUser={currentUser}
        onSaveMedication={handleSaveMedication}
      />

      <AddVitalsModal
        isOpen={isAddVitalsOpen}
        onClose={() => setIsAddVitalsOpen(false)}
        patient={selectedPatient}
        currentUser={currentUser}
        onSaveVitals={handleSaveVitals}
      />

      <RegisterPatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        currentUser={currentUser}
        onRegisterPatient={handleRegisterPatient}
        onSelectPatient={handleSelectPatient}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <span className="font-bold text-slate-800 font-['Outfit']">MediUnify</span> — Unified Patient Records for Smarter Healthcare Decisions.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SNS College of Technology · AI Campus</span>
            <span>•</span>
            <span>Department of CSE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
