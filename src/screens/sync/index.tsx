import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import { colors, spacing } from "../../lib/styles";
import { ScreenComponent } from "../../sharedTypes";
import { DeviceList, Devices } from "./Devices";
import { ProjectInfo } from "./ProjectInfo";
import {
  SyncGroupBottomSheet,
  TitleAndDescription,
} from "../../components/SyncGroupBottomSheet";
import { useBottomSheetModal } from "../../components/BottomSheetModal";

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
  const [modalContent, setModalContent] = React.useState<TitleAndDescription>({
    title: "",
    description: "",
  });
  const { sheetRef, openSheet } = useBottomSheetModal({ openOnMount: false });

  function setAndOpenModal(titleAndDescription: TitleAndDescription) {
    setModalContent(titleAndDescription);
    openSheet();
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
          {viewMode === "list" ? (
            <DeviceList setAndOpenModal={setAndOpenModal} />
          ) : null}
        </Devices>
      </ScrollView>
      <SyncGroupBottomSheet content={modalContent} ref={sheetRef} />
    </React.Fragment>
  );
};

SyncScreen.navTitle = m.navTitle;
