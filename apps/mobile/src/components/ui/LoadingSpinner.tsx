import { View, ActivityIndicator, Text } from 'react-native';
import { Messages } from '@/constants/messages';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color = '#6366f1',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="text-gray-600 mt-3 text-center">
          {text}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {content}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      {content}
    </View>
  );
}

export function FullScreenLoader() {
  return (
    <LoadingSpinner
      fullScreen
      text={Messages.common.loading}
    />
  );
}
