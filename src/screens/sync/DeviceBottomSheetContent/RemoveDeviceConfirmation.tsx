import * as React from "react";
import { StyleSheet, View } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Spacer } from "../../../components/Spacer";
import { Text } from "../../../components/Text";
import { BottomSheetContent } from "../../../components/BottomSheetModal";
import { colors, spacing } from "../../../lib/styles";
import { Peer } from "../../../sharedTypes";

const m = defineMessages({
  removeDevice: {
    id: "screens.sync.DeviceBottomSheetContent.RemoveDeviceConfirmation.removeDevice",
    defaultMessage: "Remove Device",
  },
  cancel: {
    id: "screens.sync.DeviceBottomSheetContent.RemoveDeviceConfirmation.cancel",
    defaultMessage: "Cancel",
  },
  removeConfirmationTitle: {
    id: "screens.sync.DeviceBottomSheetContent.RemoveDeviceConfirmation.removeConfirmaitionTitle",
    defaultMessage: "Are you sure you want to remove {name}?",
  },
  removeConfirmationDescription: {
    id: "screens.sync.DeviceBottomSheetContent.RemoveDeviceConfirmation.removeConfirmationDescription",
    defaultMessage:
      "{name} will be unable to sync to the project and other devices will be unable to sync with them.",
  },
});

export const RemoveDeviceConfirmation = ({
  peer,
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  peer: Peer;
}) => {
  const { formatMessage: t } = useIntl();
  return (
    <BottomSheetContent
      primaryButtonConfig={{
        text: t(m.removeDevice),
        onPress: onConfirm,
        type: "destructive",
      }}
      secondaryButtonConfig={{
        text: t(m.cancel),
        onPress: onCancel,
      }}
    >
      <View style={styles.container}>
        <MaterialIcon
          size={80}
          name="alert-circle"
          color={colors.WARNING_RED}
        />
        <Spacer size={spacing.large} direction="vertical" />
        <Text size="large" textAlign="center" bold>
          {t(m.removeConfirmationTitle, { name: peer.name || peer.deviceId })}
        </Text>
        <Spacer size={spacing.large} direction="vertical" />
        <Text size="medium" textAlign="center">
          {t(m.removeConfirmationDescription, {
            name: `${peer.name} (${peer.deviceId})`,
          })}
        </Text>
      </View>
    </BottomSheetContent>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
