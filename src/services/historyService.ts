import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult } from '../types';

/**
 * Service for managing scan history with local storage and performance optimization
 */
export class HistoryService {
  private static readonly HISTORY_KEY = '@plantis_scan_history';
  private static readonly MAX_HISTORY_ITEMS = 100;
  private static readonly CACHE_EXPIRY_DAYS = 30;

  /**
   * Saves a scan result to history
   */
  async saveScanResult(scanResult: ScanResult): Promise<void> {
    try {
      const existingHistory = await this.getAllScanResults();
      
      // Add new result at the beginning (most recent first)
      const updatedHistory = [scanResult, ...existingHistory];
      
      // Limit history size for performance
      const trimmedHistory = updatedHistory.slice(0, HistoryService.MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(
        HistoryService.HISTORY_KEY, 
        JSON.stringify(trimmedHistory)
      );
      
      console.log(`Saved scan result to history: ${scanResult.id}`);
    } catch (error) {
      console.error('Failed to save scan result to history:', error);
      throw new Error('Failed to save scan result to history');
    }
  }

  /**
   * Retrieves all scan results from history, sorted by timestamp (newest first)
   */
  async getAllScanResults(): Promise<ScanResult[]> {
    try {
      const historyData = await AsyncStorage.getItem(HistoryService.HISTORY_KEY);
      
      if (!historyData) {
        return [];
      }

      const parsedHistory: ScanResult[] = JSON.parse(historyData);
      
      // Convert timestamp strings back to Date objects and sort
      const processedHistory = parsedHistory
        .map(result => ({
          ...result,
          timestamp: new Date(result.timestamp)
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return processedHistory;
    } catch (error) {
      console.error('Failed to retrieve scan history:', error);
      return [];
    }
  }

  /**
   * Retrieves a specific scan result by ID
   */
  async getScanResultById(id: string): Promise<ScanResult | null> {
    try {
      const allResults = await this.getAllScanResults();
      return allResults.find(result => result.id === id) || null;
    } catch (error) {
      console.error('Failed to retrieve scan result by ID:', error);
      return null;
    }
  }

  /**
   * Deletes a specific scan result from history
   */
  async deleteScanResult(id: string): Promise<boolean> {
    try {
      const existingHistory = await this.getAllScanResults();
      const filteredHistory = existingHistory.filter(result => result.id !== id);
      
      await AsyncStorage.setItem(
        HistoryService.HISTORY_KEY, 
        JSON.stringify(filteredHistory)
      );
      
      console.log(`Deleted scan result from history: ${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete scan result from history:', error);
      return false;
    }
  }

  /**
   * Clears all scan history
   */
  async clearAllHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HistoryService.HISTORY_KEY);
      console.log('Cleared all scan history');
    } catch (error) {
      console.error('Failed to clear scan history:', error);
      throw new Error('Failed to clear scan history');
    }
  }

  /**
   * Gets the count of items in history
   */
  async getHistoryCount(): Promise<number> {
    try {
      const history = await this.getAllScanResults();
      return history.length;
    } catch (error) {
      console.error('Failed to get history count:', error);
      return 0;
    }
  }

  /**
   * Performs cleanup of old entries and optimizes storage
   */
  async performCleanup(): Promise<{ removedCount: number; totalSize: number }> {
    try {
      const allResults = await this.getAllScanResults();
      const now = new Date();
      const expiryDate = new Date(now.getTime() - (HistoryService.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
      
      // Remove expired entries
      const validResults = allResults.filter(result => 
        result.timestamp > expiryDate
      );
      
      // Limit to max items
      const trimmedResults = validResults.slice(0, HistoryService.MAX_HISTORY_ITEMS);
      
      const removedCount = allResults.length - trimmedResults.length;
      
      if (removedCount > 0) {
        await AsyncStorage.setItem(
          HistoryService.HISTORY_KEY, 
          JSON.stringify(trimmedResults)
        );
        console.log(`Cleaned up ${removedCount} old scan results`);
      }
      
      // Calculate storage size
      const storageData = JSON.stringify(trimmedResults);
      const totalSize = new Blob([storageData]).size;
      
      return { removedCount, totalSize };
    } catch (error) {
      console.error('Failed to perform history cleanup:', error);
      return { removedCount: 0, totalSize: 0 };
    }
  }

  /**
   * Filters scan results by status
   */
  async getResultsByStatus(status: 'healthy' | 'diseased'): Promise<ScanResult[]> {
    try {
      const allResults = await this.getAllScanResults();
      return allResults.filter(result => result.status === status);
    } catch (error) {
      console.error('Failed to filter results by status:', error);
      return [];
    }
  }

  /**
   * Gets scan results within a date range
   */
  async getResultsByDateRange(startDate: Date, endDate: Date): Promise<ScanResult[]> {
    try {
      const allResults = await this.getAllScanResults();
      return allResults.filter(result => 
        result.timestamp >= startDate && result.timestamp <= endDate
      );
    } catch (error) {
      console.error('Failed to filter results by date range:', error);
      return [];
    }
  }

  /**
   * Exports history data for backup purposes
   */
  async exportHistory(): Promise<string> {
    try {
      const allResults = await this.getAllScanResults();
      return JSON.stringify(allResults, null, 2);
    } catch (error) {
      console.error('Failed to export history:', error);
      throw new Error('Failed to export history data');
    }
  }

  /**
   * Imports history data from backup
   */
  async importHistory(historyData: string): Promise<number> {
    try {
      const importedResults: ScanResult[] = JSON.parse(historyData);
      
      // Validate imported data structure
      const validResults = importedResults.filter(result => 
        result.id && result.imageUri && result.status && 
        typeof result.confidence === 'number' && result.timestamp
      );
      
      // Convert timestamps and sort
      const processedResults = validResults
        .map(result => ({
          ...result,
          timestamp: new Date(result.timestamp)
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, HistoryService.MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(
        HistoryService.HISTORY_KEY, 
        JSON.stringify(processedResults)
      );
      
      console.log(`Imported ${processedResults.length} scan results`);
      return processedResults.length;
    } catch (error) {
      console.error('Failed to import history:', error);
      throw new Error('Failed to import history data');
    }
  }
}

// Export singleton instance
export const historyService = new HistoryService();