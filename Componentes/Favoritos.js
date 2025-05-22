import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const idsFavoritos = JSON.parse(await AsyncStorage.getItem('favoritos')) || [];
        // Obtener todos los Digimons favoritos
        const peticiones = idsFavoritos.map(id =>
          fetch(`https://digi-api.com/api/v1/digimon/${id}`)
            .then(res => res.json())
            .catch(() => null)
        );
        const resultados = await Promise.all(peticiones);
        const datosCompletos = resultados.filter(d => d !== null && d.name);
        setFavoritos(datosCompletos);
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      }
    };

    cargarFavoritos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.digimonCard}
      onPress={() => navigation.navigate('Detalle', { id: item.id })}
    >
      <Text style={styles.digimonId}>ID: {item.id}</Text>
      <Image
        source={{ uri: item.images?.[0]?.href || 'https://via.placeholder.com/60?text=No+Img' }}
        style={styles.digimonImage}
      />
      <Text style={styles.digimonName}>{item.name}</Text>
      <Text style={styles.digimonType}>
        Tipo: {item.types && item.types.length > 0 ? item.types.map(t => t.type).join(', ') : 'Desconocido'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Digimons Favoritos</Text>
      {favoritos.length === 0 ? (
        <Text style={styles.noFavorites}>No tienes Digimons favoritos aún.</Text>
      ) : (
        <FlatList
          data={favoritos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  noFavorites: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  digimonCard: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  digimonId: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  digimonImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  digimonName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  digimonType: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Favoritos;
