import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function StartLoading({ size }) {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Home');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={[styles.container, { height: size }]}>
      <Lottie source={require('../assets/loading.json')} autoPlay loop style={styles.animation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
