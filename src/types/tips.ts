/**
 * Types for plant care tips and disease information
 */

export interface PlantTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'general' | 'disease' | 'prevention' | 'treatment';
  severity?: 'low' | 'medium' | 'high';
  expandedContent?: string;
  steps?: string[];
  relatedTips?: string[];
}

export interface DiseaseInfo {
  diseaseType: string;
  symptoms: string[];
  causes: string[];
  treatment: PlantTip[];
  prevention: PlantTip[];
}

export interface TipCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  tips: PlantTip[];
}