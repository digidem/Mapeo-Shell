import * as React from "react";
import { View } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "../../components/Text";
import {
  BottomSheetModal,
  useBottomSheetModal,
} from "../../components/BottomSheetModal";
import { spacing } from "../../lib/styles";
import { Role, ViewMode } from ".";
import { DeviceBottomSheetContent } from "./DeviceBottomSheetContent";
import { generateData } from "../../lib/data";
import { Peer } from "../../sharedTypes";
import { AnimatedEllipsis } from "./AnimatedEllipsis";
import { DevicesList } from "./DevicesList";
import { LocalDevicesInfo } from "./LocalDevicesInfo";
import { DeviceInfoSyncingContent } from "../../components/DeviceInfoSyncingContent";

const m = defineMessages({
  searching: {
    id: "screen.sync.Devices.searching",
    defaultMessage: "Searching for devices",
  },
});

export const Devices = ({ mode, role }: { mode: ViewMode; role: Role }) => {
  const { formatMessage: t } = useIntl();
  const [peers, setPeers] = React.useState(generateData(10));

  const [status, setStatus] = React.useState<"loading" | "idle">("loading");

  const [modalMode, setModalMode] = React.useState<
    { type: "info" } | { type: "device" | "deviceSyncing"; data: Peer } | null
  >(null);

  const { sheetRef, closeSheet, openSheet } = useBottomSheetModal({
    openOnMount: false,
  });

  function handleDevicePress(syncIsIdle: boolean, peer: Peer) {
    if (syncIsIdle) {
      setModalMode({ type: "device", data: peer });
      openSheet();
      return;
    }

    setModalMode({ type: "deviceSyncing", data: peer });
    openSheet();
  }

  useFocusEffect(
    React.useCallback(() => {
      setStatus("loading");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, [])
  );

  return (
    <>
      <View style={{ paddingVertical: spacing.large }}>
        {status === "loading" ? (
          <View>
            <Text size="large" bold textAlign="center">
              {t(m.searching)}
              <AnimatedEllipsis />
            </Text>
          </View>
        ) : mode === "list" ? (
          <DevicesList
            peers={peers}
            onInfoPress={() => {
              setModalMode({ type: "info" });
              openSheet();
            }}
            onDevicePress={handleDevicePress}
          />
        ) : null}
      </View>
      <BottomSheetModal
        ref={sheetRef}
        disableBackdropPress={modalMode?.type === "device"}
      >
        {!modalMode ? null : modalMode.type === "info" ? (
          <LocalDevicesInfo />
        ) : modalMode.type === "device" ? (
          <DeviceBottomSheetContent
            onClose={() => closeSheet()}
            onRemoveDevice={() => {
              setPeers((prev) =>
                prev.filter(({ id }) => modalMode.data.id !== id)
              );
            }}
            role={role}
            peer={modalMode.data}
          />
        ) : modalMode.type === "deviceSyncing" ? (
          <DeviceInfoSyncingContent peer={modalMode.data} />
        ) : null}
      </BottomSheetModal>
    </>
  );
};
