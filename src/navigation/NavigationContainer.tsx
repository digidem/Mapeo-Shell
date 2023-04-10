import { NavigationContainer as NativeNavContainer } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useIntl } from "react-intl";

import { colors } from "../lib/styles";
import { CustomHeaderLeft } from "../components/CustomHeaderLeft";
import { CustomHeaderRight } from "../components/CustomHeaderRight";
import { Role, SyncScreen } from "../screens/sync";
import { HomeScreen } from "../screens/Home";

export type Screens = {
  Home: undefined;
  Sync: { role: Role };
};

const Stack = createNativeStackNavigator<Screens>();

export const NavigationContainer = () => {
  const { formatMessage: t } = useIntl();
  return (
    <NativeNavContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.MAPEO_DARK_BLUE },
          }}
        />
        <Stack.Screen
          name="Sync"
          component={SyncScreen}
          options={({
            navigation,
          }: {
            navigation: NativeStackNavigationProp<Screens>;
          }) => ({
            presentation: "card",
            headerTitle: t(SyncScreen.navTitle),
            contentStyle: { backgroundColor: colors.WHITE },
            headerStyle: { backgroundColor: colors.WHITE },
            headerLeft: (props) => (
              <CustomHeaderLeft
                headerBackButtonProps={props}
                goBack={navigation.goBack}
              />
            ),
            headerRight: () => (
              <CustomHeaderRight
                iconName="settings"
                onPress={() => {
                  navigation.navigate("Home");
                }}
              />
            ),
            // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
            // This **might** cause a problem for IOS
            // headerBackVisible: false,
          })}
        />
      </Stack.Navigator>
    </NativeNavContainer>
  );
};
