import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { db } from './firebaseConfig';  // Asegúrate de importar correctamente el db
import { storage } from './firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';  // Importa las funciones necesarias de Firestore
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const ProductoScreen = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [precio, setPrecio] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Función para obtener los productos desde Firestore
  const fetchProductos = () => {
    const q = query(collection(db, 'productos'), orderBy('createdAt', 'desc'));  // Consulta los productos ordenados por 'createdAt'
    
    // 'onSnapshot' para escuchar cambios en tiempo real
    onSnapshot(q, (querySnapshot) => {
      const productosArray = [];
      querySnapshot.forEach((doc) => {
        productosArray.push({ ...doc.data(), id: doc.id });
      });
      setProductos(productosArray);
    });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const pickImage = async () => {
    console.log('Iniciando selección de imagen...');
  
    // Solicitar permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Permission result:', permissionResult);
  
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }
  
    // Intentar abrir la galería con manejo de errores
    try {
      console.log('Intentando abrir la galería de imágenes...');
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log('Resultado de la selección de imagen:', pickerResult);  // Ver el resultado completo
  
      if (!pickerResult.canceled) {
        console.log('Imagen seleccionada:', pickerResult.assets[0].uri);  // Verifica la URI
        setImage(pickerResult.assets[0].uri);  // Actualiza el estado con la URI
      } else {
        console.log('El usuario canceló la selección de imagen');  // Log si el usuario cancela
      }
    } catch (error) {
      console.error('Error al intentar abrir la galería:', error);
      alert('Hubo un error al abrir la galería de imágenes. Intenta de nuevo.');
    }
  };
  
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();  // Convertimos la imagen en un blob que es lo que Firebase acepta
  
    const filename = uri.substring(uri.lastIndexOf('/') + 1);  // Extraemos el nombre del archivo
    const storageRef = ref(storage, 'productos/' + filename);  // Creamos una referencia en Firebase Storage
  
    try {
      // Subimos el archivo al storage
      await uploadBytes(storageRef, blob);
      console.log("Imagen subida correctamente");
  
      // Obtenemos la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      console.log("URL de la imagen: ", downloadURL);
      return downloadURL;  // Retornamos la URL pública de la imagen
  
    } catch (error) {
      console.error("Error al subir la imagen: ", error);
      return null;
    }
  };
  

const agregarProducto = async () => {
  let imageUrl = null;  
  if (image) {
    console.log("Subiendo imagen...");
    imageUrl = await uploadImage(image);  // Esperamos la URL después de subir la imagen

    // Verificamos si la URL de la imagen fue obtenida correctamente
    if (!imageUrl) {
      alert("Hubo un error al subir la imagen.");
      return;
    }
    console.log("Imagen subida correctamente:", imageUrl);  // Verificamos la URL de la imagen
  }

  const nuevoProducto = {
    nombre,
    marca,
    precio: parseFloat(precio),
    color,
    imageUrl,  // Guardamos la URL de la imagen subida
    createdAt: serverTimestamp(),  // Timestamp de la creación
  };

  try {
    // Agregar el producto a Firestore
    await addDoc(collection(db, 'productos'), nuevoProducto);
    console.log("Producto agregado a Firestore:", nuevoProducto);

    // Limpiar los estados
    setNombre('');
    setMarca('');
    setPrecio('');
    setColor('');
    setImage(null);
    setModalVisible(false);  // Cerrar el modal
  } catch (error) {
    console.error("Error al agregar el producto: ", error);
    alert("Hubo un error al agregar el producto.");
  }
};
  
  const editarProducto = async () => {
    let imageUrl = image;  // Usamos la imagen seleccionada o la que ya estaba.
  
    if (image && image !== imageUrl) {
      imageUrl = await uploadImage(image);  // Subimos nueva imagen si hay una seleccionada
    }
  
    const productoRef = doc(db, 'productos', currentProductId);
    try {
      await updateDoc(productoRef, {
        nombre,
        marca,
        precio: parseFloat(precio),
        color,
        imageUrl,  // Actualizamos con la nueva URL de la imagen
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
    }
  };

  const eliminarProducto = async (id) => {
    const productoRef = doc(db, 'productos', id);  // Referencia al producto a eliminar
    await deleteDoc(productoRef);
  };

  const openEditModal = (item) => {
    setCurrentProductId(item.id);
    setNombre(item.nombre);
    setMarca(item.marca);
    setPrecio(item.precio.toString());
    setColor(item.color);
    setImage(item.imageUrl);
    setEditModalVisible(true);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      <TextInput
        placeholder="Buscar producto"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.tableHeader}>
        <Text style={styles.columnHeader}>Nombre</Text>
        <Text style={styles.columnHeader}>Marca</Text>
        <Text style={styles.columnHeader}>Precio</Text>
        <Text style={styles.columnHeader}>Color</Text>
        <Text style={styles.columnHeader}>Imagen</Text>
        <Text style={styles.columnHeader}>Acciones</Text>
      </View>

      <FlatList
        data={filteredProductos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.nombre}</Text>
            <Text style={styles.cell}>{item.marca}</Text>
            <Text style={styles.cell}>{item.precio}</Text>
            <Text style={styles.cell}>{item.color}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.productImage} />}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                <SimpleLineIcons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarProducto(item.id)}>
                <AntDesign name="delete" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Agregar Producto</Text>
          <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder="Marca" value={marca} onChangeText={setMarca} style={styles.input} />
          <TextInput placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Color" value={color} onChangeText={setColor} style={styles.input} />
          <TouchableOpacity style={styles.saveButton} onPress={agregarProducto}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={editModalVisible} transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Producto</Text>
          <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder="Marca" value={marca} onChangeText={setMarca} style={styles.input} />
          <TextInput placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Color" value={color} onChangeText={setColor} style={styles.input} />
          <TouchableOpacity onPress={pickImage} style={styles.saveButton}>
            <Text>Seleccionar Imagen</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          <TouchableOpacity style={styles.saveButton} onPress={editarProducto}>
            <Text style={styles.saveButtonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


// Aquí siguen los estilos, los cuales no fueron cambiados


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4ECE1",
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    searchInput: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    columnHeader: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#ffc107',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        color: '#fff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
      },
      previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
      },
});

export default ProductoScreen;