export type UserRole = 'doctor' | 'nurse' | 'admin';

export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  badgeNumber: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  dateIdentified: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  icdCode?: string;
  diagnosedYear: string;
  status: 'active' | 'managed' | 'resolved';
  department: string;
  treatingDoctor: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'discontinued';
  prescribedBy: string;
  department: string;
  sourceSystem: string;
}

export interface LabResult {
  id: string;
  testName: string;
  category: 'Biochemistry' | 'Hematology' | 'Cardiology' | 'Radiology' | 'Vitals';
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'elevated' | 'critical' | 'low';
  testDate: string;
  sourceSystem: string;
  notes?: string;
}

export interface DoctorNote {
  id: string;
  authorName: string;
  authorRole: string;
  department: string;
  date: string;
  content: string;
  category: 'Consultation' | 'Follow-up' | 'Discharge' | 'Emergency';
}

export interface VisitRecord {
  id: string;
  date: string;
  type: 'Outpatient' | 'Emergency' | 'Inpatient' | 'Routine Checkup';
  department: string;
  attendingPhysician: string;
  reasonForVisit: string;
  clinicalSummary: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    spO2: number;
    glucose?: string;
  };
}

export interface PendingReport {
  id: string;
  testName: string;
  department: string;
  roomOrLocation: string;
  patientId: string;
  patientName: string;
  requestedAt: string;
  priority: 'Routine' | 'Urgent' | 'Stat';
  status: 'Pending Analysis' | 'Awaiting Sign-off' | 'Ready for Review';
}

export interface RecentActivity {
  id: string;
  patientName: string;
  patientId: string;
  action: string;
  timeAgo: string;
  type: 'lab' | 'prescription' | 'discharge' | 'appointment' | 'vitals';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'VIEW_RECORD' | 'UPDATE_PRESCRIPTION' | 'ADD_NOTE' | 'UPLOAD_LAB' | 'REGISTER_PATIENT' | 'EXPORT_EHR' | 'CROSS_CHECK_AI';
  patientId?: string;
  patientName?: string;
  details: string;
  ipAddress: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  lastVisit: string;
  allergies: Allergy[];
  diagnoses: Diagnosis[];
  medications: Medication[];
  labResults: LabResult[];
  doctorNotes: DoctorNote[];
  visits: VisitRecord[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    spO2: number;
    bmi: number;
    bloodSugar?: string;
  };
  siloSources: {
    emrSource: string;
    labSource: string;
    pharmacySource: string;
    paperArchiveMigrated: boolean;
  };
}

export interface ClinicalInsightResult {
  summary: string;
  clinicalAlerts: {
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
  }[];
  potentialInteractions: string[];
  suggestedNextSteps: string[];
}
