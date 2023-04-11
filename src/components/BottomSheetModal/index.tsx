import * as React from "react";
import { BackHandler, StyleSheet } from "react-native";
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";

const INITIAL_SNAP_POINTS = ["CONTENT_HEIGHT"];

export function useBottomSheetModal({ openOnMount }: { openOnMount: boolean }) {
  const initiallyOpenedRef = React.useRef(false);
  const sheetRef = React.useRef<RNBottomSheetModal>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.dismiss();
      setIsOpen(false);
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
      setIsOpen(true);
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return { sheetRef, closeSheet, openSheet, isOpen };
}

function useBackPressHandler(onHardwareBackPress?: () => void | boolean) {
  React.useEffect(() => {
    const onBack = () => {
      if (onHardwareBackPress) {
        const backPress = onHardwareBackPress();
        if (typeof backPress === "boolean") {
          return backPress;
        }
      }

      // We don't allow the back press to navigate/dismiss this modal by default
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBack);

    return () => BackHandler.removeEventListener("hardwareBackPress", onBack);
  }, [onHardwareBackPress]);
}

interface Props extends React.PropsWithChildren<{}> {
  onDismiss: () => void;
  onHardwareBackPress?: () => void | boolean;
  snapPoints?: (string | number)[];
  disableBackdropPress?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({ children, onDismiss, onHardwareBackPress, disableBackdropPress }, ref) => {
    useBackPressHandler(onHardwareBackPress);

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(INITIAL_SNAP_POINTS);

    return (
      <RNBottomSheetModal
        ref={ref}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.3}
            pressBehavior={disableBackdropPress ? "none" : "close"}
          />
        )}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}
        onDismiss={onDismiss}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={false}
      >
        <BottomSheetView
          onLayout={handleContentLayout}
          style={styles.bottomSheetView}
        >
          {children}
        </BottomSheetView>
      </RNBottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});
