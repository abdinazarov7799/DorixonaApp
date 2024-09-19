import {TabBarIcon} from "./TabBarIcon";

export const Bars = ({onPress}: {onPress: () => void}) => {
	return (
		<TabBarIcon
			name={"bars"}
			style={{marginLeft: 15}}
			color={"#215ca0"}
			size={28}
			onPress={onPress}
		/>
	);
};
