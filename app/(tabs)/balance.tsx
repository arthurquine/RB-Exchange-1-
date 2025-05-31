import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency } from '@/utils/formatters';
import { CURRENCIES } from '@/data/currencies';
import EmptyState from '@/components/EmptyState';
import { ArrowRightLeft } from 'lucide-react-native';

export default function BalanceScreen() {
  const { transactions } = useTransactionHistory();
  const [displayCurrency, setDisplayCurrency] = useState<'DZD' | 'USD' | 'EUR'>('DZD');

  // Get the last used rate for each target currency
  const getLastRate = (targetCurrency: 'EUR' | 'USD') => {
    const lastTransaction = [...transactions]
      .reverse()
      .find(t => t.targetCurrency === targetCurrency);
    return lastTransaction?.rate || null;
  };

  // Calculate balances
  const balances = React.useMemo(() => {
    const balanceMap = new Map();

    transactions.forEach(transaction => {
      const key = transaction.currencyCode;
      const currentBalance = balanceMap.get(key) || {
        buys: 0,
        sells: 0,
        currency: CURRENCIES.find(c => c.code === key),
        lastRateEUR: null,
        lastRateUSD: null,
      };

      const amount = transaction.amount * transaction.rate;

      if (transaction.type === 'buy') {
        currentBalance.buys += amount;
      } else {
        currentBalance.sells += amount;
      }

      // Update last known rates
      if (transaction.targetCurrency === 'EUR') {
        currentBalance.lastRateEUR = transaction.rate;
      } else if (transaction.targetCurrency === 'USD') {
        currentBalance.lastRateUSD = transaction.rate;
      }

      balanceMap.set(key, currentBalance);
    });

    return Array.from(balanceMap.entries()).map(([code, data]) => ({
      code,
      ...data,
      netTotal: data.buys - data.sells,
    }));
  }, [transactions]);

  // Calculate total net balance across all currencies
  const totalNetBalance = balances.reduce((total, balance) => total + balance.netTotal, 0);

  // Get the last known rate for the current display currency
  const lastRate = getLastRate(displayCurrency === 'USD' ? 'USD' : 'EUR');

  const toggleDisplayCurrency = () => {
    setDisplayCurrency(current => {
      switch (current) {
        case 'DZD': return 'USD';
        case 'USD': return 'EUR';
        case 'EUR': return 'DZD';
      }
    });
  };

  const convertAmount = (amount: number, displayCurrency: 'DZD' | 'USD' | 'EUR') => {
    if (displayCurrency === 'DZD') return amount;
    const rate = getLastRate(displayCurrency);
    return rate ? amount / rate : null;
  };

  const renderBalanceItem = ({ item }) => (
    <View style={styles.balanceItem}>
      <View style={styles.currencyInfo}>
        <Image source={{ uri: item.currency.flagUrl }} style={styles.flag} />
        <View style={styles.currencyDetails}>
          <Text style={styles.currencyName}>{item.currency.name}</Text>
          <Text style={styles.currencyCode}>{item.code}</Text>
        </View>
      </View>
      <View style={styles.balanceDetails}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Buys:</Text>
          <Text style={styles.balanceValue}>
            {displayCurrency === 'DZD' 
              ? formatCurrency(item.buys, 'DZD')
              : convertAmount(item.buys, displayCurrency) !== null
                ? formatCurrency(convertAmount(item.buys, displayCurrency), displayCurrency)
                : '-- ' + displayCurrency}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Sells:</Text>
          <Text style={styles.balanceValue}>
            {displayCurrency === 'DZD'
              ? formatCurrency(item.sells, 'DZD')
              : convertAmount(item.sells, displayCurrency) !== null
                ? formatCurrency(convertAmount(item.sells, displayCurrency), displayCurrency)
                : '-- ' + displayCurrency}
          </Text>
        </View>
        <View style={[styles.balanceRow, styles.netTotalRow]}>
          <Text style={styles.netTotalLabel}>Net Total:</Text>
          <Text style={[
            styles.netTotalValue,
            item.netTotal > 0 ? styles.positive : styles.negative
          ]}>
            {displayCurrency === 'DZD'
              ? formatCurrency(item.netTotal, 'DZD')
              : convertAmount(item.netTotal, displayCurrency) !== null
                ? formatCurrency(convertAmount(item.netTotal, displayCurrency), displayCurrency)
                : '-- ' + displayCurrency}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Balance Summary" />
      
      {transactions.length > 0 ? (
        <>
          <TouchableOpacity 
            style={styles.currencySelector}
            onPress={toggleDisplayCurrency}
          >
            <View>
              <Text style={styles.currencySelectorLabel}>Display Currency:</Text>
              {displayCurrency !== 'DZD' && lastRate && (
                <Text style={styles.exchangeRate}>
                  1 {displayCurrency} = {lastRate} DZD
                </Text>
              )}
            </View>
            <View style={styles.currencySelectorButton}>
              <Text style={styles.currencySelectorText}>{displayCurrency}</Text>
              <ArrowRightLeft size={16} color={COLORS.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.totalBalanceCard}>
            <Text style={styles.totalBalanceLabel}>Total Net Balance:</Text>
            <Text style={[
              styles.totalBalanceValue,
              totalNetBalance > 0 ? styles.positive : styles.negative
            ]}>
              {displayCurrency === 'DZD'
                ? formatCurrency(totalNetBalance, 'DZD')
                : convertAmount(totalNetBalance, displayCurrency) !== null
                  ? formatCurrency(convertAmount(totalNetBalance, displayCurrency), displayCurrency)
                  : '-- ' + displayCurrency}
            </Text>
          </View>

          <FlatList
            data={balances}
            renderItem={renderBalanceItem}
            keyExtractor={item => item.code}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          title="No transactions yet"
          description="Your balance summary will appear here once you make transactions"
          icon="history"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  currencySelectorLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exchangeRate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  currencySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  currencySelectorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  totalBalanceCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalBalanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  totalBalanceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.text,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  balanceItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  currencyDetails: {
    marginLeft: 12,
  },
  currencyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  currencyCode: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceDetails: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  netTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 0,
  },
  netTotalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  netTotalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.error,
  },
});