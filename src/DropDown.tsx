/**
 * react-native-select
 * The HTML-like <select> component React Native always deserved.
 *
 * @see https://github.com/YOUR_USERNAME/react-native-select
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from "react-native";

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface SelectTheme {
  /** Modal card background */
  cardBackground: string;
  /** Header title color */
  titleColor: string;
  /** Divider / border color */
  borderColor: string;
  /** Option label color */
  optionTextColor: string;
  /** Background of the selected option row */
  selectedOptionBackground: string;
  /** Text color of the selected option */
  selectedOptionTextColor: string;
  /** Overlay / backdrop color (use rgba) */
  backdropColor: string;
}

export const defaultTheme: SelectTheme = {
  cardBackground: "#ffffff",
  titleColor: "#111827",
  borderColor: "#e5e7eb",
  optionTextColor: "#374151",
  selectedOptionBackground: "#eff6ff",
  selectedOptionTextColor: "#3b82f6",
  backdropColor: "rgba(0,0,0,0.5)",
};

export const darkTheme: SelectTheme = {
  cardBackground: "#1f2937",
  titleColor: "#f9fafb",
  borderColor: "#374151",
  optionTextColor: "#e5e7eb",
  selectedOptionBackground: "#1e3a5f",
  selectedOptionTextColor: "#60a5fa",
  backdropColor: "rgba(0,0,0,0.7)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption<T = string> {
  /** The underlying value passed to `onSelect`. */
  value: T;
  /** Display label. Falls back to `String(value)` when omitted. */
  label?: string;
}

export interface SelectProps<T = string> {
  /** Controls modal visibility. */
  visible: boolean;

  /**
   * Options to display.
   * Pass an array of plain strings OR `SelectOption<T>` objects.
   */
  options: T[] | SelectOption<T>[];

  /** Currently selected value — used to highlight the active row. */
  selectedValue?: T;

  /** Called with the selected value when the user taps an option. */
  onSelect: (value: T) => void;

  /** Called when the user dismisses the modal (backdrop tap or close icon). */
  onClose: () => void;

  // ── Customisation ──────────────────────────────────────────────────────────

  /** Modal title string. */
  title?: string;

  /**
   * Replace the default close icon.
   * Render any element — `<Ionicons>`, `<MaterialIcons>`, plain `<Text>`, etc.
   */
  renderCloseIcon?: () => React.ReactNode;

  /**
   * Replace the default checkmark shown next to the selected option.
   */
  renderCheckIcon?: () => React.ReactNode;

  /**
   * Fully custom row renderer. When provided, the default row is replaced.
   * `isSelected` and `onPress` are provided for convenience.
   */
  renderItem?: (params: {
    option: SelectOption<T>;
    isSelected: boolean;
    onPress: () => void;
  }) => React.ReactNode;

  /**
   * Shown when `options` is empty and `loading` is false.
   * Defaults to "No options available."
   */
  renderEmptyComponent?: () => React.ReactNode;

  /** Shows a spinner and hides the list while `true`. */
  loading?: boolean;

  // ── Theming ────────────────────────────────────────────────────────────────

  /**
   * Partial theme override — merged with `defaultTheme`.
   * Pass the exported `darkTheme` for a ready-made dark variant.
   */
  theme?: Partial<SelectTheme>;

  // ── Style overrides ────────────────────────────────────────────────────────

  /** Override the modal card container style. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Override header row style. */
  headerStyle?: StyleProp<ViewStyle>;
  /** Override the title `Text` style. */
  titleStyle?: StyleProp<TextStyle>;
  /** Override each option row style. */
  optionStyle?: StyleProp<ViewStyle>;
  /** Override each option label style. */
  optionTextStyle?: StyleProp<TextStyle>;

  // ── Accessibility / testing ────────────────────────────────────────────────

  /** `testID` forwarded to the modal card `View`. */
  testID?: string;
  /** `testID` prefix for option rows — rows get `"{prefix}-{index}"`. */
  optionTestIDPrefix?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseOption<T>(raw: T | SelectOption<T>): SelectOption<T> {
  if (raw !== null && typeof raw === "object" && "value" in (raw as object)) {
    return raw as SelectOption<T>;
  }
  return { value: raw as T };
}

function getLabel<T>(option: SelectOption<T>): string {
  return option.label ?? String(option.value).replace(/_/g, " ");
}

// ─── Default icon renderers ───────────────────────────────────────────────────

const DefaultCloseIcon: React.FC = () => (
  <Text style={iconStyles.close}>✕</Text>
);

const DefaultCheckIcon: React.FC = () => (
  <Text style={iconStyles.check}>✓</Text>
);

const iconStyles = StyleSheet.create({
  close: { fontSize: 18, color: "#6b7280", lineHeight: 22 },
  check: { fontSize: 16, color: "#3b82f6", fontWeight: "700" },
});

// ─── Component ────────────────────────────────────────────────────────────────

function SelectInner<T = string>(
  props: SelectProps<T>,
  _ref: React.ForwardedRef<Modal>
) {
  const {
    visible,
    options,
    selectedValue,
    onSelect,
    onClose,
    title = "Select an option",
    renderCloseIcon,
    renderCheckIcon,
    renderItem,
    renderEmptyComponent,
    loading = false,
    theme: themeOverride,
    containerStyle,
    headerStyle,
    titleStyle,
    optionStyle,
    optionTextStyle,
    testID,
    optionTestIDPrefix = "rn-select-option",
  } = props;

  const theme: SelectTheme = { ...defaultTheme, ...themeOverride };

  const normalisedOptions: SelectOption<T>[] = (
    options as Array<T | SelectOption<T>>
  ).map(normaliseOption);

  const handleSelect = useCallback(
    (value: T) => {
      onSelect(value);
      onClose();
    },
    [onSelect, onClose]
  );

  const closeIcon = renderCloseIcon ? renderCloseIcon() : <DefaultCloseIcon />;
  const checkIcon = renderCheckIcon ? renderCheckIcon() : <DefaultCheckIcon />;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, { backgroundColor: theme.backdropColor }]}>
        {/* Tappable backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel="Close dropdown"
        />

        {/* Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground },
            containerStyle,
          ]}
          testID={testID}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: theme.borderColor },
              headerStyle,
            ]}
          >
            <Text
              style={[styles.title, { color: theme.titleColor }, titleStyle]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              {closeIcon}
            </TouchableOpacity>
          </View>

          {/* Body */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={theme.selectedOptionTextColor} />
            </View>
          ) : (
            <FlatList
              data={normalisedOptions}
              keyExtractor={(item, index) =>
                `rn-select-${String(item.value)}-${index}`
              }
              ListEmptyComponent={
                renderEmptyComponent ? (
                  <>{renderEmptyComponent()}</>
                ) : (
                  <Text
                    style={[
                      styles.emptyText,
                      { color: theme.optionTextColor },
                    ]}
                  >
                    No options available.
                  </Text>
                )
              }
              renderItem={({ item, index }) => {
                const isSelected = item.value === selectedValue;
                const isLast = index === normalisedOptions.length - 1;
                const handlePress = () => handleSelect(item.value);

                if (renderItem) {
                  return (
                    <>{renderItem({ option: item, isSelected, onPress: handlePress })}</>
                  );
                }

                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      !isLast && {
                        borderBottomColor: theme.borderColor,
                        borderBottomWidth: 1,
                      },
                      isSelected && {
                        backgroundColor: theme.selectedOptionBackground,
                      },
                      optionStyle,
                    ]}
                    onPress={handlePress}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={getLabel(item)}
                    testID={`${optionTestIDPrefix}-${index}`}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.optionTextColor },
                        isSelected && {
                          color: theme.selectedOptionTextColor,
                          fontWeight: "600",
                        },
                        optionTextStyle,
                      ]}
                    >
                      {getLabel(item)}
                    </Text>
                    {isSelected && checkIcon}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export const Select = React.forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<Modal> }
) => ReturnType<typeof SelectInner>;

export default Select;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 12,
    maxHeight: "70%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    textTransform: "capitalize",
    flexShrink: 1,
    marginRight: 8,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 24,
    fontSize: 14,
    opacity: 0.6,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
});
