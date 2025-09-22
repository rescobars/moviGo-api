import { z } from 'zod';

// Theme colors schema
export const ThemeColorsSchema = z.object({
  background1: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  background2: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  background3: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonPrimary1: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonPrimary2: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonPrimary3: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonSecondary1: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonSecondary2: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonActive: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonText: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  buttonTextHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  tableHeader: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  tableRow: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  tableRowHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  tableBorder: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  menuBackground1: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  menuBackground2: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  menuItemHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  headerBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  headerText: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  headerBorder: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  sidebarBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  sidebarText: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  sidebarBorder: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  sidebarItemHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  sidebarItemActive: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  textPrimary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  textSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  textMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  divider: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  success: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  error: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  info: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
});

// Theme metadata schema
export const ThemeMetadataSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid(),
  is_default: z.boolean(),
  is_active: z.boolean(),
});

// Branding schema
export const BrandingSchema = z.object({
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional(),
  primary_font: z.string().min(1, 'Primary font is required'),
  secondary_font: z.string().min(1, 'Secondary font is required'),
});

// Theme configuration schema
export const ThemeConfigSchema = z.object({
  theme_name: z.string().min(1, 'Theme name is required'),
  theme_version: z.string().min(1, 'Theme version is required'),
  colors: ThemeColorsSchema,
  metadata: ThemeMetadataSchema,
  branding: BrandingSchema,
});

// Type exports
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type ThemeMetadata = z.infer<typeof ThemeMetadataSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// Default theme configuration
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  theme_name: "Movigo - Moderno",
  theme_version: "1.0.0",
  colors: {
    background1: "#000000",
    background2: "#111111",
    background3: "#1a1a1a",
    buttonPrimary1: "#ffffff",
    buttonPrimary2: "#f3f4f6",
    buttonPrimary3: "#e5e7eb",
    buttonSecondary1: "#1a1a1a",
    buttonSecondary2: "#2a2a2a",
    buttonHover: "#f3f4f6",
    buttonActive: "#e5e7eb",
    buttonText: "#000000",
    buttonTextHover: "#000000",
    tableHeader: "#1a1a1a",
    tableRow: "#000000",
    tableRowHover: "#111111",
    tableBorder: "#333333",
    menuBackground1: "#000000",
    menuBackground2: "#111111",
    menuItemHover: "#1a1a1a",
    headerBackground: "#000000",
    headerText: "#ffffff",
    headerBorder: "#333333",
    sidebarBackground: "#111111",
    sidebarText: "#ffffff",
    sidebarBorder: "#333333",
    sidebarItemHover: "#1a1a1a",
    sidebarItemActive: "#ffffff",
    textPrimary: "#ffffff",
    textSecondary: "#d1d5db",
    textMuted: "#9ca3af",
    border: "#333333",
    divider: "#1a1a1a",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6"
  },
  metadata: {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "system",
    is_default: true,
    is_active: true
  },
  branding: {
    logo_url: "https://example.com/logo.png",
    favicon_url: "https://example.com/favicon.ico",
    primary_font: "Inter",
    secondary_font: "Roboto"
  }
};
