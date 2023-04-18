import * as React from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";

import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { spacing } from "../../lib/styles";

export { BottomSheetContent } from "./BottomSheetContent";

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

function usePreventBackAction(enable: boolean) {
  const navigation = useTypedNavigation();

  React.useEffect(() => {
    if (!enable) return;

    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      event.preventDefault();
    });

    return () => {
      unsubscribe();
    };
  }, [enable, navigation]);
}

interface Props extends React.PropsWithChildren<{}> {
  disableBackdropPress?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({ children, disableBackdropPress }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    usePreventBackAction(isOpen);

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
        onChange={(index) => {
          setIsOpen(index > -1);
        }}
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
    // Cannot use paddingVertical for some very strange reason
    // or else bottom-sheet sizing will not be consistent
    paddingTop: spacing.large * 1.5,
    paddingBottom: spacing.large * 1.5,
    paddingHorizontal: spacing.large,
  },
});
