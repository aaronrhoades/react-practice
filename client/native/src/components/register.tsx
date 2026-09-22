import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { api } from '@/api/client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setMessage(null);
    setSubmitting(true);

    try {
      const user = await api.users.register({ name, email });
      setMessage(`Welcome, ${user.name}. Your account is ready.`);
      setName('');
      setEmail('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
      <ThemedView style={styles.panel}>
        <ThemedText type="small" style={styles.eyebrow}>CREATE YOUR PROFILE</ThemedText>
        <ThemedText type="title" style={styles.title}>Start with a name and email.</ThemedText>
        <ThemedText style={styles.intro}>This form uses the shared oRPC contract.</ThemedText>

        <ThemedText type="smallBold">Name</ThemedText>
        <TextInput value={name} onChangeText={setName} autoCapitalize="words" style={styles.input} />
        <ThemedText type="smallBold">Email</ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          style={styles.input}
        />
        <Pressable disabled={submitting} onPress={handleSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          {submitting ? <ActivityIndicator color="#fffdf8" /> : <ThemedText style={styles.buttonText}>Register</ThemedText>}
        </Pressable>
        {message && <ThemedText accessibilityLiveRegion="polite" style={styles.message}>{message}</ThemedText>}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    gap: 10,
    padding: 24,
    borderRadius: 8,
  },
  eyebrow: {
    color: '#b45f3c',
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    marginBottom: 2,
  },
  intro: {
    marginBottom: 14,
    opacity: 0.75,
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cfc1b0',
    borderRadius: 5,
    color: '#29241f',
    backgroundColor: '#fffdf8',
  },
  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#b45f3c',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fffdf8',
    fontWeight: '700',
  },
  message: {
    marginTop: 8,
  },
});