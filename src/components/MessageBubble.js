import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ text, isMyMessage, timestamp }) => {
    return (
        <View style={[
            styles.container,
            isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
            <View style={[
                styles.bubble,
                isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
            ]}>
                <Text style={[
                    styles.text,
                    isMyMessage ? styles.myMessageText : styles.otherMessageText
                ]}>{text}</Text>
                <Text style={[
                    styles.time,
                    isMyMessage ? styles.myMessageTime : styles.otherMessageTime
                ]}>
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 15,
    },
    myMessageBubble: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 2,
    },
    otherMessageBubble: {
        backgroundColor: '#E5E5EA',
        borderBottomLeftRadius: 2,
    },
    text: {
        fontSize: 16,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#000',
    },
    time: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'right'
    },
    myMessageTime: {
        color: 'rgba(255,255,255,0.7)'
    },
    otherMessageTime: {
        color: '#888'
    }
});

export default MessageBubble;
