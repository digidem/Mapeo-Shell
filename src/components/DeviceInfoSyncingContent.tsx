import { StyleSheet, View, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useContext } from "react";
import { defineMessages, useIntl } from "react-intl";

import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { SyncContext } from "../contexts/SyncContext";
import { colors } from "../lib/styles";
import { Observation, Peer } from "../sharedTypes";

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

export const DeviceInfoSyncingContent = ({ peer }: { peer: Peer }) => {
  const [allSyncs] = useContext(SyncContext);

  const isSyncing = Object.values(allSyncs).some((val) => {
    return val[peer.deviceId] && val[peer.deviceId] === "active";
  });

  const { formatMessage: t } = useIntl();

  const icon =
    peer.deviceType === "desktop"
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
            <Text size="small">{peer.name}</Text>
            <Text size="small">{peer.deviceId}</Text>
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
          type="uploads"
          observations={peer.has}
        />
        <ColumnContainer
          title={t(isSyncing ? m.downloading : m.downloads)}
          type="downloads"
          observations={peer.wants}
        />
      </View>
      <Spacer size={30} direction="vertical" />
    </View>
  );
};

const ColumnContainer = ({
  title,
  type,
  observations,
}: {
  title: string;
  type: "uploads" | "downloads";
  observations: Observation;
}) => {
  const { formatMessage: t } = useIntl();
  const arrow =
    type === "uploads"
      ? require("../../assets/arrowUp.png")
      : require("../../assets/arrowDown.png");
  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <Text size="medium">{title}</Text>
      <Spacer size={10} direction="vertical" />
      <View style={styles.numbersContainer}>
        <Image style={{ height: 30, resizeMode: "contain" }} source={arrow} />
        <View>
          <Text size={"small"}>{`${observations.media} ${t(m.media)}`}</Text>
          <Text size={"small"}>{`${observations.observations} ${t(
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
