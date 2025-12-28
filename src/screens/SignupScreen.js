import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { registerUser } from '../services/authService';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState(''); // e.g., '1st', '2nd'
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !department || !year) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await registerUser({
                name,
                email,
                password,
                department,
                year
            });
            // Auth listener handles redirect
        } catch (error) {
            Alert.alert("Registration Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Department (e.g., CSE)"
                value={department}
                onChangeText={setDepartment}
            />

            <TextInput
                style={styles.input}
                placeholder="Year (e.g., 3rd Year)"
                value={year}
                onChangeText={setYear}
            />

            <Button title={loading ? "Creating Account..." : "Sign Up"} onPress={handleSignup} disabled={loading} />

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
    },
});

export default SignupScreen;
