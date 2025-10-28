import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-lg border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

