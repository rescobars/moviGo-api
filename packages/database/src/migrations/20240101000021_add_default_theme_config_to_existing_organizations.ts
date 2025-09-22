import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Default theme configuration - Gallo Theme
  const defaultThemeConfig = {
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

  const defaultBranding = {
    logo_url: "https://gallocerveza.com/logo.png",
    favicon_url: "https://gallocerveza.com/favicon.ico",
    primary_font: "Inter",
    secondary_font: "Roboto"
  };

  // Update all existing organizations with default theme config and branding
  await knex('organizations')
    .whereNull('theme_config')
    .update({
      theme_config: JSON.stringify(defaultThemeConfig),
      branding: JSON.stringify(defaultBranding),
      updated_at: knex.fn.now()
    });
}

export async function down(knex: Knex): Promise<void> {
  // Remove theme config and branding from all organizations
  await knex('organizations')
    .update({
      theme_config: null,
      branding: null,
      updated_at: knex.fn.now()
    });
}
