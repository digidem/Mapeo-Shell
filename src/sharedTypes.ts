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
