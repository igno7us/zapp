import React, { useState } from 'react';
import { View, Text, Image, StatusBar,TouchableOpacity } from 'react-native';
import image from '../assets/z.png';
import styles from '../styles/styles';

const Pantalladeinicio = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>BIENVENIDO A LENCERIA ZOE</Text>
      <Image source={image} style={[styles.logo, { opacity: 0.5 }]} />
      <StatusBar style="auto" />
      <View style={styles.padreboton}>
          <View style={styles.padreboton}>
            <TouchableOpacity style={styles.cajaboton} onPress={() => navigation.navigate('Login')}> 
              <Text style={styles.textoboton}>Acceder</Text> 
            </TouchableOpacity>
            <View style={styles.padreboton}>
            </View>
          </View>
      </View>
    </View>
  );
};
export default Pantalladeinicio;
