import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../supabase';

function Registro({ navigation }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Estado de carga

  const handleChange = (e, name) => {
    setFormulario({ ...formulario, [name]: e });
  };

  const handleRegistro = async () => {
    if (!formulario.nombre || !formulario.correo || !formulario.password || !formulario.fechaNacimiento || !formulario.telefono) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Validación de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formulario.fechaNacimiento)) {
      Alert.alert('Fecha inválida', 'La fecha de nacimiento debe tener el formato YYYY-MM-DD');
      return;
    }

    setError(null);
    setLoading(true);  // Activar carga

    try {
      // 1. Crear usuario en Auth
      const { data, error: errorAuth } = await supabase.auth.signUp({
        email: formulario.correo,
        password: formulario.password,
      });

      if (errorAuth) {
        setError(errorAuth.message);
        setLoading(false);
        return;
      }

      const uid = data.user.id;

      // 2. Insertar en tabla "usuarios"
      const { error: errorInsert } = await supabase.from('usuario').insert([
        {
          id: uid,
          nombre: formulario.nombre,
          correo: formulario.correo,
          fecha_nacimiento: formulario.fechaNacimiento,
          telefono: formulario.telefono,
          roll: 'usuario',
        },
      ]);

      if (errorInsert) {
        setError('Usuario creado, pero ocurrió un error en la base de datos.');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      setError('Hubo un problema al registrar el usuario.');
    } finally {
      setLoading(false);  // Detener carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={formulario.nombre}
        onChangeText={(text) => handleChange(text, 'nombre')}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#aaa"
        value={formulario.correo}
        onChangeText={(text) => handleChange(text, 'correo')}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={formulario.password}
        onChangeText={(text) => handleChange(text, 'password')}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={formulario.fechaNacimiento}
        onChangeText={(text) => handleChange(text, 'fechaNacimiento')}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#aaa"
        value={formulario.telefono}
        onChangeText={(text) => handleChange(text, 'telefono')}
        keyboardType="phone-pad"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleRegistro} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#6200ea',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  footerText: {
    color: '#fff',
    marginBottom: 10,
  },
  link: {
    color: '#1e90ff',
    fontSize: 16,
  },
});

export default Registro;
