import {NativeStackScreenProps} from '@react-navigation/native-stack';
export enum RootScreens {
  SignUp = 'SignUp',
  Verify = 'Verify',
}

export type RootStackParamList = {
  [RootScreens.SignUp]: undefined;
  [RootScreens.Verify]: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
