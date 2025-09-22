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

// Default theme configuration - Gallo Theme
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  theme_name: "Gallo - Tradicional",
  theme_version: "1.0.0",
  colors: {
    background1: "#fefefe",
    background2: "#f8fafc",
    background3: "#f1f5f9",
    buttonPrimary1: "#dc2626",
    buttonPrimary2: "#ef4444",
    buttonPrimary3: "#f87171",
    buttonSecondary1: "#f8fafc",
    buttonSecondary2: "#e5e7eb",
    buttonHover: "#dc2626",
    buttonActive: "#b91c1c",
    buttonText: "#ffffff",
    buttonTextHover: "#ffffff",
    tableHeader: "#f8fafc",
    tableRow: "#ffffff",
    tableRowHover: "#f8fafc",
    tableBorder: "#e5e7eb",
    menuBackground1: "#ffffff",
    menuBackground2: "#f8fafc",
    menuItemHover: "#fef2f2",
    headerBackground: "#dc2626",
    headerText: "#ffffff",
    headerBorder: "#e5e7eb",
    sidebarBackground: "#ffffff",
    sidebarText: "#1f2937",
    sidebarBorder: "#e5e7eb",
    sidebarItemHover: "#fef2f2",
    sidebarItemActive: "#dc2626",
    textPrimary: "#1f2937",
    textSecondary: "#4b5563",
    textMuted: "#6b7280",
    border: "#e5e7eb",
    divider: "#f3f4f6",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb"
  },
  metadata: {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "system",
    is_default: true,
    is_active: true
  },
  branding: {
    logo_url: "https://gallocerveza.com/logo.png",
    favicon_url: "https://gallocerveza.com/favicon.ico",
    primary_font: "Inter",
    secondary_font: "Roboto"
  }
};
