import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Receipt = ({ receiptData }) => {
  const route = useRoute();
  const tableNumber = route.params?.tableNumber
  if (!receiptData) {
    return null;
  }

  return (
    <ScrollView style={styles.receiptContainer}>
      <Text style={styles.centerText}>A+ Restaurant and Family KTV</Text>
      <Text style={styles.centerText}>Centennial Rd., Barangay Batong Dalig</Text>
      <Text style={styles.centerText}>Kawit, Cavite 4104</Text>
      <Text style={styles.centerText}>{receiptData.date || 'Date not available'}</Text>
      <Text style={styles.centerText}>{receiptData.time || 'Time not available'}</Text>
      <Text style={styles.centerText}>OFFICIAL RECEIPT</Text>
      <Text style={styles.centerText}>Table Number: {tableNumber || 'N/A'}</Text>
      
      <View style={styles.row1}>
        <Text style={styles.columnHeader}>QTY</Text>
        <Text style={styles.columnHeader}>ITEM</Text>
        <Text style={styles.columnHeader}>AMOUNT</Text>
      </View>
      {receiptData.items && receiptData.items.length > 0 ? (
        receiptData.items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.column}>{item.Quantity || 'N/A'}</Text>
            <Text style={styles.column}>{item.Name || 'N/A'}</Text>
            <Text style={styles.column}>{item.Total || 'N/A'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.centerText}>No items available</Text>
      )}
      <View style={styles.row}>
        <Text style={styles.column}> </Text>
        <Text style={styles.column1}>SUBTOTAL</Text>
        <Text style={styles.column}>{receiptData.subtotal || '₱0.00'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.column}> </Text>
        <Text style={styles.column1}>SERVICE CHARGE</Text>
        <Text style={styles.column}>{receiptData.serviceCharge || '₱0.00'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.column}> </Text>
        <Text style={styles.column}>GRAND TOTAL</Text>
        <Text style={styles.column}>{receiptData.grandTotal || '₱0.00'}</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  receiptContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 50,
  },
  columnHeader: {
    fontWeight: 'bold',
    width: '40%',
  },
  column: {
    width: '40%',
    fontWeight: 'bold',
  },
  column1: {
    width: '40%',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Receipt;
