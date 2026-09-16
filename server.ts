import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PATIENTS, INITIAL_PENDING_REPORTS, INITIAL_RECENT_ACTIVITIES, INITIAL_AUDIT_LOGS } from './src/mockData';
import { Patient, AuditLog, PendingReport, RecentActivity } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for the session
let patients: Patient[] = JSON.parse(JSON.stringify(INITIAL_PATIENTS));
let pendingReports: PendingReport[] = JSON.parse(JSON.stringify(INITIAL_PENDING_REPORTS));
let recentActivities: RecentActivity[] = JSON.parse(JSON.stringify(INITIAL_RECENT_ACTIVITIES));
let auditLogs: AuditLog[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

// Lazy initialized Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MediUnify EHR Backend',
    timestamp: new Date().toISOString(),
    patientCount: patients.length,
  });
});

// Patients: List & Search
app.get('/api/patients', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.json(patients);
  }

  const filtered = patients.filter((p) => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      p.diagnoses.some((d) => d.condition.toLowerCase().includes(query)) ||
      p.allergies.some((a) => a.allergen.toLowerCase().includes(query))
    );
  });
  res.json(filtered);
});

// Patients: Get Single by ID
app.get('/api/patients/:id', (req: Request, res: Response) => {
  const patient = patients.find((p) => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ error: 'Patient record not found' });
  }
  res.json(patient);
});

// Patients: Register new patient (Slide 6 step 1 & 2)
app.post('/api/patients', (req: Request, res: Response) => {
  const {
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
    initialVitals,
    createdBy,
    createdRole,
  } = req.body;

  if (!name || !age || !gender || !bloodGroup) {
    return res.status(400).json({ error: 'Missing required patient fields' });
  }

  const newId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const newPatient: Patient = {
    id: newId,
    name: name.trim(),
    age: Number(age),
    gender: gender,
    bloodGroup: bloodGroup,
    phone: phone || '+91 98000 00000',
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@patient.ehr`,
    address: address || 'Coimbatore Metropolitan Area',
    emergencyContact: emergencyContact || 'Family Contact',
    lastVisit: nowStr,
    allergies: allergyName
      ? [
          {
            id: `alg-${Date.now()}`,
            allergen: allergyName,
            severity: allergySeverity || 'moderate',
            reaction: allergyReaction || 'Adverse cutaneous reaction',
            dateIdentified: nowStr,
          },
        ]
      : [],
    diagnoses: initialDiagnosis
      ? [
          {
            id: `dx-${Date.now()}`,
            condition: initialDiagnosis,
            diagnosedYear: `${new Date().getFullYear()}`,
            status: 'active',
            department: 'General Medicine',
            treatingDoctor: createdBy || 'Attending Physician',
          },
        ]
      : [],
    medications: [],
    labResults: [],
    doctorNotes: [
      {
        id: `note-${Date.now()}`,
        authorName: createdBy || 'Intake Officer',
        authorRole: createdRole || 'Doctor',
        department: 'Triage & Intake',
        date: nowStr,
        category: 'Consultation',
        content: `Initial intake and registration completed in MediUnify. Patient enrolled in unified healthcare index.`,
      },
    ],
    visits: [
      {
        id: `vis-${Date.now()}`,
        date: nowStr,
        type: 'Outpatient',
        department: 'Triage & Intake',
        attendingPhysician: createdBy || 'Duty Medical Officer',
        reasonForVisit: 'Initial registration and baseline clinical evaluation',
        clinicalSummary: 'Comprehensive baseline intake recorded in centralized repository.',
        vitals: {
          bloodPressure: initialVitals?.bloodPressure || '120/80',
          heartRate: Number(initialVitals?.heartRate) || 72,
          temperature: initialVitals?.temperature || '98.6 °F',
          spO2: Number(initialVitals?.spO2) || 99,
        },
      },
    ],
    vitals: {
      bloodPressure: initialVitals?.bloodPressure || '120/80',
      heartRate: Number(initialVitals?.heartRate) || 72,
      temperature: initialVitals?.temperature || '98.6 °F',
      spO2: Number(initialVitals?.spO2) || 99,
      bmi: 23.5,
    },
    siloSources: {
      emrSource: 'MediUnify Centralized EHR',
      labSource: 'Hospital Diagnostic Gateway',
      pharmacySource: 'Unified e-Prescribe',
      paperArchiveMigrated: true,
    },
  };

  patients.unshift(newPatient);

  // Add recent activity
  recentActivities.unshift({
    id: `act-${Date.now()}`,
    patientName: newPatient.name,
    patientId: newPatient.id,
    action: 'New patient registered into central EHR',
    timeAgo: 'Just now',
    type: 'appointment',
  });

  // Log audit
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'usr-active',
    userName: createdBy || 'Staff Member',
    userRole: createdRole || 'admin',
    action: 'REGISTER_PATIENT',
    patientId: newPatient.id,
    patientName: newPatient.name,
    details: `Registered new patient record with ID ${newPatient.id}`,
    ipAddress: '192.168.1.120 (Registration Desk)',
  });

  res.status(201).json(newPatient);
});

// Patients: Add Doctor Note
app.post('/api/patients/:id/notes', (req: Request, res: Response) => {
  const patient = patients.find((p) => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { authorName, authorRole, department, content, category } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const newNote = {
    id: `note-${Date.now()}`,
    authorName: authorName || 'Dr. Priya Raman',
    authorRole: authorRole || 'Consultant Physician',
    department: department || 'Internal Medicine',
    date: nowStr,
    content: content.trim(),
    category: category || 'Follow-up',
  };

  patient.doctorNotes.unshift(newNote);
  patient.lastVisit = nowStr;

  // Recent activity
  recentActivities.unshift({
    id: `act-${Date.now()}`,
    patientName: patient.name,
    patientId: patient.id,
    action: 'Clinical consultation note added',
    timeAgo: 'Just now',
    type: 'discharge',
  });

  // Audit log
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'usr-1',
    userName: authorName || 'Dr. Priya Raman',
    userRole: (authorRole?.toLowerCase().includes('nurse') ? 'nurse' : 'doctor'),
    action: 'ADD_NOTE',
    patientId: patient.id,
    patientName: patient.name,
    details: `Appended clinical note: "${content.substring(0, 40)}..."`,
    ipAddress: '192.168.1.104 (Clinical Workstation)',
  });

  res.json({ message: 'Note added successfully', note: newNote, patient });
});

// Patients: Add Medication / Prescription
app.post('/api/patients/:id/medications', (req: Request, res: Response) => {
  const patient = patients.find((p) => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { name, dosage, frequency, route, prescribedBy, department } = req.body;
  if (!name || !dosage) {
    return res.status(400).json({ error: 'Medication name and dosage are required' });
  }

  // Check allergy warning
  const conflictingAllergy = patient.allergies.find((a) =>
    name.toLowerCase().includes(a.allergen.toLowerCase()) ||
    (a.allergen.toLowerCase().includes('penicillin') && (name.toLowerCase().includes('amoxicillin') || name.toLowerCase().includes('ampicillin') || name.toLowerCase().includes('augmentin')))
  );

  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const newMed = {
    id: `med-${Date.now()}`,
    name: name.trim(),
    dosage: dosage.trim(),
    frequency: frequency || 'once daily',
    route: route || 'Oral',
    startDate: nowStr,
    status: 'active' as const,
    prescribedBy: prescribedBy || 'Dr. Priya Raman',
    department: department || 'General Medicine',
    sourceSystem: 'Central e-Prescription Portal',
  };

  patient.medications.unshift(newMed);

  recentActivities.unshift({
    id: `act-${Date.now()}`,
    patientName: patient.name,
    patientId: patient.id,
    action: `Prescription updated (${newMed.name} ${newMed.dosage})`,
    timeAgo: 'Just now',
    type: 'prescription',
  });

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'usr-1',
    userName: prescribedBy || 'Dr. Priya Raman',
    userRole: 'doctor',
    action: 'UPDATE_PRESCRIPTION',
    patientId: patient.id,
    patientName: patient.name,
    details: `Prescribed ${newMed.name} ${newMed.dosage}. ${conflictingAllergy ? '⚠️ Warning: Potential allergy conflict identified.' : 'No known drug conflict.'}`,
    ipAddress: '192.168.1.104 (Clinical Workstation)',
  });

  res.json({
    message: 'Medication recorded',
    medication: newMed,
    allergyConflictWarning: conflictingAllergy ? `Caution: Patient has known allergy to ${conflictingAllergy.allergen}` : null,
    patient,
  });
});

// Patients: Add Lab Result / Vitals
app.post('/api/patients/:id/vitals', (req: Request, res: Response) => {
  const patient = patients.find((p) => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { bloodPressure, heartRate, temperature, spO2, testName, value, unit, referenceRange, status } = req.body;

  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (bloodPressure || heartRate || spO2) {
    if (bloodPressure) patient.vitals.bloodPressure = bloodPressure;
    if (heartRate) patient.vitals.heartRate = Number(heartRate);
    if (temperature) patient.vitals.temperature = temperature;
    if (spO2) patient.vitals.spO2 = Number(spO2);
  }

  if (testName && value) {
    const newLab = {
      id: `lab-${Date.now()}`,
      testName: testName.trim(),
      category: 'Biochemistry' as const,
      value: String(value).trim(),
      unit: unit || '',
      referenceRange: referenceRange || 'Standard Lab Reference',
      status: (status as any) || 'normal',
      testDate: nowStr,
      sourceSystem: 'Hospital Central Diagnostic Lab',
    };
    patient.labResults.unshift(newLab);
  }

  recentActivities.unshift({
    id: `act-${Date.now()}`,
    patientName: patient.name,
    patientId: patient.id,
    action: testName ? `Lab result recorded (${testName}: ${value})` : `Vitals recorded (BP ${patient.vitals.bloodPressure})`,
    timeAgo: 'Just now',
    type: 'vitals',
  });

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'usr-2',
    userName: req.body.staffName || 'Anitha M., RN',
    userRole: 'nurse',
    action: 'UPLOAD_LAB',
    patientId: patient.id,
    patientName: patient.name,
    details: `Updated clinical telemetry and lab markers`,
    ipAddress: '192.168.1.112 (Triage Station)',
  });

  res.json({ message: 'Vitals / Lab record updated', patient });
});

// Pending Diagnostic Reports (Slide 8)
app.get('/api/pending-reports', (req: Request, res: Response) => {
  res.json(pendingReports);
});

app.post('/api/pending-reports/:id/resolve', (req: Request, res: Response) => {
  const index = pendingReports.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const resolved = pendingReports.splice(index, 1)[0];
  res.json({ message: 'Diagnostic report signed off & synced into unified record', resolved });
});

// Recent Activities
app.get('/api/recent-activities', (req: Request, res: Response) => {
  res.json(recentActivities);
});

// Audit Logs (Slide 10, 11, 12: Security & Privacy)
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json(auditLogs);
});

app.post('/api/audit-logs', (req: Request, res: Response) => {
  const { userId, userName, userRole, action, patientId, patientName, details } = req.body;
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: userId || 'usr-anon',
    userName: userName || 'Authenticated Staff',
    userRole: userRole || 'doctor',
    action: action || 'VIEW_RECORD',
    patientId,
    patientName,
    details: details || 'Record inspected',
    ipAddress: '192.168.1.104 (Clinical Workstation)',
  };

  auditLogs.unshift(newLog);
  res.status(201).json(newLog);
});

// ----------------------------------------------------
// AI CLINICAL DECISION SUPPORT & INSIGHTS (Slide 15 & Gemini)
// ----------------------------------------------------
app.post('/api/ai/clinical-insights', async (req: Request, res: Response) => {
  const { patientId } = req.body;
  const patient = patients.find((p) => p.id.toLowerCase() === String(patientId).toLowerCase());

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Audit log for AI clinical evaluation
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'usr-1',
    userName: 'Dr. Priya Raman, MD',
    userRole: 'doctor',
    action: 'CROSS_CHECK_AI',
    patientId: patient.id,
    patientName: patient.name,
    details: `Initiated unified AI clinical synthesis across fragmented silo data`,
    ipAddress: '192.168.1.104 (Clinical Workstation)',
  });

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `You are a clinical decision support assistant built into MediUnify EHR platform.
Analyze this unified patient record synthesized from previously fragmented health systems:
Patient: ${patient.name}, Age ${patient.age}, Gender ${patient.gender}, Blood Group ${patient.bloodGroup}
Known Allergies: ${JSON.stringify(patient.allergies)}
Current Diagnoses: ${JSON.stringify(patient.diagnoses)}
Current Medications: ${JSON.stringify(patient.medications)}
Recent Lab Results: ${JSON.stringify(patient.labResults)}
Latest Vitals: ${JSON.stringify(patient.vitals)}
Doctor Notes: ${JSON.stringify(patient.doctorNotes)}

Respond in valid JSON only with this structure:
{
  "summary": "Concise 2-sentence clinical synopsis uniting all records for the attending doctor",
  "clinicalAlerts": [
    {
      "type": "critical" | "warning" | "info",
      "title": "Short title",
      "description": "Specific clinical reason based on lab values, vitals, or diagnoses"
    }
  ],
  "potentialInteractions": [
    "Drug-drug, drug-allergy or drug-disease contraindications or monitoring notes"
  ],
  "suggestedNextSteps": [
    "Actionable recommendations for the clinician"
  ]
}`;

      const aiResponse = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (aiResponse.text) {
        const parsed = JSON.parse(aiResponse.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini API call returned error, proceeding to clinical algorithm fallback:', err?.message);
    }
  }

  // Intelligent Clinical Decision Support Algorithm (Deterministic Rule-Based Fallback)
  const alerts: any[] = [];
  const interactions: string[] = [];
  const nextSteps: string[] = [];

  // Check allergies
  if (patient.allergies.length > 0) {
    patient.allergies.forEach((a) => {
      alerts.push({
        type: 'critical',
        title: `CRITICAL ALLERGY ALERT: ${a.allergen.toUpperCase()}`,
        description: `Patient documented severe anaphylactic or hypersensitivity reaction (${a.reaction}). Strictly avoid beta-lactams/cephalosporins or cross-reactive compounds.`,
      });
      interactions.push(`Absolute contraindication with ${a.allergen} antibiotic classes. Verify all active and pre-op orders.`);
    });
  }

  // Check Vitals & Labs
  if (patient.vitals.bloodPressure) {
    const [sys, dia] = patient.vitals.bloodPressure.split('/').map(Number);
    if (sys >= 135 || dia >= 85) {
      alerts.push({
        type: 'warning',
        title: 'Elevated Blood Pressure Detected',
        description: `Current reading ${patient.vitals.bloodPressure} mmHg exceeds optimal target (<120/80 mmHg). Correlate with current antihypertensive therapy.`,
      });
      nextSteps.push('Review Amlodipine dosage or assess patient medication compliance and dietary sodium.');
    }
  }

  const hba1c = patient.labResults.find((l) => l.testName.toLowerCase().includes('hba1c'));
  if (hba1c) {
    const val = parseFloat(hba1c.value);
    if (val >= 6.5) {
      alerts.push({
        type: 'info',
        title: `Glycemic Status: HbA1c ${hba1c.value}%`,
        description: `HbA1c of ${hba1c.value}% reflects established diabetes under active pharmacological management. Target range is 6.5% - 7.0%.`,
      });
      nextSteps.push('Repeat HbA1c in 3 months; monitor quarterly renal panel alongside Metformin.');
    }
  }

  const egfr = patient.labResults.find((l) => l.testName.toLowerCase().includes('gfr'));
  if (egfr && parseFloat(egfr.value) < 60) {
    alerts.push({
      type: 'warning',
      title: `Decreased Renal Clearance (eGFR ${egfr.value})`,
      description: `Renal filtering capacity compromised. Avoid nephrotoxic agents including NSAIDs and iodinated IV contrast.`,
    });
    interactions.push('NSAIDs contraindicated due to reduced glomerular filtration rate.');
  }

  // General next steps
  nextSteps.push('Ensure cross-department synchronization between Outpatient Clinic and Pathology.');
  nextSteps.push('Schedule quarterly clinical review to reassess medication tolerance.');

  const summary = `Unified record synthesis for ${patient.name} (${patient.age}y ${patient.gender}): active diagnoses of ${patient.diagnoses.map((d) => d.condition).join(', ') || 'None'}. Ongoing medical therapy includes ${patient.medications.map((m) => m.name).join(', ') || 'No active meds'}. Vitals reflect ${patient.vitals.bloodPressure} mmHg with SpO2 at ${patient.vitals.spO2}%.`;

  res.json({
    summary,
    clinicalAlerts: alerts,
    potentialInteractions: interactions,
    suggestedNextSteps: nextSteps,
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediUnify EHR Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
