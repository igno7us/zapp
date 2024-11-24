// AdminDashboardScreen.js
import React from 'react';
import { View, Text, Button,TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const AdminScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PANEL DE ADMINISTRADOR </Text>
      <TouchableOpacity style={styles.cajaboton} onPress={() => navigation.navigate('producto')}> 
              <Text style={styles.textoboton}> EDITAR PRODUCTOS </Text> 
            </TouchableOpacity>     
      <TouchableOpacity style={styles.cajaboton} onPress={() => navigation.navigate('Inicio')}> 
              <Text style={styles.textoboton}>INICIO</Text> 
            </TouchableOpacity>    
            
    </View>
  );
};

export default AdminScreen;
