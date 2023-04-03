import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageDescriptor } from "react-intl";

import { SyncScreens } from "./navigation/NavigationContainer";

export type SyncScreenComponent<ScreenName extends keyof SyncScreens> =
  React.FC<NativeStackScreenProps<SyncScreens, ScreenName>> & {
    navTitle: MessageDescriptor;
  };
