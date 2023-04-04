import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import { colors, spacing } from "../../lib/styles";
import { SyncScreenComponent } from "../../sharedTypes";
import { DevicesList } from "./DevicesList";
import { ProjectInfo } from "./ProjectInfo";

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

export const SyncScreen: SyncScreenComponent<"Sync"> = () => {
  const [viewMode, setViewMode] = React.useState<"list" | "bubbles">("list");

  return (
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
      <DevicesList />
    </ScrollView>
  );
};

SyncScreen.navTitle = m.navTitle;
