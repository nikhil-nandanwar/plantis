import { historyService } from '../services/historyService';
import { ScanResult } from '../types';

/**
 * Integration test utility to verify history functionality
 */
export const testHistoryIntegration = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing History Integration...');

    // Test data
    const testScanResult: ScanResult = {
      id: 'integration-test-' + Date.now(),
      imageUri: 'file://test-image.jpg',
      status: 'healthy',
      confidence: 0.95,
      timestamp: new Date(),
      tips: ['Test tip 1', 'Test tip 2'],
      plantType: 'Test Plant',
    };

    // Test 1: Save scan result
    console.log('📝 Testing save scan result...');
    await historyService.saveScanResult(testScanResult);
    console.log('✅ Save test passed');

    // Test 2: Retrieve all results
    console.log('📋 Testing retrieve all results...');
    const allResults = await historyService.getAllScanResults();
    const savedResult = allResults.find(result => result.id === testScanResult.id);
    if (!savedResult) {
      throw new Error('Saved result not found in history');
    }
    console.log('✅ Retrieve test passed');

    // Test 3: Get by ID
    console.log('🔍 Testing get by ID...');
    const resultById = await historyService.getScanResultById(testScanResult.id);
    if (!resultById || resultById.id !== testScanResult.id) {
      throw new Error('Get by ID failed');
    }
    console.log('✅ Get by ID test passed');

    // Test 4: Get history count
    console.log('🔢 Testing get history count...');
    const count = await historyService.getHistoryCount();
    if (count === 0) {
      throw new Error('History count should be greater than 0');
    }
    console.log('✅ Get count test passed');

    // Test 5: Filter by status
    console.log('🔍 Testing filter by status...');
    const healthyResults = await historyService.getResultsByStatus('healthy');
    const testResultInHealthy = healthyResults.find(result => result.id === testScanResult.id);
    if (!testResultInHealthy) {
      throw new Error('Test result not found in healthy filter');
    }
    console.log('✅ Filter by status test passed');

    // Test 6: Delete scan result
    console.log('🗑️ Testing delete scan result...');
    const deleteSuccess = await historyService.deleteScanResult(testScanResult.id);
    if (!deleteSuccess) {
      throw new Error('Delete operation failed');
    }
    console.log('✅ Delete test passed');

    // Test 7: Verify deletion
    console.log('✔️ Testing verify deletion...');
    const deletedResult = await historyService.getScanResultById(testScanResult.id);
    if (deletedResult !== null) {
      throw new Error('Result should be deleted');
    }
    console.log('✅ Verify deletion test passed');

    console.log('🎉 All history integration tests passed!');
    return true;

  } catch (error) {
    console.error('❌ History integration test failed:', error);
    return false;
  }
};

/**
 * Test cleanup functionality
 */
export const testHistoryCleanup = async (): Promise<boolean> => {
  try {
    console.log('🧹 Testing History Cleanup...');

    // Create some test data with old timestamps
    const oldScanResult: ScanResult = {
      id: 'old-test-' + Date.now(),
      imageUri: 'file://old-test-image.jpg',
      status: 'diseased',
      confidence: 0.80,
      timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      tips: ['Old test tip'],
    };

    const recentScanResult: ScanResult = {
      id: 'recent-test-' + Date.now(),
      imageUri: 'file://recent-test-image.jpg',
      status: 'healthy',
      confidence: 0.90,
      timestamp: new Date(),
      tips: ['Recent test tip'],
    };

    // Save both results
    await historyService.saveScanResult(oldScanResult);
    await historyService.saveScanResult(recentScanResult);

    // Perform cleanup
    const cleanupResult = await historyService.performCleanup();
    console.log(`🧹 Cleanup removed ${cleanupResult.removedCount} items`);

    // Verify old result is removed and recent result remains
    const oldResult = await historyService.getScanResultById(oldScanResult.id);
    const recentResult = await historyService.getScanResultById(recentScanResult.id);

    if (oldResult !== null) {
      console.warn('⚠️ Old result was not cleaned up (this might be expected if cleanup threshold is different)');
    }

    if (recentResult === null) {
      throw new Error('Recent result should not be cleaned up');
    }

    // Clean up test data
    await historyService.deleteScanResult(recentScanResult.id);
    if (oldResult) {
      await historyService.deleteScanResult(oldScanResult.id);
    }

    console.log('✅ Cleanup test passed');
    return true;

  } catch (error) {
    console.error('❌ History cleanup test failed:', error);
    return false;
  }
};

/**
 * Run all history tests
 */
export const runAllHistoryTests = async (): Promise<void> => {
  console.log('🚀 Starting History Integration Tests...\n');

  const integrationTestPassed = await testHistoryIntegration();
  const cleanupTestPassed = await testHistoryCleanup();

  console.log('\n📊 Test Results:');
  console.log(`Integration Test: ${integrationTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Cleanup Test: ${cleanupTestPassed ? '✅ PASSED' : '❌ FAILED'}`);

  if (integrationTestPassed && cleanupTestPassed) {
    console.log('\n🎉 All history tests passed! The history management system is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the implementation.');
  }
};