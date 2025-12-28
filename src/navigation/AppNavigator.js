import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import EventsStack from './EventsStack';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';
import NotificationsScreen from '../screens/NotificationsScreen';
import { Ionicons } from '@expo/vector-icons'; // Ensure expo/vector-icons is available (standard in Expo)

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Updates') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false, // Hide header here because HomeStack handles its own (or nested screens do)
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Events" component={EventsStack} />
            <Tab.Screen name="Chat" component={ChatStack} />
            <Tab.Screen name="Updates" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
