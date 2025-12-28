import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation }) => {
    const { user, userProfile, setUserProfile } = useContext(AuthContext);

    const [name, setName] = useState(userProfile?.name || '');
    const [department, setDepartment] = useState(userProfile?.department || '');
    const [year, setYear] = useState(userProfile?.year || '');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedFields = await updateUserProfile(user.uid, {
                name,
                department,
                year
            }, image);

            // Update Context
            setUserProfile(prev => ({ ...prev, ...updatedFields }));

            Alert.alert("Success", "Profile updated successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {image || userProfile?.photoURL ? (
                        <Image source={{ uri: image || userProfile?.photoURL }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={50} color="#ccc" />
                        </View>
                    )}
                    <View style={styles.editIcon}>
                        <Ionicons name="camera" size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Department</Text>
            <TextInput style={styles.input} value={department} onChangeText={setDepartment} />

            <Text style={styles.label}>Year</Text>
            <TextInput style={styles.input} value={year} onChangeText={setYear} />

            <Button title={loading ? "Saving..." : "Save Changes"} onPress={handleSave} disabled={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fafafa',
    }
});

export default EditProfileScreen;
