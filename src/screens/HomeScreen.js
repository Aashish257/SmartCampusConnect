import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { subscribeToAnnouncements } from '../services/dataService';
import AnnouncementCard from '../components/AnnouncementCard';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { userProfile } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAnnouncements((data) => {
            setAnnouncements(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {userProfile?.name?.split(' ')[0] || 'Student'}</Text>
            <Text style={styles.subtext}>Latest Campus Updates</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            {renderHeader()}

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={announcements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AnnouncementCard
                            title={item.title}
                            description={item.description}
                            authorName={item.authorName}
                            createdAt={item.createdAt}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No announcements yet.</Text>}
                />
            )}

            {/* Floating Action Button for Admins */}
            {userProfile?.role === 'admin' && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddAnnouncement')}
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
        paddingTop: 50 // Status bar padding manually if SafeAreaView fails specifically
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    subtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    listContent: {
        padding: 20,
        paddingBottom: 100 // Space for FAB
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 50,
        fontSize: 16
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007AFF',
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

export default HomeScreen;
