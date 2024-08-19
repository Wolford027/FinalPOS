import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, BackHandler, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { db } from '../firebase'
import Receipt from '../_components/Reciept'
import { AntDesign } from '@expo/vector-icons'
import { addDoc, collection } from 'firebase/firestore'
import { useCart } from '../_context/Cart'



const Cashier = () => {
  const [dropdown,setDropdown] = useState(false)
  const [showReciept,setShowReciept] = useState(false)
  const [recieptData, setRecieptData] = useState(null)
  const route = useRoute()
  const tableNumber = route.params?.tableNumber
  const { cart, setCart } = useCart()
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (cart.length > 0) {
        Alert.alert(
          'Warning',
          'There are items in the cart. Are you sure you want to go back?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK',
              onPress: () => {
                setCart([]); // Clear the cart
                navigation.navigate('Table');
              },
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      } else {
        navigation.navigate('Table');
        return true;
      }
      
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [cart, navigation, setCart, tableNumber]);

  const Dropdown = () => {
    setDropdown(!dropdown);
  }

  const QuantityChange = (index, quantity) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: parseInt(quantity) || 0};
      }
      return item;
    })
    setCart(updatedCart);
  }

  const AddQuantity = (index) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: item.quantity + 1};
      }
      return item;
    })
    setCart(updatedCart);
  }

  const MinusQuantity = (index) => {
    const updatedCart = cart.map((item, idx) => {
      if (idx === index && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1};
      }
    })
  }

  const RemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  }

  const calculateTotalPrice = () => {
    const totalPrice = cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.Price.replace('₱', '').trim());
      const itemQuantity = parseInt(item.quantity);

      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return total + (itemPrice * itemQuantity);
      } else {
        console.warn(`Invalid Item: ${item.Name}, Price: ${item.Price}, Quantity: ${item.quantity}`);
        return total;
      }
    }, 0);
    return totalPrice.toFixed(2)
  }

  const generateReciept = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
  
    const total = calculateTotalPrice(); 
    const serviceCharge = total >= 1000 ? (total * 0.05).toFixed(2) : '0.00';
    const grandTotal = (parseFloat(total) + parseFloat(serviceCharge)).toFixed(2);
  
    const reciept = cart.map(item => ({
      Name: item.Name,
      Price: item.Price,
      Quantity: item.quantity,
      Total: `₱${(parseFloat(item.Price.replace('₱', '').trim()) * item.quantity).toFixed(2)}`
    }));
  
    const recieptData = {
      date: formattedDate,
      time: formattedTime,
      items: reciept,
      serviceCharge: `₱${serviceCharge}`,
      grandTotal: `₱${grandTotal}`,
      subtotal: `₱${total}`,
      TableNumber: tableNumber,
    };
    setRecieptData(recieptData);
    setShowReciept(true);
  };
  

  const handlePrint = async () => {
    try {
      const recieptRef = collection(db, 'Reciept');
      await addDoc(recieptRef, {
        Date: recieptData.date,
        Time: recieptData.time,
        Items: recieptData.items,
        ServiceCharge: recieptData.serviceCharge,
        GrandTotal: recieptData.grandTotal,
        SubTotal: recieptData.subtotal, // Ensure 'subtotal' is correct
        TableNumber: recieptData.tableNumber,
      });
      Alert.alert('Success', 'The Receipt will now print.', [{
        text: 'Ok',
        onPress: () => { setShowReciept(false); setCart([]); navigation.navigate('Table'); }
      }]);
    } catch (error) {
      console.error("Error adding receipt data to Firestore: ", error);
      Alert.alert("Error", "Failed to generate receipt. Please try again later.");
    }
  };
  

  const MenuButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ width: hp(45), margin: wp(2) }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black', fontSize: hp(2.5), fontWeight: '800', textAlign: 'center' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownButton} onPress={Dropdown}>
          <Text style={styles.dropdownText}>
            <AntDesign name='caretdown' size={hp(4)} />
            Categories
          </Text>
        </TouchableOpacity>
      </View>
      {dropdown && (
        <View style={styles.dropdown}>
          <MenuButton title="Starter" onPress={() => navigation.navigate('Starter', {tableNumber})} />
          <MenuButton title="Grilled" onPress={() => navigation.navigate('Grilled')} />
          <MenuButton title="Sizzling" onPress={() => navigation.navigate('Sizzling')} />
          <MenuButton title="International" onPress={() => navigation.navigate('International')} />
          <MenuButton title="All-Day Breakfast" onPress={() => navigation.navigate('AllDayBreakFast')} />
          <MenuButton title="Main Course" onPress={() => navigation.navigate('MainCourse')} />
          <MenuButton title="Beverages" onPress={() => navigation.navigate('Beverages')} />
          <MenuButton title="Boodle Fight" onPress={() => navigation.navigate('Boodle')} />
          <MenuButton title="KTV Rooms" onPress={() => navigation.navigate('KTV')} />
        </View>
      )}
      <View style={{ flex: 1, padding: 20 }}>
        {cart.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image source={{ uri: item.ImageUrl }} style={{ width: 50, height: 50, marginRight: 5 }} />
            <Text style={{ flex: 1, marginRight: 10 }}>{item.Name}</Text>
            <Text style={{ flex: 1 }}>{item.Price}</Text>
            <TouchableOpacity onPress={() => MinusQuantity(index)} style={styles.quantityButton}>
              <AntDesign name="minus" size={20} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={String(item.quantity)}
              onChangeText={(quantity) => QuantityChange(index, quantity)}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => AddQuantity(index)} style={styles.quantityButton}>
              <AntDesign name="plus" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => RemoveItem(index)} style={{ marginLeft: 10 }}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ padding: hp(2), borderWidth: 2, borderColor: 'green', backgroundColor: '#c7f9cc' }}>
        <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Total: ₱{calculateTotalPrice()}</Text>
        <TouchableOpacity onPress={generateReciept} style={{ marginTop: hp(1), alignItems: 'center', paddingVertical: hp(1), backgroundColor: '#2F855A', borderRadius: 10 }}>
          <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'white' }}>Order</Text>
        </TouchableOpacity>
      </View>
      
      <Modal visible={showReciept} animationType="slide" onRequestClose={() => setShowReciept(false)}>
        {recieptData && <Receipt receiptData={recieptData} tableNumber={tableNumber} />}
        <TouchableOpacity onPress={handlePrint} style={styles.printButton}>
          <Text style={styles.printButtonText}>Print Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowReciept(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default Cashier

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbf7d0'
  },
  dropdownContainer: {
    borderWidth: 4,
    borderEndWidth: 0,
    borderStartWidth: 0,
    borderColor: 'green',
    backgroundColor: 'green',
  },
  dropdownButton: {
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: 'black'
  },
  dropdown: {
    padding: hp(2),
    borderWidth: 5,
    borderTopWidth: 0,
    borderColor: '#2F855A',
    position: 'absolute',
    top: hp(5),
    zIndex: 1,
    backgroundColor: 'green'
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    width: 30,
    textAlign: 'center',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  quantityButton: {
    padding: 5,
    borderRadius: 5,
  },
  printButton: {
    backgroundColor: 'green',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(5),
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(5),
  },
})