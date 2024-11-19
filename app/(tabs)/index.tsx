import React, { useState } from 'react';
import { Button, View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';

const API_URL = 'https://sensormq.onrender.com';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage(''); // Limpia el mensaje de error anterior
        try {
            const response = await axios.post(`${API_URL}/api/login`, {
                usuario: username,
                contraseña: password,
            });

            if (response.status === 200) {
                alert('Login exitoso');
                router.push('./control'); // Redirige al control sin token
            } else {
                setErrorMessage('Inicio de sesión fallido. Contacte al administrador.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('Usuario o contraseña incorrectos.');
                    } else {
                        setErrorMessage('Error con la respuesta del servidor.');
                    }
                } else {
                    setErrorMessage('No se recibió respuesta del servidor.');
                }
            } else if (error instanceof Error) {
                setErrorMessage(`Error: ${error.message}`);
            } else {
                setErrorMessage('Ocurrió un error desconocido.');
            }
            console.error('Error en el login:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TextInput
                    placeholder="Usuario"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <Button title="Iniciar sesión" onPress={handleLogin} />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
    },
});

export default LoginScreen;
