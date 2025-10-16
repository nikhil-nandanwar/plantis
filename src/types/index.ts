// Shared type definitions for the Plantis app

export interface ScanResult {
  status: 'healthy' | 'diseased';
  confidence: number;
  disease?: string;
  recommendations?: string[];
}

export interface ScanHistory {
  id: string;
  date: string;
  status: 'healthy' | 'diseased';
  confidence: number;
  imageUri: string;
  disease?: string;
  recommendations?: string[];
}

export type Screen = 'upload' | 'result' | 'history';
