import { StyleSheet, Text, View } from 'react-native';

export default function ChatsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chats</Text>
            <Text style={styles.subtitle}>
                Your private conversations will appear here.
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