import * as React from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../lib/styles";
import { Button } from "../Button";
import { Spacer } from "../Spacer";

type ButtonConfig = Pick<
  React.ComponentProps<typeof Button>,
  "onPress" | "text" | "type"
>;

interface Props
  extends React.PropsWithChildren<{
    primaryButtonConfig?: ButtonConfig;
    secondaryButtonConfig?: ButtonConfig;
  }> {}

export const BottomSheetContent = ({
  children,
  primaryButtonConfig,
  secondaryButtonConfig,
}: Props) => {
  return (
    <View style={styles.container}>
      <View>{children}</View>
      <Spacer direction="vertical" size={spacing.large} />
      <View style={styles.buttonsContainer}>
        {primaryButtonConfig && (
          <View style={styles.buttonWrapper}>
            <Button {...primaryButtonConfig} variant="primary" fullWidth />
          </View>
        )}
        {primaryButtonConfig && secondaryButtonConfig && (
          <Spacer direction="horizontal" size={spacing.medium} />
        )}
        {secondaryButtonConfig && (
          <View style={styles.buttonWrapper}>
            <Button {...secondaryButtonConfig} variant="secondary" fullWidth />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.large,
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
