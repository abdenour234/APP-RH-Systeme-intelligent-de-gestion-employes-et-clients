# MyApp

Application full-stack avec un backend Spring Boot et un frontend React, conteneurisée avec Docker. Le backend se connecte à une base de données PostgreSQL hébergée sur Supabase.

## Prérequis

- Docker et Docker Compose installés
- Un compte Supabase avec une base de données PostgreSQL

## Configuration

1. Clonez le dépôt :
   ```bash
   git clone <votre-repo>
   cd my-app
   ```

2. Copiez `.env.template` vers `.env` et remplissez vos identifiants Supabase :
   ```bash
   cp .env.template .env
   ```
   Éditez `.env` pour définir `DB_URL`, `DB_USERNAME`, et `DB_PASSWORD`.

3. Construisez et lancez l'application avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

4. Accédez à l'application :
   - Frontend : `http://localhost`
   - API Backend : `http://localhost:8080/api`

5. Arrêtez l'application :
   ```bash
   docker-compose down
   ```

## Développement

- Pour lancer le backend localement :
  - Allez dans `backend/`
  - Définissez les variables d'environnement ou configurez `application.properties`
  - Exécutez `mvn spring-boot:run`

- Pour lancer le frontend localement :
  - Allez dans `frontend/`
  - Exécutez `npm install`
  - Exécutez `npm start`
  - L'application sera disponible sur `http://localhost:3000`
