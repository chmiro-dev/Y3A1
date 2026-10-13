
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const publishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export default function ConnectionTestScreen() {
  const [status, setStatus] = useState('Testing Supabase connection...');

  useEffect(() => {
    let cancelled = false;

    async function testConnection() {
      try {
        const response = await fetch(
          `${supabaseUrl}/auth/v1/health`,
          {
            method: 'GET',
            headers: {
              apikey: publishableKey,
              Authorization: `Bearer ${publishableKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Supabase returned HTTP ${response.status}`
          );
        }

        if (!cancelled) {
          setStatus('Success! Supabase Data API is reachable.');
        }
      } catch (error) {
        if (!cancelled) {
          setStatus(
            error instanceof Error
              ? `Connection test failed: ${error.message}`
              : 'Connection test failed.'
          );
        }
      }
    }

    void testConnection();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  status: {
    textAlign: 'center',
  },
});
