import { forwardRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { BottomSheetModal } from "./BottomSheetModal";
import { BottomSheetModal as SheetRef } from "@gorhom/bottom-sheet";

export type TitleAndDescription = {
  title: string;
  description: string;
};

export const SyncGroupBottomSheet = forwardRef<
  SheetRef,
  { content: TitleAndDescription }
>(({ content }, sheetRef) => {
  return (
    <BottomSheetModal ref={sheetRef}>
      <View style={styles.btmSheetContainer}>
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
    </BottomSheetModal>
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
