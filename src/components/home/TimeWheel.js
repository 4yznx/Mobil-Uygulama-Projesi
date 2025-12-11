import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Haptics from "expo-haptics";

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

export default function TimeWheel({ selectedMinutes, onTimeChange, onClose }) {
  const flatListRef = useRef(null);

  const [visualValue, setVisualValue] = useState(selectedMinutes);

  const minutesData = Array.from({ length: 60 }, (_, i) => i + 1);

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
      });
    });
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const validIndex = Math.max(0, Math.min(index, minutesData.length - 1));
    const newValue = minutesData[validIndex];

    if (newValue !== visualValue) {
      setVisualValue(newValue);
      Haptics.selectionAsync();
    }
  };

  const handlePressNumber = (number) => {
    onTimeChange(number);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={minutesData}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedMinutes - 1}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
        }}
        renderItem={({ item }) => {
          const isSelected = item === visualValue;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePressNumber(item)}
              style={[styles.item, { opacity: isSelected ? 1 : 0.3 }]}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: isSelected ? 60 : 35,
                    fontWeight: isSelected ? "800" : "500",
                    color: "#000000",
                    transform: [{ scale: isSelected ? 1.1 : 1 }],
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    textAlign: "center",
  },
});
