# @exist08/react-native-select

> **The HTML `<select>` component React Native always deserved.**
> One import. Zero dependencies. Works exactly how you'd expect.

[![npm version](https://img.shields.io/npm/v/@exist08/react-native-select.svg)](https://www.npmjs.com/package/@exist08/react-native-select)
[![license](https://img.shields.io/npm/l/@exist08/react-native-select.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/@exist08/react-native-select.svg)](https://www.npmjs.com/package/@exist08/react-native-select)

If you've ever fought with `Picker`, installed three different dropdown libraries, or tried to style a `Modal` from scratch just to get a basic `<select>` — this is for you.

`react-native-select` is a **zero-dependency**, **fully typed**, **completely themeable** modal select component. It behaves the way HTML's `<select>` does: pick a value, done. No magic, no platform quirks, no forced icon libraries.

---

## Features

- 🎯 **Familiar API** — works just like `<select>` / `<option>` in HTML
- 🔷 **TypeScript generics** — use strings, numbers, enums, objects — anything
- 🎨 **Fully themeable** — light, dark, or your own brand colors
- 🔌 **Bring your own icons** — no `react-native-vector-icons` required
- 🧩 **Custom row rendering** — full control when you need it
- ♿ **Accessible** — proper roles, labels, and states throughout
- 🤖 **Android back button** — handled correctly via `onRequestClose`
- ✅ **Testable** — `testID` props on the card and every row

---

## Installation

```sh
npm install @exist08/react-native-select
# or
yarn add @exist08/react-native-select
```

No native modules. No linking. Just install and use.

---

## Quick Start

```tsx
import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Select from "@exist08/react-native-select";

export default function App() {
  const [visible, setVisible] = useState(false);
  const [fruit, setFruit] = useState("apple");

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>Selected: {fruit}</Text>
      </TouchableOpacity>

      <Select
        visible={visible}
        options={["apple", "banana", "cherry", "mango"]}
        selectedValue={fruit}
        onSelect={setFruit}
        onClose={() => setVisible(false)}
        title="Pick a fruit"
      />
    </View>
  );
}
```

---

## Options format

### Plain array (simplest)

```tsx
<Select options={["Option A", "Option B", "Option C"]} ... />
```

### Object array (label / value split)

Use this when your display label differs from the underlying value — enums, IDs, translated strings, etc.

```tsx
<Select
  options={[
    { value: "us", label: "United States" },
    { value: "gb", label: "United Kingdom" },
    { value: "de", label: "Germany" },
  ]}
  selectedValue="gb"
  onSelect={(code) => console.log(code)} // "us" | "gb" | "de"
  ...
/>
```

### Typed generics

```tsx
type Status = "active" | "inactive" | "pending";

<Select<Status>
  options={["active", "inactive", "pending"]}
  selectedValue={status}
  onSelect={(s: Status) => setStatus(s)}
  ...
/>
```

---

## Theming

### Dark mode

```tsx
import Select, { darkTheme } from "@exist08/react-native-select";

<Select theme={darkTheme} ... />
```

### Custom theme

Pass any subset — it's merged with `defaultTheme`.

```tsx
<Select
  theme={{
    cardBackground: "#0f172a",
    titleColor: "#e2e8f0",
    borderColor: "#1e293b",
    optionTextColor: "#cbd5e1",
    selectedOptionBackground: "#1e3a5f",
    selectedOptionTextColor: "#38bdf8",
    backdropColor: "rgba(0,0,0,0.8)",
  }}
  ...
/>
```

### Full `SelectTheme` interface

| Key | Description |
|-----|-------------|
| `cardBackground` | Modal card background color |
| `titleColor` | Header title text color |
| `borderColor` | Row divider and header border color |
| `optionTextColor` | Default option label color |
| `selectedOptionBackground` | Background of the selected row |
| `selectedOptionTextColor` | Text color of the selected row |
| `backdropColor` | Semi-transparent overlay color |

---

## Bring Your Own Icons

No icon library is bundled. The defaults are plain Unicode characters (✕ / ✓). Pass your own with render props:

```tsx
import Ionicons from "react-native-vector-icons/Ionicons";

<Select
  renderCloseIcon={() => <Ionicons name="close" size={22} color="#6b7280" />}
  renderCheckIcon={() => <Ionicons name="checkmark" size={20} color="#3b82f6" />}
  ...
/>
```

Works with any icon library: `@expo/vector-icons`, `react-native-vector-icons`, custom SVGs, emoji — anything that returns a `ReactNode`.

---

## Custom Row Rendering

Take over the entire row when you need full control:

```tsx
<Select
  options={users}
  renderItem={({ option, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.row, isSelected && styles.activeRow]}>
      <Avatar uri={option.value.avatar} />
      <Text>{option.label}</Text>
      {isSelected && <Badge text="Active" />}
    </TouchableOpacity>
  )}
  ...
/>
```

---

## Loading State

```tsx
<Select loading={isFetching} options={options} ... />
```

Shows a spinner and hides the list while `loading` is `true`.

---

## Empty State

```tsx
<Select
  options={[]}
  renderEmptyComponent={() => (
    <View style={styles.empty}>
      <Text>Nothing found. Try a different search.</Text>
    </View>
  )}
  ...
/>
```

---

## Style Overrides

Fine-grained style props — all accept `StyleProp<ViewStyle | TextStyle>`:

```tsx
<Select
  containerStyle={{ borderRadius: 20 }}
  headerStyle={{ paddingVertical: 20 }}
  titleStyle={{ fontSize: 20, fontWeight: "800" }}
  optionStyle={{ paddingVertical: 18 }}
  optionTextStyle={{ fontFamily: "MyFont" }}
  ...
/>
```

---

## Full Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Controls modal visibility |
| `options` | `T[] \| SelectOption<T>[]` | — | Options to display |
| `selectedValue` | `T` | — | Currently selected value |
| `onSelect` | `(value: T) => void` | — | Called when option is tapped |
| `onClose` | `() => void` | — | Called when modal is dismissed |
| `title` | `string` | `"Select an option"` | Modal header title |
| `theme` | `Partial<SelectTheme>` | `defaultTheme` | Theme overrides |
| `renderCloseIcon` | `() => ReactNode` | `"✕"` | Custom close icon |
| `renderCheckIcon` | `() => ReactNode` | `"✓"` | Custom check icon |
| `renderItem` | `(params) => ReactNode` | — | Full custom row renderer |
| `renderEmptyComponent` | `() => ReactNode` | `"No options available."` | Empty list component |
| `loading` | `boolean` | `false` | Show spinner instead of list |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Card container style override |
| `headerStyle` | `StyleProp<ViewStyle>` | — | Header row style override |
| `titleStyle` | `StyleProp<TextStyle>` | — | Title text style override |
| `optionStyle` | `StyleProp<ViewStyle>` | — | Option row style override |
| `optionTextStyle` | `StyleProp<TextStyle>` | — | Option text style override |
| `testID` | `string` | — | testID on the card View |
| `optionTestIDPrefix` | `string` | `"rn-select-option"` | Prefix for row testIDs |

---

## License

MIT © [exist08](https://github.com/exist08)