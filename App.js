import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen.js';
import RegistroScreen from './screens/RegistroScreen.js';
import Pantalladeinicio from './screens/InicioScreen.js';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import ProductoScreen from './screens/ProductoScreen.js';
import AdminScreen from './screens/adminScreen.js';
import VentaScreen from './screens/VentaScreen.js';
import CarritoScreen from './screens/CarritoScreen.js';

const Stack = createNativeStackNavigator();


function MyStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name='Inicio' component={Pantalladeinicio}
        options={{
          title: "INICIO",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="Login" component={LoginScreen} 
        options={{
          presentation: 'modal',
          title: "LOGIN",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="registro" component={RegistroScreen} 
        options={{
          presentation: 'modal',
          title: "REGISTRARSE",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="producto" component={ProductoScreen}
        options={{
          title: "REGISTRARSE",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="AdminScreen" component={AdminScreen} 
        options={{
          title: "PANEL ADMIN",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="VentaScreen" component={VentaScreen} 
        options={{
          title: "PRODCTOS",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
        <Stack.Screen name="Carrito" component={CarritoScreen} 
        options={{
          title: "Mi Carrito",
          headerTintColor: "white",
          headerTitleAlign: "center" ,
          headerStyle: { backgroundColor:"#628CC6"},
        }}/>
      </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
    <MyStack/>
    </NavigationContainer>
    );
}

