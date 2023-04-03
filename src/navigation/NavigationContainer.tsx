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

import { Home } from "../screens/Home";
import { Bar } from "../screens/sync/Bar";
import { ProjectCoordinator } from "../screens/projectInvite/ProjectCoordinator";
import { WHITE } from "../lib/styles";
import { CustomHeaderLeft } from "../components/CustomHeaderLeft";
import { CustomHeaderRight } from "../components/CustomHeaderRight";
import { Main } from "../screens/sync/Main";
import { useIntl } from "react-intl";

export type Drawers = {
  Home: undefined;
  Sync: NavigatorScreenParams<SyncScreens>;
  ProjectInvite: NavigatorScreenParams<ProjectInviteScreens>;
};

export type SyncScreens = {
  Main: undefined;
  Bar: undefined;
};

export type ProjectInviteScreens = {
  ProjectCoordinator: undefined;
};

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
  headerRight: () => <CustomHeaderRight toggleDrawer={toggleDrawer} />,
});

const Drawer = createDrawerNavigator<Drawers>();

export const NavigationContainer = () => {
  return (
    <NativeNavContainer>
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
      >
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ headerShown: true }}
        />
        <Drawer.Screen
          name="Sync"
          component={SyncScreensStack}
          options={{ headerTitle: "" }}
        />
        <Drawer.Screen
          name="ProjectInvite"
          component={ProjectInviteScreensStack}
        />
      </Drawer.Navigator>
    </NativeNavContainer>
  );
};

const SyncStack = createNativeStackNavigator<SyncScreens>();

const SyncScreensStack = ({
  navigation: { goBack, toggleDrawer },
}: DrawerScreenProps<Drawers, "Sync">) => {
  const { formatMessage: t } = useIntl();
  return (
    <SyncStack.Navigator
      screenOptions={() => StackNavigationOptions(goBack, toggleDrawer)}
    >
      <SyncStack.Screen
        name="Main"
        component={Main}
        options={{ headerTitle: t(Main.navTitle) }}
      />
      <SyncStack.Screen name="Bar" component={Bar} />
    </SyncStack.Navigator>
  );
};

const ProjectInviteStack = createNativeStackNavigator<ProjectInviteScreens>();

const ProjectInviteScreensStack = ({
  navigation: { goBack, toggleDrawer },
}: DrawerScreenProps<Drawers, "ProjectInvite">) => {
  return (
    <ProjectInviteStack.Navigator
      screenOptions={() => StackNavigationOptions(goBack, toggleDrawer)}
    >
      <ProjectInviteStack.Screen
        name="ProjectCoordinator"
        component={ProjectCoordinator}
      />
    </ProjectInviteStack.Navigator>
  );
};
