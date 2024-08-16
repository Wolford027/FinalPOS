import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email)
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.inputContainer}>
        <TextInput placeholder='Email' value={email} onChangeText={text => setEmail(text)} style={styles.input} />
        <TextInput placeholder='Password' value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Login

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
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 10,
  }
})