import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Message = {
  id: string;
  username: string;
  message: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    username: 'System',
    message: 'Welcome to the Global Lobby!',
    time: '9:41 PM',
  },
  {
    id: '2',
    username: 'Rogue',
    message: 'Anyone running some co-op tonight?',
    time: '9:42 PM',
  },
  {
    id: '3',
    username: 'Necromancer',
    message: 'I might be down. What are you playing?',
    time: '9:43 PM',
  },
  {
    id: '4',
    username: 'Paladin',
    message: 'Just finished a run. Looking for a group.',
    time: '9:44 PM',
  },
];

export default function GlobalLobbyScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState('');

  const sendMessage = () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      username: 'You',
      message: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
    setMessageText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Global Lobby</Text>
          <Text style={styles.headerSubtitle}>Everyone can see this chat</Text>
        </View>

        <Pressable style={styles.onlineButton}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>128 Online</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.roomHeader}>
          <Text style={styles.roomTitle}># Global Lobby</Text>
          <Text style={styles.roomDescription}>
            Meet people, chat, and find your next group.
          </Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.messageRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.messageContent}>
                <View style={styles.messageMeta}>
                  <Pressable>
                    <Text style={styles.username}>{item.username}</Text>
                  </Pressable>

                  <Text style={styles.time}>{item.time}</Text>
                </View>

                <Text style={styles.message}>{item.message}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.composer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            onSubmitEditing={sendMessage}
            placeholder="Message Global Lobby..."
            placeholderTextColor="#777"
            style={styles.input}
            returnKeyType="send"
          />

          <Pressable
            onPress={sendMessage}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
            ]}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111318',
  },

  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#181b22',
    borderBottomWidth: 1,
    borderBottomColor: '#292d36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#858b98',
    fontSize: 13,
    marginTop: 3,
  },

  onlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },

  onlineText: {
    color: '#aeb4c0',
    fontSize: 12,
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },

  roomHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#111318',
  },

  roomTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  roomDescription: {
    color: '#777e8b',
    fontSize: 12,
    marginTop: 4,
  },

  messageList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  messageRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    backgroundColor: '#111318',
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#343a46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  avatarText: {
    color: '#dce1ea',
    fontSize: 15,
    fontWeight: '700',
  },

  messageContent: {
    flex: 1,
  },

  messageMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },

  username: {
    color: '#7db7ff',
    fontSize: 14,
    fontWeight: '700',
  },

  time: {
    color: '#626875',
    fontSize: 11,
  },

  message: {
    color: '#d6d9df',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#292d36',
    backgroundColor: '#181b22',
    gap: 10,
  },

  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#242832',
    color: '#ffffff',
    fontSize: 14,
  },

  sendButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonPressed: {
    opacity: 0.75,
  },

  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
