"use strict";
/**
 * react-native-select
 * The HTML-like <select> component React Native always deserved.
 *
 * @see https://github.com/YOUR_USERNAME/react-native-select
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.darkTheme = exports.defaultTheme = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
exports.defaultTheme = {
    cardBackground: "#ffffff",
    titleColor: "#111827",
    borderColor: "#e5e7eb",
    optionTextColor: "#374151",
    selectedOptionBackground: "#eff6ff",
    selectedOptionTextColor: "#3b82f6",
    backdropColor: "rgba(0,0,0,0.5)",
};
exports.darkTheme = {
    cardBackground: "#1f2937",
    titleColor: "#f9fafb",
    borderColor: "#374151",
    optionTextColor: "#e5e7eb",
    selectedOptionBackground: "#1e3a5f",
    selectedOptionTextColor: "#60a5fa",
    backdropColor: "rgba(0,0,0,0.7)",
};
// ─── Helpers ──────────────────────────────────────────────────────────────────
function normaliseOption(raw) {
    if (raw !== null && typeof raw === "object" && "value" in raw) {
        return raw;
    }
    return { value: raw };
}
function getLabel(option) {
    var _a;
    return (_a = option.label) !== null && _a !== void 0 ? _a : String(option.value).replace(/_/g, " ");
}
// ─── Default icon renderers ───────────────────────────────────────────────────
const DefaultCloseIcon = () => (<react_native_1.Text style={iconStyles.close}>✕</react_native_1.Text>);
const DefaultCheckIcon = () => (<react_native_1.Text style={iconStyles.check}>✓</react_native_1.Text>);
const iconStyles = react_native_1.StyleSheet.create({
    close: { fontSize: 18, color: "#6b7280", lineHeight: 22 },
    check: { fontSize: 16, color: "#3b82f6", fontWeight: "700" },
});
// ─── Component ────────────────────────────────────────────────────────────────
function SelectInner(props, _ref) {
    const { visible, options, selectedValue, onSelect, onClose, title = "Select an option", renderCloseIcon, renderCheckIcon, renderItem, renderEmptyComponent, loading = false, theme: themeOverride, containerStyle, headerStyle, titleStyle, optionStyle, optionTextStyle, testID, optionTestIDPrefix = "rn-select-option", } = props;
    const theme = Object.assign(Object.assign({}, exports.defaultTheme), themeOverride);
    const normalisedOptions = options.map(normaliseOption);
    const handleSelect = (0, react_1.useCallback)((value) => {
        onSelect(value);
        onClose();
    }, [onSelect, onClose]);
    const closeIcon = renderCloseIcon ? renderCloseIcon() : <DefaultCloseIcon />;
    const checkIcon = renderCheckIcon ? renderCheckIcon() : <DefaultCheckIcon />;
    return (<react_native_1.Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <react_native_1.View style={[styles.backdrop, { backgroundColor: theme.backdropColor }]}>
        {/* Tappable backdrop */}
        <react_native_1.TouchableOpacity style={react_native_1.StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} accessibilityRole="button" accessibilityLabel="Close dropdown"/>

        {/* Card */}
        <react_native_1.View style={[
            styles.card,
            { backgroundColor: theme.cardBackground },
            containerStyle,
        ]} testID={testID}>
          {/* Header */}
          <react_native_1.View style={[
            styles.header,
            { borderBottomColor: theme.borderColor },
            headerStyle,
        ]}>
            <react_native_1.Text style={[styles.title, { color: theme.titleColor }, titleStyle]} numberOfLines={1}>
              {title}
            </react_native_1.Text>
            <react_native_1.TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel="Close">
              {closeIcon}
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          {/* Body */}
          {loading ? (<react_native_1.View style={styles.loadingContainer}>
              <react_native_1.ActivityIndicator color={theme.selectedOptionTextColor}/>
            </react_native_1.View>) : (<react_native_1.FlatList data={normalisedOptions} keyExtractor={(item, index) => `rn-select-${String(item.value)}-${index}`} ListEmptyComponent={renderEmptyComponent ? (<>{renderEmptyComponent()}</>) : (<react_native_1.Text style={[
                    styles.emptyText,
                    { color: theme.optionTextColor },
                ]}>
                    No options available.
                  </react_native_1.Text>)} renderItem={({ item, index }) => {
                const isSelected = item.value === selectedValue;
                const isLast = index === normalisedOptions.length - 1;
                const handlePress = () => handleSelect(item.value);
                if (renderItem) {
                    return (<>{renderItem({ option: item, isSelected, onPress: handlePress })}</>);
                }
                return (<react_native_1.TouchableOpacity style={[
                        styles.option,
                        !isLast && {
                            borderBottomColor: theme.borderColor,
                            borderBottomWidth: 1,
                        },
                        isSelected && {
                            backgroundColor: theme.selectedOptionBackground,
                        },
                        optionStyle,
                    ]} onPress={handlePress} accessibilityRole="menuitem" accessibilityState={{ selected: isSelected }} accessibilityLabel={getLabel(item)} testID={`${optionTestIDPrefix}-${index}`}>
                    <react_native_1.Text style={[
                        styles.optionText,
                        { color: theme.optionTextColor },
                        isSelected && {
                            color: theme.selectedOptionTextColor,
                            fontWeight: "600",
                        },
                        optionTextStyle,
                    ]}>
                      {getLabel(item)}
                    </react_native_1.Text>
                    {isSelected && checkIcon}
                  </react_native_1.TouchableOpacity>);
            }}/>)}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
}
exports.Select = react_1.default.forwardRef(SelectInner);
exports.default = exports.Select;
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = react_native_1.StyleSheet.create({
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
//# sourceMappingURL=DropDown.js.map