import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './Onboarding';
import UploadScreen from './UploadScreen';
import ResultScreen from './ResultScreen';
import HistoryScreen from './HistoryScreen';
import plantisApi from '../services/plantisApi';

interface ScanResult {
  status: 'healthy' | 'diseased';
  confidence: number;
}

interface ScanHistory {
  id: string;
  date: string;
  status: 'healthy' | 'diseased';
  confidence: number;
  imageUri: string;
}

type Screen = 'onboarding' | 'upload' | 'result' | 'history';

export default function PlantisApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historyScan, setHistoryScan] = useState<ScanHistory | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      if (completed === 'true') {
        setCurrentScreen('upload');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('upload');
  };

  const handleImageSelected = async (imageUri: string) => {
    setSelectedImage(imageUri);
    setIsAnalyzing(true);
    setCurrentScreen('result');

    // API call to analyze plant
    try {
      // For demo purposes, using mock data. Replace with:
      // const result = await plantisApi.analyzePlant(imageUri);
      const mockResult: ScanResult = {
        status: Math.random() > 0.5 ? 'healthy' : 'diseased',
        confidence: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setScanResult(mockResult);

      // Save to history
      const scanHistory: ScanHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: mockResult.status,
        confidence: mockResult.confidence,
        imageUri
      };

      const existingHistory = await AsyncStorage.getItem('scanHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(scanHistory);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(history));

    } catch (error) {
      console.error('API call failed:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to analyze the plant image. Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => setCurrentScreen('upload') }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setSelectedImage(null);
    setScanResult(null);
    setHistoryScan(null);
    setCurrentScreen('upload');
  };

  const handleHistoryPress = () => {
    setCurrentScreen('history');
  };

  const handleBackToHome = () => {
    setSelectedImage(null);
    setScanResult(null);
    setHistoryScan(null);
    setCurrentScreen('upload');
  };

  const handleViewHistoryResult = (scan: ScanHistory) => {
    setHistoryScan(scan);
    setScanResult({ status: scan.status, confidence: scan.confidence });
    setSelectedImage(scan.imageUri);
    setCurrentScreen('result');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'upload':
        return (
          <UploadScreen
            onImageSelected={handleImageSelected}
            onHistoryPress={handleHistoryPress}
          />
        );
      case 'result':
        return (
          <ResultScreen
            imageUri={selectedImage || ''}
            result={scanResult}
            onNewScan={handleNewScan}
            onBack={handleBackToHome}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            onBack={handleBackToHome}
            onViewResult={handleViewHistoryResult}
          />
        );
      default:
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <View className="flex-1">
      {renderScreen()}
    </View>
  );
}