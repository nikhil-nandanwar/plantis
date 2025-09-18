/**
 * Simple validation test for tips functionality
 */

const { tipCategories, getTipsForScanResult, getDiseaseInfo } = require('../../../services/tipsService');

describe('Tips Service Validation', () => {
  test('tipCategories should have all required categories', () => {
    expect(tipCategories).toBeDefined();
    expect(tipCategories.length).toBeGreaterThan(0);
    
    const categoryIds = tipCategories.map(cat => cat.id);
    expect(categoryIds).toContain('general-care');
    expect(categoryIds).toContain('seasonal-care');
    expect(categoryIds).toContain('disease-treatment');
    expect(categoryIds).toContain('prevention');
  });

  test('getTipsForScanResult should return tips for healthy plants', () => {
    const tips = getTipsForScanResult('healthy', 0.95);
    expect(tips).toBeDefined();
    expect(tips.length).toBeGreaterThan(0);
  });

  test('getTipsForScanResult should return tips for diseased plants', () => {
    const tips = getTipsForScanResult('diseased', 0.87);
    expect(tips).toBeDefined();
    expect(tips.length).toBeGreaterThan(0);
  });

  test('getDiseaseInfo should return info for known diseases', () => {
    const leafSpotInfo = getDiseaseInfo('leaf-spot');
    expect(leafSpotInfo).toBeDefined();
    expect(leafSpotInfo.diseaseType).toBe('Leaf Spot Disease');
    
    const rootRotInfo = getDiseaseInfo('root-rot');
    expect(rootRotInfo).toBeDefined();
    expect(rootRotInfo.diseaseType).toBe('Root Rot');
  });

  test('getDiseaseInfo should return null for unknown diseases', () => {
    const unknownInfo = getDiseaseInfo('unknown-disease');
    expect(unknownInfo).toBeNull();
  });

  test('all tip categories should have tips', () => {
    tipCategories.forEach(category => {
      expect(category.tips).toBeDefined();
      expect(category.tips.length).toBeGreaterThan(0);
      
      category.tips.forEach(tip => {
        expect(tip.id).toBeDefined();
        expect(tip.title).toBeDefined();
        expect(tip.description).toBeDefined();
        expect(tip.icon).toBeDefined();
        expect(tip.category).toBeDefined();
      });
    });
  });
});