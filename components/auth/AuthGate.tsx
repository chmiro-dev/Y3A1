
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthScreen from '../../app/(tabs)/auth';
import { supabase } from '../../lib/supabase';

type GateStatus =
  | 'recovering-password'
  | 'loading'
  | 'signed-out'
  | 'pending'
  | 'rejected'
  | 'blocked'
  | 'approved'
  | 'error';

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<GateStatus>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let isRecoveringPassword = false;

    const checkAccess = async (currentSession: Session | null) => {
      if (!active) return;

      if (isRecoveringPassword) {
  setStatus('recovering-password');
  return;
}

if (!currentSession) {
  setStatus('signed-out');
  return;
}

setStatus('loading');

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('approval_status')
          .eq('id', currentSession.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          if (active) setStatus('error');
          return;
        }

        const { data: isBlocked, error: blockedError } =
          await supabase.rpc('is_current_user_blocked');

        if (blockedError) throw blockedError;
        if (!active) return;

        if (isBlocked === true) {
          setStatus('blocked');
        } else if (profile.approval_status === 'approved') {
          setStatus('approved');
        } else if (profile.approval_status === 'rejected') {
          setStatus('rejected');
        } else {
          setStatus('pending');
        }
      } catch {
        if (active) setStatus('error');
      }
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setStatus('error');
        return;
      }

      void checkAccess(data.session);
    });

    const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, newSession) => {
  if (event === 'PASSWORD_RECOVERY') {
  console.log('Y3A1: PASSWORD_RECOVERY event received');
  isRecoveringPassword = true;
  setStatus('recovering-password');
  return;
}

  setTimeout(() => {
    if (active) void checkAccess(newSession);
  }, 0);
});

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [retryCount]);

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#8ab4f8" />
        <Text style={styles.message}>Checking your access to Y3A1…</Text>
      </SafeAreaView>
    );
  }

  if (status === 'signed-out') {
  return <AuthScreen />;
}

if (status === 'recovering-password') {
  return <AuthScreen initialPasswordRecovery />;
}

  if (status === 'pending') {
    return (
      <GateMessage
        title="Awaiting Host approval"
        message="Your account has been created, but the Host must approve it before you can access Y3A1."
        actionLabel="Sign out"
        onAction={() => void supabase.auth.signOut()}
      />
    );
  }

  if (status === 'rejected') {
    return (
      <GateMessage
        title="Account not approved"
        message="The Host has not approved your account. You can sign out of Y3A1 here."
        actionLabel="Sign out"
        onAction={() => void supabase.auth.signOut()}
      />
    );
  }

  if (status === 'blocked') {
    return (
      <GateMessage
        title="Access blocked"
        message="Your access to Y3A1 has been blocked by the Host. You cannot access the presentation or chat."
        actionLabel="Sign out"
        onAction={() => void supabase.auth.signOut()}
      />
    );
  }

  if (status === 'error') {
    return (
      <GateMessage
        title="Unable to verify access"
        message="Y3A1 couldn't verify your account. Check your connection and try again."
        actionLabel="Retry"
        onAction={() => {
          setStatus('loading');
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  return <>{children}</>;
}

function GateMessage({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <SafeAreaView style={styles.centered}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#101318',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#1b2028',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#c4cbd5',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  button: {
    minHeight: 46,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#356ac3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
