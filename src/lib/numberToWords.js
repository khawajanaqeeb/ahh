// src/lib/numberToWords.js
// Utility to convert numbers into words for Pakistani Rupee currency receipts

export function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num) || num === 0 || num === '') {
    return '';
  }

  const n = Math.floor(Math.abs(Number(num)));
  if (n === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertLessThanThousand(number) {
    if (number === 0) return '';
    if (number < 20) return ones[number] + ' ';
    if (number < 100) return tens[Math.floor(number / 10)] + ' ' + (number % 10 !== 0 ? ones[number % 10] + ' ' : '');
    return ones[Math.floor(number / 100)] + ' Hundred ' + (number % 100 !== 0 ? convertLessThanThousand(number % 100) : '');
  }

  function convert(num) {
    if (num === 0) return '';
    let result = '';

    // Millions (1,000,000+)
    if (num >= 10000000) {
      result += convert(Math.floor(num / 10000000)) + ' Crore ';
      num %= 10000000;
    }
    if (num >= 100000) {
      result += convertLessThanThousand(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    if (num >= 1000) {
      result += convertLessThanThousand(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    if (num > 0) {
      result += convertLessThanThousand(num);
    }
    return result.trim();
  }

  const words = convert(n);
  return `${words} Rupees Only`;
}
