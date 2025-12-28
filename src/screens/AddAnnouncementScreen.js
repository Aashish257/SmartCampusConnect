import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { addAnnouncement } from '../services/dataService';
import { AuthContext } from '../context/AuthContext';

const AddAnnouncementScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, userProfile } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await addAnnouncement({
                title,
                description,
                authorName: userProfile?.name || user?.email,
                authorId: user.uid
            });
            Alert.alert("Success", "Announcement posted successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to post announcement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>New Announcement</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter title..."
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter details..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />

            <Button title={loading ? "Posting..." : "Post Announcement"} onPress={handleSubmit} disabled={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fafafa',
        fontSize: 16,
    },
    textArea: {
        height: 100,
    }
});

export default AddAnnouncementScreen;
