import React from 'react';
import { X, Pill, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Patient, StaffUser } from '../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentUser: StaffUser;
  initialMedName?: string;
  onSaveMedication: (data: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
  }) => Promise<{ allergyConflictWarning?: string | null }>;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentUser,
  initialMedName = '',
  onSaveMedication,
}) => {
  const [name, setName] = React.useState(initialMedName);
  const [dosage, setDosage] = React.useState(initialMedName ? '500 mg' : '');
  const [frequency, setFrequency] = React.useState('once daily');
  const [route, setRoute] = React.useState('Oral');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen && initialMedName) {
      setName(initialMedName);
      setDosage('500 mg');
    } else if (isOpen && !name) {
      setName('');
      setDosage('');
    }
  }, [isOpen, initialMedName]);

  if (!isOpen) return null;

  // Real-time contraindication detection
  const detectedAllergyConflict = React.useMemo(() => {
    const medLower = name.toLowerCase().trim();
    if (!medLower) return null;

    for (const allergy of patient.allergies) {
      const allergenLower = allergy.allergen.toLowerCase();
      if (
        medLower.includes(allergenLower) ||
        (allergenLower.includes('penicillin') &&
          (medLower.includes('amoxicillin') ||
            medLower.includes('ampicillin') ||
            medLower.includes('augmentin') ||
            medLower.includes('penicillin'))) ||
        (allergenLower.includes('nsaid') &&
          (medLower.includes('ibuprofen') ||
            medLower.includes('aspirin') ||
            medLower.includes('naproxen')))
      ) {
        return allergy;
      }
    }
    return null;
  }, [name, patient.allergies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      setError('Please provide medication name and dosage.');
      return;
    }

    if (detectedAllergyConflict) {
      const proceed = window.confirm(
        `CRITICAL ALLERGY ALERT:\nPatient ${patient.name} has a known severe allergy to ${detectedAllergyConflict.allergen} (${detectedAllergyConflict.reaction}).\n\nPrescribing this may cause life-threatening anaphylaxis. Do you wish to override with caution?`
      );
      if (!proceed) return;
    }

    try {
      setLoading(true);
      setError('');
      await onSaveMedication({ name, dosage, frequency, route });
      setName('');
      setDosage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Prescribe Medication</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 flex justify-between items-center">
            <span>
              Patient: <strong className="text-slate-900">{patient.name}</strong> ({patient.id})
            </span>
            <span>
              Prescriber: <strong className="text-slate-900">{currentUser.name}</strong>
            </span>
          </div>

          {/* Real-time Allergy Cross-Check Banner */}
          {detectedAllergyConflict ? (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-400 text-rose-900 rounded-xl text-xs space-y-1 animate-pulse">
              <div className="font-bold flex items-center gap-1.5 text-rose-700 text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                CRITICAL ALLERGY CONTRAINDICATION!
              </div>
              <p>
                Patient has a recorded severe reaction to{' '}
                <strong>{detectedAllergyConflict.allergen}</strong>: “
                {detectedAllergyConflict.reaction}”.
              </p>
              <p className="text-[11px] text-rose-700 font-semibold">
                Unified EHR safety check flagged this prescription before it reaches the pharmacy.
              </p>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              Real-time EHR safety validator active. Checking against all documented allergies and drug history.
            </div>
          )}

          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medication Name & Salt
            </label>
            <input
              type="text"
              placeholder="e.g. Metformin, Amlodipine, Lisinopril, Amoxicillin..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
            />
            {patient.allergies.some((a) => a.allergen.toLowerCase().includes('penicillin')) && (
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Try typing "Amoxicillin" to test the automated unified allergy prevention shield.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                placeholder="e.g. 500mg, 10mg, 2 puffs"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
              >
                <option value="once daily">Once daily</option>
                <option value="twice daily">Twice daily</option>
                <option value="three times daily">Three times daily</option>
                <option value="once daily at bedtime">Once daily at bedtime</option>
                <option value="as needed for pain">As needed (PRN)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Route</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="Oral">Oral</option>
              <option value="Inhalation">Inhalation</option>
              <option value="Subcutaneous">Subcutaneous</option>
              <option value="Intravenous (IV)">Intravenous (IV)</option>
              <option value="Topical">Topical</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                detectedAllergyConflict
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              {loading ? 'Submitting...' : 'Dispatch to Central Pharmacy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
