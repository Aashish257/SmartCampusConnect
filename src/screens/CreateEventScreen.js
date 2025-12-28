import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addEvent } from '../services/dataService';
import { Ionicons } from '@expo/vector-icons';

const CreateEventScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Simple YYYY-MM-DD for now
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !location || !date) {
            Alert.alert("Error", "Please fill in required fields (Title, Location, Date)");
            return;
        }

        setLoading(true);
        try {
            await addEvent({
                title,
                description,
                location,
                date
            }, image);
            Alert.alert("Success", "Event created successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to create event: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Create New Event</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="camera" size={40} color="#ccc" />
                        <Text style={styles.imageText}>Upload Event Poster</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Text style={styles.label}>Event Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Annual Tech Fest" />

            <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-12-31" />

            <Text style={styles.label}>Location *</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Main Auditorium" />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline numberOfLines={4}
                textAlignVertical="top"
                placeholder="Event details..."
            />

            <Button title={loading ? "Creating..." : "Create Event"} onPress={handleSubmit} disabled={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#f0f0f0',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagePreview: {
        width: '100%',
        height: '100%'
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageText: {
        color: '#888',
        marginTop: 10
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
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fafafa',
    },
    textArea: {
        height: 100,
    }
});

export default CreateEventScreen;
