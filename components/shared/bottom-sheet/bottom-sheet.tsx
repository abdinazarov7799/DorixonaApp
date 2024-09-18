import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {BottomSheetBackdropProps} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import {PropsWithChildren, useCallback} from "react";

type BottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	snap?: string;
} & PropsWithChildren<unknown>;

export const BaseBottomSheet = ({
	bottomSheetRef,
	children,
	snap = "45%",
}: BottomSheetProps) => {
	const snapPoints = [snap];
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);
	return (
		<>
			<BottomSheetModal
				ref={bottomSheetRef}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetScrollView>{children}</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
};
