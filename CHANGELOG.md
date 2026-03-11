# Changelog

All notable changes to `react-native-select` will be documented in this file.

## [1.0.0] - 2025-01-01

### Added
- Initial release
- Generic `Select<T>` component — works with strings, numbers, enums, or any value type
- `SelectOption<T>` shape with separate `value` / `label` fields
- Full theming via `theme` prop — `defaultTheme` and `darkTheme` exported
- `renderCloseIcon` and `renderCheckIcon` render props — bring your own icon library
- `renderItem` for fully custom row rendering
- `renderEmptyComponent` for custom empty states
- `loading` prop with built-in spinner
- Granular style overrides: `containerStyle`, `headerStyle`, `titleStyle`, `optionStyle`, `optionTextStyle`
- `testID` and `optionTestIDPrefix` for testing
- Full accessibility: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`
- Android back-button support via `onRequestClose`
- Zero runtime dependencies — only `react` and `react-native` as peer deps
