import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageDescriptor } from "react-intl";

import { Screens } from "./navigation/NavigationContainer";

export type ScreenComponent<ScreenName extends keyof Screens> = React.FC<
  NativeStackScreenProps<Screens, ScreenName>
> &
  // Home screen doesn't have a nav header
  (ScreenName extends "Home"
    ? {}
    : {
        navTitle: MessageDescriptor;
      });

export type Peer = {
  id: number;
  name: string;
  deviceId: string;
  deviceType: "desktop" | "mobile";
  has: number;
  wants: number;
  lastSynced: number;
  connectionType: "local" | "internet";
};
