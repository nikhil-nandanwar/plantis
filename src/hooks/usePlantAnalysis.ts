import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult, ScanHistory } from '../types';

// Mock AI analysis - replace with actual API call
const mockAnalyze = async (): Promise<ScanResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  const mockResult: ScanResult = {
    status: Math.random() > 0.6 ? 'healthy' : 'diseased',
    confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
  };

  // Add disease and recommendations if diseased
  if (mockResult.status === 'diseased') {
    const diseases = [
      'Leaf Spot',
      'Powdery Mildew',
      'Bacterial Blight',
      'Rust Disease',
      'Anthracnose'
    ];
    mockResult.disease = diseases[Math.floor(Math.random() * diseases.length)];
    mockResult.recommendations = [
      'Remove affected leaves immediately',
      'Improve air circulation around the plant',
      'Avoid watering the leaves directly',
      'Apply appropriate fungicide treatment',
      'Monitor plant closely for 1-2 weeks'
    ];
  } else {
    mockResult.recommendations = [
      'Your plant looks healthy! Keep up the good work',
      'Continue regular watering schedule',
      'Ensure adequate sunlight exposure',
      'Check for pests regularly',
      'Consider fertilizing during growing season'
    ];
  }

  return mockResult;
};

export function usePlantAnalysis() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = useCallback(async (imageUri: string): Promise<ScanResult | null> => {
    setIsAnalyzing(true);
    try {
      // Replace with actual API call: plantisApi.analyzePlant(imageUri)
      const analysisResult = await mockAnalyze();
      setResult(analysisResult);

      // Save to history
      const scanHistory: ScanHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: analysisResult.status,
        confidence: analysisResult.confidence,
        imageUri,
        disease: analysisResult.disease,
        recommendations: analysisResult.recommendations
      };

      const existingHistory = await AsyncStorage.getItem('scanHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(scanHistory);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(history));

      return analysisResult;
    } catch (error) {
      console.error('Analysis failed:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { result, isAnalyzing, analyzeImage, clearResult };
}
