/**
 * HistoryScreen — экран истории распознаваний.
 *
 * Список последних 50 записей (новые первыми).
 * Каждая запись: тип + текст результата + дата.
 */

import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Colors, Typography} from '../theme/appTheme';
import type {HistoryEntry} from '@features/storage/domain/historyEntry';

// TODO: import {historyRepository} from '@features/storage/data/databaseHelper';

export function HistoryScreen(): React.JSX.Element {
  const {t} = useTranslation();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // TODO: historyRepository.getAllEntries().then(setEntries);
  }, []);

  const renderItem = ({item}: {item: HistoryEntry}): React.JSX.Element => (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${item.type}: ${item.resultText}`}
    >
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.result} numberOfLines={3}>
        {item.resultText}
      </Text>
      <Text style={styles.date}>{item.createdAt}</Text>
    </View>
  );

  return (
    <View style={styles.container} accessible accessibilityLabel={t('history.screenLabel')}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={styles.emptyText}
            accessible
            accessibilityLabel={t('history.empty')}
          >
            {t('history.empty')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  type: {
    ...Typography.labelLarge,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  result: {
    ...Typography.bodyLarge,
    color: Colors.light.onSurface,
    marginBottom: 8,
  },
  date: {
    ...Typography.bodyMedium,
    color: Colors.light.outline,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.light.outline,
  },
});
