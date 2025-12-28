import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { seedDatabase } from '../services/seedService';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { userProfile, user } = useContext(AuthContext);

    const handleSeedData = async () => {
        try {
            await seedDatabase(user.uid);
            Alert.alert("Success", "Demo data has been added!");
        } catch (error) {
            Alert.alert("Error", "Failed to add demo data.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {userProfile?.photoURL ? (
                            <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{userProfile?.name?.charAt(0) || 'U'}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <Ionicons name="school-outline" size={24} color="#666" style={styles.icon} />
                        <View>
                            <Text style={styles.label}>Department</Text>
                            <Text style={styles.value}>{userProfile?.department || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={24} color="#666" style={styles.icon} />
                        <View>
                            <Text style={styles.label}>Year</Text>
                            <Text style={styles.value}>{userProfile?.year || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#666" style={styles.icon} />
                        <View>
                            <Text style={styles.label}>Role</Text>
                            <Text style={styles.value}>{userProfile?.role || 'student'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={logoutUser}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { marginTop: 30, borderColor: '#ddd', backgroundColor: '#f0f0f0' }]} onPress={handleSeedData}>
                    <Ionicons name="cloud-upload-outline" size={20} color="#555" />
                    <Text style={[styles.actionText, { color: '#555' }]}>Populate Demo Data</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    avatarContainer: {
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    icon: {
        marginRight: 20
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 44
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF'
    },
    logoutButton: {
        borderColor: '#ffebee',
        backgroundColor: '#fff',
        marginTop: 10
    },
    logoutText: {
        color: '#FF3B30'
    }
});

export default ProfileScreen;
