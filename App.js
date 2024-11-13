import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const logoImage = require('./assets/wings.jpeg');
const businessName = 'WINGS CAFE';

const API_URL = 'http://localhost:3000'; // Backend server URL (ensure it's running)

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: '', price: '', quantity: '' });

  // Fetch products from the database
  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${API_URL}/products`)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [isLoggedIn]);

  // Handle login
  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  // Handle adding new products
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert('Please fill in all product fields.');
      return;
    }

    const product = {
      ...newProduct,
      quantity: parseInt(newProduct.quantity),
      price: parseFloat(newProduct.price),
    };

    axios.post(`${API_URL}/products`, product)
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', description: '', category: '', price: '', quantity: '' });
      })
      .catch(error => console.error('Error adding product:', error));
  };

  // Update product stock quantity
  const updateQuantity = (id, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(product.quantity + delta, 0) }
          : product
      )
    );
  };

  // Delete product
  const deleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  // Dashboard: Get products low in stock
  const lowStockProducts = products.filter((product) => product.quantity <= 5);

  const renderLoginForm = () => (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );

  const renderMainContent = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.businessName}>{businessName}</Text>
      </View>

      {/* Product Management Section */}
      <View style={styles.productFormContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Description"
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Category"
          value={newProduct.category}
          onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Price"
          value={newProduct.price}
          keyboardType="numeric"
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Quantity"
          value={newProduct.quantity}
          keyboardType="numeric"
          onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
        />
        <Button title="Add Product" onPress={addProduct} />
      </View>

      {/* Product List with Stock Management */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                <Text>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                <Text>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <View style={styles.lowStockAlert}>
          <Text style={styles.lowStockText}>Low Stock Alert:</Text>
          {lowStockProducts.map((product) => (
            <Text key={product.id}>{product.name} - {product.quantity} left</Text>
          ))}
        </View>
      )}
    </View>
  );

  return isLoggedIn ? renderMainContent() : renderLoginForm();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productFormContainer: {
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowStockAlert: {
    backgroundColor: '#fffae6',
    padding: 10,
    marginTop: 20,
  },
  lowStockText: {
    fontWeight: 'bold',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loginTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
});




