import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useSubscription } from '../contexts/SubscriptionContext';
import { ADMOB_CONFIG } from '../config/admob';

export const AdBanner: React.FC = () => {
  const { isPro } = useSubscription();

  // If user is Pro, don't render the ad
  if (isPro) {
    return null;
  }

  // If no adUnitId is available, don't render
  if (!ADMOB_CONFIG.BANNER_ID) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={ADMOB_CONFIG.BANNER_ID as string}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // You can make this dynamic based on consent
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
});
