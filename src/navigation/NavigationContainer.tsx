import {
  NavigationContainer as NativeNavContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Home } from "../screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Bar } from "../screens/sync/Bar";
import { ProjectCoordinator } from "../screens/projectInvite/ProjectCoordinator";

export type Drawers = {
  Home: undefined;
  Sync: NavigatorScreenParams<SyncScreens>;
  ProjectInvite: NavigatorScreenParams<ProjectInviteScreens>;
};

export type SyncScreens = {
  Bar: undefined;
};

export type ProjectInviteScreens = {
  ProjectCoordinator: undefined;
};

const Drawer = createDrawerNavigator<Drawers>();

export const NavigationContainer = () => {
  return (
    <NativeNavContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
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

const SyncScreensStack = () => {
  return (
    <SyncStack.Navigator>
      <SyncStack.Screen name="Bar" component={Bar} />
    </SyncStack.Navigator>
  );
};

const ProjectInviteStack = createNativeStackNavigator<ProjectInviteScreens>();

const ProjectInviteScreensStack = () => {
  return (
    <ProjectInviteStack.Navigator>
      <ProjectInviteStack.Screen
        name="ProjectCoordinator"
        component={ProjectCoordinator}
      />
    </ProjectInviteStack.Navigator>
  );
};
