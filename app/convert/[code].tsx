import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { ArrowLeft, Copy, ArrowRightLeft } from 'lucide-react-native';
import { CURRENCIES } from '@/data/currencies';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency } from '@/utils/formatters';
import * as Clipboard from 'expo-clipboard';

export default function ConvertDetailScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [total, setTotal] = useState(0);
  const [conversionType, setConversionType] = useState<'buy' | 'sell'>('buy');
  const [targetCurrency, setTargetCurrency] = useState<'USD' | 'EUR'>('EUR');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { addTransaction } = useTransactionHistory();
  
  const currency = CURRENCIES.find(c => c.code === code);
  
  useEffect(() => {
    calculateTotal();
  }, [amount, rate, conversionType]);
  
  const calculateTotal = () => {
    if (amount && rate) {
      const amountValue = parseFloat(amount);
      const rateValue = parseFloat(rate);
      
      if (!isNaN(amountValue) && !isNaN(rateValue)) {
        if (conversionType === 'buy') {
          setTotal(amountValue * rateValue);
        } else {
          setTotal(amountValue * rateValue);
        }
      } else {
        setTotal(0);
      }
    } else {
      setTotal(0);
    }
  };
  
  const handleSaveTransaction = () => {
    if (!amount || !rate) {
      Alert.alert('Error', 'Please enter both amount and rate');
      return;
    }
    
    if (parseFloat(amount) <= 0 || parseFloat(rate) <= 0) {
      Alert.alert('Error', 'Amount and rate must be greater than zero');
      return;
    }
    
    const transaction = {
      id: Date.now().toString(),
      currencyCode: code,
      currencyName: currency?.name || code,
      type: conversionType,
      amount: parseFloat(amount),
      rate: parseFloat(rate),
      targetCurrency,
      total,
      timestamp: new Date().toISOString()
    };
    
    addTransaction(transaction);
    setIsSaved(true);
    
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };
  
  const copyResultToClipboard = async () => {
    if (total > 0) {
      const formattedResult = formatCurrency(total, 'DZD');
      await Clipboard.setStringAsync(formattedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const toggleConversionType = () => {
    setConversionType(prev => prev === 'buy' ? 'sell' : 'buy');
  };
  
  const toggleTargetCurrency = () => {
    setTargetCurrency(prev => prev === 'USD' ? 'EUR' : 'USD');
    // Reset inputs when changing target currency
    setAmount('');
    setRate('');
    setTotal(0);
  };
  
  if (!currency) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Currency not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currency.name}</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.currencyInfoContainer}>
          <View style={styles.flagContainer}>
            <Image source={{ uri: currency.flagUrl }} style={styles.flag} />
          </View>
          <View style={styles.currencyInfo}>
            <Text style={styles.currencyName}>{currency.name}</Text>
            <Text style={styles.currencyCountry}>{currency.country}</Text>
          </View>
          <Text style={styles.currencyCode}>{currency.code}</Text>
        </View>
        
        <View style={styles.conversionTypeContainer}>
          <TouchableOpacity
            style={[
              styles.conversionTypeButton,
              conversionType === 'buy' && styles.activeConversionType
            ]}
            onPress={() => setConversionType('buy')}
          >
            <Text style={[
              styles.conversionTypeText,
              conversionType === 'buy' && styles.activeConversionTypeText
            ]}>Buy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.conversionTypeButton,
              conversionType === 'sell' && styles.activeConversionType
            ]}
            onPress={() => setConversionType('sell')}
          >
            <Text style={[
              styles.conversionTypeText,
              conversionType === 'sell' && styles.activeConversionTypeText
            ]}>Sell</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.targetCurrencySelector}
          onPress={toggleTargetCurrency}
        >
          <Text style={styles.targetCurrencyLabel}>Converting to:</Text>
          <View style={styles.targetCurrencyButton}>
            <Text style={styles.targetCurrencyText}>{targetCurrency}</Text>
            <ArrowRightLeft size={16} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Amount in {targetCurrency}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder={`Enter amount in ${targetCurrency}`}
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>
        
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Exchange Rate (DZD)</Text>
          <TextInput
            style={styles.input}
            value={rate}
            onChangeText={setRate}
            placeholder="Enter rate in DZD"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Result (DZD)</Text>
          <View style={styles.resultContainer}>
            <Text style={styles.resultValue}>
              {formatCurrency(total, 'DZD')}
            </Text>
            <TouchableOpacity
              style={[styles.copyButton, copied && styles.copyButtonActive]}
              onPress={copyResultToClipboard}
            >
              <Copy size={20} color={copied ? COLORS.cardBackground : COLORS.primary} />
              <Text style={[styles.copyButtonText, copied && styles.copyButtonTextActive]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.savedButton]}
          onPress={handleSaveTransaction}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Transaction Saved!' : 'Save Transaction'}
          </Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  currencyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  conversionTypeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  conversionTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeConversionType: {
    backgroundColor: COLORS.primary,
  },
  conversionTypeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  activeConversionTypeText: {
    color: COLORS.cardBackground,
  },
  targetCurrencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  targetCurrencyLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  targetCurrencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  targetCurrencyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  inputCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  resultCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.text,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8,
    gap: 6,
  },
  copyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  copyButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  copyButtonTextActive: {
    color: COLORS.cardBackground,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  savedButton: {
    backgroundColor: COLORS.success,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.cardBackground,
  },
});