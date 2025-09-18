import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult, UserPreferences } from '../types';

/**
 * AsyncStorage wrapper functions for history management
 */

// Storage keys
const STORAGE_KEYS = {
  SCAN_HISTORY: '@plantis:scan_history',
  USER_PREFERENCES: '@plantis:user_preferences',
  FIRST_TIME_USER: '@plantis:first_time_user',
} as const;

// Maximum number of scan results to store
const MAX_HISTORY_ITEMS = 100;

/**
 * Save a scan result to history
 * @param scanResult - The scan result to save
 * @returns Promise<void>
 */
export async function saveScanResult(scanResult: ScanResult): Promise<void> {
  try {
    const existingHistory = await getScanHistory();
    
    // Add new result at the beginning of the array
    const updatedHistory = [scanResult, ...existingHistory];
    
    // Limit to maximum number of items
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCAN_HISTORY,
      JSON.stringify(trimmedHistory)
    );
  } catch (error) {
    throw new Error(`Failed to save scan result: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all scan results from history
 * @returns Promise<ScanResult[]> - Array of scan results
 */
export async function getScanHistory(): Promise<ScanResult[]> {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    
    if (!historyJson) {
      return [];
    }
    
    const history = JSON.parse(historyJson);
    
    // Convert timestamp strings back to Date objects
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('Failed to get scan history:', error);
    return [];
  }
}

/**
 * Get a specific scan result by ID
 * @param id - The ID of the scan result
 * @returns Promise<ScanResult | null> - The scan result or null if not found
 */
export async function getScanResultById(id: string): Promise<ScanResult | null> {
  try {
    const history = await getScanHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Failed to get scan result by ID:', error);
    return null;
  }
}

/**
 * Delete a scan result from history
 * @param id - The ID of the scan result to delete
 * @returns Promise<boolean> - True if deleted, false if not found
 */
export async function deleteScanResult(id: string): Promise<boolean> {
  try {
    const history = await getScanHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    
    if (filteredHistory.length === history.length) {
      return false; // Item not found
    }
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCAN_HISTORY,
      JSON.stringify(filteredHistory)
    );
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete scan result: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clear all scan history
 * @returns Promise<void>
 */
export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
  } catch (error) {
    throw new Error(`Failed to clear scan history: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the number of items in scan history
 * @returns Promise<number> - Number of items in history
 */
export async function getScanHistoryCount(): Promise<number> {
  try {
    const history = await getScanHistory();
    return history.length;
  } catch (error) {
    console.error('Failed to get scan history count:', error);
    return 0;
  }
}

/**
 * Save user preferences
 * @param preferences - User preferences to save
 * @returns Promise<void>
 */
export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    throw new Error(`Failed to save user preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get user preferences
 * @returns Promise<UserPreferences> - User preferences with defaults
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  try {
    const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    
    if (!preferencesJson) {
      // Return default preferences
      const defaultPreferences: UserPreferences = {
        isFirstTime: true,
        notificationsEnabled: true,
        imageQuality: 'medium',
      };
      
      // Save defaults for future use
      await saveUserPreferences(defaultPreferences);
      return defaultPreferences;
    }
    
    return JSON.parse(preferencesJson);
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    // Return defaults on error
    return {
      isFirstTime: true,
      notificationsEnabled: true,
      imageQuality: 'medium',
    };
  }
}

/**
 * Check if this is the first time the user is opening the app
 * @returns Promise<boolean> - True if first time user
 */
export async function isFirstTimeUser(): Promise<boolean> {
  try {
    const preferences = await getUserPreferences();
    return preferences.isFirstTime;
  } catch (error) {
    console.error('Failed to check first time user:', error);
    return true; // Default to first time user on error
  }
}

/**
 * Mark that the user has completed onboarding
 * @returns Promise<void>
 */
export async function markOnboardingComplete(): Promise<void> {
  try {
    const preferences = await getUserPreferences();
    await saveUserPreferences({
      ...preferences,
      isFirstTime: false,
    });
  } catch (error) {
    throw new Error(`Failed to mark onboarding complete: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get storage usage statistics
 * @returns Promise<{historyCount: number, estimatedSize: string}> - Storage statistics
 */
export async function getStorageStats(): Promise<{historyCount: number, estimatedSize: string}> {
  try {
    const historyCount = await getScanHistoryCount();
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    
    const estimatedBytes = (historyJson?.length || 0) + (preferencesJson?.length || 0);
    const estimatedKB = Math.round(estimatedBytes / 1024);
    const estimatedSize = estimatedKB > 1024 
      ? `${Math.round(estimatedKB / 1024)}MB` 
      : `${estimatedKB}KB`;
    
    return {
      historyCount,
      estimatedSize,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      historyCount: 0,
      estimatedSize: '0KB',
    };
  }
}