import {
  NavigationContainer as NativeNavContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { useIntl } from "react-intl";

import { Bar } from "../screens/sync/Bar";
import { WHITE } from "../lib/styles";
import { CustomHeaderLeft } from "../components/CustomHeaderLeft";
import { CustomHeaderRight } from "../components/CustomHeaderRight";
import { Main } from "../screens/sync/Main";

export type Drawers = {
  Sync: NavigatorScreenParams<SyncScreens>;
};

export type SyncScreens = {
  Main: undefined;
  Bar: undefined;
};

export type ProjectInviteScreens = {
  ProjectCoordinator: undefined;
};

// The drawer navigation is hidden in the UI. Currently the user only see the Sync Nav (Native Stack).
// And the drawer is inaccessible to the user.
// Im leaving the drawer navigation in because it is undecided whether we will be using it in the future.
export const createBaseStackNavigationOptions = (
  goBack: () => void
): NativeStackNavigationOptions => ({
  presentation: "card",
  contentStyle: { backgroundColor: WHITE },
  headerStyle: { backgroundColor: WHITE },
  // headerLeft: (props: HeaderButtonProps) => (
  //   <CustomHeaderLeft headerBackButtonProps={props} goBack={goBack} />
  // ),
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
});

const Drawer = createDrawerNavigator<Drawers>();

export const NavigationContainer = () => {
  return (
    <NativeNavContainer>
      <Drawer.Navigator
        screenOptions={{ headerShown: false, swipeEnabled: false }}
        initialRouteName="Sync"
      >
        <Drawer.Screen name="Sync" component={SyncScreensStack} />
      </Drawer.Navigator>
    </NativeNavContainer>
  );
};

const SyncStack = createNativeStackNavigator<SyncScreens>();

const SyncScreensStack = ({
  navigation: { goBack },
}: DrawerScreenProps<Drawers, "Sync">) => {
  const { formatMessage: t } = useIntl();

  const screenOptions = {
    ...createBaseStackNavigationOptions(goBack),
    headerRight: () => <CustomHeaderRight iconName={"settings"} />,
  };

  return (
    <SyncStack.Navigator screenOptions={screenOptions}>
      <SyncStack.Screen
        name="Main"
        component={Main}
        options={{ headerTitle: t(Main.navTitle) }}
      />
      <SyncStack.Screen name="Bar" component={Bar} />
    </SyncStack.Navigator>
  );
};
