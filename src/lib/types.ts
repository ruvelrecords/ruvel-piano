export type AgeGroup = 'Kids (6-12)' | 'Youth (13-17)' | 'Adults (18+)';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type ClassStatus = 'Completed' | 'Cancelled' | 'Rescheduled' | 'Scheduled';
export type PaymentType = 'Single' | '4-Pack' | '8-Pack' | 'Custom';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Other';

export interface RuvelKey {
  id: string;
  name: string;
  emoji: string;
  description: string;
  type: 'auto' | 'manual';
  milestone?: number;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  level: Level;
  goals: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  notes: string;
  currentModule: number;
  assignedSongs: string[];
  keysEarned: string[];
  createdAt: string;
  updatedAt: string;
  // Per-student custom pricing
  priceSingle?: number;
  price4Pack?: number;
  price8Pack?: number;
  // Auth credentials
  username?: string;
  pin?: string;
  // Schedule info
  schedule?: string;
}

export type MaterialKind = 'video' | 'pdf' | 'sheet' | 'image' | 'link' | 'audio';

export interface ClassMaterial {
  id: string;
  kind: MaterialKind;
  label: string;
  // Either a URL (YouTube / Drive / etc.) OR a base64 data URI (for small images).
  url?: string;
  dataUri?: string;
  notes?: string;
  createdAt: string;
}

export interface ClassEntry {
  id: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  status: ClassStatus;
  module: number;
  whatWeWorkedOn: string;
  homeworkAssigned: string;
  teacherNotes: string;
  nextClassFocus: string;
  createdAt: string;
  // Enhanced fields
  topics?: string[];
  songsWorkedOn?: string[];
  energyLevel?: 'Low' | 'Medium' | 'High';
  achievement?: string;
  needsWork?: string;
  sessionRating?: 1 | 2 | 3 | 4 | 5;
  // Material assigned to this specific class (videos, PDFs, sheets, links)
  materials?: ClassMaterial[];
}

export interface Payment {
  id: string;
  studentId: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  date: string;
  notes: string;
  classesTotal: number;
  classesRemaining: number;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  relationship: 'Current Student' | 'Former Student' | 'Parent of Student';
  rating: number;
  experience: string;
  duration: string;
  recommend: boolean;
  status: 'Pending' | 'Published' | 'Hidden';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  studentId: string;
  type: 'photo' | 'video';
  data: string;
  caption: string;
  date: string;
  createdAt: string;
}

export interface Settings {
  teacherName: string;
  studioName: string;
  location: string;
  currency: string;
  priceSingle: number;
  price4Pack: number;
  price8Pack: number;
}

export interface ActivityEntry {
  id: string;
  message: string;
  type: 'student' | 'class' | 'payment' | 'key' | 'note';
  timestamp: string;
}

export interface AppSession {
  role: 'teacher' | 'student';
  studentId?: string;
  name: string;
  loggedInAt: string;
}

export interface AuthStore {
  teacher: {
    username: string;
    password: string;
  };
}
