import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { CURRENCIES } from '@/data/currencies';

export default function AddCurrencyScreen() {
  const router = useRouter();
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    country: '',
    flagUrl: '',
  });

  const handleAddCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.country) {
      // Default flag URL if not provided
      const flagUrl = newCurrency.flagUrl || `https://flagcdn.com/w80/${newCurrency.code.toLowerCase()}.png`;
      
      CURRENCIES.push({
        ...newCurrency,
        flagUrl,
      });
      
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Currency</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Currency Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., USD, EUR, GBP"
            value={newCurrency.code}
            onChangeText={code => setNewCurrency({...newCurrency, code: code.toUpperCase()})}
            maxLength={3}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Currency Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., US Dollar"
            value={newCurrency.name}
            onChangeText={name => setNewCurrency({...newCurrency, name})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., United States"
            value={newCurrency.country}
            onChangeText={country => setNewCurrency({...newCurrency, country})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Flag URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/flag.png"
            value={newCurrency.flagUrl}
            onChangeText={flagUrl => setNewCurrency({...newCurrency, flagUrl})}
          />
          <Text style={styles.hint}>
            Leave empty to use default flag based on currency code
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            (!newCurrency.code || !newCurrency.name || !newCurrency.country) && styles.addButtonDisabled
          ]}
          onPress={handleAddCurrency}
          disabled={!newCurrency.code || !newCurrency.name || !newCurrency.country}
        >
          <Text style={styles.addButtonText}>Add Currency</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
  },
  hint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.cardBackground,
  },
});