
export enum Department {
  RADIOLOGY = 'Radiology',
  ONCOLOGY = 'Oncology',
  PATHOLOGY = 'Pathology',
  ADMIN = 'Administration'
}

export interface User {
  id: string;
  name: string;
  role: 'Doctor' | 'Admin' | 'Staff';
  department: Department;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  department: Department;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  department: Department;
}
