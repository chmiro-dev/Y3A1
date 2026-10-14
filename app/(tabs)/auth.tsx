import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthScreen({
  initialPasswordRecovery = false,
}: {
  initialPasswordRecovery?: boolean;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] =
    useState(initialPasswordRecovery);
  const [isSettingNewPassword, setIsSettingNewPassword] =
    useState(initialPasswordRecovery);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (initialPasswordRecovery) {
      setIsRecoveringPassword(true);
      setIsSettingNewPassword(true);
    }
  }, [initialPasswordRecovery]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
        setIsSettingNewPassword(true);
        setNotice('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const showMessage = (message: string) => {
    setNotice(message);

    if (Platform.OS !== 'web') {
      Alert.alert('Y3A1', message);
    }
  };

  const requestPasswordReset = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showMessage('Enter your account email address first.');
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo: 'http://localhost:8081',
          // TODO: Change redirectTo to the production URL when deploying.
        }
      );

      if (error) {
        throw error;
      }

      showMessage(
        'If an account exists for that email, a password reset link will be sent. Check your inbox.'
      );
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : 'Unable to request a reset email. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const saveNewPassword = async () => {
    if (newPassword.length < 8) {
      showMessage(
        'Your new password must contain at least 8 characters.'
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showMessage('The passwords do not match.');
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setNewPassword('');
      setConfirmNewPassword('');
      setPassword('');
      setIsSettingNewPassword(false);
      setIsRecoveringPassword(false);
      setIsSignUp(false);

      showMessage(
        'Password updated successfully. Please sign in with your new password.'
      );

      await supabase.auth.signOut();
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update your password. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const cleanDisplayName = displayName.trim();

    if (!cleanEmail || !password) {
      showMessage('Enter your email address and password.');
      return;
    }

    if (
      isSignUp &&
      !/^[A-Za-z0-9_]{3,30}$/.test(cleanUsername)
    ) {
      showMessage(
        'Your username must be 3–30 characters and use only letters, numbers, and underscores.'
      );
      return;
    }

    if (isSignUp && password.length < 8) {
      showMessage(
        'Your password must contain at least 8 characters.'
      );
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: cleanDisplayName || cleanUsername,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          showMessage(
            'Account created. Check your email to verify your address. Your account will need Host approval before you can access Y3A1.'
          );
        } else {
          showMessage(
            'Your account was created. Host approval is required before you can access Y3A1.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          throw error;
        }

        showMessage(
          'Signed in. We will check your account approval before enabling access.'
        );
      }
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const returnToSignIn = () => {
    setIsRecoveringPassword(false);
    setIsSettingNewPassword(false);
    setIsSignUp(false);
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setNotice('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.brand}>Y3A1</Text>

            <Text style={styles.title}>
              {isSettingNewPassword
                ? 'Choose a new password'
                : isRecoveringPassword
                  ? 'Reset your password'
                  : isSignUp
                    ? 'Create your account'
                    : 'Welcome back'}
            </Text>

            <Text style={styles.subtitle}>
              {isSettingNewPassword
                ? 'Choose a new password for your Y3A1 account.'
                : isRecoveringPassword
                  ? 'Enter the email address associated with your account. We will send you a password reset link if an account exists.'
                  : isSignUp
                    ? 'Create an account to request access to Y3A1.'
                    : 'Sign in to continue to the presentation room.'}
            </Text>

            {isSettingNewPassword ? (
              <View>
                <Text style={styles.label}>New password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter a new password"
                  placeholderTextColor="#777e8b"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={styles.input}
                  editable={!busy}
                />

                <Text style={styles.label}>
                  Confirm new password
                </Text>
                <TextInput
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Enter the new password again"
                  placeholderTextColor="#777e8b"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={styles.input}
                  editable={!busy}
                  onSubmitEditing={saveNewPassword}
                />
              </View>
            ) : (
              <View>
                {isSignUp && !isRecoveringPassword ? (
                  <View>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Choose a username"
                      placeholderTextColor="#777e8b"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.input}
                      editable={!busy}
                    />

                    <Text style={styles.label}>
                      Display name (optional)
                    </Text>
                    <TextInput
                      value={displayName}
                      onChangeText={setDisplayName}
                      placeholder="Name shown in chat"
                      placeholderTextColor="#777e8b"
                      style={styles.input}
                      editable={!busy}
                    />
                  </View>
                ) : null}

                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#777e8b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  style={styles.input}
                  editable={!busy}
                />

                {!isRecoveringPassword ? (
                  <View>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#777e8b"
                      secureTextEntry
                      autoCapitalize="none"
                      autoComplete={
                        isSignUp ? 'new-password' : 'current-password'
                      }
                      style={styles.input}
                      editable={!busy}
                      onSubmitEditing={submit}
                    />
                  </View>
                ) : null}
              </View>
            )}

            {notice ? (
              <Text
                accessibilityLiveRegion="polite"
                style={styles.notice}
              >
                {notice}
              </Text>
            ) : null}

            <Pressable
              onPress={
                isSettingNewPassword
                  ? saveNewPassword
                  : isRecoveringPassword
                    ? requestPasswordReset
                    : submit
              }
              disabled={busy}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                busy && styles.disabled,
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSettingNewPassword
                    ? 'Save new password'
                    : isRecoveringPassword
                      ? 'Send password reset email'
                      : isSignUp
                        ? 'Create account'
                        : 'Sign in'}
                </Text>
              )}
            </Pressable>

            {!isRecoveringPassword && !isSettingNewPassword && !isSignUp ? (
              <Pressable
                onPress={() => {
                  setIsRecoveringPassword(true);
                  setNotice('');
                }}
                disabled={busy}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot password?
                </Text>
              </Pressable>
            ) : null}

            {isRecoveringPassword || isSettingNewPassword ? (
              <Pressable
                onPress={returnToSignIn}
                disabled={busy}
                style={styles.switchButton}
              >
                <Text style={styles.switchText}>
                  Back to sign in
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setIsSignUp((current) => !current);
                  setNotice('');
                }}
                disabled={busy}
                style={styles.switchButton}
              >
                <Text style={styles.switchText}>
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : 'New here? Create an account'}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f17',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    padding: 28,
    borderRadius: 18,
    backgroundColor: '#151b27',
    borderWidth: 1,
    borderColor: '#293244',
  },
  brand: {
    color: '#7db7ff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    color: '#f4f6fb',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aab3c2',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  label: {
    color: '#e3e8f1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#374257',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f4f6fb',
    backgroundColor: '#0f1420',
    fontSize: 15,
    marginBottom: 18,
  },
  notice: {
    color: '#cbd8ed',
    backgroundColor: '#202a3b',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#3478f6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.55,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    color: '#91bfff',
    fontSize: 14,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 4,
  },
  switchText: {
    color: '#aebbd0',
    fontSize: 14,
    textAlign: 'center',
  },
});