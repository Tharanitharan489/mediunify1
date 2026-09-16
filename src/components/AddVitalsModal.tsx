import React from 'react';
import { X, Activity, Droplet, Send } from 'lucide-react';
import { Patient, StaffUser } from '../types';

interface AddVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentUser: StaffUser;
  onSaveVitals: (data: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: string;
    spO2?: number;
    testName?: string;
    value?: string;
    unit?: string;
    referenceRange?: string;
    status?: 'normal' | 'elevated' | 'critical' | 'low';
  }) => Promise<void>;
}

export const AddVitalsModal: React.FC<AddVitalsModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentUser,
  onSaveVitals,
}) => {
  const [bloodPressure, setBloodPressure] = React.useState(patient.vitals.bloodPressure || '120/80');
  const [heartRate, setHeartRate] = React.useState(String(patient.vitals.heartRate || 72));
  const [temperature, setTemperature] = React.useState(patient.vitals.temperature || '98.4 °F');
  const [spO2, setSpO2] = React.useState(String(patient.vitals.spO2 || 98));

  const [addLabTest, setAddLabTest] = React.useState(false);
  const [testName, setTestName] = React.useState('');
  const [value, setValue] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [status, setStatus] = React.useState<'normal' | 'elevated' | 'critical' | 'low'>('normal');

  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveVitals({
        bloodPressure,
        heartRate: Number(heartRate),
        temperature,
        spO2: Number(spO2),
        ...(addLabTest && testName && value
          ? {
              testName,
              value,
              unit,
              status,
              referenceRange: 'Standard Clinical Range',
            }
          : {}),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Record Vitals & Lab Telemetry</h3>
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
              Recorded By: <strong className="text-slate-900">{currentUser.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                placeholder="e.g. 138/88"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pulse / Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="e.g. 74"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Temperature
              </label>
              <input
                type="text"
                placeholder="e.g. 98.4 °F"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Oxygen Saturation (SpO2 %)
              </label>
              <input
                type="number"
                placeholder="e.g. 99"
                value={spO2}
                onChange={(e) => setSpO2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Toggle Lab Result Entry */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={addLabTest}
                onChange={(e) => setAddLabTest(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Also Attach Diagnostic Lab Marker (e.g. Glucose, Lipid, HbA1c)</span>
            </label>

            {addLabTest && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Lab Test Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fasting Blood Sugar"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Value & Unit
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="110"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-2/3 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="mg/dL"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-1/3 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Flag Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                  >
                    <option value="normal">Normal (Within Reference)</option>
                    <option value="elevated">Elevated (Borderline / High)</option>
                    <option value="critical">Critical Warning</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            )}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Sync Telemetry to Central EHR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
