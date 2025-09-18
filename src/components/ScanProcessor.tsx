import React, { useState, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { ScanResult, ErrorState, LoadingState } from '../types';
import { scanService } from '../services/scanService';
import { HapticService } from '../services/hapticService';
import { LoadingSpinner } from './LoadingSpinner';
import { ResultScreen } from './ResultScreen';

interface ScanProcessorProps {
  imageUri: string;
  onScanComplete: (result: ScanResult) => void;
  onScanError: (error: ErrorState) => void;
  onRetry?: () => void;
  onNewScan?: () => void;
  onViewHistory?: () => void;
}

export const ScanProcessor: React.FC<ScanProcessorProps> = ({
  imageUri,
  onScanComplete,
  onScanError,
  onRetry,
  onNewScan,
  onViewHistory,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    message: 'Preparing to analyze your plant...',
    progress: 0,
  });
  
  const [result, setResult] = useState<ScanResult | undefined>();
  const [error, setError] = useState<ErrorState | undefined>();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasStartedScan = useRef(false);

  // Enhanced encouraging messages for loading
  const encouragingMessages = [
    "Our AI is carefully examining your plant for the best care recommendations...",
    "Analyzing leaf patterns, colors, and health indicators with precision...",
    "Your plant care journey is important to us - we're being thorough! 🌱",
    "Almost there! Preparing personalized plant care tips just for you...",
    "Great job taking care of your plants! Results coming up...",
    "Every plant deserves the best care - we're making sure you get expert advice! 🌿"
  ];

  const updateProgress = useCallback((progress: number, message: string) => {
    setLoadingState(prev => ({
      ...prev,
      progress,
      message,
    }));

    // Provide haptic feedback at key milestones
    if (progress === 0.5 || progress === 0.8) {
      HapticService.progressMilestone();
    }
  }, []);

  const performScan = useCallback(async () => {
    if (!imageUri || hasStartedScan.current) return;
    
    hasStartedScan.current = true;
    setIsProcessing(true);
    setError(undefined);
    setResult(undefined);

    // Haptic feedback when scan starts
    HapticService.scanStart();

    try {
      const scanResult = await scanService.performScan(imageUri, updateProgress);

      if (scanResult.result) {
        // Haptic feedback for successful scan completion
        HapticService.scanComplete();
        
        setResult(scanResult.result);
        setIsProcessing(false);
        onScanComplete(scanResult.result);
      } else if (scanResult.error) {
        // Haptic feedback for scan error
        HapticService.error();
        
        setError(scanResult.error);
        setIsProcessing(false);
        onScanError(scanResult.error);
      }
    } catch (error) {
      console.error('Scan processor error:', error);
      
      // Haptic feedback for unexpected error
      HapticService.error();
      
      const errorState: ErrorState = {
        hasError: true,
        message: 'An unexpected error occurred during scanning.',
        retryable: true,
      };
      setError(errorState);
      setIsProcessing(false);
      onScanError(errorState);
    }
  }, [imageUri, updateProgress, onScanComplete, onScanError]);

  const handleRetry = useCallback(() => {
    hasStartedScan.current = false;
    setError(undefined);
    setResult(undefined);
    setLoadingState({
      isLoading: true,
      message: 'Preparing to analyze your plant...',
      progress: 0,
    });
    
    if (onRetry) {
      onRetry();
    } else {
      performScan();
    }
  }, [onRetry, performScan]);

  // Start scan when component mounts
  React.useEffect(() => {
    if (imageUri && !hasStartedScan.current) {
      performScan();
    }
  }, [imageUri, performScan]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      scanService.cancelCurrentScan();
    };
  }, []);

  // Show loading spinner while processing
  if (isProcessing && !result && !error) {
    return (
      <LoadingSpinner
        message={loadingState.message}
        progress={loadingState.progress}
        showProgress={true}
        encouragingMessages={encouragingMessages}
        showProcessingSteps={true}
      />
    );
  }

  // Show results or error screen
  return (
    <ResultScreen
      result={result}
      error={error}
      onRetry={handleRetry}
      onNewScan={onNewScan}
      onViewHistory={onViewHistory}
    />
  );
};