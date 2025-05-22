import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { supabase } from "../supabase"; 
import { useNavigation } from '@react-navigation/native'; // Aseguramos de tener la navegación correctamente importada

function Administrador() {
    const [usuarios, setUsuarios] = useState([]);
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accesoPermitido, setAccesoPermitido] = useState(false);
    const navigation = useNavigation(); // Usamos useNavigation correctamente

    useEffect(() => {
        const verificarAcceso = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                navigation.navigate("Home"); // Redirigimos a Home si no hay acceso
                return;
            }

            const { data, error } = await supabase
                .from("usuario")
                .select("roll")
                .eq("id", user.id)
                .single();

            if (error || !data || data.roll !== "admin") {
                alert("Acceso denegado");
                navigation.navigate("Home");
                return;
            }

            setAccesoPermitido(true);
        };

        verificarAcceso();
    }, [navigation]);

    useEffect(() => {
        if (!accesoPermitido) return;

        const obtenerDatos = async () => {
            try {
                const { data: usuariosData, error: usuariosError } = await supabase
                    .from("usuario")
                    .select("id, nombre, correo, roll, telefono");

                const { data: fotosData, error: fotosError } = await supabase
                    .from("multimedia")
                    .select("id, url, usuarioid");

                if (usuariosError || fotosError) {
                    console.error(usuariosError || fotosError);
                    alert("Hubo un error al cargar los datos. Intenta de nuevo.");
                    setLoading(false);
                    return;
                }

                const usuariosConFotos = usuariosData.map((usuario) => ({
                    ...usuario,
                    fotos: fotosData.filter((foto) => foto.usuarioid === usuario.id),
                }));

                setUsuarios(usuariosConFotos);
                setFotos(fotosData);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                alert("Hubo un error al obtener los datos.");
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [accesoPermitido]);

    const editarUsuario = async (id, nuevoNombre, nuevoCorreo, nuevoTelefono) => {
        try {
            const { error } = await supabase
                .from("usuario")
                .update({
                    nombre: nuevoNombre,
                    correo: nuevoCorreo,
                    telefono: nuevoTelefono,
                })
                .eq("id", id);

            if (error) {
                console.error(error);
                alert("Error al actualizar el usuario");
            } else {
                setUsuarios((prev) =>
                    prev.map((usuario) =>
                        usuario.id === id
                            ? { ...usuario, nombre: nuevoNombre, correo: nuevoCorreo, telefono: nuevoTelefono }
                            : usuario
                    )
                );
                alert("Usuario actualizado correctamente");
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert("Error al actualizar el usuario");
        }
    };

    const eliminarImagen = async (imagenId) => {
        try {
            const { error } = await supabase
                .from("multimedia")
                .delete()
                .eq("id", imagenId);

            if (error) {
                console.error("Error al eliminar la imagen:", error);
                alert("Error al eliminar la imagen");
            } else {
                setFotos((prevFotos) => prevFotos.filter((foto) => foto.id !== imagenId));
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((usuario) => ({
                        ...usuario,
                        fotos: usuario.fotos.filter((foto) => foto.id !== imagenId),
                    }))
                );
                alert("Imagen eliminada correctamente");
            }
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            alert("Error al eliminar la imagen");
        }
    };

    const handleChange = (text, usuarioId, campo) => {
        setUsuarios((prev) =>
            prev.map((usuario) =>
                usuario.id === usuarioId ? { ...usuario, [campo]: text } : usuario
            )
        );
    };

    if (!accesoPermitido) return null;
    if (loading) return <ActivityIndicator size="large" color="#fff" />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Administrador - Gestión de Usuarios y Multimedia</Text>
            {usuarios.map((usuario) => (
                <View key={usuario.id} style={styles.usuarioContainer}>
                    <Text style={styles.usuarioText}>ID Usuario: {usuario.id}</Text>
                    <TextInput
                        style={styles.input}
                        value={usuario.nombre}
                        onChangeText={(text) => handleChange(text, usuario.id, "nombre")}
                    />
                    <Text style={styles.usuarioText}>Correo: {usuario.correo}</Text>
                    <TextInput
                        style={styles.input}
                        value={usuario.telefono}
                        onChangeText={(text) => handleChange(text, usuario.id, "telefono")}
                    />
                    <View style={styles.fotosContainer}>
                        {usuario.fotos.map((foto) => (
                            <View key={foto.id} style={styles.fotoWrapper}>
                                <Image source={{ uri: foto.url }} style={styles.image} />
                                <TouchableOpacity onPress={() => eliminarImagen(foto.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        onPress={() => editarUsuario(usuario.id, usuario.nombre, usuario.correo, usuario.telefono)}
                        style={[styles.saveButton, loading && { opacity: 0.5 }]}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
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
    usuarioContainer: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    usuarioText: {
        color: '#bbb',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    fotosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    fotoWrapper: {
        marginRight: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    deleteButton: {
        marginTop: 5,
        backgroundColor: '#ff6347',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Administrador;
