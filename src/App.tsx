import "react-native-gesture-handler";

import * as React from "react";
import { registerRootComponent } from "expo";
import { defineMessages } from "react-intl";

import { IntlProvider } from "./contexts/IntlContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { NavigationContainer } from "./navigation/NavigationContainer";
import { SyncProvider } from "./contexts/SyncContext";

const m = defineMessages({
  firstMessage: {
    id: "app.firstMessage",
    defaultMessage: "This is a test",
    description: "Used as a tester",
  },
});

export default function App() {
  return (
    <PermissionsProvider>
      <IntlProvider>
        <SyncProvider>
          <NavigationContainer />
        </SyncProvider>
      </IntlProvider>
    </PermissionsProvider>
  );
}

registerRootComponent(App);
