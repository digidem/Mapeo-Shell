import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import { colors, spacing } from "../../lib/styles";
import { ScreenComponent } from "../../sharedTypes";
import { DeviceList, Devices } from "./Devices";
import { ProjectInfo } from "./ProjectInfo";
import {
  BottomSheetRef,
  SyncGroupBottomSheet,
} from "../../components/SyncGroupBottomSheet";

export type ViewMode = "list" | "bubbles";
export type Role = "coordinator" | "participant";

const m = defineMessages({
  navTitle: {
    id: "screen.sync.index.navTitle",
    defaultMessage: "Synchronize",
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  scrollContentContainer: {
    padding: spacing.large,
  },
});

export const SyncScreen: ScreenComponent<"Sync"> = ({ route }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const ref = React.useRef<BottomSheetRef>(null);

  function openRef() {
    console.log("This is being pressed");
    console.log(ref.current);
    ref.current?.snapToIndex(1);
  }

  return (
    <React.Fragment>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <ProjectInfo
          name="Project Catapult"
          viewMode={viewMode}
          toggleViewMode={() => {
            setViewMode((prev) => (prev === "list" ? "bubbles" : "list"));
          }}
        />
        <Devices>
          {viewMode === "list" ? <DeviceList openSheet={openRef} /> : null}
        </Devices>
      </ScrollView>
      <SyncGroupBottomSheet ref={ref} />
    </React.Fragment>
  );
};

SyncScreen.navTitle = m.navTitle;
