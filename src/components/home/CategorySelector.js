import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CategorySelector({
  categories,
  selected,
  onSelect,
  onAddPress,
  onDeletePress,
  disabled,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Kategori Seç</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catBtn,
              selected === cat && styles.catBtnActive,
              disabled && { opacity: 0.5 },
            ]}
            onPress={() => !disabled && onSelect(cat)}
            onLongPress={() => !disabled && onDeletePress(cat)}
            delayLongPress={500}
          >
            <Text
              style={[styles.catText, selected === cat && styles.catTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.catBtn, styles.addBtn, disabled && { opacity: 0.5 }]}
          onPress={onAddPress}
          disabled={disabled}
        >
          <Ionicons name="add-outline" size={26} color="#555" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: "center",
    height: 60,
  },
  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,

    borderWidth: 1,
    borderColor: "#eee",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: 50,
    paddingHorizontal: 0,
    backgroundColor: "#F5F5F5",
    borderColor: "#ccc",
    borderStyle: "solid",
  },
  catBtnActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.4,
    elevation: 4,
  },
  catText: {
    color: "#444",
    fontSize: 15,
    fontWeight: "500",
  },
  catTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  hintText: {
    fontSize: 11,
    color: "#999",
    marginTop: 5,
  },
});
