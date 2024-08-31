import AntDesign from "@expo/vector-icons/AntDesign";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

interface SearchBarProps {
  value: string;
  setValue: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, setValue }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={[styles.container, isFocused && styles.shadow]}>
      <AntDesign name="search1" size={20} color="black" />
      <TextInput
        placeholder="Search or add new friends"
        style={styles.input}
        value={value}
        onChangeText={setValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyLabel="Search"
        returnKeyType="search"
        placeholderTextColor={"#3D4353"}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => setValue("")}>
          <AntDesign name="closecircleo" size={18} color="#dc3545" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CEDBEA",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    gap: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
