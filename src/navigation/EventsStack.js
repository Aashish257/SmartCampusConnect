import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from '../screens/EventsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

const Stack = createNativeStackNavigator();

const EventsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EventsList" component={EventsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event' }} />
        </Stack.Navigator>
    );
};

export default EventsStack;
