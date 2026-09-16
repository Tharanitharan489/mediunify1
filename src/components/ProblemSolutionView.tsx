import React from 'react';
import {
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileQuestion,
  FlaskConical,
  Pill,
  FolderArchive,
  Layers,
  HeartHandshake,
  Users,
  Stethoscope,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export const ProblemSolutionView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Team & Origin Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 mb-3">
              <GraduationCap className="w-4 h-4" />
              SNS COLLEGE OF TECHNOLOGY – AI Campus · Department of CSE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
              MediUnify: Unified Patient Records for Smarter Healthcare Decisions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              HealthTech · Electronic Health Records (EHR) · Full Stack Architecture built for healthcare organizations tackling fragmented patient data silos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-xs space-y-1 sm:min-w-[240px]">
            <div className="font-bold text-teal-300 uppercase tracking-wider text-[11px] mb-2">
              Engineering Team:
            </div>
            <div className="text-slate-200">Janarthanan R <span className="text-teal-400 font-mono">(713523CS072)</span></div>
            <div className="text-slate-200">Sreenath R <span className="text-teal-400 font-mono">(713523CS513)</span></div>
            <div className="text-slate-200">Srinivasa Aravind S <span className="text-teal-400 font-mono">(713523CS514)</span></div>
            <div className="text-slate-200 font-semibold text-white">TharaniTharan VS <span className="text-teal-400 font-mono">(713523CS515)</span></div>
          </div>
        </div>
      </div>

      {/* Slide 3: The Problem We Observed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            Slide 02 · What is wrong?
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">The Problem We Observed</h2>
          <p className="text-sm text-slate-600 mt-1">
            Healthcare organizations often store patient information across different systems, departments, files and applications — not in one connected place.
          </p>
        </div>

        {/* 4 Fragmented Silos Visual (Recreating Slide 3 diagram) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/50 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-950">Patient History</h4>
                <span className="text-[11px] font-mono text-rose-700">EMR A</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">Sits in an isolated clinic software database</p>
          </div>

          <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/50 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-950">Lab Reports</h4>
                <span className="text-[11px] font-mono text-rose-700">Metropolis Lab Sys</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">Live in a separate pathology portal</p>
          </div>

          <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/50 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-950">Prescriptions</h4>
                <span className="text-[11px] font-mono text-rose-700">Pharmacy DB</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">Tracked separately by dispensary staff</p>
          </div>

          <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/50 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-950">Older Visits</h4>
                <span className="text-[11px] font-mono text-rose-700">Paper Archives</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">Physical paper files aren't easy to pull up</p>
          </div>
        </div>

        {/* Slide 3 Quote */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center text-sm font-semibold text-teal-950 italic">
          “The information exists — but it is not always available in one place when it is needed.”
        </div>
      </div>

      {/* Slide 4: Why This Matters (4 impact pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs mb-3">
            01
          </div>
          <h4 className="font-bold text-sm text-slate-900">Records are scattered</h4>
          <p className="text-xs text-slate-600 mt-1">Staff spend extra time searching across systems</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs mb-3">
            02
          </div>
          <h4 className="font-bold text-sm text-slate-900">History isn't complete</h4>
          <p className="text-xs text-slate-600 mt-1">Doctors may not see the full patient picture quickly</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs mb-3">
            03
          </div>
          <h4 className="font-bold text-sm text-slate-900">Tests get repeated</h4>
          <p className="text-xs text-slate-600 mt-1">Missing reports lead to unnecessary re-testing</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs mb-3">
            04
          </div>
          <h4 className="font-bold text-sm text-slate-900">Departments don't sync</h4>
          <p className="text-xs text-slate-600 mt-1">Coordination between teams becomes harder</p>
        </div>
      </div>

      {/* Slide 13: Fragmented vs Unified Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            Slide 12 · Why is it useful?
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
            What Makes Our Solution Useful?
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 bg-rose-50/70 text-rose-900 font-bold uppercase text-[10px] tracking-wider w-1/2">
                  Fragmented Approach (Legacy)
                </th>
                <th className="py-3 px-4 bg-teal-50 text-teal-900 font-bold uppercase text-[10px] tracking-wider w-1/2">
                  Our Unified Approach (MediUnify)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Information spread across systems
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Patient information in one platform
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Time spent searching for records
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Faster access to what's needed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Difficult cross-department coordination
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Shared, authorized access for all teams
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Patient history may be incomplete at point of care
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    A more complete, unified patient overview
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Manual record tracking
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Digital record management
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide 14: Expected Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">For Doctors</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Faster access to patient history
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              More context before deciding
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Easier review of reports & meds
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">For Healthcare Staff</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Less manual searching
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Easier record management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Better team coordination
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">For Patients</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              More organized medical history
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Less repeating the same information
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              A smoother care experience
            </li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-center text-xs text-slate-700 font-medium">
        “Our goal is not to replace clinical expertise — it is to give healthcare professionals better access to the information they already need.” (Slide 14)
      </div>
    </div>
  );
};
