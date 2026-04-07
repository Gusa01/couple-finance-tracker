import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schemas';

export function useLoginForm() {
  const { login, isLoading, error, clearError } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearError();
    await login(data.email.trim(), data.password);
  });

  return { control, errors, onSubmit, isLoading, storeError: error };
}
