import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200';
      case 'danger':
        return 'bg-danger-600';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <TouchableOpacity
      className={`${getVariantClasses()} rounded-lg py-3 px-6 ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}

