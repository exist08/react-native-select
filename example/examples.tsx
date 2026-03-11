/**
 * Example usage of react-native-select
 * Copy any snippet into your own project.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Select, { darkTheme, type SelectOption } from "react-native-select";

// ─── 1. Basic string list ─────────────────────────────────────────────────────

export function BasicExample() {
  const [visible, setVisible] = useState(false);
  const [fruit, setFruit] = useState("apple");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>Fruit: {fruit}</Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={["apple", "banana", "cherry", "mango", "passion_fruit"]}
        selectedValue={fruit}
        onSelect={setFruit}
        onClose={() => setVisible(false)}
        title="Pick a fruit"
      />
    </View>
  );
}

// ─── 2. Object options (label / value) ───────────────────────────────────────

export function ObjectOptionsExample() {
  const [visible, setVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("us");

  const countries: SelectOption<string>[] = [
    { value: "us", label: "🇺🇸 United States" },
    { value: "gb", label: "🇬🇧 United Kingdom" },
    { value: "de", label: "🇩🇪 Germany" },
    { value: "jp", label: "🇯🇵 Japan" },
    { value: "in", label: "🇮🇳 India" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>
          Country: {countries.find((c) => c.value === countryCode)?.label}
        </Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={countries}
        selectedValue={countryCode}
        onSelect={setCountryCode}
        onClose={() => setVisible(false)}
        title="Select your country"
      />
    </View>
  );
}

// ─── 3. Dark theme ────────────────────────────────────────────────────────────

export function DarkThemeExample() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("system");

  return (
    <View style={[styles.container, { backgroundColor: "#111" }]}>
      <TouchableOpacity style={styles.triggerDark} onPress={() => setVisible(true)}>
        <Text style={{ color: "#fff" }}>Theme: {value}</Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={["light", "dark", "system"]}
        selectedValue={value}
        onSelect={setValue}
        onClose={() => setVisible(false)}
        title="Appearance"
        theme={darkTheme}
      />
    </View>
  );
}

// ─── 4. Custom brand theme ────────────────────────────────────────────────────

export function CustomThemeExample() {
  const [visible, setVisible] = useState(false);
  const [tier, setTier] = useState("pro");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>Plan: {tier}</Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={["free", "pro", "enterprise"]}
        selectedValue={tier}
        onSelect={setTier}
        onClose={() => setVisible(false)}
        title="Choose your plan"
        theme={{
          selectedOptionBackground: "#fef9c3",
          selectedOptionTextColor: "#b45309",
          titleColor: "#92400e",
        }}
      />
    </View>
  );
}

// ─── 5. With your own icons ───────────────────────────────────────────────────
// Uncomment and install react-native-vector-icons or @expo/vector-icons first.

// import Ionicons from "react-native-vector-icons/Ionicons";
//
// export function WithIconsExample() {
//   const [visible, setVisible] = useState(false);
//   const [sort, setSort] = useState("newest");
//
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
//         <Text style={styles.triggerText}>Sort: {sort}</Text>
//       </TouchableOpacity>
//
//       <Select
//         visible={visible}
//         options={["newest", "oldest", "popular", "price_low_high", "price_high_low"]}
//         selectedValue={sort}
//         onSelect={setSort}
//         onClose={() => setVisible(false)}
//         title="Sort by"
//         renderCloseIcon={() => <Ionicons name="close" size={22} color="#6b7280" />}
//         renderCheckIcon={() => <Ionicons name="checkmark" size={20} color="#3b82f6" />}
//       />
//     </View>
//   );
// }

// ─── 6. Loading state ─────────────────────────────────────────────────────────

export function LoadingExample() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const [loading] = useState(true); // swap with real fetch state

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>Open (loading...)</Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={[]}
        loading={loading}
        selectedValue={selected}
        onSelect={setSelected}
        onClose={() => setVisible(false)}
        title="Fetching options..."
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  trigger: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  triggerDark: {
    backgroundColor: "#374151",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  triggerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
