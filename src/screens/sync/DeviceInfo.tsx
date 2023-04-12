import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Role } from ".";
import { Text } from "../../components/Text";
import { defineMessages, useIntl } from "react-intl";
import { Spacer } from "../../components/Spacer";
import { colors, spacing } from "../../lib/styles";
import { Button } from "../../components/Button";
import { Peer } from "../../sharedTypes";

const m = defineMessages({
  // Intl.PluralRules not supported by Hermes (https://github.com/facebook/hermes/blob/main/doc/IntlAPIs.md)
  // Easier to just do separate strings than using @formatjs polyfills for our case
  // (https://formatjs.io/docs/polyfills/intl-pluralrules/)
  itemToSync: {
    id: "screens.sync.DeviceSyncInfo.itemToSync",
    defaultMessage: "1 item ready to sync",
  },
  itemsToSync: {
    id: "screens.sync.DeviceSyncInfo.itemsToSync",
    defaultMessage: "{count} items ready to sync",
  },
  lastSynced: {
    id: "screens.sync.DeviceSyncInfo.lastSynced",
    defaultMessage: "Last synced",
  },
  removeDevice: {
    id: "screens.sync.DeviceSyncInfo.removeDevice",
    defaultMessage: "Remove device",
  },
  close: {
    id: "screens.sync.DeviceSyncInfo.close",
    defaultMessage: "Close",
  },
});

interface Props {
  onClose: () => void;
  role: Role;
  peer: Peer;
}

export const DeviceInfo = ({ onClose, peer, role }: Props) => {
  const { formatMessage: t } = useIntl();

  const { deviceType, name, lastSynced, has, wants } = peer;

  const remainingSyncItems = wants - has;

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.deviceRowContainer}>
          <View style={styles.nameAndIcon}>
            <Image
              style={{ height: 80, width: 80, resizeMode: "contain" }}
              source={
                deviceType === "desktop"
                  ? require("../../../assets/desktop.png")
                  : require("../../../assets/mobile.png")
              }
            />
            <Spacer direction="horizontal" size={spacing.medium} />
            <Text size="small" bold numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={styles.lastSyncedContainer}>
            <Text size="small" color={colors.DARK_GRAY}>
              {t(m.lastSynced, { date: lastSynced })}
            </Text>
            <Text size="small" color={colors.DARK_GRAY}>
              {new Date(lastSynced).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
        <Spacer direction="vertical" size={spacing.large} />
        <View>
          {remainingSyncItems > 0 ? (
            <Text size="medium">
              {remainingSyncItems === 1
                ? t(m.itemToSync)
                : t(m.itemsToSync, { count: remainingSyncItems })}
            </Text>
          ) : null}
        </View>
        <Spacer direction="vertical" size={spacing.large} />
        {role === "coordinator" && (
          <Button
            asText
            type="destructive"
            variant="secondary"
            text="Remove device"
            iconName="trash-can-outline"
            onPress={() => {}}
          />
        )}
        <Spacer direction="vertical" size={spacing.large} />
      </View>
      <Button
        type="normal"
        variant="secondary"
        text="Close"
        fullWidth
        onPress={() => {
          onClose();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.large,
  },
  deviceRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameAndIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  lastSyncedContainer: {
    alignItems: "flex-end",
  },
});
