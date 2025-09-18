import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ScanResult } from '../../types';
import { historyService } from '../../services/historyService';
import { imageCacheManager, getCachedThumbnail } from '../../utils/imageCacheUtils';
import { memoryManager } from '../../utils/memoryUtils';
import { performanceManager } from '../../utils/performanceUtils';

interface HistoryListProps {
  onItemPress: (scanResult: ScanResult) => void;
  filterStatus?: 'healthy' | 'diseased' | 'all';
  refreshTrigger?: number;
  enableLazyLoading?: boolean;
  pageSize?: number;
}

interface HistoryListState {
  scanResults: ScanResult[];
  displayedResults: ScanResult[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMoreData: boolean;
}

interface CachedThumbnail {
  uri: string;
  cachedUri: string;
  timestamp: Date;
}

const { width: screenWidth } = Dimensions.get('window');
const THUMBNAIL_SIZE = { width: 64, height: 64 };

export const HistoryList: React.FC<HistoryListProps> = ({
  onItemPress,
  filterStatus = 'all',
  refreshTrigger = 0,
  enableLazyLoading = true,
  pageSize = 20,
}) => {
  const [state, setState] = useState<HistoryListState>({
    scanResults: [],
    displayedResults: [],
    isLoading: true,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,
    currentPage: 0,
    hasMoreData: true,
  });

  const [thumbnailCache, setThumbnailCache] = useState<Map<string, CachedThumbnail>>(new Map());

  const loadHistory = useCallback(async (showRefreshing = false, resetPagination = true) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: !showRefreshing && resetPagination,
        isRefreshing: showRefreshing,
        error: null,
      }));

      let results: ScanResult[];
      
      if (filterStatus === 'all') {
        results = await historyService.getAllScanResults();
      } else {
        results = await historyService.getResultsByStatus(filterStatus);
      }

      // Preload thumbnails for better performance
      if (results.length > 0) {
        const imageUris = results.slice(0, Math.min(10, results.length)).map(r => r.imageUri);
        memoryManager.queueOperation(
          () => preloadThumbnails(imageUris),
          'normal'
        ).catch(error => {
          console.warn('Failed to preload thumbnails:', error);
        });
      }

      const initialDisplayCount = enableLazyLoading ? pageSize : results.length;
      const displayedResults = results.slice(0, initialDisplayCount);

      setState(prev => ({
        ...prev,
        scanResults: results,
        displayedResults,
        isLoading: false,
        isRefreshing: false,
        currentPage: resetPagination ? 0 : prev.currentPage,
        hasMoreData: results.length > initialDisplayCount,
      }));

      // Update performance metrics
      performanceManager.updateMetrics();
    } catch (error) {
      console.error('Failed to load history:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: 'Failed to load scan history',
      }));
    }
  }, [filterStatus, enableLazyLoading, pageSize]);

  const preloadThumbnails = useCallback(async (imageUris: string[]) => {
    const cachePromises = imageUris.map(async (uri) => {
      try {
        const cachedUri = await getCachedThumbnail(uri, THUMBNAIL_SIZE);
        setThumbnailCache(prev => new Map(prev.set(uri, {
          uri,
          cachedUri,
          timestamp: new Date(),
        })));
        return cachedUri;
      } catch (error) {
        console.warn('Failed to cache thumbnail:', uri, error);
        return uri;
      }
    });

    await Promise.allSettled(cachePromises);
  }, []);

  const loadMoreData = useCallback(async () => {
    if (!enableLazyLoading || state.isLoadingMore || !state.hasMoreData) {
      return;
    }

    setState(prev => ({ ...prev, isLoadingMore: true }));

    try {
      const nextPage = state.currentPage + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = startIndex + pageSize;
      
      const newItems = state.scanResults.slice(startIndex, endIndex);
      
      if (newItems.length > 0) {
        // Preload thumbnails for new items
        const newImageUris = newItems.map(r => r.imageUri);
        memoryManager.queueOperation(
          () => preloadThumbnails(newImageUris),
          'low'
        ).catch(error => {
          console.warn('Failed to preload new thumbnails:', error);
        });

        setState(prev => ({
          ...prev,
          displayedResults: [...prev.displayedResults, ...newItems],
          currentPage: nextPage,
          hasMoreData: endIndex < prev.scanResults.length,
          isLoadingMore: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          hasMoreData: false,
          isLoadingMore: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load more data:', error);
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
      }));
    }
  }, [enableLazyLoading, state.isLoadingMore, state.hasMoreData, state.currentPage, state.scanResults, pageSize, preloadThumbnails]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, refreshTrigger]);

  // Cleanup thumbnails cache when component unmounts
  useEffect(() => {
    return () => {
      // Clear thumbnail cache to free memory
      setThumbnailCache(new Map());
    };
  }, []);

  const handleRefresh = useCallback(() => {
    // Clear thumbnail cache on refresh
    setThumbnailCache(new Map());
    loadHistory(true, true);
  }, [loadHistory]);

  const handleEndReached = useCallback(() => {
    if (enableLazyLoading) {
      loadMoreData();
    }
  }, [enableLazyLoading, loadMoreData]);

  const handleDeleteItem = useCallback((item: ScanResult) => {
    Alert.alert(
      'Delete Scan Result',
      'Are you sure you want to delete this scan result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await historyService.deleteScanResult(item.id);
            if (success) {
              // Remove from thumbnail cache
              setThumbnailCache(prev => {
                const newCache = new Map(prev);
                newCache.delete(item.imageUri);
                return newCache;
              });
              
              // Clear cached thumbnail file
              imageCacheManager.getCachedImage(item.imageUri, {
                thumbnailSize: THUMBNAIL_SIZE,
              }).then(cachedPath => {
                if (cachedPath) {
                  // The cache manager will handle cleanup
                }
              }).catch(() => {
                // Ignore cache cleanup errors
              });
              
              loadHistory(false, true);
            } else {
              Alert.alert('Error', 'Failed to delete scan result');
            }
          },
        },
      ]
    );
  }, [loadHistory]);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: 'healthy' | 'diseased'): string => {
    return status === 'healthy' ? '#22c55e' : '#ef4444';
  };

  const getStatusEmoji = (status: 'healthy' | 'diseased'): string => {
    return status === 'healthy' ? '🌱' : '🚨';
  };

  const OptimizedThumbnail = React.memo<{ item: ScanResult }>(({ item }) => {
    const [thumbnailUri, setThumbnailUri] = useState<string>(item.imageUri);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const loadThumbnail = async () => {
        // Check if already cached in memory
        const cached = thumbnailCache.get(item.imageUri);
        if (cached) {
          setThumbnailUri(cached.cachedUri);
          return;
        }

        setIsLoading(true);
        try {
          const cachedUri = await getCachedThumbnail(item.imageUri, THUMBNAIL_SIZE);
          setThumbnailUri(cachedUri);
          
          // Update memory cache
          setThumbnailCache(prev => new Map(prev.set(item.imageUri, {
            uri: item.imageUri,
            cachedUri,
            timestamp: new Date(),
          })));
        } catch (error) {
          console.warn('Failed to load thumbnail:', error);
          // Fallback to original URI
          setThumbnailUri(item.imageUri);
        } finally {
          setIsLoading(false);
        }
      };

      loadThumbnail();
    }, [item.imageUri]);

    return (
      <View className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
        {isLoading ? (
          <View className="w-full h-full justify-center items-center">
            <ActivityIndicator size="small" color="#22c55e" />
          </View>
        ) : (
          <Image
            source={{ uri: thumbnailUri }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => {
              // Fallback to original URI on error
              setThumbnailUri(item.imageUri);
            }}
          />
        )}
      </View>
    );
  });

  const renderHistoryItem = useCallback(({ item }: { item: ScanResult }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-lg p-4 mb-3 border border-gray-100"
      onPress={() => onItemPress(item)}
      onLongPress={() => handleDeleteItem(item)}
    >
      <View className="flex-row items-center space-x-4">
        {/* Optimized Thumbnail Image */}
        <OptimizedThumbnail item={item} />

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-semibold text-gray-900">
              {getStatusEmoji(item.status)} {item.status === 'healthy' ? 'Healthy' : 'Diseased'}
            </Text>
            <Text className="text-sm text-gray-500">
              {formatDate(item.timestamp)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">
              Confidence: {Math.round(item.confidence * 100)}%
            </Text>
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: getStatusColor(item.status) }}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {item.plantType && (
            <Text className="text-xs text-gray-500 mt-1">
              Plant: {item.plantType}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [onItemPress, handleDeleteItem]);

  const renderFooter = useCallback(() => {
    if (!enableLazyLoading || !state.hasMoreData) {
      return null;
    }

    return (
      <View className="py-4 items-center">
        {state.isLoadingMore ? (
          <ActivityIndicator size="small" color="#22c55e" />
        ) : (
          <TouchableOpacity
            onPress={loadMoreData}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            <Text className="text-gray-600">Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [enableLazyLoading, state.hasMoreData, state.isLoadingMore, loadMoreData]);

  const keyExtractor = useCallback((item: ScanResult) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 88, // Approximate item height
    offset: 88 * index,
    index,
  }), []);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-6xl mb-4">🌿</Text>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        No Scans Yet
      </Text>
      <Text className="text-gray-600 text-center px-8">
        {filterStatus === 'all'
          ? 'Start scanning your plants to see your history here!'
          : `No ${filterStatus} plants found in your history.`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        Unable to Load History
      </Text>
      <Text className="text-gray-600 text-center px-8 mb-4">
        {state.error}
      </Text>
      <TouchableOpacity
        className="bg-primary-green px-6 py-3 rounded-xl"
        onPress={() => loadHistory()}
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (state.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-gray-600 mt-4">Loading history...</Text>
      </View>
    );
  }

  if (state.error) {
    return renderError();
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={state.displayedResults}
        renderItem={renderHistoryItem}
        keyExtractor={keyExtractor}
        getItemLayout={enableLazyLoading ? getItemLayout : undefined}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            colors={['#22c55e']}
            tintColor="#22c55e"
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <View className="h-2" />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={pageSize}
        windowSize={10}
      />
    </View>
  );
};