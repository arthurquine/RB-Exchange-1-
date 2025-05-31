import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Text,
  Image,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { CURRENCIES } from '@/data/currencies';
import { ArrowLeft, Search, X } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(CURRENCIES);
  
  const searchInputRef = React.useRef(null);
  
  useEffect(() => {
    // Focus the search input when the component mounts
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = CURRENCIES.filter(currency => 
        currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    } else {
      setFilteredCurrencies(CURRENCIES);
    }
  }, [searchQuery]);
  
  const handleCurrencySelect = (currency) => {
    router.push({
      pathname: '/convert/[code]',
      params: { code: currency.code }
    });
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search currency..."
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.currencyList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No currencies found</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
    paddingVertical: 0,
  },
  currencyList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});