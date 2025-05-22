import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Para manejar la navegación en React Native

function Menu() {
  const navigation = useNavigation();  // Hook de navegación de React Navigation

  return (
    <View style={styles.menuContainer}>
      {/* Enlaces del menú */}
      <TouchableOpacity onPress={() => navigation.navigate('Listar')} style={styles.menuItem}>
        <Text style={styles.menuText}>Lista</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Aleatorios')} style={styles.menuItem}>
        <Text style={styles.menuText}>Aleatorio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favoritos')} style={styles.menuItem}>
        <Text style={styles.menuText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Usuario')} style={styles.menuItem}>
        <Text style={styles.menuText}>Usuario</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro para el menú
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#333', // Fondo oscuro de los items del menú
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff', // Texto blanco para el tema oscuro
    fontSize: 18,
    fontWeight: 'bold', // Texto en negrita
  },
});

export default Menu;
