import React from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import { COLORS } from '@/constants/Colors';
import HistoryItem from '@/components/HistoryItem';
import EmptyState from '@/components/EmptyState';

export default function HistoryScreen() {
  const { history, t } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header" accessibilityLabel={t('history.screenLabel')}>
          {t('history.screenLabel')}
        </Text>

        {history.length === 0 ? (
          <EmptyState message={t('history.empty')} />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HistoryItem result={item.result} timestamp={item.timestamp} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 20,
    letterSpacing: 0.4,
  },
  listContent: {
    paddingBottom: 12,
  },
});
