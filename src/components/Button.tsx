import * as React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, spacing } from "../lib/styles";
import { Text, styles as textStyles } from "./Text";

const HIT_SLOP = {
  top: spacing.small,
  right: spacing.small,
  bottom: spacing.small,
  left: spacing.small,
};

interface ButtonProps extends React.PropsWithChildren {
  asText?: boolean;
  borderless?: boolean;
  fullWidth?: boolean;
  iconName?: React.ComponentProps<typeof MaterialIcon>["name"];
  onPress: (event: GestureResponderEvent) => void;
  text: string;
  type?: "destructive" | "normal";
  variant?: "primary" | "secondary";
}

export const Button = ({
  asText,
  borderless,
  fullWidth,
  iconName,
  onPress,
  text,
  type,
  variant,
}: ButtonProps) => {
  const buttonType = type || "normal";
  const buttonVariant = variant || "primary";

  const [width, setWidth] = React.useState<number>(0);

  const accentColor =
    buttonType === "normal" ? colors.MAPEO_BLUE : colors.WARNING_RED;

  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) => {
        if (layout.width) setWidth(layout.width);
      }}
    >
      <Pressable
        onPress={onPress}
        hitSlop={HIT_SLOP}
        android_ripple={
          !asText
            ? {
                color: colors.WHITE,
                radius: width,
                foreground: true,
              }
            : undefined
        }
        style={({ pressed }) => {
          return [
            styles.pressable,
            {
              flex: asText || !fullWidth ? 0 : 1,
              justifyContent: asText ? "flex-start" : "center",
              paddingVertical: asText ? 0 : spacing.medium,
              paddingHorizontal: asText ? 0 : spacing.large,
              backgroundColor:
                buttonVariant === "primary" ? accentColor : colors.WHITE,
              borderColor:
                buttonVariant === "primary" ? accentColor : colors.GRAY,
              borderWidth: asText || borderless ? 0 : 1,
              opacity: asText && pressed ? 0.4 : 1,
            },
          ];
        }}
      >
        {iconName && (
          <MaterialIcon
            name={iconName}
            size={textStyles.medium.fontSize}
            color={buttonVariant === "primary" ? colors.WHITE : accentColor}
            style={styles.icon}
          />
        )}
        <Text
          size="smallMedium"
          bold
          color={buttonVariant === "primary" ? colors.WHITE : accentColor}
        >
          {text}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.WHITE,
  },
  pressable: {
    flexDirection: "row",
    borderRadius: 4,
  },
  icon: {
    marginRight: spacing.small,
    paddingTop: spacing.small / 2,
  },
});
