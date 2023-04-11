import GorhomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text } from "./Text";
import { defineMessages } from "react-intl";
import { Spacer } from "./Spacer";

const m = defineMessages({
  localDevices: {
    id: "components.SyncGroupBottomSheet.localDevices",
    defaultMessage: "Local Devices",
  },
});

export type BottomSheetRef = BottomSheetMethods;

export type TitleAndDescription = {
  title: string;
  description: string;
};

export const SyncGroupBottomSheet = forwardRef<
  BottomSheetRef,
  { content: TitleAndDescription }
>(({ content }, ref) => {
  const [snapPoints, setSnapPoints] = useState<(number | string)[]>([0, "40%"]);

  return (
    <GorhomSheet
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleHeight={0}
      handleComponent={() => null}
      index={-1}
    >
      <View
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout;
          setSnapPoints([0, height]);
        }}
        style={styles.btmSheetContainer}
      >
        <Image
          style={{ height: 80, width: 80, resizeMode: "contain" }}
          source={require("../../assets/questionMark.png")}
        />
        <Spacer size={20} direction="vertical" />
        <Text size="medium">{content.title}</Text>
        <Spacer size={20} direction="vertical" />
        <Text textAlign="center" size="small">
          {content.description}
        </Text>
        <Spacer size={20} direction="vertical" />
      </View>
    </GorhomSheet>
  );
});

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
