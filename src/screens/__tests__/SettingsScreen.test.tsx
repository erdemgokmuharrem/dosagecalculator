import React from 'react';
import { Linking } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SettingsScreen from '../SettingsScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LINKS } from '../../config/links';
import i18n from '../../locales/i18n';
import appJson from '../../../app.json';

/**
 * Settings carries what App Review checks by hand: a working privacy policy
 * link, the advertising-consent entry point UMP requires in the EEA/UK, and the
 * app version. The links used to be plain text in an Alert and the version was
 * hardcoded to one the app never shipped as.
 */

// jest-expo's Constants has no manifest. In a build, expo-constants embeds
// app.json in the bundle (EXConstants.bundle/app.config), which this mirrors.
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: jest.requireActual('../../../app.json').expo },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const mockSubscription: {
  isPro: boolean;
  subscription: { plan: string } | null;
} = { isPro: false, subscription: null };
jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => mockSubscription,
}));

type Consent = {
  canRequestAds: boolean;
  personalized: boolean;
  privacyOptionsRequired: boolean;
};
const mockAds: {
  consent: Consent | null;
  openPrivacyOptions: jest.Mock;
} = { consent: null, openPrivacyOptions: jest.fn() };
jest.mock('../../contexts/AdContext', () => ({
  useAdManager: () => mockAds,
}));

const renderScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <SettingsScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );

const adRow = () => screen.queryByText(i18n.t('settings.adPreferences'));

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(() => {
  mockSubscription.isPro = false;
  mockSubscription.subscription = null;
  mockAds.consent = null;
  mockAds.openPrivacyOptions = jest.fn().mockResolvedValue(undefined);
});

describe('SettingsScreen — advertising consent', () => {
  it('shows no ad row until consent has resolved', () => {
    renderScreen();
    expect(adRow()).toBeNull();
  });

  it('shows the consent outcome without an entry point where UMP needs none', () => {
    mockAds.consent = {
      canRequestAds: true,
      personalized: false,
      privacyOptionsRequired: false,
    };
    renderScreen();
    expect(
      screen.getByText(i18n.t('settings.adsNonPersonalized'))
    ).toBeTruthy();
    fireEvent.press(adRow()!);
    expect(mockAds.openPrivacyOptions).not.toHaveBeenCalled();
  });

  it('opens the privacy-options form where UMP requires it', () => {
    mockAds.consent = {
      canRequestAds: true,
      personalized: true,
      privacyOptionsRequired: true,
    };
    renderScreen();
    expect(screen.getByText(i18n.t('settings.adsPersonalized'))).toBeTruthy();
    fireEvent.press(adRow()!);
    expect(mockAds.openPrivacyOptions).toHaveBeenCalledTimes(1);
  });

  it('never shows the ad row to Pro users', () => {
    mockSubscription.isPro = true;
    mockSubscription.subscription = { plan: 'monthly' };
    mockAds.consent = {
      canRequestAds: true,
      personalized: false,
      privacyOptionsRequired: true,
    };
    renderScreen();
    expect(adRow()).toBeNull();
  });
});

describe('SettingsScreen — links and version', () => {
  it('opens the privacy policy and terms instead of showing their address', () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    renderScreen();
    fireEvent.press(screen.getByText(i18n.t('settings.privacy')));
    fireEvent.press(screen.getByText(i18n.t('settings.terms')));
    expect(open).toHaveBeenCalledWith(LINKS.privacyPolicy);
    expect(open).toHaveBeenCalledWith(LINKS.terms);
    open.mockRestore();
  });

  it('opens a mail draft to support', () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    renderScreen();
    fireEvent.press(screen.getByText(i18n.t('settings.support')));
    expect(open).toHaveBeenCalledWith(`mailto:${LINKS.supportEmail}`);
    open.mockRestore();
  });

  it('shows the version from app.json', () => {
    renderScreen();
    const version = appJson.expo.version.replace(/\./g, '\\.');
    expect(screen.getByText(new RegExp(`\\b${version}\\b`))).toBeTruthy();
  });
});
