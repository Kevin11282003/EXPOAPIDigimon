import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

function Filtro({ onTipoChange }) {
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const res = await fetch('https://digi-api.com/api/v1/type');
        const json = await res.json();
        // Asumiendo que `json.content.fields` contiene la lista de tipos
        if (json.content && Array.isArray(json.content.fields)) {
          setTipos(json.content.fields);
        }
      } catch (error) {
        console.error('Error obteniendo los tipos:', error);
      }
    };

    obtenerTipos();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onTipoChange('All')}
        >
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
        {tipos.map((tipo) => (
          <TouchableOpacity
            key={tipo.id}
            style={styles.button}
            onPress={() => onTipoChange(tipo.name)}
          >
            <Text style={styles.buttonText}>{tipo.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Filtro;
