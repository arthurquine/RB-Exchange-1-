/**
 * Format currency value to a French-style format
 * @param value - Numeric value to format
 * @param currencyCode - Currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string = 'USD'): string {
  if (isNaN(value) || value === 0) {
    return currencyCode === 'USD' ? '$0,00' : '0,00 €';
  }

  // Format number with French-style (comma as decimal separator)
  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedValue = formatter.format(value);

  // Add currency symbol based on currency code
  if (currencyCode === 'USD') {
    return `$${formattedValue}`;
  } else if (currencyCode === 'EUR') {
    return `${formattedValue} €`;
  } else {
    return `${formattedValue} ${currencyCode}`;
  }
}