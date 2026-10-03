import { StyleSheet, Text, View } from 'react-native';

export default function GroupsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Groups</Text>
            <Text style={styles.subtitle}>
                Your group rooms will appear here.
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