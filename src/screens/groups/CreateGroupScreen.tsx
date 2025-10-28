import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateGroup } from '../../hooks/useGroups';
import { useAuth } from '../../hooks/useAuth';
import { CURRENCY_LIST } from '../../constants/currencies';

export default function CreateGroupScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const createGroup = useCreateGroup();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('TRY');

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Grup adı gereklidir');
      return;
    }

    try {
      const group = await createGroup.mutateAsync({
        name,
        description: description || undefined,
        baseCurrency,
        startDate: new Date(),
      });
      
      navigation.navigate('GroupDetail' as never, { id: group.id } as never);
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold mb-6">Yeni Grup Oluştur</Text>
        
        <Text className="text-gray-700 mb-2">Grup Adı *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Örn: Kapadokya Gezisi"
          value={name}
          onChangeText={setName}
        />
        
        <Text className="text-gray-700 mb-2">Açıklama</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Grup hakkında kısa bilgi"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
        
        <Text className="text-gray-700 mb-2">Para Birimi</Text>
        <View className="flex-row flex-wrap mb-6">
          {CURRENCY_LIST.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              className={`mr-2 mb-2 px-4 py-2 rounded-lg border ${
                baseCurrency === currency.code
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => setBaseCurrency(currency.code)}
            >
              <Text
                className={
                  baseCurrency === currency.code ? 'text-white' : 'text-gray-700'
                }
              >
                {currency.symbol} {currency.code}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          className="bg-primary-600 rounded-lg py-3"
          onPress={handleCreate}
          disabled={createGroup.isPending}
        >
          {createGroup.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Grup Oluştur
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

