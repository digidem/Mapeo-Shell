import * as React from "react";
import { View, StyleSheet } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Spacer } from "../../components/Spacer";
import { Text } from "../../components/Text";
import { colors, spacing } from "../../lib/styles";
import { ProgressBar } from "../../components/ProgressBar";
import { Button } from "../../components/Button";
import { Peer } from "../../sharedTypes";

const m = defineMessages({
  localDevices: {
    id: "screen.sync.DevicesList.localDevices",
    defaultMessage: "Local Devices",
  },
  sync: {
    id: "screen.sync.DevicesList.sync",
    defaultMessage: "Sync",
  },
  deviceName: {
    id: "screen.sync.DevicesList.deviceName",
    defaultMessage: "Device Name",
  },
  lastSynced: {
    id: "screen.sync.DevicesList.lastSynced",
    defaultMessage: "Last Synced",
  },
});

export const DevicesList = ({
  peers,
  onDevicePress,
  onInfoPress,
}: {
  peers: Peer[];
  onDevicePress: (peer: Peer) => void;
  onInfoPress: () => void;
}) => {
  const { formatMessage: t } = useIntl();
  const [shouldStart, setShouldStart] = React.useState(false);

  return (
    <View>
      <View style={styles.headerRowContainer}>
        <View style={styles.headerTitleContainer}>
          <Text size="medium" bold>
            {t(m.localDevices)}
          </Text>
          <Spacer direction="horizontal" size={spacing.medium} />
          <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
            <MaterialIcon name="help" size={14} color={colors.DARK_GRAY} />
          </TouchableOpacity>
        </View>
        <Button
          iconName="lightning-bolt"
          onPress={() => setShouldStart(true)}
          text={t(m.sync)}
        />
      </View>
      <View style={styles.listHeaderContainer}>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.deviceName)}
        </Text>
        <Text size="small" color={colors.DARK_GRAY}>
          {t(m.lastSynced)}
        </Text>
      </View>
      {peers.map((peer) => (
        <ProgressBar
          key={peer.id}
          deviceId={peer.deviceId}
          deviceType={peer.deviceType}
          deviceName={peer.name}
          date={new Date(peer.lastSynced).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          syncGroup="local"
          shouldStart={shouldStart}
          style={{ marginTop: 10 }}
          onPress={() => onDevicePress(peer)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.medium,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  infoButton: {
    borderRadius: 10,
    borderColor: colors.GRAY,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.medium,
  },
});
