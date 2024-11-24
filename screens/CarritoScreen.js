import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Usamos el hook para obtener los parámetros de navegación

const CarritoScreen = ({navigation }) => {
  const route = useRoute();  // Obtener los parámetros de la navegación
  const [carrito, setCarrito] = useState(route.params?.carrito || []);  // Recuperamos el carrito desde los parámetros
  const [total, setTotal] = useState(0);

  // Calcular el total cada vez que el carrito cambia
  useEffect(() => {
    const nuevoTotal = carrito.reduce((sum, product) => sum + product.precio, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = (productId) => {
    const updatedCarrito = carrito.filter(item => item.id !== productId);
    setCarrito(updatedCarrito);  // Actualizamos el carrito sin el producto eliminado
  };

  const handleFinalizarCompra = () => {
    // Lógica para finalizar la compra
    alert('Compra Finalizada!');
    setCarrito([]);  // Vaciar el carrito
  };

  const renderItem = ({ item }) => (
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

        {/* Botón para eliminar el producto del carrito */}
        <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
          <Text style={styles.removeButton}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>

      {/* Lista de productos en el carrito */}
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: ${total}</Text>

      <Button title="Finalizar Compra" onPress={handleFinalizarCompra} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('VentaScreen')} 
          accessibilityLabel="Ir a la sección de productos"
        >
          <Text style={styles.buttonText}>Productos</Text>
        </TouchableOpacity>
        </View> 
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4ECE1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productDescription: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 10,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column', // Botones en columna
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  
});

export default CarritoScreen;
