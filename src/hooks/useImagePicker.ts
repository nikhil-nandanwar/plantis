import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraPermission.granted && libraryPermission.granted;
  };

  const pickImage = async (fromCamera: boolean): Promise<string | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera and photo library permissions are required to use this feature.'
      );
      return null;
    }

    setIsLoading(true);

    try {
      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      Alert.alert('Error', 'Failed to capture/select image. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { pickImage, isLoading };
}
