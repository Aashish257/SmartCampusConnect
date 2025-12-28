import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { subscribeToEvents, toggleEventJoin } from '../services/dataService';
import EventCard from '../components/EventCard';
import { Ionicons } from '@expo/vector-icons';

const EventsScreen = ({ navigation }) => {
    const { user, userProfile } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToEvents((data) => {
            setEvents(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleJoin = async (event) => {
        const isJoined = event.attendees?.includes(user.uid);
        try {
            await toggleEventJoin(event.id, user.uid, !isJoined);
        } catch (error) {
            console.error("Failed to join event", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Upcoming Events</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EventCard
                            title={item.title}
                            date={item.date}
                            location={item.location}
                            imageUrl={item.imageUrl}
                            isJoined={item.attendees?.includes(user.uid)}
                            onJoin={() => handleJoin(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No events scheduled.</Text>}
                />
            )}

            {/* Admin FAB */}
            {userProfile?.role === 'admin' && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('CreateEvent')}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    listContent: {
        padding: 20,
        paddingBottom: 100
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999'
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#8E44AD', // Purple for events
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    }
});

export default EventsScreen;
