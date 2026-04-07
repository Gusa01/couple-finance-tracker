import { z } from 'zod';
import { Messages } from '@/constants/messages';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, Messages.errors.emailRequired)
    .email(Messages.errors.invalidEmail),
  password: z.string().min(1, Messages.errors.passwordRequired),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, Messages.errors.nameRequired),
    email: z
      .string()
      .min(1, Messages.errors.emailRequired)
      .email(Messages.errors.invalidEmail),
    password: z.string().min(6, Messages.errors.passwordMinLength),
    confirmPassword: z.string().min(1, Messages.errors.passwordRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: Messages.errors.passwordsNoMatch,
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
