import { Platform } from 'react-native';

export const Colors = {
  // Light Mode: Clean & Playful (Mint/Lavender)
  light: {
    text: '#1A1A2E',
    background: '#F4F5F7',
    tint: '#1A1A2E',
    icon: '#8E8EA0',
    tabIconDefault: '#8E8EA0',
    tabIconSelected: '#1A1A2E',
    card: '#FFFFFF',
    cardBorder: 'transparent',
    primary: '#1A1A2E',         // dark button
    primaryText: '#FFFFFF',
    primaryLight: '#E8E8EE',    // soft gray surface
    accent: '#87F29A',          // mint green
    accentText: '#1A1A2E',
    danger: '#FF6B6B',
    dangerLight: '#FFE0E0',
    muted: '#8E8EA0',
    mutedLight: '#F0F0F3',
    separator: '#EBEBEF',
    heroCard: '#1A1A2E',        // dark for the welcome card
    heroText: '#FFFFFF',
    heroAccent: '#87F29A',
    // Drawer
    drawerBackground: '#FFFFFF',
    drawerActive: '#1A1A2E',
    drawerInactive: '#8E8EA0',
  },
  // Dark Mode: Dark & Premium (Finance app - Neon Green / Vibrant Blue)
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#87F29A',
    icon: '#888888',
    tabIconDefault: '#888888',
    tabIconSelected: '#FFFFFF',
    card: '#161618',
    cardBorder: 'transparent',
    primary: '#FFFFFF',         // white button / text
    primaryText: '#000000',
    primaryLight: '#222222',    // dark surface
    accent: '#87F29A',          // bright lime green
    accentText: '#1A1A2E',
    danger: '#FF4444',
    dangerLight: '#331111',
    muted: '#888888',
    mutedLight: '#222222',
    separator: '#222222',
    heroCard: '#161618',        // dark card matching overall theme
    heroText: '#FFFFFF',
    heroAccent: '#87F29A',      // bright lime green accent
    // Drawer
    drawerBackground: '#000000',
    drawerActive: '#FFFFFF',
    drawerInactive: '#888888',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
