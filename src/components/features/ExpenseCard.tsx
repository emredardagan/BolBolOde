import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Expense } from '../../types/models';
import { formatCurrency } from '../../services/algorithms/currency-conversion';
import { Currency } from '../../types/enums';
import Card from '../ui/Card';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
}

export default function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card className="p-4 mb-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-semibold">{expense.title}</Text>
            <Text className="text-gray-500 text-sm">
              {new Date(expense.date.seconds * 1000).toLocaleDateString('tr-TR')}
            </Text>
            <Text className="text-gray-500 text-sm">{expense.category}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary-600">
              {formatCurrency(expense.baseCurrencyAmount, expense.currency as Currency)}
            </Text>
            <Text className="text-gray-500 text-xs">
              {expense.participantIds.length} kişi
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

