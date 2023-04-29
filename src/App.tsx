import "react-native-gesture-handler";

import * as React from "react";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { IntlProvider } from "./contexts/IntlContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { NavigationContainer } from "./navigation/NavigationContainer";
import { SyncProvider } from "./contexts/SyncContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  return (
    <PermissionsProvider>
      <IntlProvider>
        <SyncProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <NavigationContainer />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SyncProvider>
      </IntlProvider>
    </PermissionsProvider>
  );
}

registerRootComponent(App);
