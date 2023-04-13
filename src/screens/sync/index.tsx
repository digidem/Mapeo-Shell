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
  DeviceInfoSyncingContent,
} from "../../components/DeviceInfoSyncingContent";
import { SyncContext } from "../../contexts/SyncContext";

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
    "syncGroup" | "deviceInfoSyncing" | "deviceInfo"
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

  const [allSyncs] = React.useContext(SyncContext);

  function setAndOpenSyncGroupModal(titleAndDescription: TitleAndDescription) {
    setSyncGroupContent(titleAndDescription);
    setModalContent("syncGroup");
    openSheet();
  }

  function setAndOpenDeviceInfoModal(deviceInfo: DeviceInfo) {
    const isSyncing = Object.values(allSyncs).some((val) => {
      return val[deviceInfo.deviceId] && val[deviceInfo.deviceId] !== "idle";
    });

    if (isSyncing) {
      setModalContent("deviceInfoSyncing");
      setDeviceInfoContent(deviceInfo);
      openSheet();
      return;
    }
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
        ) : modalContent === "deviceInfoSyncing" ? (
          <DeviceInfoSyncingContent content={deviceInfoContent} />
        ) : null}
      </BottomSheetModal>
    </React.Fragment>
  );
};

SyncScreen.navTitle = m.navTitle;
