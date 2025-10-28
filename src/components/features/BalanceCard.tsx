import React from 'react';
import { View, Text } from 'react-native';
import { Balance } from '../../types/models';
import { formatCurrency } from '../../services/algorithms/currency-conversion';
import { Currency } from '../../types/enums';
import Card from '../ui/Card';

interface BalanceCardProps {
  balance: Balance;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const isPositive = balance.balance > 0;
  const isZero = balance.balance === 0;

  return (
    <Card className="p-4 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold">{balance.name}</Text>
        <Text
          className={`text-lg font-bold ${
            isPositive ? 'text-success-600' : isZero ? 'text-gray-600' : 'text-danger-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(balance.balance, Currency.TRY)}
        </Text>
      </View>
    </Card>
  );
}

