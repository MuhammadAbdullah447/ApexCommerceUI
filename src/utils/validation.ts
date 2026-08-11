import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username or Email is required'),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .trim()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(4, 'OTP must be exactly 4 digits')
    .regex(/^\d+$/, 'OTP must be numerical'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;
