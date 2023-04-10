import GorhomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text } from "./Text";

const MIN_SHEET_HEIGHT = 400;

export type BottomSheetRef = BottomSheetMethods;

export const SyncGroupBottomSheet = forwardRef<BottomSheetRef, {}>(
  ({}, ref) => {
    const [snapPoints, setSnapPoints] = useState<(number | string)[]>([
      MIN_SHEET_HEIGHT,
      "40%",
    ]);

    return (
      <GorhomSheet
        ref={ref}
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose={true}
        handleComponent={() => null}
        index={-1}
        snapPoints={snapPoints}
      >
        <View
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            //setSnapPoints([MIN_SHEET_HEIGHT, height]);
          }}
          style={styles.btmSheetContainer}
        >
          <Text size="medium">Hello</Text>
          <Text size="small">
            These devices are on your project and on the same wifi as you
          </Text>
        </View>
      </GorhomSheet>
    );
  }
);

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
