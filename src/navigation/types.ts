import { NavigatorScreenParams } from '@react-navigation/native';

export type AppTabParamList = {
  Home: undefined;
  Categories: { reset?: boolean; collection?: string } | undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  ProductDetails: { productId: string };
  Notifications: undefined;
};
