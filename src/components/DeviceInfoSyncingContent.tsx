import { StyleSheet, View, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useContext } from "react";
import { defineMessages, useIntl } from "react-intl";

import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { DeviceType } from "../screens/sync/Devices";
import { SyncContext } from "../contexts/SyncContext";
import { colors } from "../lib/styles";
import { getRandomNumberMax30 } from "../hooks/useSync";

const m = defineMessages({
  syncing: {
    id: "Components.DeviceInfoContents.syncing",
    defaultMessage: "Syncing",
  },
  uploading: {
    id: "Components.DeviceInfoContents.uploading",
    defaultMessage: "Uploading",
  },
  downloading: {
    id: "Components.DeviceInfoContents.downloading",
    defaultMessage: "Downloading",
  },
  uploads: {
    id: "Components.DeviceInfoContents.uploads",
    defaultMessage: "Uploads",
  },
  downloads: {
    id: "Components.DeviceInfoContents.downloads",
    defaultMessage: "Downloads",
  },
  media: {
    id: "Components.DeviceInfoContents.media",
    defaultMessage: "media",
  },
  observations: {
    id: "Components.DeviceInfoContents.observations",
    defaultMessage: "observations",
  },
});

export type DeviceInfo = {
  deviceType: DeviceType;
  deviceName: string;
  deviceId: string;
};

export const DeviceInfoSyncingContent = ({
  content,
}: {
  content: DeviceInfo;
}) => {
  const [allSyncs] = useContext(SyncContext);

  const isSyncing = Object.values(allSyncs).some((val) => {
    return val[content.deviceId] && val[content.deviceId] === "active";
  });

  const { formatMessage: t } = useIntl();

  const icon =
    content.deviceType === "desktop"
      ? require("../../assets/desktop.png")
      : require("../../assets/mobile.png");
  return (
    <View style={styles.btmSheetContainer}>
      <View
        style={[
          styles.topContainer,
          { justifyContent: isSyncing ? "space-between" : "flex-start" },
        ]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{ height: 80, width: 80, resizeMode: "contain" }}
            source={icon}
          />
          <Spacer size={10} direction="horizontal" />
          <View>
            <Text size="small">{content.deviceName}</Text>
            <Text size="small">{content.deviceId}</Text>
          </View>
        </View>

        {isSyncing && (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MaterialIcon name={"bolt"} size={45} color={colors.DARK_GRAY} />
            <View style={{ display: "flex" }}>
              <Text size="small">{`${t(m.syncing)}...`}</Text>
            </View>
          </View>
        )}
      </View>
      <Spacer size={30} direction="vertical" />
      <View style={styles.bottomContainer}>
        <ColumnContainer
          title={t(isSyncing ? m.uploading : m.uploads)}
          arrowDirection="up"
        />
        <ColumnContainer
          title={t(isSyncing ? m.downloading : m.downloads)}
          arrowDirection="down"
        />
      </View>
      <Spacer size={30} direction="vertical" />
    </View>
  );
};

const ColumnContainer = ({
  title,
  arrowDirection,
}: {
  title: string;
  arrowDirection: "up" | "down";
}) => {
  const { formatMessage: t } = useIntl();
  const arrow =
    arrowDirection === "up"
      ? require("../../assets/arrowUp.png")
      : require("../../assets/arrowDown.png");
  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <Text size="medium">{title}</Text>
      <Spacer size={10} direction="vertical" />
      <View style={styles.numbersContainer}>
        <Image style={{ height: 30, resizeMode: "contain" }} source={arrow} />
        <View>
          <Text size={"small"}>{`${getRandomNumberMax30()} ${t(
            m.media
          )}`}</Text>
          <Text size={"small"}>{`${getRandomNumberMax30()} ${t(
            m.observations
          )}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  topContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
  },
  numbersContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
