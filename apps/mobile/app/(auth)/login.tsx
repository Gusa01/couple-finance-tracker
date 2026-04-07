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
import { useLoginForm } from '@/hooks/useLoginForm';

export default function LoginScreen() {
  const { control, errors, onSubmit, isLoading, storeError } = useLoginForm();

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
          <View className="flex-1 px-6 justify-center">
            <View className="mb-10">
              <Text className="text-3xl font-bold text-gray-900 text-center">
                {Messages.auth.loginTitle}
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Ingresa a tu cuenta para continuar
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
                  autoComplete="password"
                />
              )}
            />

            <Button
              onPress={onSubmit}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              {Messages.auth.loginButton}
            </Button>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">
                {Messages.auth.noAccount}{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Text className="text-primary-600 font-semibold">
                  {Messages.auth.createAccount}
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
