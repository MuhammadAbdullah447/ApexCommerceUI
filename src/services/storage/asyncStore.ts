import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStore = {
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.warn(`Error reading item '${key}' from AsyncStorage:`, error);
      return null;
    }
  },

  setItem: async <T>(key: string, value: T): Promise<boolean> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.warn(`Error writing item '${key}' to AsyncStorage:`, error);
      return false;
    }
  },

  removeItem: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing item '${key}' from AsyncStorage:`, error);
      return false;
    }
  },

  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing AsyncStorage:', error);
      return false;
    }
  },
};
