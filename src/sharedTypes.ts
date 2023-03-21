import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageDescriptor } from "react-intl";

import {
  ProjectInviteScreens,
  SyncScreens,
} from "./navigation/NavigationContainer";

export type SyncScreenComponent<ScreenName extends keyof SyncScreens> =
  React.FC<NativeStackScreenProps<SyncScreens, ScreenName>> & {
    navTitle: MessageDescriptor;
  };

export type ProjectInviteScreenComponent<
  ScreenName extends keyof ProjectInviteScreens
> = React.FC<NativeStackScreenProps<ProjectInviteScreens, ScreenName>> & {
  navTitle: MessageDescriptor;
};
