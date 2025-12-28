import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ title, date, location, imageUrl, onJoin, isJoined }) => {
    return (
        <View style={styles.card}>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{new Date(date).toDateString()}</Text>
                </View>

                <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{location}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.joinButton, isJoined && styles.joinedButton]}
                    onPress={onJoin}
                >
                    <Text style={[styles.joinText, isJoined && styles.joinedText]}>
                        {isJoined ? "Joined" : "Join Event"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    joinButton: {
        marginTop: 15,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    joinedButton: {
        backgroundColor: '#e3f2fd',
        borderWidth: 1,
        borderColor: '#007AFF'
    },
    joinText: {
        color: 'white',
        fontWeight: 'bold',
    },
    joinedText: {
        color: '#007AFF'
    }
});

export default EventCard;
