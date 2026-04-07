import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  isPassword = false,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center bg-gray-50 rounded-xl border px-3
          ${isFocused ? 'border-primary-500' : hasError ? 'border-error-500' : 'border-gray-200'}
        `}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={hasError ? '#ef4444' : isFocused ? '#6366f1' : '#9ca3af'}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className="flex-1 py-3.5 text-base text-gray-900"
          placeholderTextColor="#9ca3af"
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9ca3af"
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-sm text-error-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
