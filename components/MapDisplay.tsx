import React from 'react';
import { StyleSheet, View } from 'react-native';
import YaMap from 'react-native-yamap-plus';
import { COLORS } from '@/constants/Colors';

/**
 * MapDisplay Component
 * 
 * Required to comply with Yandex MapKit free license terms.
 * Displays a visible map on the screen.
 */
const MapDisplay = () => {
  return (
    <View 
      style={styles.container} 
      accessibilityElementsHidden={true} 
      importantForAccessibility="no-hide-descendants"
    >
      <YaMap
        style={styles.map}
        showUserPosition={false}
        nightMode={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120, // Sufficiently visible for license compliance
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapDisplay;
