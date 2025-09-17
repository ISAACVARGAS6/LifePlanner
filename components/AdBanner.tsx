import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SakuraColors } from '../constants/Colors';

// Importación condicional de Google Ads
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  if (!__DEV__) {
    const googleAds = require('react-native-google-mobile-ads');
    BannerAd = googleAds.BannerAd;
    BannerAdSize = googleAds.BannerAdSize;
    TestIds = googleAds.TestIds;
  }
} catch (error: any) {
  console.log('AdBanner: Google Ads no disponible en este entorno');
}

interface AdBannerProps {
  position?: 'top' | 'bottom';
  size?: any; // Cambiado de BannerAdSize a any para evitar errores de tipo
  testMode?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  position = 'bottom', 
  size = 'BANNER',
  testMode = __DEV__
}) => {
  // Si estamos en desarrollo o Google Ads no está disponible, mostrar un placeholder
  if (__DEV__ || !BannerAd) {
    return (
      <View style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition
      ]}>
        <View style={styles.placeholder}>
          {/* Placeholder para desarrollo */}
        </View>
      </View>
    );
  }

  const adUnitId = testMode ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';

  return (
    <View style={[
      styles.container,
      position === 'top' ? styles.topPosition : styles.bottomPosition
    ]}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: ['productivity', 'planning', 'organization', 'tasks', 'projects'],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: SakuraColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bottomPosition: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: SakuraColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdBanner; 