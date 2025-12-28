import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddAnnouncementScreen from '../screens/AddAnnouncementScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddAnnouncement" component={AddAnnouncementScreen} options={{ title: 'Add Announcement' }} />
        </Stack.Navigator>
    );
};

export default HomeStack;
