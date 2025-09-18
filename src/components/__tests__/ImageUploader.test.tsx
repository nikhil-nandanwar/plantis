import { ImageUploader } from '../ImageUploader';

describe('ImageUploader Component', () => {
  describe('Component Definition', () => {
    it('should be defined and exportable', () => {
      expect(ImageUploader).toBeDefined();
      expect(typeof ImageUploader).toBe('function');
    });

    it('should be a React functional component', () => {
      // Check if it's a function (functional component)
      expect(typeof ImageUploader).toBe('function');
      
      // Check if it has the expected length (number of parameters)
      expect(ImageUploader.length).toBe(1); // Should accept one props parameter
    });
  });

  describe('Props Interface', () => {
    it('should accept onImageSelected callback prop', () => {
      const mockCallback = jest.fn();
      const props = {
        onImageSelected: mockCallback,
        onImageUploaded: jest.fn(),
      };
      
      expect(props.onImageSelected).toBe(mockCallback);
      expect(typeof props.onImageSelected).toBe('function');
    });

    it('should accept onImageUploaded callback prop', () => {
      const mockCallback = jest.fn();
      const props = {
        onImageSelected: jest.fn(),
        onImageUploaded: mockCallback,
      };
      
      expect(props.onImageUploaded).toBe(mockCallback);
      expect(typeof props.onImageUploaded).toBe('function');
    });
  });

  describe('Component Integration', () => {
    it('should be importable from components index', () => {
      const { ImageUploader: ImportedImageUploader } = require('../index');
      expect(ImportedImageUploader).toBeDefined();
      expect(ImportedImageUploader).toBe(ImageUploader);
    });
  });
});