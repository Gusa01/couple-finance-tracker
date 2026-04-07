import { View, Text, Image } from 'react-native';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function UserAvatar({ name, avatarUrl, size = 'md' }: UserAvatarProps) {
  const styles = sizeMap[size];

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        className={`${styles.container} rounded-full`}
      />
    );
  }

  return (
    <View
      className={`${styles.container} rounded-full bg-primary-100 items-center justify-center`}
    >
      <Text className={`${styles.text} font-semibold text-primary-700`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
