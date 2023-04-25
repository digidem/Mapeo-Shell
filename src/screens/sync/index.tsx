import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import { colors, spacing } from "../../lib/styles";
import { ScreenComponent } from "../../sharedTypes";
import { Devices } from "./Devices";
import { ProjectInfo } from "./ProjectInfo";

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
  const { role } = route.params;
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <ProjectInfo
        name="Catapult"
        viewMode={viewMode}
        toggleViewMode={() => {
          setViewMode((prev) => (prev === "list" ? "bubbles" : "list"));
        }}
      />
      <Devices mode={viewMode} role={role} />
    </ScrollView>
  );
};

SyncScreen.navTitle = m.navTitle;
