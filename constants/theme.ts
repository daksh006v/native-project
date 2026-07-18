import { Platform } from 'react-native';

const tintColorLight = '#1B6B4A';
const tintColorDark = '#4ADE80';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F5F7FA',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    primary: '#1B6B4A',
    primaryLight: '#E8F5EE',
    accent: '#F59E0B',
    accentLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    muted: '#6B7280',
    mutedLight: '#F3F4F6',
    separator: '#E5E7EB',
    drawerBackground: '#FFFFFF',
    drawerActive: '#1B6B4A',
    drawerInactive: '#6B7280',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    cardBorder: '#334155',
    primary: '#4ADE80',
    primaryLight: '#14532D',
    accent: '#FBBF24',
    accentLight: '#78350F',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    muted: '#94A3B8',
    mutedLight: '#1E293B',
    separator: '#334155',
    drawerBackground: '#1E293B',
    drawerActive: '#4ADE80',
    drawerInactive: '#94A3B8',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
