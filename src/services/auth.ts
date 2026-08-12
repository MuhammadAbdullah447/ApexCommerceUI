import { asyncStore } from './storage/asyncStore';
import { UserProfile } from '../types/auth';
export type { UserProfile };

interface MockUser {
  name: string;
  email: string;
  password: string;
}

const STORAGE_KEY = '@local_mock_users';
const localMockUsers: MockUser[] = [];
let isLoaded = false;

const loadUsers = async () => {
  if (isLoaded) return;
  const users = await asyncStore.getItem<MockUser[]>(STORAGE_KEY);
  if (users) {
    localMockUsers.length = 0;
    localMockUsers.push(...users);
  }
  isLoaded = true;
};

export const registerMockUser = async (user: MockUser) => {
  await loadUsers();
  const trimmedEmail = user.email.trim();
  const trimmedName = user.name.trim();
  const trimmedPassword = user.password.trim();

  // Prevent duplicate emails
  if (!localMockUsers.some((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
    localMockUsers.push({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    });
    await asyncStore.setItem(STORAGE_KEY, localMockUsers);
  }
};

export const loginWithDummyJSON = async (usernameOrEmail: string, password: string): Promise<UserProfile> => {
  await loadUsers();

  const trimmedUsernameOrEmail = usernameOrEmail.trim();
  const trimmedPassword = password.trim();

  // Extract username prefix from email if it is an email, otherwise use it directly (e.g., emilys@company.com -> emilys)
  const username = trimmedUsernameOrEmail.includes('@') ? trimmedUsernameOrEmail.split('@')[0] : trimmedUsernameOrEmail;

  // Check local mock users first
  const localUser = localMockUsers.find(
    (u) =>
      (u.email.toLowerCase() === trimmedUsernameOrEmail.toLowerCase() ||
        u.email.split('@')[0].toLowerCase() === username.toLowerCase()) &&
      u.password === trimmedPassword
  );

  if (localUser) {
    return {
      id: 9999 + localMockUsers.indexOf(localUser),
      username: username,
      email: localUser.email,
      firstName: localUser.name.split(' ')[0] || localUser.name,
      lastName: localUser.name.split(' ').slice(1).join(' ') || '',
      gender: 'unknown',
      // High-quality generic user avatar
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      token: 'mock-jwt-token-for-' + username,
    };
  }

  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: trimmedPassword,
      expiresInMins: 30, // optional
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || 'Invalid credentials or connection error.';
    throw new Error(message);
  }

  const data: UserProfile = await response.json();
  return data;
};
