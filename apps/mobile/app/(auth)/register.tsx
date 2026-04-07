import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { Messages } from '@/constants/messages';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export default function RegisterScreen() {
  const { control, errors, onSubmit, isLoading, storeError } = useRegisterForm();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center py-8">
            <View className="mb-10">
              <Text className="text-3xl font-bold text-gray-900 text-center">
                {Messages.auth.registerTitle}
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Crea tu cuenta para empezar
              </Text>
            </View>

            {storeError && (
              <View className="bg-error-500/10 rounded-xl p-4 mb-6">
                <Text className="text-error-600 text-center">
                  {storeError}
                </Text>
              </View>
            )}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={Messages.auth.name}
                  placeholder={Messages.auth.namePlaceholder}
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  leftIcon="person-outline"
                  autoCapitalize="words"
                  autoComplete="name"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={Messages.auth.email}
                  placeholder={Messages.auth.emailPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={Messages.auth.password}
                  placeholder={Messages.auth.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  leftIcon="lock-closed-outline"
                  isPassword
                  autoCapitalize="none"
                  autoComplete="new-password"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={Messages.auth.confirmPassword}
                  placeholder={Messages.auth.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  leftIcon="lock-closed-outline"
                  isPassword
                  autoCapitalize="none"
                  autoComplete="new-password"
                />
              )}
            />

            <Button
              onPress={onSubmit}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              {Messages.auth.registerButton}
            </Button>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">
                {Messages.auth.hasAccount}{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Text className="text-primary-600 font-semibold">
                  {Messages.auth.login}
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
