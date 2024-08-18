import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Placeholder from '../assets/logo.png'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const Avatar = ({ uri, source, onPress, aviOnly = false, ...props }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={uri ? { uri } : Placeholder}
          style={[styles.image, aviOnly && { height: 35, width: 35, borderWidth: 0 }]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  image: {
    borderRadius: 75,
    width: 150,
    height: 150, 
  },
});
