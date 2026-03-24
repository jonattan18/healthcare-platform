export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
  admissionDate: string;
  doctor: string;
  department: string;
  phone: string;
  email: string;
  avatar: string;
  lastVisit: string;
  bloodType: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
