import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-600 active:bg-primary-700',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-gray-100 active:bg-gray-200',
    text: 'text-gray-900',
  },
  outline: {
    container: 'bg-transparent border border-primary-600 active:bg-primary-50',
    text: 'text-primary-600',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100',
    text: 'text-primary-600',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'py-2 px-3',
    text: 'text-sm',
  },
  md: {
    container: 'py-3 px-4',
    text: 'text-base',
  },
  lg: {
    container: 'py-4 px-6',
    text: 'text-lg',
  },
};

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        rounded-xl items-center justify-center flex-row
        ${variantStyle.container}
        ${sizeStyle.container}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#6366f1'}
          size="small"
        />
      ) : (
        <Text
          className={`
            font-semibold
            ${variantStyle.text}
            ${sizeStyle.text}
          `}
          style={textStyle}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
