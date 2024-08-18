import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ios = Platform.OS == 'ios'

const Header = ({title}) => {
    
    const  { top } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: ios ? top : top + 10 }]} className='flex-row justify-between px-5 bg-green-800 pb-6'>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.homeButton}>
          <AntDesign name="home" size={hp(3)} color="black" />
        </TouchableOpacity>
        <Text style={styles.titleText} className='font-medium color-green-300'>{title}</Text>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        backgroundColor: '#057008',
        paddingBottom: hp(2),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButton: {
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
    },
    titleText: {
        fontSize: hp(3),
        color: '#E6FFE6',
        fontWeight: '600',
        marginLeft: 10,
    }
})