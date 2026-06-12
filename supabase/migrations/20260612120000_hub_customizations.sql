alter table "public"."project_configs"
  add column if not exists "feedback_hide_author_names" boolean not null default false;

alter table "public"."project_configs"
  add column if not exists "hub_custom_tabs" jsonb not null default '[]'::jsonb;
