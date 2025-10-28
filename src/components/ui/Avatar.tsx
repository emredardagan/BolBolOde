import React from 'react';
import { View, Text } from 'react-native';

interface AvatarProps {
  name: string;
  emoji?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, emoji, size = 'md', className = '' }: AvatarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-base';
      case 'lg':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };

  return (
    <View
      className={`${getSizeClasses()} bg-primary-600 rounded-full items-center justify-center ${className}`}
    >
      <Text className={getTextSize()}>{emoji || '👤'}</Text>
    </View>
  );
}

