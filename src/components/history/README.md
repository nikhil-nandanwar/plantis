# History Management System

This directory contains the complete history management system for the Plantis app, providing local storage and management of plant scan results.

## Components

### HistoryService (`src/services/historyService.ts`)

The core service that handles all history-related operations using AsyncStorage.

**Key Features:**
- Save scan results to local storage
- Retrieve all scan results (sorted by timestamp)
- Get specific scan results by ID
- Delete individual scan results
- Clear all history
- Filter results by status (healthy/diseased)
- Filter results by date range
- Automatic cleanup of old entries (30+ days)
- Storage size optimization (max 100 items)
- Export/import functionality for backup

**Usage:**
```typescript
import { historyService } from '../services/historyService';

// Save a scan result
await historyService.saveScanResult(scanResult);

// Get all results
const results = await historyService.getAllScanResults();

// Get by ID
const result = await historyService.getScanResultById('scan-id');

// Delete a result
await historyService.deleteScanResult('scan-id');

// Perform cleanup
const { removedCount, totalSize } = await historyService.performCleanup();
```

### HistoryList Component (`src/components/history/HistoryList.tsx`)

A React Native component that displays a list of scan results with thumbnails.

**Features:**
- Displays scan results in chronological order (newest first)
- Shows thumbnail images, status, confidence, and timestamp
- Supports filtering by status (all/healthy/diseased)
- Pull-to-refresh functionality
- Long press to delete items
- Empty state handling
- Loading and error states
- Responsive date formatting (e.g., "Just now", "2h ago", "Yesterday")

**Props:**
```typescript
interface HistoryListProps {
  onItemPress: (scanResult: ScanResult) => void;
  filterStatus?: 'healthy' | 'diseased' | 'all';
  refreshTrigger?: number;
}
```

**Usage:**
```tsx
<HistoryList
  onItemPress={(result) => setSelectedResult(result)}
  filterStatus="healthy"
  refreshTrigger={refreshCounter}
/>
```

### HistoryItemDetail Component (`src/components/history/HistoryItemDetail.tsx`)

A detailed view component for individual scan results.

**Features:**
- Full-size image display
- Detailed scan information (status, confidence, timestamp, ID)
- Plant care tips display
- Share functionality
- Delete functionality with confirmation
- Responsive status messages based on confidence level
- Plant type information (when available)

**Props:**
```typescript
interface HistoryItemDetailProps {
  scanResult: ScanResult;
  onClose: () => void;
  onDelete?: () => void;
}
```

**Usage:**
```tsx
<HistoryItemDetail
  scanResult={selectedResult}
  onClose={() => setSelectedResult(null)}
  onDelete={() => refreshHistory()}
/>
```

### useHistory Hook (`src/hooks/useHistory.ts`)

A custom React hook that provides state management for history operations.

**Features:**
- Automatic loading of history on mount
- State management for loading, error, and data states
- Optimistic updates for better UX
- Error handling and recovery
- Automatic refresh capabilities

**Returns:**
```typescript
interface UseHistoryReturn {
  // State
  scanResults: ScanResult[];
  isLoading: boolean;
  error: string | null;
  historyCount: number;
  
  // Actions
  refreshHistory: () => Promise<void>;
  addScanResult: (scanResult: ScanResult) => Promise<void>;
  deleteScanResult: (id: string) => Promise<boolean>;
  clearAllHistory: () => Promise<void>;
  performCleanup: () => Promise<{ removedCount: number; totalSize: number }>;
  getResultsByStatus: (status: 'healthy' | 'diseased') => Promise<ScanResult[]>;
  getScanResultById: (id: string) => Promise<ScanResult | null>;
}
```

**Usage:**
```tsx
const {
  scanResults,
  isLoading,
  error,
  addScanResult,
  deleteScanResult,
  refreshHistory
} = useHistory();
```

## Integration Examples

### Basic History Display

```tsx
import React, { useState } from 'react';
import { HistoryList, HistoryItemDetail } from '../components/history';
import { ScanResult } from '../types';

export const HistoryScreen = () => {
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  if (selectedResult) {
    return (
      <HistoryItemDetail
        scanResult={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    );
  }

  return (
    <HistoryList
      onItemPress={setSelectedResult}
      filterStatus="all"
    />
  );
};
```

### Integrating with Scan Workflow

```tsx
import { useHistory } from '../hooks/useHistory';
import { scanService } from '../services/scanService';

export const ScanScreen = () => {
  const { addScanResult } = useHistory();

  const handleScan = async (imageUri: string) => {
    try {
      // Perform scan
      const { result, error } = await scanService.performScan(imageUri);
      
      if (result) {
        // Save to history
        await addScanResult(result);
        
        // Navigate to results or show success
        console.log('Scan completed and saved to history');
      }
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };
};
```

### History Management with Filters

```tsx
import React, { useState } from 'react';
import { HistoryList } from '../components/history';
import { useHistory } from '../hooks/useHistory';

export const FilteredHistoryScreen = () => {
  const [filter, setFilter] = useState<'all' | 'healthy' | 'diseased'>('all');
  const { performCleanup, clearAllHistory } = useHistory();

  const handleCleanup = async () => {
    const result = await performCleanup();
    console.log(`Cleaned up ${result.removedCount} old entries`);
  };

  return (
    <View>
      {/* Filter buttons */}
      <View style={{ flexDirection: 'row' }}>
        <Button title="All" onPress={() => setFilter('all')} />
        <Button title="Healthy" onPress={() => setFilter('healthy')} />
        <Button title="Diseased" onPress={() => setFilter('diseased')} />
      </View>
      
      {/* History list */}
      <HistoryList
        filterStatus={filter}
        onItemPress={(result) => console.log('Selected:', result.id)}
      />
      
      {/* Management buttons */}
      <Button title="Cleanup Old Entries" onPress={handleCleanup} />
      <Button title="Clear All History" onPress={clearAllHistory} />
    </View>
  );
};
```

## Performance Considerations

1. **Storage Limits**: The system automatically limits history to 100 items to prevent storage bloat
2. **Automatic Cleanup**: Entries older than 30 days are automatically removed during cleanup
3. **Lazy Loading**: The HistoryList component uses FlatList for efficient rendering of large lists
4. **Image Caching**: Thumbnail images are cached locally for better performance
5. **Optimistic Updates**: The useHistory hook provides optimistic updates for better UX

## Error Handling

The system includes comprehensive error handling:

- **Storage Errors**: Graceful fallbacks when AsyncStorage operations fail
- **Data Corruption**: Validation and recovery mechanisms for corrupted data
- **Network Issues**: Offline-first approach with local storage
- **Memory Management**: Automatic cleanup to prevent memory leaks

## Testing

The system includes comprehensive tests:

- **Unit Tests**: For HistoryService, useHistory hook, and components
- **Integration Tests**: For complete workflows
- **Performance Tests**: For storage operations and cleanup
- **Error Scenario Tests**: For various failure conditions

Run tests with:
```bash
npm test -- --testPathPatterns="history"
```

## Storage Schema

The history data is stored in AsyncStorage with the key `@plantis_scan_history` as a JSON array:

```json
[
  {
    "id": "scan-123456789",
    "imageUri": "file://path/to/image.jpg",
    "status": "healthy",
    "confidence": 0.95,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "tips": ["Keep up the good work!", "Continue current care routine."],
    "plantType": "Rose"
  }
]
```

## Future Enhancements

Potential improvements for the history system:

1. **Cloud Sync**: Synchronize history across devices
2. **Advanced Filtering**: Filter by date ranges, plant types, confidence levels
3. **Statistics**: Show trends and analytics over time
4. **Export Options**: Export to CSV, PDF, or other formats
5. **Batch Operations**: Select and delete multiple items at once
6. **Search**: Full-text search through scan results and tips
7. **Categories**: User-defined categories for organizing scans