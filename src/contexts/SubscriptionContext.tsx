import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSubscription } from '../types';
import subscriptionService from '../services/subscription';

interface SubscriptionContextType {
  subscription: UserSubscription;
  isPro: boolean;
  purchaseMonthly: () => Promise<{ success: boolean; error?: string }>;
  purchaseLifetime: () => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: { isPro: false },
  isPro: false,
  purchaseMonthly: async () => ({ success: false }),
  purchaseLifetime: async () => ({ success: false }),
  restorePurchases: async () => ({ success: false }),
  isLoading: true,
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<UserSubscription>({
    isPro: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await subscriptionService.initialize();
      setSubscription(subscriptionService.getSubscription());
      setIsLoading(false);
    };
    init();

    const unsubscribe = subscriptionService.subscribe(sub => {
      setSubscription(sub);
    });
    return unsubscribe;
  }, []);

  const purchaseMonthly = async () => {
    setIsLoading(true);
    const result = await subscriptionService.purchaseMonthly();
    setIsLoading(false);
    return result;
  };

  const purchaseLifetime = async () => {
    setIsLoading(true);
    const result = await subscriptionService.purchaseLifetime();
    setIsLoading(false);
    return result;
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    const result = await subscriptionService.restorePurchases();
    setIsLoading(false);
    return result;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isPro: subscription.isPro,
        purchaseMonthly,
        purchaseLifetime,
        restorePurchases,
        isLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
export default SubscriptionContext;
