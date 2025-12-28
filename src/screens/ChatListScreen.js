import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { subscribeToUserChats } from '../services/chatService';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToUserChats(user.uid, (data) => {
            setChats(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatScreen', {
                chatId: item.id,
                otherUserName: item.otherUserName
            })}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.otherUserName?.charAt(0)}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.otherUserName}</Text>
                    <Text style={styles.time}>
                        {item.lastMessage?.createdAt && new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>{item.lastMessage?.text}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No chats yet.</Text>
                            <Text style={styles.subText}>Tap + to start a conversation.</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AllUsers')}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#999'
    },
    preview: {
        color: '#666',
        fontSize: 14
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    subText: {
        color: '#999',
        marginTop: 5
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

export default ChatListScreen;
