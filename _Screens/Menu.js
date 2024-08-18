import { StyleSheet, Text, View, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'

const Menu = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.textContainer}>
          <View style={styles.textBorder}>
            <Text style={styles.addProdText}>Add Product</Text>
          </View>
        </View>

        <View style={styles.ProdButtons}>
          <MenuButton title="Starter" onpress={() => navigation.navigate('Starter')} />
          <MenuButton title="Grilled" onpress={() => navigation.navigate('Grilled')} />
          <MenuButton title="Sizzling" onpress={() => navigation.navigate('Sizzling')} />
          <MenuButton title="International" onpress={() => navigation.navigate('International')} />
          <MenuButton title="All-Day-Breakfast" onpress={() => navigation.navigate('AllDayBreakFast')} />
          <MenuButton title="Main Course" onpress={() => navigation.navigate('MainCourse')} />
          <MenuButton title="Beverages" onpress={() => navigation.navigate('Beverages')} />
          <MenuButton title="Boodle Fight" onpress={() => navigation.navigate('Boodle Fight')} />
        </View>
      </ScrollView>
    </View>
  )
}

const MenuButton = ({title, onpress}) => {
  return (
    <TouchableOpacity onPress={onpress} style={styles.menuButton}>
      <View style={styles.buttonContainer}>
        <Text style={styles.textButton}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbf7d0',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  textContainer: {
    width: wp(70),
    marginVertical: hp(2),
  },
  textBorder: {
    backgroundColor: 'rgba(0, 128, 0, 0.05)',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 20,
    padding: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  addProdText: {
    color: 'black',
    fontSize: hp(2.5),
    fontWeight: '800',
  },
  ProdButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuButton: {
    width: wp(45),
    margin: wp(2.5),
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 128, 0, 0.05)',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'black',
    fontSize: hp(2.5),
    fontWeight: '800',
    textAlign: 'center',
  }
})
