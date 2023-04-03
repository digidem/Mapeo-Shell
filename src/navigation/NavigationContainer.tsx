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

import { Bar } from "../screens/sync/Bar";
import { WHITE } from "../lib/styles";
import { CustomHeaderLeft } from "../components/CustomHeaderLeft";

export type Drawers = {
  Sync: NavigatorScreenParams<SyncScreens>;
};

export type SyncScreens = {
  Bar: undefined;
};

// The drawer navigation is hidden in the UI. Currently the user only see the Sync Nav (Native Stack). And the drawer is inaccessible to the user. Im leaving the drawer navigation in because it is undecided whether we will be using it in the future.
export const StackNavigationOptions = (
  goBack: () => void,
  toggleDrawer: () => void
): NativeStackNavigationOptions => ({
  presentation: "card",
  contentStyle: { backgroundColor: WHITE },
  headerStyle: { backgroundColor: WHITE },
  headerLeft: (props: HeaderButtonProps) => (
    <CustomHeaderLeft headerBackButtonProps={props} goBack={goBack} />
  ),
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
  // uncomment if drawer nav is turned back on
  // headerRight: () => <CustomHeaderRight toggleDrawer={toggleDrawer} />,
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
  navigation: { goBack, toggleDrawer },
}: DrawerScreenProps<Drawers, "Sync">) => {
  return (
    <SyncStack.Navigator
      screenOptions={() => StackNavigationOptions(goBack, toggleDrawer)}
    >
      <SyncStack.Screen name="Bar" component={Bar} />
    </SyncStack.Navigator>
  );
};
