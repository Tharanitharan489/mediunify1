import React from 'react';
import { X, UserPlus, ShieldAlert, CheckCircle2, HeartPulse } from 'lucide-react';
import { StaffUser, Patient } from '../types';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffUser;
  onRegisterPatient: (patientData: any) => Promise<Patient>;
  onSelectPatient: (patientId: string) => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegisterPatient,
  onSelectPatient,
}) => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [gender, setGender] = React.useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = React.useState('B+');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [emergencyContact, setEmergencyContact] = React.useState('');

  // Clinical initial intake (Slide 6 step 2)
  const [allergyName, setAllergyName] = React.useState('');
  const [allergySeverity, setAllergySeverity] = React.useState<'mild' | 'moderate' | 'severe'>('severe');
  const [allergyReaction, setAllergyReaction] = React.useState('');
  const [initialDiagnosis, setInitialDiagnosis] = React.useState('');
  const [bloodPressure, setBloodPressure] = React.useState('120/80');
  const [heartRate, setHeartRate] = React.useState('72');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) {
      setError('Please provide patient name and age.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await onRegisterPatient({
        name,
        age,
        gender,
        bloodGroup,
        phone,
        email,
        address,
        emergencyContact,
        allergyName,
        allergySeverity,
        allergyReaction,
        initialDiagnosis,
        initialVitals: {
          bloodPressure,
          heartRate: Number(heartRate),
          temperature: '98.4 °F',
          spO2: 99,
        },
        createdBy: currentUser.name,
        createdRole: currentUser.role,
      });

      onSelectPatient(created.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Patient Registration & Clinical Intake
              </h3>
              <p className="text-[11px] text-slate-500">
                Step 1 & 2: Check-in, vitals, symptoms and unified record ingestion (Slide 6)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs">{error}</div>}

          {/* Section 1: Demographics */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">
              1. Patient Demographics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meenakshi Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age *</label>
                <input
                  type="number"
                  placeholder="45"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98400 11223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                placeholder="Residential address / district"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 2: Documented Allergies (Critical for EHR Safety) */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1 flex items-center gap-1.5 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              2. Known Drug / Substance Hypersensitivities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allergen Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, NSAIDs"
                  value={allergyName}
                  onChange={(e) => setAllergyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={allergySeverity}
                  onChange={(e) => setAllergySeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="severe">Severe (Anaphylaxis Risk)</option>
                  <option value="moderate">Moderate</option>
                  <option value="mild">Mild (Rash / Pruritus)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reaction</label>
                <input
                  type="text"
                  placeholder="e.g. Bronchospasm, facial swelling"
                  value={allergyReaction}
                  onChange={(e) => setAllergyReaction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Baseline Clinical Vitals & Initial Diagnosis */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">
              3. Baseline Telemetry & Presenting Diagnosis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Condition
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Asthma"
                  value={initialDiagnosis}
                  onChange={(e) => setInitialDiagnosis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Baseline BP
                </label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  placeholder="72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Creating Record...' : 'Complete Intake & Ingest into EHR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
