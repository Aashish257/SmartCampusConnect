import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationContext } from '../context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
    const { notifications, markRead } = useContext(NotificationContext);

    useEffect(() => {
        // Mark as read when screen opens
        const unsubscribe = navigation.addListener('focus', () => {
            markRead();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.iconBox, item.type === 'event' ? styles.eventIcon : styles.announceIcon]}>
                <Ionicons
                    name={item.type === 'event' ? "calendar" : "megaphone"}
                    size={24}
                    color="white"
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.time}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Updates</Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No updates yet.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 50
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    list: {
        padding: 15
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        alignItems: 'center'
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    eventIcon: {
        backgroundColor: '#8E44AD'
    },
    announceIcon: {
        backgroundColor: '#007AFF'
    },
    content: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3
    },
    desc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5
    },
    time: {
        fontSize: 12,
        color: '#999'
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999'
    }
});

export default NotificationsScreen;
