import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  className?: string;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  className = '',
}: InputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-gray-700 mb-2">{label}</Text>}
      <TextInput
        className={`border ${
          error ? 'border-danger-600' : 'border-gray-300'
        } rounded-lg px-4 py-3`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text className="text-danger-600 text-sm mt-1">{error}</Text>}
    </View>
  );
}

