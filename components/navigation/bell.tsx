import {useRouter} from "expo-router";
import {TabBarIcon} from "./TabBarIcon";

export const Bell = () => {
	const router = useRouter();
	const handleNavigate = () => {
		router.push("/notification");
	};
	return (
		<TabBarIcon
			name={"bells"}
			style={{marginRight: 15}}
			color={"#215ca0"}
			size={28}
			onPress={handleNavigate}
		/>
	);
};
