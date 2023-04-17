import * as React from "react";
import { View } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "../../components/Text";
import { SyncGroupBottomSheetContent } from "../../components/SyncGroupBottomSheet";
import { spacing } from "../../lib/styles";
import { Role, ViewMode } from ".";
import {
  BottomSheetModal,
  useBottomSheetModal,
} from "../../components/BottomSheetModal";
import { DeviceInfo } from "./DeviceInfo";
import { generateData } from "../../lib/data";
import { Peer } from "../../sharedTypes";
import { DevicesList } from "./DevicesList";
import { AnimatedEllipsis } from "./AnimatedEllipsis";

const m = defineMessages({
  searching: {
    id: "screen.sync.Devices.searching",
    defaultMessage: "Searching for devices",
  },
  localDevices: {
    id: "screen.sync.Devices.localDevices",
    defaultMessage: "Local Devices",
  },
  localDeviceDescription: {
    id: "screen.sync.Devices.localDeviceDescription",
    defaultMessage:
      "These devices are on your project and on the same wifi network as you.",
  },
});

export const Devices = ({ mode, role }: { mode: ViewMode; role: Role }) => {
  const { formatMessage: t } = useIntl();
  const [peers] = React.useState(generateData(10));

  const [status, setStatus] = React.useState<"loading" | "idle">("loading");

  const [modalMode, setModalMode] = React.useState<
    { type: "info" } | { type: "device"; data: Peer } | null
  >(null);

  const { sheetRef, closeSheet, openSheet } = useBottomSheetModal({
    openOnMount: false,
  });

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
            onDevicePress={(peer: Peer) => {
              setModalMode({ type: "device", data: peer });
              openSheet();
            }}
          />
        ) : null}
      </View>
      <BottomSheetModal
        ref={sheetRef}
        disableBackdropPress={modalMode?.type === "device"}
      >
        {!modalMode ? null : modalMode.type === "info" ? (
          <SyncGroupBottomSheetContent
            content={{
              title: t(m.localDevices),
              description: t(m.localDeviceDescription),
            }}
          />
        ) : modalMode.type === "device" ? (
          <DeviceInfo
            onClose={() => closeSheet()}
            role={role}
            peer={modalMode.data}
          />
        ) : null}
      </BottomSheetModal>
    </>
  );
};
