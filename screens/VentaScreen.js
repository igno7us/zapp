import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';  // Asegúrate de importar correctamente 'db' desde 'credenciales'
import { collection, getDocs } from 'firebase/firestore'; // Funciones de la API modular
import image from '../assets/basura.png';

const VentaScreen = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);  // Estado para manejar los productos en el carrito

  // Recupera los productos de Firebase
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Usar la nueva API modular para obtener productos
        const productosSnapshot = await getDocs(collection(db, 'productos')); // Usar 'collection' y 'getDocs'
        const productosList = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Productos desde Firebase:', productosList);
        setProductos(productosList);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Función para agregar el producto al carrito sin redirigir
  const handleAddToCart = (producto) => {
    // Agregar el producto al carrito
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
    alert(`${producto.nombre} ha sido agregado al carrito`);
  };

  // Función para finalizar la compra y vaciar el carrito
  const handleborrartodo = () => {
    // Lógica para finalizar la compra
    setCarrito([]);  // Vaciar el carrito después de finalizar la compra
  };

  return (
    <View style={styles.container}>
      <Text>BIENVENIDO A LENCERIA ZOE</Text>
      <StatusBar style="auto" />

      <Text style={styles.title}>Productos Disponibles</Text>
      {productos.length === 0 ? (
        <Text>No hay productos disponibles</Text>  // Mensaje si no hay productos
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              {/* Imagen del producto */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              ) : (
                <Text>No hay imagen disponible</Text>
              )}
              <View style={styles.productDescription}>
                <Text style={styles.productName}>Nombre: {item.nombre}</Text>
                <Text>Marca: {item.marca}</Text>
                <Text>Color: {item.color}</Text>
                <Text>Precio: ${item.precio}</Text>
                <Button title="Agregar al Carrito" onPress={() => handleAddToCart(item)} />
              </View>
            </View>
          )}
        />
      )}

      {/* Mostrar el número de productos en el carrito */}
      <View style={styles.cartInfo}>
        <Text style={styles.cartText}>Productos en el carrito: {carrito.length}</Text>
        <Button
          title="Ver Carrito"
          onPress={() => navigation.navigate('Carrito', { carrito })}  // Pasar el carrito como parámetro
        />
      </View>
      <TouchableOpacity onPress={handleborrartodo} style={styles.iconContainer}>
        <Image 
          source={require('../assets/basura.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4ECE1",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',  // Alineación horizontal
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    alignItems: 'center',  // Alinea todos los elementos verticalmente en el centro
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,  // Espaciado entre la imagen y la descripción
  },
  productDescription: {
    flex: 1,  // Hace que la descripción ocupe el resto del espacio disponible
    justifyContent: 'space-between',  // Espaciado entre las líneas de texto y el botón
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cartInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#E1E9F4",
    borderRadius: 30,
    paddingVertical: 15,
    width: '80%', // Botón más ancho
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,                      
    height: 50,
    marginRight: 10,               
  },
});

export default VentaScreen;
