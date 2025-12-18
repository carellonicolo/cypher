

import { ThemeProfile } from '../types';

// Color Palette Definitions (RGB Triplets for Tailwind Opacity Support)
const PALETTES: Record<string, Record<string, string>> = {
  // Slate (Cool Gray) - DEFAULT BASE
  SLATE: {
    50: '248 250 252', 100: '241 245 249', 200: '226 232 240', 300: '203 213 225', 400: '148 163 184',
    500: '100 116 139', 600: '71 85 105', 700: '51 65 85', 800: '30 41 59', 850: '15 23 42', 900: '15 23 42', 950: '2 6 23'
  },
  // Zinc (Industrial Gray) - NERD BASE
  ZINC: {
    50: '250 250 250', 100: '244 244 245', 200: '228 228 231', 300: '212 212 216', 400: '161 161 170',
    500: '113 113 122', 600: '82 82 91', 700: '63 63 70', 800: '39 39 42', 850: '24 24 27', 900: '24 24 27', 950: '0 0 0'
  },
  // Stone (Warm Gray/Earthy) - NATURE BASE
  STONE: {
    50: '250 250 249', 100: '245 245 244', 200: '231 229 228', 300: '214 211 209', 400: '168 162 158',
    500: '120 113 108', 600: '87 83 78', 700: '68 64 60', 800: '41 37 36', 850: '28 25 23', 900: '28 25 23', 950: '12 10 9'
  },
  
  // PRIMARY COLORS
  INDIGO: {
    50: '238 242 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252', 400: '129 140 248',
    500: '99 102 241', 600: '79 70 229', 700: '67 56 202', 800: '55 48 163', 900: '49 46 129', 950: '30 27 75'
  },
  LIME: { // NERD PRIMARY
    50: '247 254 231', 100: '236 252 203', 200: '217 249 157', 300: '190 242 100', 400: '163 230 53',
    500: '132 204 22', 600: '101 163 13', 700: '77 124 15', 800: '63 98 18', 900: '54 83 20', 950: '26 46 5'
  },
  VIOLET: { // YOUTH PRIMARY
    50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253', 400: '167 139 250',
    500: '139 92 246', 600: '124 58 237', 700: '109 40 217', 800: '91 33 182', 850: '50 20 90', 900: '46 16 101', 950: '25 5 50'
  },
  EMERALD: { // NATURE PRIMARY
    50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 400: '52 211 153',
    500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59', 950: '2 44 34'
  },
  CYAN: { // OCEAN PRIMARY
    50: '236 254 255', 100: '207 250 254', 200: '165 243 252', 300: '103 232 249', 400: '34 211 238',
    500: '6 182 212', 600: '8 145 178', 700: '14 116 144', 800: '21 94 117', 900: '22 78 99', 950: '8 51 68'
  },
  ORANGE: { // SUNSET PRIMARY
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116', 400: '251 146 60',
    500: '249 115 22', 600: '234 88 12', 700: '194 65 12', 800: '154 52 18', 900: '124 45 18', 950: '67 20 7'
  },

  // ACCENT COLORS (For Decrypt/Secondary Actions)
  ROSE: { // DEFAULT ACCENT
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175', 400: '251 113 133',
    500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 800: '159 18 57', 900: '136 19 55', 950: '76 5 25'
  },
  AMBER: { // NERD ACCENT (Retro terminal warning)
    50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77', 400: '251 191 36',
    500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 800: '146 64 14', 900: '120 53 15', 950: '69 26 3'
  },
  FUCHSIA: { // YOUTH ACCENT
    50: '253 244 255', 100: '250 232 255', 200: '245 208 254', 300: '240 171 252', 400: '232 121 249',
    500: '217 70 239', 600: '192 38 211', 700: '162 28 175', 800: '134 25 143', 900: '112 26 117', 950: '74 4 78'
  },
  RUST: { // NATURE ACCENT (Orange/Brownish) - using Orange palette but darker semantic use
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116', 400: '251 146 60',
    500: '249 115 22', 600: '234 88 12', 700: '194 65 12', 800: '154 52 18', 900: '124 45 18', 950: '67 20 7'
  },
  BLUE: { // OCEAN ACCENT
    50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253', 400: '96 165 250',
    500: '59 130 246', 600: '37 99 235', 700: '29 78 216', 800: '30 64 175', 900: '30 58 138', 950: '23 37 84'
  }
};

interface ThemeConfig {
  base: string;
  primary: string;
  accent: string;
  radius: string; // CSS value for border-radius
  fonts: { sans: string, mono: string, display: string };
}

const THEME_CONFIGS: Record<ThemeProfile, ThemeConfig> = {
  [ThemeProfile.DEFAULT]: { 
    base: 'SLATE',
    primary: 'INDIGO',
    accent: 'ROSE',
    radius: '0.75rem', 
    fonts: { sans: 'Inter', mono: 'Fira Code', display: 'Inter' }
  },
  [ThemeProfile.NERD]: {
    base: 'ZINC',
    primary: 'LIME',
    accent: 'AMBER',
    radius: '0px', 
    fonts: { sans: 'Fira Code', mono: 'Fira Code', display: 'Fira Code' }
  },
  [ThemeProfile.YOUTH]: {
    base: 'VIOLET', 
    primary: 'VIOLET',
    accent: 'FUCHSIA',
    radius: '1.75rem', 
    fonts: { sans: 'Outfit', mono: 'Fira Code', display: 'Outfit' }
  },
  [ThemeProfile.NATURE]: {
    base: 'STONE',
    primary: 'EMERALD',
    accent: 'RUST', // Orange palette
    radius: '0.5rem', 
    fonts: { sans: 'Space Grotesk', mono: 'Fira Code', display: 'Space Grotesk' }
  },
  [ThemeProfile.OCEAN]: {
    base: 'SLATE',
    primary: 'CYAN',
    accent: 'BLUE',
    radius: '1rem', 
    fonts: { sans: 'Quicksand', mono: 'Fira Code', display: 'Quicksand' } 
  },
  [ThemeProfile.SUNSET]: {
    base: 'STONE',
    primary: 'ORANGE',
    accent: 'ROSE',
    radius: '0.25rem',
    fonts: { sans: 'Plus Jakarta Sans', mono: 'Fira Code', display: 'Plus Jakarta Sans' }
  }
};

export const applyTheme = (profile: ThemeProfile) => {
  const config = THEME_CONFIGS[profile];
  const root = document.documentElement;

  // Apply Base Colors
  const basePalette = PALETTES[config.base];
  Object.keys(basePalette).forEach(shade => {
    root.style.setProperty(`--color-base-${shade}`, basePalette[shade]);
  });

  // Apply Primary Colors
  const primaryPalette = PALETTES[config.primary];
  Object.keys(primaryPalette).forEach(shade => {
    root.style.setProperty(`--color-primary-${shade}`, primaryPalette[shade]);
  });

  // Apply Accent Colors
  const accentPalette = PALETTES[config.accent];
  Object.keys(accentPalette).forEach(shade => {
    root.style.setProperty(`--color-accent-${shade}`, accentPalette[shade]);
  });

  // Apply Fonts
  root.style.setProperty('--font-sans', config.fonts.sans);
  root.style.setProperty('--font-mono', config.fonts.mono);
  root.style.setProperty('--font-display', config.fonts.display);

  // Apply Radius
  root.style.setProperty('--radius-theme', config.radius);
};

export const getThemeName = (profile: ThemeProfile): string => {
  switch (profile) {
    case ThemeProfile.DEFAULT: return 'Default';
    case ThemeProfile.NERD: return 'Terminal';
    case ThemeProfile.YOUTH: return 'Vibrant';
    case ThemeProfile.NATURE: return 'Eco';
    case ThemeProfile.OCEAN: return 'Ocean';
    case ThemeProfile.SUNSET: return 'Sunset';
    default: return 'Default';
  }
};