import { Student, ClassEntry, Payment, ActivityEntry } from './types';
import { generateId } from './utils';

// Today is 2026-05-14
// Luciana: Fridays at 4:00 PM | 3 completed classes
// Zoe: Mondays at 4:00 PM | 5 completed classes (trial + 4 enrolled)
// Dairo: Thursdays at 5:00 PM | 1 completed class, 1 scheduled today

export function createSeedData(): {
  students: Student[];
  classes: ClassEntry[];
  payments: Payment[];
  activity: ActivityEntry[];
} {
  const luciana: Student = {
    id: 'student_luciana',
    name: 'Luciana',
    age: 10,
    ageGroup: 'Kids (6-12)',
    level: 'Beginner',
    goals: 'Learn chords, read music, play songs she loves',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    notes: '',
    currentModule: 2,
    assignedSongs: [],
    keysEarned: ['first_touch'],
    createdAt: '2026-04-24T08:00:00.000Z',
    updatedAt: '2026-05-08T16:00:00.000Z',
    // Luciana's personal rates: $50/class | 4-pack $180 | 8-pack $360
    priceSingle: 50,
    price4Pack: 180,
    price8Pack: 360,
    username: 'luciana',
    pin: '1111',
    schedule: 'Fridays at 4:00 PM',
  };

  const zoe: Student = {
    id: 'student_zoe',
    name: 'Zoe',
    age: 13,
    ageGroup: 'Youth (13-17)',
    level: 'Beginner',
    goals: 'Play songs she loves, improve technique, learn to read music',
    parentName: 'Sofi (mom)',
    parentPhone: '',
    parentEmail: '',
    notes: '',
    currentModule: 3,
    assignedSongs: [],
    keysEarned: ['first_touch'],
    createdAt: '2026-03-19T08:00:00.000Z',
    updatedAt: '2026-05-11T16:45:00.000Z',
    // Zoe's personal rates: $50/class | 4-pack $160 | 8-pack $320
    priceSingle: 50,
    price4Pack: 160,
    price8Pack: 320,
    username: 'zoe',
    pin: '2222',
    schedule: 'Mondays at 4:00 PM',
  };

  const dairo: Student = {
    id: 'student_dairo',
    name: 'Dairo',
    age: 30,
    ageGroup: 'Adults (18+)',
    level: 'Beginner',
    goals: 'Learn to play chords, understand music theory, have fun with piano',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    notes: '',
    currentModule: 2,
    assignedSongs: [],
    keysEarned: ['first_touch'],
    createdAt: '2026-05-07T08:00:00.000Z',
    updatedAt: '2026-05-07T19:00:00.000Z',
    // Dairo's personal rates: $60/class | individual only
    priceSingle: 60,
    price4Pack: 220,
    price8Pack: 460,
    username: 'dairo',
    pin: '3333',
    schedule: 'Thursdays at 5:00 PM',
  };

  // ─── Luciana's classes (Fridays at 4:00 PM) ─────────────────────────────
  const lucianaClasses: ClassEntry[] = [
    {
      id: 'class_luciana_1',
      studentId: 'student_luciana',
      date: '2026-04-24',
      time: '16:00',
      duration: 45,
      status: 'Completed',
      module: 1,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-04-24T16:45:00.000Z',
    },
    {
      id: 'class_luciana_2',
      studentId: 'student_luciana',
      date: '2026-05-01',
      time: '16:00',
      duration: 45,
      status: 'Completed',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-01T16:45:00.000Z',
    },
    {
      id: 'class_luciana_3',
      studentId: 'student_luciana',
      date: '2026-05-08',
      time: '16:00',
      duration: 45,
      status: 'Completed',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-08T16:45:00.000Z',
    },
  ];

  // ─── Zoe's classes (Mondays at 4:00 PM) ─────────────────────────────────
  const zoeClasses: ClassEntry[] = [
    {
      id: 'class_zoe_1',
      studentId: 'student_zoe',
      date: '2026-03-19',
      time: '16:00',
      duration: 60,
      status: 'Completed',
      module: 1,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-03-19T16:00:00.000Z',
    },
    {
      id: 'class_zoe_2',
      studentId: 'student_zoe',
      date: '2026-03-23',
      time: '16:00',
      duration: 60,
      status: 'Completed',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-03-23T16:00:00.000Z',
    },
    {
      id: 'class_zoe_3',
      studentId: 'student_zoe',
      date: '2026-03-30',
      time: '16:00',
      duration: 60,
      status: 'Completed',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-03-30T16:00:00.000Z',
    },
    {
      id: 'class_zoe_4',
      studentId: 'student_zoe',
      date: '2026-05-01',
      time: '16:00',
      duration: 60,
      status: 'Completed',
      module: 3,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-01T16:00:00.000Z',
    },
    {
      id: 'class_zoe_5',
      studentId: 'student_zoe',
      date: '2026-05-11',
      time: '16:00',
      duration: 60,
      status: 'Completed',
      module: 3,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-11T16:45:00.000Z',
    },
    // Next scheduled class
    {
      id: 'class_zoe_next',
      studentId: 'student_zoe',
      date: '2026-05-18',
      time: '16:00',
      duration: 60,
      status: 'Scheduled',
      module: 4,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-11T17:00:00.000Z',
    },
  ];

  // ─── Dairo's classes (Thursdays at 5:00 PM) ──────────────────────────────
  const dairoClasses: ClassEntry[] = [
    {
      id: 'class_dairo_1',
      studentId: 'student_dairo',
      date: '2026-05-07',
      time: '17:00',
      duration: 60,
      status: 'Completed',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-07T17:00:00.000Z',
    },
    {
      id: 'class_dairo_today',
      studentId: 'student_dairo',
      date: '2026-05-14',
      time: '17:00',
      duration: 60,
      status: 'Scheduled',
      module: 2,
      whatWeWorkedOn: '',
      homeworkAssigned: '',
      teacherNotes: '',
      nextClassFocus: '',
      createdAt: '2026-05-07T17:30:00.000Z',
    },
  ];

  // ─── Payments ─────────────────────────────────────────────────────────────
  // Luciana: $180 AUD | Cash | Apr 24 | 4-class pack | 3 used, 1 remaining
  const lucianaPayment: Payment = {
    id: 'payment_luciana_1',
    studentId: 'student_luciana',
    type: '4-Pack',
    amount: 180,
    method: 'Cash',
    date: '2026-04-24',
    notes: '4-class pack paid upfront on first class',
    classesTotal: 4,
    classesRemaining: 1,
    createdAt: '2026-04-24T16:00:00.000Z',
  };

  // Zoe: $25 trial Mar 19 + $160 4-pack Mar 23 | both Cash
  const zoeTrialPayment: Payment = {
    id: 'payment_zoe_trial',
    studentId: 'student_zoe',
    type: 'Single',
    amount: 25,
    method: 'Cash',
    date: '2026-03-19',
    notes: 'Trial class (30 min)',
    classesTotal: 1,
    classesRemaining: 0,
    createdAt: '2026-03-19T16:00:00.000Z',
  };

  const zoePackPayment: Payment = {
    id: 'payment_zoe_pack',
    studentId: 'student_zoe',
    type: '4-Pack',
    amount: 160,
    method: 'Cash',
    date: '2026-03-23',
    notes: '4-class pack — pack complete, new pack PENDING',
    classesTotal: 4,
    classesRemaining: 0,
    createdAt: '2026-03-23T16:00:00.000Z',
  };

  // Dairo: $120 AUD | Cash | May 7 | 2 individual classes pre-paid ($60 each)
  const dairoPayment: Payment = {
    id: 'payment_dairo_1',
    studentId: 'student_dairo',
    type: 'Custom',
    amount: 120,
    method: 'Cash',
    date: '2026-05-07',
    notes: '2 individual classes pre-paid at $60 each (May 7 + May 14)',
    classesTotal: 2,
    classesRemaining: 1,
    createdAt: '2026-05-07T17:00:00.000Z',
  };

  // ─── Activity feed ────────────────────────────────────────────────────────
  const activity: ActivityEntry[] = [
    {
      id: generateId(),
      message: 'Zoe completed class — May 11 (Module 3)',
      type: 'class',
      timestamp: '2026-05-11T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Luciana completed class — May 8 (Module 2)',
      type: 'class',
      timestamp: '2026-05-08T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Dairo completed first class — May 7 (Module 2)',
      type: 'class',
      timestamp: '2026-05-07T18:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Dairo paid $120 cash — 2 individual classes',
      type: 'payment',
      timestamp: '2026-05-07T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Zoe completed class — May 1 (Module 3)',
      type: 'class',
      timestamp: '2026-05-01T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Luciana completed class — May 1 (Module 2)',
      type: 'class',
      timestamp: '2026-05-01T16:45:00.000Z',
    },
    {
      id: generateId(),
      message: 'Luciana paid $180 cash — 4-class pack',
      type: 'payment',
      timestamp: '2026-04-24T16:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Luciana completed class — Apr 24 (Module 1)',
      type: 'class',
      timestamp: '2026-04-24T16:45:00.000Z',
    },
    {
      id: generateId(),
      message: 'Zoe completed class — Mar 30 (Module 2)',
      type: 'class',
      timestamp: '2026-03-30T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Zoe paid $160 cash — 4-class pack',
      type: 'payment',
      timestamp: '2026-03-23T16:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Zoe completed trial class — Mar 19',
      type: 'class',
      timestamp: '2026-03-19T17:00:00.000Z',
    },
    {
      id: generateId(),
      message: 'Zoe paid $25 cash — trial class',
      type: 'payment',
      timestamp: '2026-03-19T16:00:00.000Z',
    },
  ];

  return {
    students: [luciana, zoe, dairo],
    classes: [...lucianaClasses, ...zoeClasses, ...dairoClasses],
    payments: [lucianaPayment, zoeTrialPayment, zoePackPayment, dairoPayment],
    activity,
  };
}
