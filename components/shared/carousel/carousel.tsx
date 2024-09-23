import React, {useRef} from "react";
import {
	View,
	Text,
	FlatList,
	Animated,
	Dimensions,
	Image,
	ViewStyle,
	NativeSyntheticEvent,
	NativeScrollEvent,
} from "react-native";
import {styled} from "nativewind";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const {width} = Dimensions.get("window");

type CardCarouselProps = {
	activeIndex: number;
	setActiveIndex: (index: number) => void;
	myCards: []
};

const CardCarousel = ({activeIndex, setActiveIndex,myCards}: CardCarouselProps) => {
	const scrollX = useRef(new Animated.Value(0)).current;
	const onMomentumScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const index = Math.floor(event.nativeEvent.contentOffset.x / (width - 57));
		setActiveIndex(index);
	};

	return (
		<View className="flex-1 ">
			{/* Carousel */}
			<FlatList
				data={myCards}
				keyExtractor={item => item.id.toString()}
				horizontal
				pagingEnabled
				contentContainerStyle={{
					gap: 8,
					paddingHorizontal: 16,
					paddingVertical: 12,
				}}
				showsHorizontalScrollIndicator={false}
				onScroll={Animated.event(
					[{nativeEvent: {contentOffset: {x: scrollX}}}],
					{useNativeDriver: false}
				)}
				onMomentumScrollEnd={onMomentumScrollEnd}
				renderItem={({item: {name, number}}) => (
					<StyledView
						style={{width: width - 48}}
						className="flex-row items-center rounded-lg bg-white p-4 flex-1"
					>
						<StyledView>
							<StyledText className="text-[13px] text-[#656E78]">
								{name} ····{String(number).slice(-4)}
							</StyledText>
						</StyledView>
						<StyledView className="max-h-8 h-8 max-w-12 w-12 ml-auto">
							<StyledImage
								resizeMode="contain"
								className="h-full w-full"
								source={
									number?.substring(0,4) == "8600"
										? require("@/assets/images/uzcard.png")
										: require("@/assets/images/humo.png")
								}
							/>
						</StyledView>
					</StyledView>
				)}
			/>

			{/* Dots Indicator */}
			<StyledView className="flex-row mt-2 mx-auto">
				{myCards.map((_, i) => (
					<View
						key={i}
						style={[
							$dot,
							{
								backgroundColor: i === activeIndex ? "black" : "gray",
							},
						]}
					/>
				))}
			</StyledView>
		</View>
	);
};

const $dot: ViewStyle = {
	height: 8,
	width: 8,
	marginHorizontal: 4,
	borderTopLeftRadius: 4,
	borderTopRightRadius: 4,
	borderBottomRightRadius: 4,
	borderBottomLeftRadius: 4,
};

export default CardCarousel;
