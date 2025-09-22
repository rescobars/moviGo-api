import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Default theme configuration
  const defaultThemeConfig = {
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

  const defaultBranding = {
    logo_url: "https://example.com/logo.png",
    favicon_url: "https://example.com/favicon.ico",
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
