import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Count: {count}</ThemedText>
      <View style={styles.buttons}>
        <Button title="Decrement" onPress={() => setCount(current => current - 1)} />
        <Button title="Increment" onPress={() => setCount(current => current + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
});