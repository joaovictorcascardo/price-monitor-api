import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("url", 1024).notNullable();
    table.decimal("target_price", 10, 2).notNullable();
    table.string("name", 255).nullable();
    table.decimal("current_price", 10, 2).nullable();
    table.string("image_url", 1024).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("products");
}
