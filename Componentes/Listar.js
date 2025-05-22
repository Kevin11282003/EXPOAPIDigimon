import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Filtro from './Filtros';

function Listar() {
  const [todos, setTodos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarTodos = async () => {
      setCargando(true);
      try {
        let ids = [];
        for (let page = 0; page < 292; page++) {
          const res = await fetch(`https://digi-api.com/api/v1/digimon?page=${page}`);
          const json = await res.json();
          ids = ids.concat(json.content.map(d => d.id));
        }

        const peticiones = ids.map(id => fetch(`https://digi-api.com/api/v1/digimon/${id}`).then(res => res.json()).catch(() => null));
        const resultados = await Promise.all(peticiones);
        const datosCompletos = resultados.filter(d => d !== null && d.name);

        setTodos(datosCompletos);
      } catch (e) {
        console.error('Error cargando Digimon:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarTodos();
  }, []); // Cargar los Digimons solo una vez al montar el componente

  const tiposUnicos = useMemo(() => [
    ...new Set(todos.flatMap(d => d.types?.map(t => t.type)).filter(Boolean))
  ], [todos]);

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
  };

  const resultadosFiltrados = useMemo(() => {
    let resultados = todos;

    if (tipoSeleccionado !== 'All') {
      resultados = resultados.filter(d => d.types?.some(t => t.type === tipoSeleccionado));
    }

    if (busqueda.length >= 3 && isNaN(busqueda)) {
      resultados = resultados.filter(d => d.name.toLowerCase().includes(busqueda.toLowerCase()));
    }

    if (!isNaN(busqueda)) {
      resultados = resultados.filter(d => d.id.toString().includes(busqueda));
    }

    return resultados;
  }, [todos, tipoSeleccionado, busqueda]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Digimon"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={(text) => setBusqueda(text)}
      />

      <View style={styles.filtro}>
        <Filtro onTipoChange={handleTipoChange} />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={resultadosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.digimonCard}>
              <Text style={styles.digimonId}>ID: {item.id}</Text>
              <Text style={styles.digimonName}>{item.name}</Text>
              <Text style={styles.digimonType}>
                Tipo: {item.types?.map(t => t.type).join(', ') || 'Desconocido'}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  buscador: {
    height: 40,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  filtro: {
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  digimonCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  digimonId: {
    color: '#fff',
    fontSize: 14,
  },
  digimonName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  digimonType: {
    color: '#bbb',
    fontSize: 14,
  },
});

export default Listar;
