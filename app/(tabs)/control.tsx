import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

const API_URL = 'https://sensormq.onrender.com';

export default function ControlScreen() {
    const [ledStatus, setLedStatus] = useState('off');
    const [gasValue, setGasValue] = useState<number | null>(null);
    const [gasState, setGasState] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Obtener el valor del sensor de gas de la base de datos
    const fetchGasSensorData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/lectura_gas`);
            if (response.data) {
                setGasValue(response.data.valor_gas);
                setGasState(response.data.estado_gas);
            }
        } catch (error) {
            console.error('Error fetching gas data:', error);
            Alert.alert('Error', 'No se pudo obtener el valor del sensor de gas');
        }
    };

    useEffect(() => {
        fetchGasSensorData();
        
        // Actualizar datos cada 5 segundos
        const interval = setInterval(fetchGasSensorData, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        router.replace('/');
    };

    const showLogoutModal = () => {
        setIsModalVisible(true);
    };

    const hideLogoutModal = () => {
        setIsModalVisible(false);
    };

    const controlLed = async (newState: 'on' | 'off') => {
        try {
            const response = await axios.post(`${API_URL}/api/led`, {
                estado: newState === 'on',
                id_usuario: 1  // Asegúrate de enviar el ID de usuario correcto
            });

            if (response.status === 200) {
                setLedStatus(newState);
                Alert.alert('Éxito', `LED ${newState === 'on' ? 'encendido' : 'apagado'} correctamente`);
            }
        } catch (error) {
            console.error('Error controlling LED:', error);
            Alert.alert('Error', 'No se pudo controlar el LED');
        }
    };

    const navigateToReportes = () => {
        router.push('/reporte');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Panel de Control</Text>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={showLogoutModal}
                >
                    <Feather name="log-out" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={hideLogoutModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>¿Estás seguro que deseas cerrar sesión?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={hideLogoutModal} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout} style={[styles.modalButton, styles.modalButtonDanger]}>
                                <Text style={styles.modalButtonText}>Sí</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    Estado actual del Led: {' '}
                    <Text style={[
                        styles.statusValue,
                        { color: ledStatus === 'on' ? '#00CC66' : '#FF3B30' }
                    ]}>
                        {ledStatus === 'on' ? 'ENCENDIDO' : 'APAGADO'}
                    </Text>
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, ledStatus === 'on' ? styles.activeButton : null]}
                    onPress={() => controlLed('on')}
                >
                    <Text style={styles.buttonText}>ENCENDER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, ledStatus === 'off' ? styles.inactiveButton : null]}
                    onPress={() => controlLed('off')}
                >
                    <Text style={styles.buttonText}>APAGAR</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sensorContainer}>
                <Text style={styles.statusText}>
                    Valor del Sensor de Gas: {' '}
                    <Text style={[styles.statusValue, { color: gasState === 'Peligro' ? '#FF3B30' : '#00CC66' }]}>
                        {gasValue !== null ? `${gasValue} ppm` : 'Cargando...'}
                    </Text>
                </Text>
                {gasState && (
                    <Text style={[styles.gasState, { color: gasState === 'Peligro' ? '#FF3B30' : '#00CC66' }]}>
                        Estado: {gasState}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.button, styles.reportButton]}
                onPress={navigateToReportes}
            >
                <Text style={styles.buttonText}>IR A REPORTES</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#FF3B30',
    },
    statusContainer: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sensorContainer: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        fontSize: 18,
        color: '#333',
    },
    statusValue: {
        fontWeight: 'bold',
    },
    gasState: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    activeButton: {
        backgroundColor: '#00CC66',
    },
    inactiveButton: {
        backgroundColor: '#FF3B30',
    },
    reportButton: {
        backgroundColor: '#5856D6',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    modalButtonDanger: {
        backgroundColor: '#FF3B30',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});