import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('segment', function (table) {
      table.uuid('id').notNullable().primary();
      table.integer('accuracy').notNullable();
      table.uuid('parent_id').nullable().references('id').inTable('segment');
      table.bigInteger('osm_line_id');
      table.specificType('way', 'geometry(LineString,900913)').notNullable();

      table.index(['way'], null, 'gist');
    })
    .createTable('profile', function (table) {
      table.uuid('id').notNullable().primary();
      table.string('name', 255).notNullable();
    })
    .createTable('profile_segment_quality', function (table) {
      table.increments().primary();
      table.uuid('profile_id').notNullable().references('id').inTable('profile');
      table.uuid('segment_id').notNullable().references('id').inTable('segment');
      table.integer('quality').notNullable();
    })
    .createTable('layer', function (table) {
      table.uuid('id').notNullable().primary();
      table.string('code', 255).notNullable();
    })
    .createTable('layer_segment_quality_aggregation', function (table) {
      table.increments().primary();
      table.uuid('layer_id').notNullable().references('id').inTable('layer');
      table.uuid('segment_id').notNullable().references('id').inTable('segment');
      table.integer('quality').notNullable();

      table.unique(['layer_id', 'segment_id']);
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('layer_segment_quality_aggregation')
    .dropTableIfExists('layer')
    .dropTableIfExists('profile_segment_quality')
    .dropTableIfExists('profile')
    .dropTableIfExists('segment');
}

