import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAdManager, adRequestOptions } from '../contexts/AdContext';
import { ADMOB_CONFIG } from '../config/admob';

/**
 * Banner slot. Renders nothing for Pro users, when no unit id is configured, or
 * before advertising consent has resolved: a banner must not request an ad ahead
 * of the consent flow, and its personalisation follows the consent result.
 */
export const AdBanner: React.FC = () => {
  const { isPro } = useSubscription();
  const { consent } = useAdManager();

  if (isPro || !ADMOB_CONFIG.BANNER_ID) return null;
  if (!consent || !consent.canRequestAds) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={ADMOB_CONFIG.BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={adRequestOptions(consent)}
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
