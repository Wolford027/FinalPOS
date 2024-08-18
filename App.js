import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './_Login/Login';
import MainHome from './_Screens/Home';
import Loading from './_startup/StartLoading';
import Header from './_components/Header';
import Reports from './_Screens/Reports'
import Menu from './_Screens/Menu'
import Cashier from './_Screens/Cashier'
import Audit from './_Screens/Audit'
import Table from './_table/Table';
import Starter from './_Menu/Starter';
import Grilled from './_Menu/Grilled';
import Sizzling from './_Menu/Sizzling';
import International from './_Menu/International';
import AllDayBreakFast from './_Menu/All-Day-Breakfast';
import MainCourse from './_Menu/Main-Course';
import Beverages from './_Menu/Beverages';
import Boodle from './_Menu/Boodle-Fight'
import KTV from './_Menu/KTV-Rooms'
import { CartProvider } from './_context/Cart';
import { ImageProvider } from './_context/ImageContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <CartProvider>
        <ImageProvider>
          <Stack.Navigator>
            <Stack.Screen name='StartLoading' options={{ headerShown: false }} component={Loading} /> 
            <Stack.Screen name='Login' options={{ headerShown: false }} component={Login} /> 
            <Stack.Screen name='Home' options={{ header: () => <Header title={'Home'} /> }} component={MainHome} />
            <Stack.Screen name='Report' options={{ header: () => <Header title={'Reports'} /> }} component={Reports} />
            <Stack.Screen name='Menu' options={{ header: () => <Header title={'Menu'} /> }} component={Menu} />
            <Stack.Screen name='Table' options={{ header: () => <Header title={'Tables'} /> }} component={Table} />
            <Stack.Screen name='Cashier' options={{ header: () => <Header title={'Cashier'} /> }} component={Cashier} />
            <Stack.Screen name='Audit' options={{ header: () => <Header title={'Audit'} /> }} component={Audit} />
            <Stack.Screen name='Starter' options={{ header: () => <Header title={'Starter'} /> }} component={Starter} />
            <Stack.Screen name='Grilled' options={{ header: () => <Header title={'Grilled'} /> }} component={Grilled} />
            <Stack.Screen name='Sizzling' options={{ header: () => <Header title={'Sizzling'} /> }} component={Sizzling} />
            <Stack.Screen name='International' options={{ header: () => <Header title={'International'} /> }} component={International} />
            <Stack.Screen name='AllDayBreakFast' options={{ header: () => <Header title={'AllDayBreakFast'} /> }} component={AllDayBreakFast} />
            <Stack.Screen name='MainCourse' options={{ header: () => <Header title={'MainCourse'} /> }} component={MainCourse} />
            <Stack.Screen name='Beverages' options={{ header: () => <Header title={'Beverages'} /> }} component={Beverages} />
            <Stack.Screen name='Boodle' options={{ header: () => <Header title={'Boodle'} /> }} component={Boodle} />
            <Stack.Screen name='KTV' options={{ header: () => <Header title={'KTVRooms'} /> }} component={KTV} />
          </Stack.Navigator>
        </ImageProvider>
      </CartProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
