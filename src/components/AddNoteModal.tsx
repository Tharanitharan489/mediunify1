import React from 'react';
import { X, FileText, Send, AlertCircle } from 'lucide-react';
import { Patient, StaffUser } from '../types';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentUser: StaffUser;
  onSaveNote: (content: string, category: string) => Promise<void>;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentUser,
  onSaveNote,
}) => {
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('Follow-up');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide clinical note text.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSaveNote(content, category);
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Add Clinical Doctor Note</h3>
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
              Author: <strong className="text-slate-900">{currentUser.name}</strong>
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Note Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="Follow-up">Follow-up Consultation</option>
              <option value="Consultation">New Clinical Consultation</option>
              <option value="Discharge">Discharge Summary</option>
              <option value="Emergency">Emergency Evaluation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Assessment & Plan
            </label>
            <textarea
              rows={5}
              placeholder="Record clinical impressions, treatment advice, medication titration, or follow-up schedule..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
            />
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
              {loading ? 'Saving...' : 'Save to Unified EHR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
