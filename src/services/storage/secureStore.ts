import * as Keychain from 'react-native-keychain';

export const saveSecureItem = async (key: string, value: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(key, value, { service: key });
    return true;
  } catch (error) {
    console.error(`Error saving to secure store for service: ${key}`, error);
    return false;
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error(`Error reading from secure store for service: ${key}`, error);
    return null;
  }
};

export const deleteSecureItem = async (key: string): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({ service: key });
    return true;
  } catch (error) {
    console.error(`Error deleting from secure store for service: ${key}`, error);
    return false;
  }
};
