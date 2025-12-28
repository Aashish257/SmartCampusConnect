import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getAllUsers, createOrGetChat } from '../services/chatService';
import { Ionicons } from '@expo/vector-icons';

const AllUsersScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAllUsers(user.uid);
        setUsers(data);
        setLoading(false);
    };

    const handleUserPress = async (otherUser) => {
        // Determine Chat ID (create or get)
        const chatId = await createOrGetChat(user.uid, otherUser);

        // Navigate to Chat Screen
        navigation.replace('ChatScreen', {
            chatId,
            otherUserName: otherUser.name
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="white" />
            </View>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.department} • {item.role}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>No other users found.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        color: '#666',
        fontSize: 12
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888'
    }
});

export default AllUsersScreen;
