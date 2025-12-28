import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { subscribeToMessages, sendMessage } from '../services/chatService';
import MessageBubble from '../components/MessageBubble';

const ChatScreen = ({ route, navigation }) => {
    const { chatId, otherUserName } = route.params;
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: otherUserName });

        const unsubscribe = subscribeToMessages(chatId, (data) => {
            setMessages(data);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async () => {
        if (inputText.trim().length === 0) return;

        const text = inputText;
        setInputText(''); // Clear immediately

        try {
            await sendMessage(chatId, text, user.uid);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <MessageBubble
                            text={item.text}
                            isMyMessage={item.senderId === user.uid}
                            timestamp={item.createdAt}
                        />
                    )}
                    inverted // Show newest at bottom
                    contentContainerStyle={styles.listContent}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        multiline
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardContainer: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        padding: 5,
    }
});

export default ChatScreen;
