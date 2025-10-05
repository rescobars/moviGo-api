import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    // Add theme_config_dark column as JSONB for dark theme configuration
    table.jsonb('theme_config_dark').nullable();
    
    // Add index for JSONB column for efficient querying
    table.index(['theme_config_dark'], 'idx_organizations_theme_config_dark', 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    // Drop the index first
    table.dropIndex(['theme_config_dark'], 'idx_organizations_theme_config_dark');
    
    // Drop the column
    table.dropColumn('theme_config_dark');
  });
}
