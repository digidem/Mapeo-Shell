import * as React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { colors, spacing } from "../lib/styles";
import { defineMessages, useIntl } from "react-intl";

import { Spacer } from "../components/Spacer";
import { Text } from "../components/Text";
import { ScreenComponent } from "../sharedTypes";

const m = defineMessages({
  title: {
    id: "screen.Home.title",
    defaultMessage: "Mapeo Mobile Testing",
  },
  subtitle: {
    id: "screen.Home.subtitle",
    defaultMessage: "Sync",
  },
  coordinatorButtonText: {
    id: "screen.Home.coordinatorButtonText",
    defaultMessage: "Sync (as Coordinator)",
  },
  participantButtonText: {
    id: "screen.Home.participantButtonText",
    defaultMessage: "Sync (as Participant)",
  },
});

const navButtonStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.WHITE,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    backgroundColor: colors.LIGHT_GRAY,
    paddingVertical: spacing.large * 1.5,
    paddingHorizontal: spacing.large * 2,
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: spacing.large,
  },
});

const NavButton = ({
  onPress,
  leftText,
  rightText,
}: {
  onPress: () => void;
  leftText: string;
  rightText: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={navButtonStyles.container}
      android_ripple={{
        color: colors.LIGHT_BLUE,
        radius: 200,
        foreground: true,
      }}
    >
      <View style={navButtonStyles.leftContainer}>
        <Text size="large" bold>
          {leftText}
        </Text>
      </View>
      <View style={navButtonStyles.rightContainer}>
        <Text size="medium" textAlign="center" bold numberOfLines={1}>
          {rightText}
        </Text>
      </View>
    </Pressable>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.large * 4,
    paddingHorizontal: spacing.large * 2,
  },
});

export const HomeScreen: ScreenComponent<"Home"> = ({ navigation }) => {
  const { formatMessage: t } = useIntl();

  return (
    <View style={screenStyles.container}>
      <Text size="large" bold color={colors.WHITE} textAlign="center">
        {t(m.title)}
      </Text>
      <Text size="large" color={colors.WHITE} textAlign="center">
        {t(m.subtitle)}
      </Text>
      <Spacer direction="vertical" size={spacing.large * 2} />
      <NavButton
        leftText="1"
        rightText={t(m.coordinatorButtonText)}
        onPress={() => {
          navigation.navigate("Sync", { role: "coordinator" });
        }}
      />
      <Spacer direction="vertical" size={spacing.large * 2} />
      <NavButton
        leftText="2"
        rightText={t(m.participantButtonText)}
        onPress={() => {
          navigation.navigate("Sync", { role: "participant" });
        }}
      />
    </View>
  );
};
