import { StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';


const Home = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton
            title="Reports"
            iconName="clipboard-pulse-outline"
            onPress={() => navigation.navigate('Report')}
          />
        <IconButton
            title="Menu"
            iconName="silverware-clean"
            onPress={() => navigation.navigate('Menu')}
          />
        <IconButton
            title="Cashier"
            iconName="cash-register"
            onPress={() => navigation.navigate('Table')}
          />
        <IconButton
            title="Audit Trail"
            iconName="file-clock-outline"
            onPress={() => navigation.navigate('Audit')}
          />
      </View>
    </View>
  )
}

const IconButton = ({ title, iconName, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ width: wp(40), alignItems: 'center', margin: wp(5) }}>
    <MaterialCommunityIcons name={iconName} size={hp(15)} color={'#065F46'} />
    <Text style={{ textAlign: 'center', fontSize: hp(3), fontWeight: 'bold', color: '#065F46' }}>{title}</Text>
  </TouchableOpacity>
);

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbf7d0',
    alignItems: 'center'
  },
  iconContainer: {
    flexDirection:  'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: hp(5)
  }
})