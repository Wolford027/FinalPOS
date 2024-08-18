import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword,  } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Loading from '../_components/Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      // Retrieve user document from Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Store last login time
        await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });

        if (userRole === 'admin') {
          // Navigate to admin screen
          navigation.navigate('Home');
        } else {
          // Navigate to user home screen
          Alert.alert('Error', 'Not Admin')
        }
      } else {
        Alert.alert('Error', 'User data not found.');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode='contain' />
      </View>
      <View>
        <Text style={styles.titleText}>A+ Point Of Sales</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading size={hp(25)} />
          </View>
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    height: hp(6.5),
    width: wp(50) ,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#057008',
    borderRadius: 10,
    marginTop: 40,
  },
  signInButtonText: {
    fontSize: hp(2.7),
    color: '#E6FFE6',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  logo: {
    width: wp(50),
    height: hp(25),
    
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(5),
  },
  titleText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(5),
    textAlign: 'center',
    color: 'green'
  }
});
