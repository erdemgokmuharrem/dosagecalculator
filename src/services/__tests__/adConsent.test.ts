import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AD_CONSENT_STATE_KEY,
  openPrivacyOptions,
  resolveAdConsent,
  resetAdConsentForTests,
} from '../adConsent';

/**
 * Advertising consent decisions.
 *
 * Personalised ads must never be requested without every applicable consent,
 * the tracking prompt must not be shown when its answer would not be used, and
 * any failure must degrade to non-personalised ads rather than block the app.
 */

const mockCalls: string[] = [];
const mockUmp = {
  gatherConsent: jest.fn(),
  getUserChoices: jest.fn(),
  showPrivacyOptionsForm: jest.fn(),
};
const mockInitialize = jest.fn();
const mockAtt = { get: jest.fn(), request: jest.fn() };

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({
    initialize: () => {
      mockCalls.push('init');
      return mockInitialize();
    },
  }),
  AdsConsent: {
    gatherConsent: () => {
      mockCalls.push('ump');
      return mockUmp.gatherConsent();
    },
    getUserChoices: () => mockUmp.getUserChoices(),
    showPrivacyOptionsForm: () => {
      mockCalls.push('privacy-form');
      return mockUmp.showPrivacyOptionsForm();
    },
  },
  AdsConsentPrivacyOptionsRequirementStatus: {
    UNKNOWN: 'UNKNOWN',
    REQUIRED: 'REQUIRED',
    NOT_REQUIRED: 'NOT_REQUIRED',
  },
  AdsConsentStatus: {
    UNKNOWN: 'UNKNOWN',
    REQUIRED: 'REQUIRED',
    NOT_REQUIRED: 'NOT_REQUIRED',
    OBTAINED: 'OBTAINED',
  },
}));

jest.mock('expo-tracking-transparency', () => ({
  getTrackingPermissionsAsync: () => mockAtt.get(),
  requestTrackingPermissionsAsync: () => {
    mockCalls.push('att');
    return mockAtt.request();
  },
}));

jest.mock('../monitoring', () => ({ reportError: jest.fn() }));

const setOS = (os: 'ios' | 'android') =>
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true });

beforeEach(async () => {
  await AsyncStorage.clear();
  resetAdConsentForTests();
  mockCalls.length = 0;
  mockUmp.gatherConsent.mockResolvedValue({
    status: 'NOT_REQUIRED',
    canRequestAds: true,
  });
  mockUmp.getUserChoices.mockResolvedValue({
    selectPersonalisedAds: true,
    storeAndAccessInformationOnDevice: true,
  });
  mockAtt.get.mockResolvedValue({ status: 'undetermined' });
  mockAtt.request.mockResolvedValue({ status: 'granted' });
  mockInitialize.mockResolvedValue([]);
  mockUmp.showPrivacyOptionsForm.mockResolvedValue({});
  setOS('ios');
});

afterAll(() => setOS('ios'));

describe('resolveAdConsent', () => {
  it('personalises only with UMP and ATT consent, in UMP → ATT → init order', async () => {
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: true,
      personalized: true,
    });
    expect(mockCalls).toEqual(['ump', 'att', 'init']);
  });

  it('stays non-personalised when tracking is denied', async () => {
    mockAtt.request.mockResolvedValue({ status: 'denied' });
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: true,
      personalized: false,
    });
  });

  it('respects an earlier ATT answer without asking again', async () => {
    mockAtt.get.mockResolvedValue({ status: 'denied' });
    const result = await resolveAdConsent();
    expect(result.personalized).toBe(false);
    expect(mockAtt.request).not.toHaveBeenCalled();
  });

  it('does not ask for tracking when UMP consent does not allow personalisation', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'OBTAINED',
      canRequestAds: true,
    });
    mockUmp.getUserChoices.mockResolvedValue({
      selectPersonalisedAds: false,
      storeAndAccessInformationOnDevice: true,
    });
    const result = await resolveAdConsent();
    expect(result).toMatchObject({ canRequestAds: true, personalized: false });
    // A tracking permission that would not be used must not be requested.
    expect(mockAtt.get).not.toHaveBeenCalled();
    expect(mockAtt.request).not.toHaveBeenCalled();
  });

  it('requires device-storage consent as well as the personalisation purpose', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'OBTAINED',
      canRequestAds: true,
    });
    mockUmp.getUserChoices.mockResolvedValue({
      selectPersonalisedAds: true,
      storeAndAccessInformationOnDevice: false,
    });
    expect((await resolveAdConsent()).personalized).toBe(false);
  });

  it('personalises with obtained UMP consent and ATT', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'OBTAINED',
      canRequestAds: true,
    });
    expect((await resolveAdConsent()).personalized).toBe(true);
  });

  it('treats an unresolved UMP status as no personalisation', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'REQUIRED',
      canRequestAds: true,
    });
    const result = await resolveAdConsent();
    expect(result.personalized).toBe(false);
    expect(mockAtt.request).not.toHaveBeenCalled();
  });

  it('requests no ads at all when UMP forbids it', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'REQUIRED',
      canRequestAds: false,
    });
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: false,
      personalized: false,
    });
  });

  it('falls back to non-personalised ads when UMP fails, still initialising the SDK', async () => {
    mockUmp.gatherConsent.mockRejectedValue(new Error('no consent message'));
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: true,
      personalized: false,
    });
    expect(mockAtt.request).not.toHaveBeenCalled();
    expect(mockCalls).toContain('init');
  });

  it('requests no ads when the SDK fails to initialise', async () => {
    mockInitialize.mockRejectedValue(new Error('init failed'));
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: false,
      personalized: false,
    });
  });

  it('never shows the ATT prompt on Android; personalisation follows UMP', async () => {
    setOS('android');
    await expect(resolveAdConsent()).resolves.toMatchObject({
      canRequestAds: true,
      personalized: true,
    });
    expect(mockAtt.get).not.toHaveBeenCalled();
    expect(mockAtt.request).not.toHaveBeenCalled();
  });

  it('runs the flow once however many times it is requested', async () => {
    await Promise.all([
      resolveAdConsent(),
      resolveAdConsent(),
      resolveAdConsent(),
    ]);
    expect(mockCalls.filter(c => c === 'ump')).toHaveLength(1);
  });
});

const savedDiagnostics = async () =>
  JSON.parse((await AsyncStorage.getItem(AD_CONSENT_STATE_KEY)) ?? 'null');

describe('privacy options and diagnostics', () => {
  it('flags when UMP requires a privacy-options entry point', async () => {
    mockUmp.gatherConsent.mockResolvedValue({
      status: 'OBTAINED',
      canRequestAds: true,
      privacyOptionsRequirementStatus: 'REQUIRED',
    });
    expect((await resolveAdConsent()).privacyOptionsRequired).toBe(true);
  });

  it('does not flag it outside regulated regions', async () => {
    expect((await resolveAdConsent()).privacyOptionsRequired).toBe(false);
  });

  it('records a non-identifying summary of the last run', async () => {
    await resolveAdConsent();
    const saved = await savedDiagnostics();
    expect(saved).toMatchObject({
      umpStatus: 'NOT_REQUIRED',
      umpError: null,
      trackingChecked: true,
      trackingAllowed: true,
      result: { canRequestAds: true, personalized: true },
    });
    expect(typeof saved.at).toBe('string');
  });

  it('records why UMP failed, so a silent fallback can be diagnosed', async () => {
    mockUmp.gatherConsent.mockRejectedValue(
      new Error('Publisher misconfiguration: no consent message configured')
    );
    await resolveAdConsent();
    const saved = await savedDiagnostics();
    expect(saved.umpError).toMatch(/Publisher misconfiguration/);
    expect(saved.trackingChecked).toBe(false);
    expect(saved.result.personalized).toBe(false);
  });

  it('opens the privacy-options form and recomputes consent from the new choice', async () => {
    expect((await resolveAdConsent()).personalized).toBe(true);

    mockUmp.gatherConsent.mockResolvedValue({
      status: 'OBTAINED',
      canRequestAds: true,
      privacyOptionsRequirementStatus: 'REQUIRED',
    });
    mockUmp.getUserChoices.mockResolvedValue({
      selectPersonalisedAds: false,
      storeAndAccessInformationOnDevice: true,
    });

    const updated = await openPrivacyOptions();
    expect(mockCalls).toContain('privacy-form');
    expect(mockCalls.filter(c => c === 'ump')).toHaveLength(2);
    expect(updated.personalized).toBe(false);
  });
});
