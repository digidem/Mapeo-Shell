import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import { colors, spacing } from "../../lib/styles";
import { ScreenComponent } from "../../sharedTypes";
import { DeviceList, Devices } from "./Devices";
import { ProjectInfo } from "./ProjectInfo";
import {
  SyncGroupBottomSheetContent,
  TitleAndDescription,
} from "../../components/SyncGroupBottomSheet";
import {
  BottomSheetModal,
  useBottomSheetModal,
} from "../../components/BottomSheetModal";
import {
  DeviceInfo,
  DeviceInfoContent,
} from "../../components/DeviceInfoContent";

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
  const { sheetRef, openSheet } = useBottomSheetModal({ openOnMount: false });
  const [modalContent, setModalContent] = React.useState<
    "syncGroup" | "deviceInfo"
  >("syncGroup");

  const [syncGroupContent, setSyncGroupContent] =
    React.useState<TitleAndDescription>({
      title: "",
      description: "",
    });

  const [deviceInfoContent, setDeviceInfoContent] = React.useState<DeviceInfo>({
    deviceId: "",
    deviceName: "",
    deviceType: "mobile",
  });

  function setAndOpenSyncGroupModal(titleAndDescription: TitleAndDescription) {
    setSyncGroupContent(titleAndDescription);
    setModalContent("syncGroup");
    openSheet();
  }

  function setAndOpenDeviceInfoModal(deviceInfo: DeviceInfo) {
    setModalContent("deviceInfo");
    setDeviceInfoContent(deviceInfo);
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
            <DeviceList
              setDeviceModal={setAndOpenDeviceInfoModal}
              setAndOpenModal={setAndOpenSyncGroupModal}
            />
          ) : null}
        </Devices>
      </ScrollView>
      <BottomSheetModal ref={sheetRef}>
        {modalContent === "syncGroup" ? (
          <SyncGroupBottomSheetContent content={syncGroupContent} />
        ) : (
          <DeviceInfoContent content={deviceInfoContent} />
        )}
      </BottomSheetModal>
    </React.Fragment>
  );
};

SyncScreen.navTitle = m.navTitle;
