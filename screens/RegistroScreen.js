import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, StatusBar, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import auth from './firebaseConfig';
import { db } from './firebaseConfig';

const RegistroScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registrarUsuario = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
      const user = userCredential.user; 

 
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'user', 
      });

      // Notificación de éxito
      Alert.alert('Registro exitoso', 'Usuario creado con éxito');
      navigation.navigate('Login'); 
    } catch (error) {
      
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/ze2.jpg')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Registro</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <Button title="Registrar" onPress={registrarUsuario} />
        <View style={styles.link}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  link: {
    alignItems: "center",
    padding: 10,
  },
});

export default RegistroScreen;