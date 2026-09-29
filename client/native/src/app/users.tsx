import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { api } from '@/api/client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUsers } from '@my-app/client-shared';

export default function UsersScreen() {
  const { users, loading, error, refetchUsers } = useUsers(() => api.users.list());

  useFocusEffect(
    useCallback(() => {
      refetchUsers();
    }, [refetchUsers]),
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.message}>Loading users...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Users</ThemedText>

      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<ThemedText style={styles.empty}>No users found.</ThemedText>}
        renderItem={({ item }) => (
          <ThemedView style={styles.userCard}>
            <ThemedText type="smallBold">{item.name}</ThemedText>
            <ThemedText style={styles.email}>{item.email}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  header: {
    marginBottom: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  userCard: {
    padding: 14,
    borderRadius: 10,
    gap: 4,
  },
  email: {
    opacity: 0.7,
  },
  message: {
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 12,
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
  },
});
