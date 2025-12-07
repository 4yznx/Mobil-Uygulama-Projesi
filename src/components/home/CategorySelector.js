import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CategorySelector({
  categories,
  selected,
  onSelect,
  disabled,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Kategori Seç</Text>

      <View style={styles.categoryBox}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catBtn,
              selected === cat && styles.catBtnActive,
              disabled && { opacity: 0.5 },
            ]}
            onPress={() => !disabled && onSelect(cat)}
          >
            <Text
              style={[styles.catText, selected === cat && styles.catTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "white",
  },

  categoryBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 10,
  },

  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
  },

  catBtnActive: {
    backgroundColor: "",
    borderColor: "grey",
  },

  catText: {
    fontSize: 15,
  },

  catTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});
