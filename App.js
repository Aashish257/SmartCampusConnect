import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AuthStack from './src/navigation/AuthStack';
import TabNavigator from './src/navigation/AppNavigator';

const AppNav = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthStack />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppNav />
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
