import { NetworkService } from '../networkService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('NetworkService', () => {
  let networkService: NetworkService;

  beforeEach(() => {
    networkService = NetworkService.getInstance();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = NetworkService.getInstance();
      const instance2 = NetworkService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('connectivity checking', () => {
    it('should detect online state when fetch succeeds', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      // Trigger connectivity check
      await new Promise(resolve => setTimeout(resolve, 100));

      const state = networkService.getNetworkState();
      expect(state.isConnected).toBe(true);
      expect(state.isInternetReachable).toBe(true);
    });

    it('should detect offline state when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Trigger connectivity check
      await new Promise(resolve => setTimeout(resolve, 100));

      const state = networkService.getNetworkState();
      expect(state.isConnected).toBe(false);
      expect(state.isInternetReachable).toBe(false);
    });
  });

  describe('listeners', () => {
    it('should add and remove listeners', () => {
      const listener = jest.fn();
      const unsubscribe = networkService.addListener(listener);

      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });

    it('should notify listeners on state change', async () => {
      const listener = jest.fn();
      networkService.addListener(listener);

      // Mock network state change
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      
      // Wait for state change
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('waitForConnection', () => {
    it('should resolve immediately if already connected', async () => {
      // Mock connected state
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      
      const result = await networkService.waitForConnection(1000);
      expect(result).toBe(true);
    });

    it('should timeout if connection not restored', async () => {
      // Mock disconnected state
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const result = await networkService.waitForConnection(100);
      expect(result).toBe(false);
    });
  });
});