import { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const INITIAL_ELAPSED_SECONDS = 18 * 60 + 42;

function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, '0'))
        .join(':');
}

function formatStartTime(date: Date | null) {
    if (!date) {
        return '—';
    }

    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function HostScreen() {
    const [isLive, setIsLive] = useState(true);
    const [startedAt, setStartedAt] = useState<Date | null>(
        new Date(Date.now() - INITIAL_ELAPSED_SECONDS * 1000)
    );
    const [elapsedSeconds, setElapsedSeconds] = useState(
        INITIAL_ELAPSED_SECONDS
    );


    type AudienceMember = {
        id: string;
        name: string;
        platform: 'Mobile' | 'Desktop';
    };

    type JoinRequest = {
        id: string;
        name: string;
        platform: 'Mobile' | 'Desktop';
    };

    type ChatMessage = {
        id: string;
        userId: string;
        userName: string;
        text: string;
        timestamp: string;
    };

    const initialAudience: AudienceMember[] = [
        { id: '1', name: 'Mike', platform: 'Mobile' },
        { id: '2', name: 'Sarah', platform: 'Desktop' },
        { id: '3', name: 'James', platform: 'Mobile' },
        { id: '4', name: 'Emily', platform: 'Mobile' },
        { id: '5', name: 'David', platform: 'Desktop' },
        { id: '6', name: 'Jessica', platform: 'Mobile' },
        { id: '7', name: 'Robert', platform: 'Desktop' },
        { id: '8', name: 'Amanda', platform: 'Mobile' },
        { id: '9', name: 'Daniel', platform: 'Desktop' },
        { id: '10', name: 'Rachel', platform: 'Mobile' },
        { id: '11', name: 'Kevin', platform: 'Mobile' },
        { id: '12', name: 'Laura', platform: 'Desktop' },
    ];

    const initialJoinRequests: JoinRequest[] = [
        {
            id: '13',
            name: 'John',
            platform: 'Mobile',
        },
        {
            id: '14',
            name: 'Jane',
            platform: 'Desktop',
        },
    ];

    const initialChatMessages: ChatMessage[] = [
        {
            id: 'message-1',
            userId: '1',
            userName: 'Mike',
            text: 'Great presentation so far!',
            timestamp: '6:41 PM',
        },
        {
            id: 'message-2',
            userId: '2',
            userName: 'Sarah',
            text: 'The second slide is really helpful.',
            timestamp: '6:42 PM',
        },
        {
            id: 'message-3',
            userId: '3',
            userName: 'James',
            text: 'Can you go back to the previous slide?',
            timestamp: '6:43 PM',
        },
        {
            id: 'message-4',
            userId: '4',
            userName: 'Emily',
            text: 'I have a question about this.',
            timestamp: '6:44 PM',
        },
    ];

    const [chatEnabled, setChatEnabled] = useState(true);

    const [chatMessages, setChatMessages] =
        useState<ChatMessage[]>(initialChatMessages);

    const [removedFromPresentation, setRemovedFromPresentation] =
        useState<string[]>([]);

    const [removedMessageIds, setRemovedMessageIds] =
        useState<string[]>([]);

    const [audience, setAudience] =
        useState<AudienceMember[]>(initialAudience);

    const [joinRequests, setJoinRequests] =
        useState<JoinRequest[]>(initialJoinRequests);

    const [blockedUsers, setBlockedUsers] =
        useState<AudienceMember[]>([]);



    const mobileViewers = isLive
        ? audience.filter((member) => member.platform === 'Mobile').length
        : 0;

    const desktopViewers = isLive
        ? audience.filter((member) => member.platform === 'Desktop').length
        : 0;

    const audienceTotal = mobileViewers + desktopViewers;

    const majorityPlatform =
        audienceTotal === 0
            ? '—'
            : mobileViewers > desktopViewers
                ? 'Mobile'
                : desktopViewers > mobileViewers
                    ? 'Desktop'
                    : 'Even';

    //Audience Management Functions
    const handleAcceptRequest = (request: JoinRequest) => {
        const isBlocked = blockedUsers.some(
            (member) => member.id === request.id
        );

        if (isBlocked) {
            return;
        }

        setJoinRequests((current) =>
            current.filter((item) => item.id !== request.id)
        );

        setAudience((current) => [
            ...current,
            {
                id: request.id,
                name: request.name,
                platform: request.platform,
            },
        ]);
    };

    const handleRejectRequest = (requestId: string) => {
        setJoinRequests((current) =>
            current.filter((item) => item.id !== requestId)
        );
    };

    const handleRemoveViewer = (memberId: string) => {
        setAudience((current) =>
            current.filter((member) => member.id !== memberId)
        );

        setRemovedFromPresentation((current) =>
            current.includes(memberId)
                ? current
                : [...current, memberId]
        );
    };

    const handleBlockViewer = (member: AudienceMember) => {
        setAudience((current) =>
            current.filter((item) => item.id !== member.id)
        );

        setBlockedUsers((current) => [
            ...current,
            member,
        ]);

        setJoinRequests((current) =>
            current.filter((request) => request.id !== member.id)
        );

        setRemovedFromPresentation((current) =>
            current.filter((userId) => userId !== member.id)
        );
    };

    const unblockUser = (userId: string) => {
        setBlockedUsers((current) =>
            current.filter((member) => member.id !== userId)
        );
    };

    const handleRemoveChatMessage = (messageId: string) => {
        setRemovedMessageIds((current) =>
            current.includes(messageId)
                ? current
                : [...current, messageId]
        );
    };

    const handleRemoveChatUser = (userId: string) => {
        setAudience((current) =>
            current.filter((member) => member.id !== userId)
        );

        setRemovedFromPresentation((current) =>
            current.includes(userId)
                ? current
                : [...current, userId]
        );
    };

    const handleBlockChatUser = (message: ChatMessage) => {
        const alreadyBlocked = blockedUsers.some(
            (member) => member.id === message.userId
        );

        if (alreadyBlocked) {
            return;
        }

        const audienceMember = audience.find(
            (member) => member.id === message.userId
        );

        const blockedMember: AudienceMember = audienceMember ?? {
            id: message.userId,
            name: message.userName,
            platform: 'Desktop',
        };

        setAudience((current) =>
            current.filter((member) => member.id !== message.userId)
        );

        setJoinRequests((current) =>
            current.filter((request) => request.id !== message.userId)
        );

        setRemovedFromPresentation((current) =>
            current.filter((userId) => userId !== message.userId)
        );

        setBlockedUsers((current) => [
            ...current,
            blockedMember,
        ]);
    };

    // Update the presentation duration while live.
    useEffect(() => {
        if (!isLive || !startedAt) {
            return;
        }

        const updateDuration = () => {
            const elapsed = Math.floor(
                (Date.now() - startedAt.getTime()) / 1000
            );

            setElapsedSeconds(elapsed);
        };

        updateDuration();

        const interval = setInterval(updateDuration, 1000);

        return () => clearInterval(interval);
    }, [isLive, startedAt]);

    const statusText = isLive ? 'LIVE' : 'OFFLINE';

    const viewerCount = isLive ? audienceTotal : 0;

    const handleStartPresentation = () => {
        const now = new Date();

        setStartedAt(now);
        setElapsedSeconds(0);
        setIsLive(true);
    };

    const handleEndPresentation = () => {
        setIsLive(false);
        setStartedAt(null);
        setElapsedSeconds(0);

        // End the current audience session
        setAudience([]);
        setJoinRequests([]);
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>HOST CONTROL PANEL</Text>
                    <Text style={styles.title}>Your Presentation</Text>
                    <Text style={styles.subtitle}>
                        Manage your current presentation session.
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        isLive
                            ? styles.statusBadgeLive
                            : styles.statusBadgeOffline,
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,
                            isLive
                                ? styles.statusDotLive
                                : styles.statusDotOffline,
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            isLive
                                ? styles.statusTextLive
                                : styles.statusTextOffline,
                        ]}
                    >
                        {statusText}
                    </Text>
                </View>
            </View>

            <View style={styles.sessionCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Session Information</Text>
                    <Text style={styles.cardDescription}>
                        Current presentation status
                    </Text>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>STATUS</Text>
                        <Text style={styles.infoValue}>{statusText}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>VIEWERS</Text>
                        <Text style={styles.infoValue}>{viewerCount}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>STARTED</Text>
                        <Text style={styles.infoValue}>
                            {formatStartTime(startedAt)}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>DURATION</Text>
                        <Text style={styles.infoValue}>
                            {formatDuration(elapsedSeconds)}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {isLive ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.endButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleEndPresentation}
                    >
                        <Text style={styles.endButtonText}>
                            END PRESENTATION
                        </Text>
                    </Pressable>
                ) : (
                    <Pressable
                        style={({ pressed }) => [
                            styles.startButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleStartPresentation}
                    >
                        <Text style={styles.startButtonText}>
                            START PRESENTATION
                        </Text>
                    </Pressable>
                )}
            </View>

            <View style={styles.audienceCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Audience Overview</Text>
                    <Text style={styles.cardDescription}>
                        Current audience and platform distribution
                    </Text>
                </View>

                <View style={styles.audienceSummary}>
                    <View style={styles.audienceTotal}>
                        <Text style={styles.audienceTotalNumber}>
                            {audienceTotal}
                        </Text>

                        <Text style={styles.audienceTotalLabel}>
                            {audienceTotal === 1 ? 'Viewer' : 'Viewers'}
                        </Text>
                    </View>

                    <View style={styles.majorityBadge}>
                        <Text style={styles.majorityLabel}>MAJORITY PLATFORM</Text>
                        <Text style={styles.majorityValue}>
                            {majorityPlatform}
                        </Text>
                    </View>
                </View>

                <View style={styles.platformRow}>
                    <View style={styles.platformCard}>
                        <View style={styles.platformHeader}>
                            <Text style={styles.platformName}>Mobile</Text>
                            <Text style={styles.platformCount}>
                                {mobileViewers}
                            </Text>
                        </View>

                        <View style={styles.platformBarTrack}>
                            <View
                                style={[
                                    styles.platformBar,
                                    {
                                        width:
                                            audienceTotal > 0
                                                ? `${(mobileViewers / audienceTotal) * 100}%`
                                                : '0%',
                                    },
                                ]}
                            />
                        </View>

                        <Text style={styles.platformPercentage}>
                            {audienceTotal > 0
                                ? Math.round((mobileViewers / audienceTotal) * 100)
                                : 0}
                            %
                        </Text>
                    </View>

                    <View style={styles.platformCard}>
                        <View style={styles.platformHeader}>
                            <Text style={styles.platformName}>Desktop</Text>
                            <Text style={styles.platformCount}>
                                {desktopViewers}
                            </Text>
                        </View>

                        <View style={styles.platformBarTrack}>
                            <View
                                style={[
                                    styles.platformBar,
                                    {
                                        width:
                                            audienceTotal > 0
                                                ? `${(desktopViewers / audienceTotal) * 100}%`
                                                : '0%',
                                    },
                                ]}
                            />
                        </View>

                        <Text style={styles.platformPercentage}>
                            {audienceTotal > 0
                                ? Math.round((desktopViewers / audienceTotal) * 100)
                                : 0}
                            %
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.managementCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Audience Management</Text>
                    <Text style={styles.cardDescription}>
                        Manage join requests and current audience members
                    </Text>
                </View>

                {joinRequests.length > 0 && (
                    <View style={styles.managementSection}>
                        <View style={styles.managementSectionHeader}>
                            <Text style={styles.managementSectionTitle}>
                                Pending Requests
                            </Text>

                            <View style={styles.requestBadge}>
                                <Text style={styles.requestBadgeText}>
                                    {joinRequests.length}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.memberList}>
                            {joinRequests.map((request) => (
                                <View
                                    key={request.id}
                                    style={styles.memberRow}
                                >
                                    <View style={styles.memberIdentity}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {request.name.charAt(0)}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={styles.memberName}>
                                                {request.name}
                                            </Text>

                                            <Text style={styles.memberPlatform}>
                                                {request.platform}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.memberActions}>
                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.acceptButton,
                                                pressed && styles.buttonPressed,
                                            ]}
                                            onPress={() =>
                                                handleAcceptRequest(request)
                                            }
                                        >
                                            <Text style={styles.acceptButtonText}>
                                                Accept
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.rejectButton,
                                                pressed && styles.buttonPressed,
                                            ]}
                                            onPress={() =>
                                                handleRejectRequest(request.id)
                                            }
                                        >
                                            <Text style={styles.rejectButtonText}>
                                                Reject
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.managementSection}>
                    <View style={styles.managementSectionHeader}>
                        <Text style={styles.managementSectionTitle}>
                            Current Audience
                        </Text>

                        <Text style={styles.currentAudienceCount}>
                            {audience.length}
                        </Text>
                    </View>

                    {audience.length === 0 ? (
                        <View style={styles.emptyAudience}>
                            <Text style={styles.emptyAudienceTitle}>
                                No viewers currently connected
                            </Text>

                            <Text style={styles.emptyAudienceText}>
                                Accepted audience members will appear here.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.memberList}>
                            {audience.map((member) => (
                                <View
                                    key={member.id}
                                    style={styles.memberRow}
                                >
                                    <View style={styles.memberIdentity}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {member.name.charAt(0)}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={styles.memberName}>
                                                {member.name}
                                            </Text>

                                            <Text style={styles.memberPlatform}>
                                                {member.platform}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.memberActions}>
                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.removeButton,
                                                pressed && styles.buttonPressed,
                                            ]}
                                            onPress={() =>
                                                handleRemoveViewer(member.id)
                                            }
                                        >
                                            <Text style={styles.removeButtonText}>
                                                Remove
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.blockButton,
                                                pressed && styles.buttonPressed,
                                            ]}
                                            onPress={() =>
                                                handleBlockViewer(member)
                                            }
                                        >
                                            <Text style={styles.blockButtonText}>
                                                Block
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {blockedUsers.length > 0 && (
                    <View style={styles.managementSection}>
                        <View style={styles.managementSectionHeader}>
                            <Text style={styles.managementSectionTitle}>
                                Blocked Users
                            </Text>

                            <Text style={styles.currentAudienceCount}>
                                {blockedUsers.length}
                            </Text>
                        </View>

                        <View style={styles.memberList}>
                            {blockedUsers.map((member) => (
                                <View
                                    key={member.id}
                                    style={styles.memberRow}
                                >
                                    <View style={styles.memberIdentity}>
                                        <View style={styles.blockedAvatar}>
                                            <Text style={styles.blockedAvatarText}>
                                                !
                                            </Text>
                                        </View>

                                        <View>
                                            <View style={styles.blockedNameRow}>
                                                <Text style={styles.memberName}>
                                                    {member.name}
                                                </Text>

                                                <View style={styles.blockedBadge}>
                                                    <Text style={styles.blockedBadgeText}>
                                                        BLOCKED
                                                    </Text>
                                                </View>
                                            </View>

                                            <Text style={styles.memberPlatform}>
                                                Cannot access presentation or chat
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.memberActions}>
                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.unblockButton,
                                                pressed && styles.buttonPressed,
                                            ]}
                                            onPress={() => unblockUser(member.id)}
                                        >
                                            <Text style={styles.unblockButtonText}>
                                                Unblock
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}


            </View>

            <View style={styles.chatCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Chat Moderation</Text>

                    <Text style={styles.cardDescription}>
                        Moderate messages and control who can participate in chat.
                    </Text>
                </View>

                <View style={styles.chatSettingsRow}>
                    <View style={styles.chatSettingsText}>
                        <Text style={styles.managementSectionTitle}>
                            Chat Enabled
                        </Text>

                        <Text style={styles.chatSettingDescription}>
                            Chat remains available even when the presentation is offline.
                        </Text>
                    </View>

                    <Pressable
                        accessibilityRole="switch"
                        accessibilityState={{ checked: chatEnabled }}
                        onPress={() => setChatEnabled((current) => !current)}
                        style={[
                            styles.toggle,
                            chatEnabled && styles.toggleEnabled,
                        ]}
                    >
                        <View
                            style={[
                                styles.toggleThumb,
                                chatEnabled && styles.toggleThumbEnabled,
                            ]}
                        />
                    </Pressable>
                </View>

                <View style={styles.chatDivider} />

                <View style={styles.managementSectionHeader}>
                    <Text style={styles.managementSectionTitle}>
                        Recent Messages
                    </Text>

                    <Text style={styles.currentAudienceCount}>
                        {chatMessages.length}
                    </Text>
                </View>

                {!chatEnabled ? (
                    <View style={styles.chatDisabled}>
                        <Text style={styles.chatDisabledTitle}>
                            Chat is disabled
                        </Text>

                        <Text style={styles.chatDisabledText}>
                            Audience members cannot send new messages until chat is
                            enabled again.
                        </Text>
                    </View>
                ) : chatMessages.length === 0 ? (
                    <View style={styles.chatEmpty}>
                        <Text style={styles.chatEmptyTitle}>
                            No chat messages
                        </Text>

                        <Text style={styles.chatEmptyText}>
                            New audience messages will appear here.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.chatMessageList}>
                        {chatMessages.map((message) => {
                            const isMessageRemoved =
                                removedMessageIds.includes(message.id);

                            const isBlocked = blockedUsers.some(
                                (member) => member.id === message.userId
                            );

                            const isRemovedFromPresentation =
                                removedFromPresentation.includes(message.userId);

                            return (
                                <View
                                    key={message.id}
                                    style={styles.chatMessageRow}
                                >
                                    <View style={styles.chatMessageIdentity}>
                                        <View
                                            style={[
                                                styles.avatar,
                                                isBlocked && styles.blockedMessageAvatar,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.avatarText,
                                                    isBlocked &&
                                                    styles.blockedMessageAvatarText,
                                                ]}
                                            >
                                                {message.userName.charAt(0)}
                                            </Text>
                                        </View>

                                        <View style={styles.chatMessageContent}>
                                            <View style={styles.chatMessageHeader}>
                                                <Text style={styles.memberName}>
                                                    {message.userName}
                                                </Text>

                                                {isBlocked && (
                                                    <View style={styles.blockedBadge}>
                                                        <Text style={styles.blockedBadgeText}>
                                                            BLOCKED
                                                        </Text>
                                                    </View>
                                                )}

                                                <Text style={styles.chatTimestamp}>
                                                    {message.timestamp}
                                                </Text>
                                            </View>

                                            {isMessageRemoved ? (
                                                <View style={styles.removedMessage}>
                                                    <Text style={styles.removedMessageText}>
                                                        Message removed
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text style={styles.chatMessageText}>
                                                    {message.text}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {isRemovedFromPresentation && !isBlocked && (
                                        <View style={styles.removedPresentationStatus}>
                                            <Text
                                                style={styles.removedPresentationStatusTitle}
                                            >
                                                ✓ Removed from presentation
                                            </Text>

                                            <Text
                                                style={styles.removedPresentationStatusText}
                                            >
                                                Can still participate in chat and can request to join again.
                                            </Text>
                                        </View>
                                    )}

                                    {isBlocked && (
                                        <View style={styles.blockedChatStatus}>
                                            <Text style={styles.blockedChatStatusTitle}>
                                                ⚠ Blocked from host space
                                            </Text>

                                            <Text style={styles.blockedChatStatusText}>
                                                Cannot access presentation or chat.
                                            </Text>
                                        </View>
                                    )}

                                    {!isBlocked && (
                                        <View style={styles.chatMessageActions}>
                                            {isMessageRemoved ? (
                                                <View style={styles.removedActionStatus}>
                                                    <Text style={styles.removedActionStatusText}>
                                                        Message removed
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Pressable
                                                    style={({ pressed }) => [
                                                        styles.removeMessageButton,
                                                        pressed && styles.buttonPressed,
                                                    ]}
                                                    onPress={() =>
                                                        handleRemoveChatMessage(message.id)
                                                    }
                                                >
                                                    <Text style={styles.removeMessageButtonText}>
                                                        Remove Message
                                                    </Text>
                                                </Pressable>
                                            )}

                                            {isRemovedFromPresentation ? (
                                                <View style={styles.removedPresentationButton}>
                                                    <Text style={styles.removedPresentationButtonText}>
                                                        ✓ Removed from Presentation
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Pressable
                                                    style={({ pressed }) => [
                                                        styles.removeMessageButton,
                                                        pressed && styles.buttonPressed,
                                                    ]}
                                                    onPress={() =>
                                                        handleRemoveChatUser(message.userId)
                                                    }
                                                >
                                                    <Text style={styles.removeMessageButtonText}>
                                                        Remove from Presentation
                                                    </Text>
                                                </Pressable>
                                            )}

                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.chatBlockButton,
                                                    pressed && styles.buttonPressed,
                                                ]}
                                                onPress={() =>
                                                    handleBlockChatUser(message)
                                                }
                                            >
                                                <Text style={styles.chatBlockButtonText}>
                                                    Block
                                                </Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={styles.chatModerationNote}>
                    <Text style={styles.chatModerationNoteText}>
                        Removing a message does not affect the user. Removing a user from
                        the presentation does not remove them from chat. Blocking removes
                        access to both chat and the presentation.
                    </Text>
                </View>
            </View>

            <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>Session controls</Text>
                <Text style={styles.noteText}>
                    Starting a presentation creates a new live session.
                    Ending it makes the presentation unavailable to the
                    audience until you start another session.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },

    content: {
        width: '100%',
        maxWidth: 1100,
        alignSelf: 'center',
        padding: 24,
        gap: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: '#687386',
        marginBottom: 6,
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#172033',
    },

    subtitle: {
        marginTop: 5,
        fontSize: 15,
        color: '#687386',
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderWidth: 1,
    },

    statusBadgeLive: {
        backgroundColor: '#fff',
        borderColor: '#d8dde5',
    },

    statusBadgeOffline: {
        backgroundColor: '#fff',
        borderColor: '#d8dde5',
    },

    statusDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },

    statusDotLive: {
        backgroundColor: '#d92d20',
    },

    statusDotOffline: {
        backgroundColor: '#98a2b3',
    },

    statusText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.8,
    },

    statusTextLive: {
        color: '#b42318',
    },

    statusTextOffline: {
        color: '#667085',
    },

    sessionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5eb',
        padding: 22,
    },

    cardHeader: {
        marginBottom: 20,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#172033',
    },

    cardDescription: {
        marginTop: 4,
        fontSize: 14,
        color: '#687386',
    },

    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    infoItem: {
        flexGrow: 1,
        flexBasis: 180,
        minHeight: 88,
        justifyContent: 'center',
        backgroundColor: '#f7f8fa',
        borderRadius: 12,
        padding: 16,
    },

    infoLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: '#7a8494',
        marginBottom: 7,
    },

    infoValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#172033',
    },

    divider: {
        height: 1,
        backgroundColor: '#e7eaf0',
        marginVertical: 22,
    },

    startButton: {
        minHeight: 52,
        borderRadius: 10,
        backgroundColor: '#172033',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    startButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.4,
    },

    endButton: {
        minHeight: 52,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d92d20',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    endButtonText: {
        color: '#b42318',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.4,
    },

    buttonPressed: {
        opacity: 0.7,
    },

    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5eb',
        padding: 20,
    },

    noteTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#172033',
        marginBottom: 6,
    },

    noteText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#687386',
    },

    audienceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5eb',
        padding: 22,
    },

    audienceSummary: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
        marginBottom: 14,
    },

    audienceTotal: {
        flex: 1,
        minHeight: 100,
        justifyContent: 'center',
        backgroundColor: '#f7f8fa',
        borderRadius: 12,
        padding: 16,
    },

    audienceTotalNumber: {
        fontSize: 30,
        fontWeight: '700',
        color: '#172033',
    },

    audienceTotalLabel: {
        marginTop: 3,
        fontSize: 13,
        color: '#687386',
    },

    majorityBadge: {
        flex: 1,
        minHeight: 100,
        justifyContent: 'center',
        backgroundColor: '#f7f8fa',
        borderRadius: 12,
        padding: 16,
    },

    majorityLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: '#7a8494',
        marginBottom: 7,
    },

    majorityValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#172033',
    },

    platformRow: {
        flexDirection: 'row',
        gap: 12,
    },

    platformCard: {
        flex: 1,
        backgroundColor: '#f7f8fa',
        borderRadius: 12,
        padding: 16,
    },

    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    platformName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    platformCount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#172033',
    },

    platformBarTrack: {
        height: 7,
        borderRadius: 4,
        backgroundColor: '#e1e5eb',
        overflow: 'hidden',
    },

    platformBar: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#172033',
    },

    platformPercentage: {
        marginTop: 8,
        fontSize: 12,
        color: '#687386',
    },

    managementCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5eb',
        padding: 22,
    },

    managementSection: {
        marginTop: 4,
    },

    managementSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    managementSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    requestBadge: {
        minWidth: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f4f7',
    },

    requestBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    currentAudienceCount: {
        fontSize: 13,
        fontWeight: '700',
        color: '#687386',
    },

    memberList: {
        borderWidth: 1,
        borderColor: '#e7eaf0',
        borderRadius: 12,
        overflow: 'hidden',
    },

    memberRow: {
        minHeight: 68,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: '#e7eaf0',
    },

    memberIdentity: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eef1f5',
    },

    avatarText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    memberName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#172033',
    },

    memberPlatform: {
        marginTop: 2,
        fontSize: 12,
        color: '#7a8494',
    },

    memberActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    acceptButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#172033',
    },

    acceptButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },

    rejectButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d8dde5',
        backgroundColor: '#fff',
    },

    rejectButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    removeButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d8dde5',
        backgroundColor: '#fff',
    },

    removeButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    blockButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d92d20',
        backgroundColor: '#fff',
    },

    blockButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b42318',
    },

    emptyAudience: {
        padding: 24,
        borderWidth: 1,
        borderColor: '#e7eaf0',
        borderRadius: 12,
        alignItems: 'center',
    },

    emptyAudienceTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    emptyAudienceText: {
        marginTop: 4,
        fontSize: 12,
        color: '#7a8494',
    },

    chatCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e1e5eb',
        padding: 22,
    },

    chatSettingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },

    chatSettingsText: {
        flex: 1,
    },

    chatSettingDescription: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 18,
        color: '#7a8494',
    },

    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 3,
        justifyContent: 'center',
        backgroundColor: '#d8dde5',
    },

    toggleEnabled: {
        backgroundColor: '#172033',
    },

    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },

    toggleThumbEnabled: {
        alignSelf: 'flex-end',
    },

    chatDivider: {
        height: 1,
        backgroundColor: '#e7eaf0',
        marginVertical: 22,
    },

    chatMessageList: {
        borderWidth: 1,
        borderColor: '#e7eaf0',
        borderRadius: 12,
        overflow: 'hidden',
    },

    chatMessageRow: {
        padding: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e7eaf0',
    },

    chatMessageIdentity: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },

    chatMessageContent: {
        flex: 1,
    },

    chatMessageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },

    chatTimestamp: {
        fontSize: 11,
        color: '#98a2b3',
    },

    chatMessageText: {
        marginTop: 4,
        fontSize: 14,
        lineHeight: 20,
        color: '#344054',
    },

    chatMessageActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        paddingLeft: 46,
    },

    removeMessageButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d8dde5',
        backgroundColor: '#fff',
    },

    removeMessageButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    chatEmpty: {
        padding: 24,
        borderWidth: 1,
        borderColor: '#e7eaf0',
        borderRadius: 12,
        alignItems: 'center',
    },

    chatEmptyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    chatEmptyText: {
        marginTop: 4,
        fontSize: 12,
        color: '#7a8494',
        textAlign: 'center',
    },

    chatDisabled: {
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#f7f8fa',
    },

    chatDisabledTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
    },

    chatDisabledText: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 18,
        color: '#7a8494',
    },

    chatModerationNote: {
        marginTop: 14,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f7f8fa',
    },

    chatModerationNoteText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#687386',
    },

    blockedAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef3f2',
    },

    blockedAvatarText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#b42318',
    },

    blockedNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },

    blockedBadge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: '#fef3f2',
        borderWidth: 1,
        borderColor: '#fecdca',
    },

    blockedBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: '#b42318',
    },

    unblockButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d8dde5',
        backgroundColor: '#fff',
    },

    unblockButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    blockedMessageAvatar: {
        backgroundColor: '#fef3f2',
    },

    blockedMessageAvatarText: {
        color: '#b42318',
    },

    blockedChatStatus: {
        marginLeft: 46,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fef3f2',
        borderWidth: 1,
        borderColor: '#fecdca',
    },

    blockedChatStatusTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b42318',
    },

    blockedChatStatusText: {
        marginTop: 3,
        fontSize: 11,
        lineHeight: 16,
        color: '#912018',
    },

    removedMessage: {
        marginTop: 4,
        paddingVertical: 6,
        paddingHorizontal: 9,
        borderRadius: 7,
        backgroundColor: '#f7f8fa',
    },

    removedMessageText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#7a8494',
    },

    removedPresentationStatus: {
        marginLeft: 46,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f7f8fa',
        borderWidth: 1,
        borderColor: '#e1e5eb',
    },

    removedPresentationStatusTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    removedPresentationStatusText: {
        marginTop: 3,
        fontSize: 11,
        lineHeight: 16,
        color: '#687386',
    },

    removedActionStatus: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f8fa',
    },

    removedActionStatusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7a8494',
    },

    removedPresentationButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f8fa',
        borderWidth: 1,
        borderColor: '#d8dde5',
    },

    removedPresentationButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#344054',
    },

    chatBlockButton: {
        minHeight: 34,
        paddingHorizontal: 12,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d92d20',
        backgroundColor: '#fff',
    },

    chatBlockButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b42318',
    },
});