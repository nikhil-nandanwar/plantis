import { useState, useEffect, useCallback } from 'react';
import { ScanResult } from '../types';
import { historyService } from '../services/historyService';

interface UseHistoryState {
  scanResults: ScanResult[];
  isLoading: boolean;
  error: string | null;
  historyCount: number;
}

interface UseHistoryActions {
  refreshHistory: () => Promise<void>;
  addScanResult: (scanResult: ScanResult) => Promise<void>;
  deleteScanResult: (id: string) => Promise<boolean>;
  clearAllHistory: () => Promise<void>;
  performCleanup: () => Promise<{ removedCount: number; totalSize: number }>;
  getResultsByStatus: (status: 'healthy' | 'diseased') => Promise<ScanResult[]>;
  getScanResultById: (id: string) => Promise<ScanResult | null>;
}

interface UseHistoryReturn extends UseHistoryState, UseHistoryActions {}

/**
 * Custom hook for managing scan history with local storage
 */
export const useHistory = (): UseHistoryReturn => {
  const [state, setState] = useState<UseHistoryState>({
    scanResults: [],
    isLoading: true,
    error: null,
    historyCount: 0,
  });

  const refreshHistory = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [results, count] = await Promise.all([
        historyService.getAllScanResults(),
        historyService.getHistoryCount(),
      ]);
      
      setState(prev => ({
        ...prev,
        scanResults: results,
        historyCount: count,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to refresh history:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load scan history',
        isLoading: false,
      }));
    }
  }, []);

  const addScanResult = useCallback(async (scanResult: ScanResult) => {
    try {
      await historyService.saveScanResult(scanResult);
      
      // Update local state immediately for better UX
      setState(prev => ({
        ...prev,
        scanResults: [scanResult, ...prev.scanResults],
        historyCount: prev.historyCount + 1,
      }));
    } catch (error) {
      console.error('Failed to add scan result:', error);
      throw new Error('Failed to save scan result');
    }
  }, []);

  const deleteScanResult = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await historyService.deleteScanResult(id);
      
      if (success) {
        // Update local state immediately
        setState(prev => ({
          ...prev,
          scanResults: prev.scanResults.filter(result => result.id !== id),
          historyCount: Math.max(0, prev.historyCount - 1),
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to delete scan result:', error);
      return false;
    }
  }, []);

  const clearAllHistory = useCallback(async () => {
    try {
      await historyService.clearAllHistory();
      
      setState(prev => ({
        ...prev,
        scanResults: [],
        historyCount: 0,
      }));
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw new Error('Failed to clear scan history');
    }
  }, []);

  const performCleanup = useCallback(async () => {
    try {
      const result = await historyService.performCleanup();
      
      // Refresh history after cleanup
      await refreshHistory();
      
      return result;
    } catch (error) {
      console.error('Failed to perform cleanup:', error);
      return { removedCount: 0, totalSize: 0 };
    }
  }, [refreshHistory]);

  const getResultsByStatus = useCallback(async (status: 'healthy' | 'diseased') => {
    try {
      return await historyService.getResultsByStatus(status);
    } catch (error) {
      console.error('Failed to get results by status:', error);
      return [];
    }
  }, []);

  const getScanResultById = useCallback(async (id: string) => {
    try {
      return await historyService.getScanResultById(id);
    } catch (error) {
      console.error('Failed to get scan result by ID:', error);
      return null;
    }
  }, []);

  // Load initial history on mount
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    // State
    scanResults: state.scanResults,
    isLoading: state.isLoading,
    error: state.error,
    historyCount: state.historyCount,
    
    // Actions
    refreshHistory,
    addScanResult,
    deleteScanResult,
    clearAllHistory,
    performCleanup,
    getResultsByStatus,
    getScanResultById,
  };
};