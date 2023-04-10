import GorhomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text } from "./Text";

const MIN_SHEET_HEIGHT = 400;

export type BottomSheetRef = BottomSheetMethods;

export const SyncGroupBottomSheet = forwardRef<BottomSheetRef, {}>(
  ({}, ref) => {
    const [snapPoints, setSnapPoints] = useState<(number | string)[]>([
      "25%",
      "40%",
    ]);

    return (
      <GorhomSheet
        ref={ref}
        backdropComponent={null}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}
        index={-1}
        snapPoints={snapPoints}
      >
        <View style={styles.btmSheetContainer}>
          <Text size="medium">Hello</Text>
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
