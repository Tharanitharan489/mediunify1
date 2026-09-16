import React from 'react';
import {
  User,
  AlertTriangle,
  FileText,
  Calendar,
  Pill,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Brain,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  Heart,
  Thermometer,
  Wind,
  Droplet,
  ExternalLink,
  Printer,
  Download,
} from 'lucide-react';
import { Patient, StaffUser, ClinicalInsightResult } from '../types';

interface PatientRecordViewProps {
  patient: Patient;
  allPatients: Patient[];
  onSelectPatient: (patientId: string) => void;
  currentUser: StaffUser;
  onOpenAddNote: () => void;
  onOpenAddMedication: () => void;
  onOpenAddVitals: () => void;
  onLogAudit: (action: any, details: string) => void;
}

export const PatientRecordView: React.FC<PatientRecordViewProps> = ({
  patient,
  allPatients,
  onSelectPatient,
  currentUser,
  onOpenAddNote,
  onOpenAddMedication,
  onOpenAddVitals,
  onLogAudit,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'history' | 'reports' | 'medications' | 'visits' | 'ai-insights' | 'audit'
  >('overview');

  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiInsight, setAiInsight] = React.useState<ClinicalInsightResult | null>(null);

  // Auto-fetch AI insights or generate deterministic synthesis when requested
  const fetchAiInsights = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/clinical-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patient.id }),
      });
      const data = await res.json();
      setAiInsight(data);
      onLogAudit('CROSS_CHECK_AI', `Evaluated clinical risk & interactions using Gemini AI engine`);
    } catch (err) {
      console.error('Error loading AI insights:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    onLogAudit('EXPORT_EHR', `Generated printable clinical summary for ${patient.name} (${patient.id})`);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Top Patient Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">Patient Selection:</span>
          <div className="relative">
            <select
              id="patient-record-select"
              value={patient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {allPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.age}y {p.gender} · Blood {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>
          {patient.id === 'PT-20481' && (
            <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-teal-300">
              Slide 9 Reference Case
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
            title="Print or export consolidated EHR"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Record
          </button>
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>4 Systems Unified</span>
          </div>
        </div>
      </div>

      {/* Main Patient Banner — Faithfully recreating Slide 9 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Patient Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-9 h-9" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                    {patient.name}
                  </h1>

                  {/* Allergy Highlight Badge from Slide 9 */}
                  {patient.allergies.map((alg) => (
                    <div
                      key={alg.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-300 rounded-full text-rose-700 text-xs font-bold shadow-xs animate-pulse"
                      title={`Severe hypersensitivity reaction: ${alg.reaction}`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Allergy: {alg.allergen}
                    </div>
                  ))}

                  {patient.allergies.length === 0 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                      No Known Drug Allergies (NKDA)
                    </span>
                  )}
                </div>

                {/* Subtitle from Slide 9 */}
                <p className="text-sm font-medium text-slate-600 mt-1">
                  Age {patient.age} · {patient.gender} · Blood Group {patient.bloodGroup}
                </p>

                {/* Unified Data Silo Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Source Aggregation:</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {patient.siloSources.emrSource}
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {patient.siloSources.labSource}
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {patient.siloSources.pharmacySource}
                  </span>
                </div>
              </div>
            </div>

            {/* Top-right Identifiers from Slide 9 */}
            <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="font-mono text-sm font-bold text-slate-900 bg-slate-100 md:bg-transparent px-2 py-1 md:p-0 rounded">
                ID: <span className="text-teal-700">{patient.id}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Last Visit: <span className="font-semibold text-slate-800">{patient.lastVisit}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Contact: {patient.phone}
              </div>
            </div>
          </div>

          {/* Action Buttons for Clinical Staff */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {currentUser.role === 'doctor' && (
                <>
                  <button
                    id="btn-add-doctor-note"
                    onClick={onOpenAddNote}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    + Add Doctor Note
                  </button>
                  <button
                    id="btn-add-prescription"
                    onClick={onOpenAddMedication}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Pill className="w-3.5 h-3.5 text-teal-400" />
                    + Prescribe Medication
                  </button>
                </>
              )}

              {(currentUser.role === 'doctor' || currentUser.role === 'nurse') && (
                <button
                  id="btn-record-vitals"
                  onClick={onOpenAddVitals}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-600" />
                  + Record Vitals / Lab Result
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('ai-insights');
                  if (!aiInsight) fetchAiInsights();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
              >
                <Brain className="w-3.5 h-3.5" />
                AI Clinical Decision Support
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar — Directly matching Slide 9 tabs: Overview, History, Reports, Medications, Visits */}
        <div className="flex items-center border-t border-slate-200 px-6 bg-slate-50/60 overflow-x-auto scrollbar-none">
          <button
            id="tab-sub-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            id="tab-sub-history"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            History
          </button>
          <button
            id="tab-sub-reports"
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reports ({patient.labResults.length})
          </button>
          <button
            id="tab-sub-medications"
            onClick={() => setActiveTab('medications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'medications'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Medications ({patient.medications.length})
          </button>
          <button
            id="tab-sub-visits"
            onClick={() => setActiveTab('visits')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'visits'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Visits ({patient.visits.length})
          </button>
          <button
            id="tab-sub-ai-insights"
            onClick={() => {
              setActiveTab('ai-insights');
              if (!aiInsight) fetchAiInsights();
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ai-insights'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Clinical Insights (Slide 15)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB CONTENT 1: OVERVIEW (Exact Replica of Slide 9)      */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column from Slide 9: Previous Diagnoses & Current Medications */}
            <div className="space-y-6">
              {/* Previous Diagnoses Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Previous Diagnoses
                  </h3>
                  <span className="text-xs text-slate-400">ICD-10 Coded</span>
                </div>

                <div className="space-y-3">
                  {patient.diagnoses.map((dx) => (
                    <div key={dx.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0"></span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {dx.condition} —{' '}
                          <span className="font-normal text-slate-600">
                            diagnosed {dx.diagnosedYear}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {dx.department} · Managed by {dx.treatingDoctor}
                        </div>
                      </div>
                    </div>
                  ))}

                  {patient.diagnoses.length === 0 && (
                    <p className="text-sm text-slate-400">No recorded diagnoses on file.</p>
                  )}
                </div>
              </div>

              {/* Current Medications Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Current Medications
                  </h3>
                  <span className="text-xs text-slate-400">Central e-Prescription</span>
                </div>

                <div className="space-y-3">
                  {patient.medications.map((med) => (
                    <div key={med.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0"></span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {med.name} {med.dosage} —{' '}
                          <span className="font-normal text-slate-600">{med.frequency}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Route: {med.route} · Prescribed by {med.prescribedBy} ({med.department})
                        </div>
                      </div>
                    </div>
                  ))}

                  {patient.medications.length === 0 && (
                    <p className="text-sm text-slate-400">No current active prescriptions.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column from Slide 9: Recent Lab Results & Doctor Notes */}
            <div className="space-y-6">
              {/* Recent Lab Results Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Recent Lab Results
                  </h3>
                  <span className="text-xs text-slate-400">Metropolis & Central Labs</span>
                </div>

                <div className="space-y-3.5">
                  {/* Result 1: HbA1c */}
                  {patient.labResults.find((l) => l.testName.includes('HbA1c')) && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-800">HbA1c</div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">
                          {patient.labResults.find((l) => l.testName.includes('HbA1c'))?.value}%
                        </span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  )}

                  {/* Result 2: Blood Pressure */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <div className="text-sm font-medium text-slate-800">Blood Pressure</div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-rose-700">
                        {patient.vitals.bloodPressure || '138/88'}
                      </span>
                      {/* Flagged icon from Slide 9 (red circled x / warning) */}
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Result 3: Cholesterol */}
                  {patient.labResults.find((l) => l.testName.includes('Cholesterol')) && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-800">Cholesterol</div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">
                          {patient.labResults.find((l) => l.testName.includes('Cholesterol'))?.value} mg/dL
                        </span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  )}

                  {/* Other lab results */}
                  {patient.labResults
                    .filter(
                      (l) =>
                        !l.testName.includes('HbA1c') && !l.testName.includes('Cholesterol')
                    )
                    .slice(0, 2)
                    .map((lab) => (
                      <div
                        key={lab.id}
                        className="flex items-center justify-between py-1.5 border-b border-slate-100"
                      >
                        <div className="text-sm font-medium text-slate-800">{lab.testName}</div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-bold ${
                              lab.status === 'normal' ? 'text-slate-900' : 'text-amber-700'
                            }`}
                          >
                            {lab.value} {lab.unit}
                          </span>
                          {lab.status === 'normal' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Doctor Notes Section from Slide 9 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Doctor Notes
                  </h3>
                  {patient.doctorNotes.length > 0 && (
                    <span className="text-xs text-slate-400">
                      {patient.doctorNotes[0].authorName} · {patient.doctorNotes[0].date}
                    </span>
                  )}
                </div>

                {patient.doctorNotes.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 italic text-sm text-slate-700 leading-relaxed">
                    “{patient.doctorNotes[0].content}”
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No physician notes recorded yet.</p>
                )}

                {patient.doctorNotes.length > 1 && (
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                    >
                      View all {patient.doctorNotes.length} historical consultation notes →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slide 9 Bottom Quote Caption */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-center text-xs text-teal-900 font-medium">
            <span className="font-bold">One screen.</span> The doctor sees this patient's history without opening five different systems.
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB CONTENT 2: HISTORY (Full Chronological Timeline)    */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Complete Medical History & Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated across past hospital stays, outpatient visits, and migrated legacy paper records.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-teal-200 space-y-8 my-4">
            {patient.visits.map((vis) => (
              <div key={vis.id} className="relative group">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white border-2 border-teal-300"></span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-sm text-slate-900">
                      {vis.type} Encounter — {vis.department}
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {vis.date}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    Attending Physician: <span className="font-semibold text-slate-800">{vis.attendingPhysician}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Reason: <span className="font-medium text-slate-800">{vis.reasonForVisit}</span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 mt-2.5">
                    {vis.clinicalSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-500 font-mono">
                    <span className="bg-slate-200/60 px-2 py-0.5 rounded">BP: {vis.vitals.bloodPressure}</span>
                    <span className="bg-slate-200/60 px-2 py-0.5 rounded">HR: {vis.vitals.heartRate} bpm</span>
                    <span className="bg-slate-200/60 px-2 py-0.5 rounded">Temp: {vis.vitals.temperature}</span>
                    <span className="bg-slate-200/60 px-2 py-0.5 rounded">SpO2: {vis.vitals.spO2}%</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Doctor historical notes in timeline */}
            {patient.doctorNotes.map((note) => (
              <div key={note.id} className="relative group">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-white"></span>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Clinical Note ({note.category}) — {note.authorName} ({note.department})
                    </span>
                    <span className="text-xs font-mono text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 italic">“{note.content}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB CONTENT 3: REPORTS (Diagnostic & Lab Management)    */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Lab & Diagnostic Report Management
              </h3>
              <p className="text-xs text-slate-500">
                View relevant reports without hopping across 5 hospital systems.
              </p>
            </div>
            {(currentUser.role === 'doctor' || currentUser.role === 'nurse') && (
              <button
                onClick={onOpenAddVitals}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Upload New Lab Marker
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Test Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Reference Range</th>
                  <th className="py-3 px-4">Source System</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.labResults.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {lab.testName}
                      {lab.notes && (
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                          {lab.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lab.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {lab.value} {lab.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {lab.referenceRange}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {lab.sourceSystem}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{lab.testDate}</td>
                    <td className="py-3 px-4 text-right">
                      {lab.status === 'normal' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Normal
                        </span>
                      )}
                      {lab.status === 'elevated' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" /> Elevated
                        </span>
                      )}
                      {lab.status === 'low' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" /> Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB CONTENT 4: MEDICATIONS (Medication Tracking)         */}
      {/* ======================================================== */}
      {activeTab === 'medications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Medication Tracking & Cross-Checking
              </h3>
              <p className="text-xs text-slate-500">
                Current and past medications, monitored in one view across pharmacy silos.
              </p>
            </div>
            {currentUser.role === 'doctor' && (
              <button
                onClick={onOpenAddMedication}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                + Add Medication
              </button>
            )}
          </div>

          {/* Allergy Banner in Medications view */}
          {patient.allergies.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-900">
                    Active Allergy Alert: {patient.allergies.map((a) => a.allergen).join(', ')}
                  </div>
                  <div className="text-[11px] text-rose-700">
                    System verifies that prospective prescriptions do not conflict with documented hypersensitivities.
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Strict Guard
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.medications.map((med) => (
              <div
                key={med.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/40 hover:bg-white transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{med.name}</div>
                    <div className="text-xs font-semibold text-teal-700 mt-0.5">
                      {med.dosage} · {med.frequency}
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {med.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200/70 space-y-1">
                  <div>Route: <span className="font-medium text-slate-700">{med.route}</span></div>
                  <div>Prescribed by: <span className="font-medium text-slate-700">{med.prescribedBy} ({med.department})</span></div>
                  <div>Pharmacy Sync: <span className="font-medium text-slate-700">{med.sourceSystem}</span></div>
                  <div>Started on: <span className="font-medium text-slate-700">{med.startDate}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB CONTENT 5: VISITS (Visits & Telemetry)               */}
      {/* ======================================================== */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Visit Records & Encounter History
            </h3>
            <p className="text-xs text-slate-500">
              Complete log of outpatient visits, inpatient admissions, and emergency contacts.
            </p>
          </div>

          <div className="space-y-4">
            {patient.visits.map((vis) => (
              <div key={vis.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{vis.type} Visit</span>
                    <span className="text-xs text-slate-500 ml-2">({vis.department})</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-teal-700">{vis.date}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 font-medium">Attending Physician:</div>
                    <div className="font-semibold text-slate-900">{vis.attendingPhysician}</div>
                    <div className="text-slate-500 font-medium mt-2">Reason for Visit:</div>
                    <div className="text-slate-800">{vis.reasonForVisit}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Clinical Summary:</div>
                    <div className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200">
                      {vis.clinicalSummary}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-sans font-bold text-slate-700 text-[11px]">Recorded Vitals:</span>
                  <span>BP: <strong>{vis.vitals.bloodPressure}</strong></span>
                  <span>HR: <strong>{vis.vitals.heartRate} bpm</strong></span>
                  <span>Temp: <strong>{vis.vitals.temperature}</strong></span>
                  <span>SpO2: <strong>{vis.vitals.spO2}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB CONTENT 6: AI CLINICAL INSIGHTS (Slide 15 Future Scope) */}
      {/* ======================================================== */}
      {activeTab === 'ai-insights' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  AI-Assisted Clinical Decision Support
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Synthesis engine analyzing unified records, cross-checking drug interactions, and identifying abnormal trends.
              </p>
            </div>
            <button
              onClick={fetchAiInsights}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              {aiLoading ? 'Synthesizing...' : 'Re-run AI Analysis'}
            </button>
          </div>

          {aiLoading && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-700">Connecting to Gemini AI Engine...</p>
              <p className="text-[11px] text-slate-400 mt-1">Cross-referencing allergy files, lab markers, and active prescriptions.</p>
            </div>
          )}

          {aiInsight && !aiLoading && (
            <div className="space-y-4">
              {/* Clinical Summary */}
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <div className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">
                  Unified Clinical Synopsis
                </div>
                <p className="text-xs text-teal-950 leading-relaxed font-medium">
                  {aiInsight.summary}
                </p>
              </div>

              {/* Clinical Alerts */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Automated Clinical Risk Alerts
                </div>
                {aiInsight.clinicalAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      alert.type === 'critical'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : alert.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">{alert.title}</div>
                      <div className="text-[11px] mt-0.5 opacity-90">{alert.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Potential Interactions */}
              {aiInsight.potentialInteractions.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Drug Contraindications & Interactions
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {aiInsight.potentialInteractions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Next Steps */}
              {aiInsight.suggestedNextSteps.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Suggested Next Clinical Steps
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {aiInsight.suggestedNextSteps.map((step, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
