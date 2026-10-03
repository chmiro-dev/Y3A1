import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
                Your profile, settings, and account controls will appear here.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111318',
        padding: 24,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        color: '#777e8b',
        fontSize: 14,
        marginTop: 8,
    },
});