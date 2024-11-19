import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const API_URL = 'https://sensormq.onrender.com';

export default function LecturaGas() {
    const [lecturasGas, setLecturasGas] = useState<any[]>([]);

    // Función para obtener todas las lecturas de gas
    const fetchLecturasGas = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/lectura_gapps`);
            setLecturasGas(response.data); // Guardamos todas las lecturas en el estado
        } catch (error) {
            console.error('Error al obtener las lecturas de gas', error);
        }
    };

    // Llamar a la función cuando el componente se monte
    useEffect(() => {
        fetchLecturasGas();
    }, []);

    // Renderizar cada elemento en la lista
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.item}>
            <Text>ID Lectura: {item.id_lectura}</Text>
            <Text>Valor del Gas: {item.valor_gas}</Text>
            <Text>Estado del Gas: {item.estado_gas}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>ID Sensor: {item.id_sensor}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lecturas de Gas</Text>

            {lecturasGas.length > 0 ? (
                <FlatList
                    data={lecturasGas} // Lista de lecturas
                    renderItem={renderItem} // Renderizamos cada elemento
                    keyExtractor={(item) => item.id_lectura.toString()} // Clave única por registro
                />
            ) : (
                <Text>No hay lecturas registradas.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    item: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
});
