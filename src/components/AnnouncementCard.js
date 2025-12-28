import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnouncementCard = ({ title, description, authorName, createdAt }) => {
    const formattedDate = new Date(createdAt).toLocaleDateString() + ' ' + new Date(createdAt).toLocaleTimeString();

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.footer}>
                <Text style={styles.author}>Posted by: {authorName}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333'
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
        lineHeight: 20
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    author: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic'
    },
    date: {
        fontSize: 12,
        color: '#888'
    }
});

export default AnnouncementCard;
