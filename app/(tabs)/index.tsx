import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { CURRENCIES } from '@/data/currencies';
import { Search, Plus } from 'lucide-react-native';

export default function ConvertScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCurrencies = searchQuery 
    ? CURRENCIES.filter(currency => 
        currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CURRENCIES.filter(currency => currency.code !== 'EUR' && currency.code !== 'USD');

  const handleCurrencySelect = (currency) => {
    router.push({
      pathname: '/convert/[code]',
      params: { code: currency.code }
    });
  };

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.currencyItem}
      onPress={() => handleCurrencySelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.flagContainer}>
        <Image source={{ uri: item.flagUrl }} style={styles.flag} />
      </View>
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyName}>{item.name}</Text>
        <Text style={styles.currencyCountry}>{item.country}</Text>
      </View>
      <Text style={styles.currencyCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="RBExchange" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TouchableOpacity
            style={styles.searchInput}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Text style={styles.searchPlaceholder}>Search currency...</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.currencyList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Select a currency</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-currency')}
            activeOpacity={0.7}
          >
            <Plus size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add New Currency</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  currencyList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  flag: {
    width: '100%',
    height: '100%',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  currencyCountry: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  currencyCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
});