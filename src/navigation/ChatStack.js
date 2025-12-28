import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import AllUsersScreen from '../screens/AllUsersScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
            <Stack.Screen name="AllUsers" component={AllUsersScreen} options={{ title: 'New Chat' }} />
        </Stack.Navigator>
    );
};

export default ChatStack;
