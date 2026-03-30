import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',       // chemin vers ton fichier de schéma
  out: './drizzle',                    // dossier où seront générées les migrations (optionnel)
  dialect: 'postgresql',               // type de base de données
  dbCredentials: {
    url: process.env.DATABASE_URL!,    // utilise la variable d'environnement
  },
});