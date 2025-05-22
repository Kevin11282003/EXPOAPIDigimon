import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../supabase";  // Asegúrate de importar correctamente supabase

export default function Usuario() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    roll: "",
  });

  const [nuevaUrl, setNuevaUrl] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Obtener datos del usuario
  useEffect(() => {
    async function fetchUsuario() {
      setCargando(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("usuario")
            .select("*")
            .eq("id", user.id)
            .single();
          if (data) {
            setUsuario(data);
            setForm(data);
            fetchImagenes(user.id);
          } else {
            setError("Error al cargar los datos del usuario.");
          }
        }
      } catch (error) {
        setError("Error al obtener los datos del usuario.");
      } finally {
        setCargando(false);
      }
    }

    fetchUsuario();
  }, []);

  const fetchImagenes = async (usuarioid) => {
    setCargando(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("multimedia")
        .select("*")
        .eq("usuarioid", usuarioid);
      if (data) {
        setImagenes(data);
      } else {
        setError("Error al cargar las imágenes.");
      }
    } catch (error) {
      setError("Error al cargar las imágenes.");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e, name) => {
    setForm({ ...form, [name]: e });
  };

  const handleUpdate = async () => {
    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("usuario")
        .update(form)
        .eq("id", usuario.id);
      if (error) {
        setError("Error al actualizar");
      } else {
        Alert.alert("Datos actualizados");
      }
    } catch (error) {
      setError("Error al actualizar");
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarUrl = async () => {
    if (!nuevaUrl.trim()) return;

    // Validar URL
    if (!/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(nuevaUrl)) {
      setError("Por favor ingrese una URL válida de imagen.");
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("multimedia")
        .insert([{ url: nuevaUrl, usuarioid: usuario.id }]);
      if (error) {
        setError("Error al agregar la imagen");
      } else {
        setNuevaUrl("");
        fetchImagenes(usuario.id);
      }
    } catch (error) {
      setError("Error al agregar la imagen");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarImagen = async (id) => {
    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("multimedia")
        .delete()
        .eq("id", id);
      if (!error) {
        setImagenes(imagenes.filter((img) => img.id !== id));
      } else {
        setError("Error al eliminar la imagen.");
      }
    } catch (error) {
      setError("Error al eliminar la imagen.");
    } finally {
      setCargando(false);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setImagenes([]);
  };

  if (cargando) return <Text style={styles.loading}>Cargando...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  if (!usuario) return <Text style={styles.error}>No se encontró el usuario.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.perfilSection}>
        <Text style={styles.header}>Perfil de Usuario</Text>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={form.nombre}
            onChangeText={(text) => handleChange(text, "nombre")}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#aaa"
            value={form.correo}
            onChangeText={(text) => handleChange(text, "correo")}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento"
            placeholderTextColor="#aaa"
            value={form.fecha_nacimiento}
            onChangeText={(text) => handleChange(text, "fecha_nacimiento")}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#aaa"
            value={form.telefono}
            onChangeText={(text) => handleChange(text, "telefono")}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Rol"
            placeholderTextColor="#aaa"
            value={form.roll}
            onChangeText={(text) => handleChange(text, "roll")}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagenesSection}>
        <Text style={styles.subHeader}>Agregar imagen</Text>
        <View style={styles.agregarImagen}>
          <TextInput
            style={styles.input}
            placeholder="URL de la imagen"
            placeholderTextColor="#aaa"
            value={nuevaUrl}
            onChangeText={(text) => setNuevaUrl(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAgregarUrl}
            disabled={cargando}
          >
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeader}>Imágenes guardadas</Text>
        <View style={styles.listaImagenes}>
          {imagenes.map((img) => (
            <View key={img.id} style={styles.imageContainer}>
              <Image
                source={{ uri: img.url }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleEliminarImagen(img.id)}
                disabled={cargando}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.logoutSection}>
        <Text style={styles.header}>¿Deseas cerrar sesión?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Stack.Screen
  name="Usuario"
  component={Usuario}
  options={{
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 15 }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Atrás</Text> {/* Texto "Atrás" */}
      </TouchableOpacity>
    ),
  }}
/>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#6200ea",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagenesSection: {
    marginTop: 20,
  },
  agregarImagen: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  listaImagenes: {
    marginTop: 10,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  logoutSection: {
    marginTop: 20,
    alignItems: "center",
  },
});
