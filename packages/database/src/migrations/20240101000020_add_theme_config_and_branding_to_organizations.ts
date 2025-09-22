import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    // Add theme_config column as JSONB
    table.jsonb('theme_config').nullable();
    
    // Add branding column as JSONB
    table.jsonb('branding').nullable();
    
    // Add indexes for JSONB columns for efficient querying
    table.index(['theme_config'], 'idx_organizations_theme_config', 'gin');
    table.index(['branding'], 'idx_organizations_branding', 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    // Drop indexes first
    table.dropIndex(['theme_config'], 'idx_organizations_theme_config');
    table.dropIndex(['branding'], 'idx_organizations_branding');
    
    // Drop columns
    table.dropColumn('theme_config');
    table.dropColumn('branding');
  });
}
