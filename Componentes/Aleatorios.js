import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../supabase'; 
import { useNavigation } from '@react-navigation/native';

function Aleatorios() {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const obtenerUsuarioAleatorio = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('usuario')
            .select('id, nombre, correo, roll')
            .order('id', { ascending: true })
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            alert('Hubo un error al obtener el usuario aleatorio');
            setLoading(false);
            return;
        }

        setUsuario(data);
        setLoading(false);
    };

    useEffect(() => {
        obtenerUsuarioAleatorio();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    return (
        <View style={styles.container}>
            {usuario && (
                <View style={styles.usuarioContainer}>
                    <Text style={styles.usuarioText}>ID Usuario: {usuario.id}</Text>
                    <Text style={styles.usuarioText}>Nombre: {usuario.nombre}</Text>
                    <Text style={styles.usuarioText}>Correo: {usuario.correo}</Text>
                    <Text style={styles.usuarioText}>Roll: {usuario.roll}</Text>
                    <TouchableOpacity
                        style={styles.reloadButton}
                        onPress={obtenerUsuarioAleatorio}
                    >
                        <Text style={styles.reloadButtonText}>Cargar otro usuario</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    usuarioContainer: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    usuarioText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    reloadButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    reloadButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Aleatorios;
