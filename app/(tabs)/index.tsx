import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

type Message = {
  id: string;
  user: string;
  text: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    user: 'System',
    text: 'Welcome to the presentation.',
  },
  {
    id: '2',
    user: 'Mike',
    text: 'Hello everyone!',
  },
  {
    id: '3',
    user: 'Sarah',
    text: 'Glad to be here.',
  },
];

export default function LiveSessionScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  // Temporary local state.
  // Later this will come from Supabase.
  const isLive = true;

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now().toString(),
        user: 'You',
        text,
      },
    ]);

    setMessageText('');
  };

  const presentationHeight = isMobile
    ? Math.min(width * 0.62, 360)
    : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Your Presentation</Text>
            <Text style={styles.hostName}>Christopher</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isLive ? styles.liveBadge : styles.offlineBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                isLive ? styles.liveDot : styles.offlineDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                isLive ? styles.liveText : styles.offlineText,
              ]}
            >
              {isLive ? 'LIVE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        {isLive ? (
          /* =========================
             LIVE SESSION
             ========================= */
          <View
            style={[
              styles.content,
              isMobile && styles.contentMobile,
            ]}
          >
            {/* Presentation */}
            <View
              style={[
                styles.presentationSection,
                isMobile && styles.presentationSectionMobile,
              ]}
            >
              <View
                style={[
                  styles.presentationFrame,
                  isMobile && {
                    flex: 0,
                    flexGrow: 0,
                    flexShrink: 0,
                    height: presentationHeight,
                  },
                ]}
              >
                <View style={styles.presentationContent}>
                  <Text style={styles.presentationLabel}>
                    CURRENT PRESENTATION
                  </Text>

                  <Text
                    style={[
                      styles.presentationTitle,
                      isMobile && styles.presentationTitleMobile,
                    ]}
                  >
                    Christopher is presenting
                  </Text>

                  <Text style={styles.presentationSubtitle}>
                    Your presentation content will appear here.
                  </Text>
                </View>

                <View style={styles.sourceBadge}>
                  <Text style={styles.sourceText}>PRESENTATION</Text>
                </View>
              </View>
            </View>

            {/* Chat */}
            <View
              style={[
                styles.chatSection,
                isMobile && styles.chatSectionMobile,
              ]}
            >
              <View style={styles.chatHeader}>
                <View>
                  <Text style={styles.chatTitle}>Chat</Text>
                  <Text style={styles.chatSubtitle}>
                    Audience conversation
                  </Text>
                </View>

                <View style={styles.viewerCount}>
                  <View style={styles.viewerDot} />
                  <Text style={styles.viewerText}>12 watching</Text>
                </View>
              </View>

              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.message}>
                    <Text style={styles.messageUser}>{item.user}</Text>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                )}
              />

              <View style={styles.composer}>
                <TextInput
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Type a message..."
                  placeholderTextColor="#777e8b"
                  style={styles.input}
                  onSubmitEditing={sendMessage}
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
          </View>
        ) : (
          /* =========================
             OFFLINE HOME
             ========================= */
          <ScrollView
            style={styles.offlineScroll}
            contentContainerStyle={[
              styles.offlineContent,
              isMobile && styles.offlineContentMobile,
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.offlineHero}>
              <Text style={styles.offlineEyebrow}>CURRENTLY OFFLINE</Text>

              <Text
                style={[
                  styles.offlineTitle,
                  isMobile && styles.offlineTitleMobile,
                ]}
              >
                Christopher isn't presenting right now.
              </Text>

              <Text style={styles.offlineMessage}>
                Check back later for the next live presentation. In the
                meantime, you can explore the available content below.
              </Text>
            </View>

            {/* Custom message */}
            <View style={styles.contentCard}>
              <Text style={styles.cardEyebrow}>MESSAGE</Text>
              <Text style={styles.cardTitle}>Welcome</Text>
              <Text style={styles.cardText}>
                Thanks for stopping by. New presentations and live broadcasts
                will appear here when Christopher is online.
              </Text>
            </View>

            {/* Previous presentations */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>
                Previous Presentations
              </Text>

              <View
                style={[
                  styles.presentationCards,
                  isMobile && styles.presentationCardsMobile,
                ]}
              >
                <Pressable style={styles.savedCard}>
                  <View style={styles.savedCardPreview}>
                    <Text style={styles.savedCardPreviewText}>VIDEO</Text>
                  </View>

                  <Text style={styles.savedCardTitle}>
                    Previous Presentation
                  </Text>

                  <Text style={styles.savedCardSubtitle}>
                    Watch this presentation
                  </Text>
                </Pressable>

                <Pressable style={styles.savedCard}>
                  <View style={styles.savedCardPreview}>
                    <Text style={styles.savedCardPreviewText}>SLIDES</Text>
                  </View>

                  <Text style={styles.savedCardTitle}>
                    Presentation Slides
                  </Text>

                  <Text style={styles.savedCardSubtitle}>
                    View the presentation
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Links */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Useful Links</Text>

              <Pressable style={styles.linkCard}>
                <View>
                  <Text style={styles.linkTitle}>Website</Text>
                  <Text style={styles.linkSubtitle}>
                    Visit the website
                  </Text>
                </View>

                <Text style={styles.linkArrow}>›</Text>
              </Pressable>

              <Pressable style={styles.linkCard}>
                <View>
                  <Text style={styles.linkTitle}>YouTube</Text>
                  <Text style={styles.linkSubtitle}>
                    Watch more videos
                  </Text>
                </View>

                <Text style={styles.linkArrow}>›</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111318',
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#181b22',
    borderBottomWidth: 1,
    borderBottomColor: '#292d36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  appTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },

  hostName: {
    color: '#8d95a3',
    fontSize: 13,
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  liveBadge: {
    backgroundColor: '#2a171b',
  },

  offlineBadge: {
    backgroundColor: '#242830',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  liveDot: {
    backgroundColor: '#ef4444',
  },

  offlineDot: {
    backgroundColor: '#8d95a3',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  liveText: {
    color: '#f87171',
  },

  offlineText: {
    color: '#aab1bd',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
  },

  contentMobile: {
    flexDirection: 'column',
  },

  presentationSection: {
    flex: 1,
    padding: 24,
  },

  presentationSectionMobile: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    padding: 12,
    paddingBottom: 8,
  },

  presentationFrame: {
    flex: 1,
    minHeight: 300,
    backgroundColor: '#080a0e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292d36',
    overflow: 'hidden',
    position: 'relative',
  },

  presentationContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  presentationLabel: {
    color: '#6f7785',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 14,
  },

  presentationTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  presentationTitleMobile: {
    fontSize: 21,
  },

  presentationSubtitle: {
    color: '#777e8b',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 480,
    lineHeight: 22,
  },

  sourceBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#181b22',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#292d36',
  },

  sourceText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
  },

  chatSection: {
    width: 360,
    backgroundColor: '#181b22',
    borderLeftWidth: 1,
    borderLeftColor: '#292d36',
    flexDirection: 'column',
  },

  chatSectionMobile: {
    width: '100%',
    flex: 1,
    minHeight: 0,
    borderLeftWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#292d36',
  },

  chatHeader: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#292d36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  chatTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  chatSubtitle: {
    color: '#777e8b',
    fontSize: 12,
    marginTop: 3,
  },

  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },

  viewerText: {
    color: '#8d95a3',
    fontSize: 11,
  },

  messageList: {
    flex: 1,
  },

  messageListContent: {
    padding: 18,
  },

  message: {
    marginBottom: 18,
  },

  messageUser: {
    color: '#a5b4fc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  messageText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },

  composer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#292d36',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    minHeight: 42,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#343944',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 14,
  },

  sendButton: {
    minHeight: 42,
    marginLeft: 8,
    paddingHorizontal: 14,
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
    fontSize: 13,
    fontWeight: '700',
  },

  /* Offline */

  offlineScroll: {
    flex: 1,
  },

  offlineContent: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 40,
    paddingBottom: 80,
  },

  offlineContentMobile: {
    padding: 20,
    paddingBottom: 40,
  },

  offlineHero: {
    paddingVertical: 36,
    paddingHorizontal: 8,
  },

  offlineEyebrow: {
    color: '#8d95a3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  offlineTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    maxWidth: 700,
  },

  offlineTitleMobile: {
    fontSize: 26,
    lineHeight: 34,
  },

  offlineMessage: {
    color: '#8d95a3',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 650,
  },

  contentCard: {
    backgroundColor: '#181b22',
    borderWidth: 1,
    borderColor: '#292d36',
    borderRadius: 12,
    padding: 24,
    marginBottom: 36,
  },

  cardEyebrow: {
    color: '#6f7785',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },

  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },

  cardText: {
    color: '#9ca3af',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    maxWidth: 700,
  },

  sectionBlock: {
    marginBottom: 36,
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },

  presentationCards: {
    flexDirection: 'row',
    gap: 16,
  },

  presentationCardsMobile: {
    flexDirection: 'column',
  },

  savedCard: {
    flex: 1,
    backgroundColor: '#181b22',
    borderWidth: 1,
    borderColor: '#292d36',
    borderRadius: 10,
    overflow: 'hidden',
  },

  savedCardPreview: {
    height: 140,
    backgroundColor: '#080a0e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  savedCardPreviewText: {
    color: '#6f7785',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  savedCardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  savedCardSubtitle: {
    color: '#777e8b',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingTop: 5,
    paddingBottom: 16,
  },

  linkCard: {
    minHeight: 68,
    backgroundColor: '#181b22',
    borderWidth: 1,
    borderColor: '#292d36',
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  linkTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  linkSubtitle: {
    color: '#777e8b',
    fontSize: 13,
    marginTop: 4,
  },

  linkArrow: {
    color: '#8d95a3',
    fontSize: 28,
    fontWeight: '300',
  },
});