import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/authStore';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schemas';

export function useRegisterForm() {
  const { register, isLoading, error, clearError } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearError();
    await register(data.email.trim(), data.password, data.name.trim());
  });

  return { control, errors, onSubmit, isLoading, storeError: error };
}
