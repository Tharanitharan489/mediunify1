import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileSpreadsheet,
  Terminal,
  UserCheck,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Database,
  KeyRound,
  FileText,
} from 'lucide-react';
import { AuditLog, StaffUser } from '../types';

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
  currentUser: StaffUser;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs, currentUser }) => {
  const [filterQuery, setFilterQuery] = React.useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<'ALL' | 'doctor' | 'nurse' | 'admin'>('ALL');

  const filteredLogs = React.useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesText =
        !filterQuery ||
        log.userName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (log.patientName && log.patientName.toLowerCase().includes(filterQuery.toLowerCase())) ||
        log.action.toLowerCase().includes(filterQuery.toLowerCase());

      const matchesRole = selectedRoleFilter === 'ALL' || log.userRole === selectedRoleFilter;

      return matchesText && matchesRole;
    });
  }, [auditLogs, filterQuery, selectedRoleFilter]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Security, Privacy & Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Slide 10, 11 & 12: Immutable clinical access logs and Role-Based Access Control (RBAC)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              HIPAA Audit Logging Active
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 italic">
          “Healthcare data is sensitive, so security is part of the design — not an afterthought. Only the information required for the user's role should be accessible.” (Slides 11 & 12)
        </div>
      </div>

      {/* Slide 12: 8 Pillars of Security & Privacy Grid */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Enterprise Security Architecture (Slide 12)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Role-Based Access</div>
            <div className="text-[11px] text-slate-400">Strict Doctor, Nurse & Admin permission separation</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Secure Authentication</div>
            <div className="text-[11px] text-slate-400">Multi-factor & session cryptographic tokens</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Password Protection</div>
            <div className="text-[11px] text-slate-400">Argon2 / bcrypt credential hashing standards</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Encrypted Communication</div>
            <div className="text-[11px] text-slate-400">TLS 1.3 in-transit and AES-256 at-rest</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Audit Logs</div>
            <div className="text-[11px] text-slate-400">Real-time immutable write-once read-many ledger</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Controlled Record Access</div>
            <div className="text-[11px] text-slate-400">Need-to-know departmental segmentation</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Database Security</div>
            <div className="text-[11px] text-slate-400">Parameterized queries & SQL injection defenses</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="font-bold text-slate-100 mb-0.5">Regular Backups</div>
            <div className="text-[11px] text-slate-400">Automated geo-redundant point-in-time recovery</div>
          </div>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Role-Based Access Control (RBAC) Matrix
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Feature / Action</th>
                <th className="py-2.5 px-4 text-center">Doctor (Physician)</th>
                <th className="py-2.5 px-4 text-center">Nurse (Clinical Triage)</th>
                <th className="py-2.5 px-4 text-center">Administrator (IT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">View Unified Patient Profile & History</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Full Access</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Full Access</td>
                <td className="py-2.5 px-4 text-center text-amber-600 font-bold">Metadata Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Add Doctor Consult Notes & Assessment</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Authorized</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Restricted</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Prescribe Medications & Titrate Dosages</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Authorized</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Restricted</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Record Vitals, Glucose & Telemetry</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Authorized</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">Authorized</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Inspect Security Audit Trail & System Logs</td>
                <td className="py-2.5 px-4 text-center text-slate-400">Audit Read-only</td>
                <td className="py-2.5 px-4 text-center text-slate-400">No Access</td>
                <td className="py-2.5 px-4 text-center text-purple-600 font-bold">Full Compliance Admin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Immutable Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Live Immutable Access Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Captures every record viewing, prescription update, lab intake, and AI cross-check event.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Roles</option>
              <option value="doctor">Doctors only</option>
              <option value="nurse">Nurses only</option>
              <option value="admin">Admins only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Patient Affected</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Terminal / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.userRole === 'doctor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.userRole === 'nurse'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {log.patientName ? (
                      <span className="font-medium text-slate-900">
                        {log.patientName}{' '}
                        <span className="text-[11px] text-slate-400 font-mono">({log.patientId})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
