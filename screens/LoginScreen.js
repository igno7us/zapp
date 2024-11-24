import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, StatusBar, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import auth from './firebaseConfig';
import { db } from './firebaseConfig';

const image = require('../assets/ze2.jpg');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logeo = async () => {
    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  

      
      const docSnap = await getDoc(doc(db, "users", user.uid));  

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Datos del usuario:", userData);  

        if (userData.role === 'admin') {

          navigation.navigate('AdminScreen');
        } else {

          navigation.navigate('VentaScreen');
        }
      } else {
        Alert.alert('Error', 'No se encontraron datos del usuario en Firestore');
      }
    } catch (error) {
  
      console.log("Error de login:", error.message);  
      Alert.alert('Error', error.message);  
    }
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/usuario.png')}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={(text)=>setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
        <Image
            source={require('../assets/candado.png')}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={(text)=>setPassword(text)}
          />
        </View>
        <Button title="Iniciar sesión" onPress={logeo} style={styles.button1} />
        <View style={styles.link}>
          <TouchableOpacity onPress={() => navigation.navigate('registro')}> 
            <Text>No tenes cuenta?...registrate ACA</Text> 
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>  
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#F4ECE1",
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover', 
    opacity: 0.3,    
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: 'black', 
  },
  inputContainer: {
    flexDirection: 'row',   ///////////////////alinea horizontalmente el ícono y el texto
    alignItems: 'center',  ///////////////////alinea verticalmente en el centro
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10, ///tamanio del marco transparente
    width: '95%', // Ajusta el ancho del input
    marginBottom: 15,},

  input: {
    flex: 1 ,
    alignItems: 'center',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    paddingVertical: 0,  
    flexDirection: 'row', ////////////aline horizontalmente el ícono y el campo de texto
    alignItems: 'center', ////////alinea verticalmente en el centro
  },

  icon: {
    width: 20,                      ///////aajusta el tamaño del ícono según sea necesario
    height: 20,
    marginRight: 10,               /////espacio entre el ícono y el campo de texto
  },

  button1: {
    backgroundColor:"#E1E9F4",
    borderRadius:30,
    paddingVertical:20,
    width:150,
    marginTop:20,
  },
  link:{
    alignItems: "center",
    padding: 60,
  },
});

export default LoginScreen;