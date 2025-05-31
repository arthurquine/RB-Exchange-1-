import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';

export default function HistoryScreen() {
  const router = useRouter();
  const { transactions } = useTransactionHistory();

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: '/convert/[code]',
          params: { code: item.currencyCode }
        });
      }}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{item.currencyCode}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        <View style={[
          styles.typeIndicator, 
          {backgroundColor: item.type === 'buy' ? COLORS.success + '20' : COLORS.error + '20'}
        ]}>
          {item.type === 'buy' ? (
            <ArrowDown size={16} color={COLORS.success} />
          ) : (
            <ArrowUp size={16} color={COLORS.error} />
          )}
          <Text style={[
            styles.transactionType,
            {color: item.type === 'buy' ? COLORS.success : COLORS.error}
          ]}>
            {item.type === 'buy' ? 'Buy' : 'Sell'}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.amount, item.targetCurrency)}
          </Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Rate:</Text>
          <Text style={styles.amountValue}>
            {item.rate} DZD
          </Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(item.total, 'DZD')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Transaction History" />
      
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.transactionList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState 
          title="No transactions yet"
          description="Your transaction history will appear here"
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
  transactionList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  transactionItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  transactionType: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  transactionDetails: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
});