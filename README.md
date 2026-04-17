# Outlander Gear Co. — E-Commerce Outdoor

Application e-commerce complète pour la vente d'équipements de plein air.  
**Stack** : PostgreSQL · Node.js/Express (TypeScript) · Angular 19 · TailwindCSS

---

## Prérequis à installer

### 1. Node.js (v18+)

**macOS (avec Homebrew) :**
```bash
brew install node
```

**Sans Homebrew — installer Homebrew d'abord :**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

**Vérifier l'installation :**
```bash
node --version    # doit afficher v18.x ou plus
npm --version     # doit afficher 9.x ou plus
```

---

### 2. PostgreSQL

**macOS (avec Homebrew) :**
```bash
brew install postgresql@16
```

Après l'installation, Homebrew affiche un chemin. Ajouter PostgreSQL au PATH :
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Démarrer le service PostgreSQL :**
```bash
brew services start postgresql@16
```

**Vérifier :**
```bash
psql --version     # doit afficher psql (PostgreSQL) 16.x
createdb --version # doit afficher createdb (PostgreSQL) 16.x
```

> **Alternative sans Homebrew :** Télécharger l'installateur depuis [postgresql.org/download/macosx](https://www.postgresql.org/download/macosx/) ou utiliser [Postgres.app](https://postgresapp.com/) (glisser-déposer, zéro config).

---

### 3. Angular CLI (optionnel mais recommandé)

```bash
npm install -g @angular/cli
```

---

## Installation du projet

### Étape 1 — Créer la base de données

```bash
# Ouvrir un terminal dans le dossier du projet
cd website

# Créer la base de données
createdb outlander_gear

# Exécuter le schéma (crée les tables)
psql -d outlander_gear -f database/schema.sql

# Insérer les données de test
psql -d outlander_gear -f database/seed.sql
```

> **Si `createdb` échoue avec "role does not exist"**, c'est que votre utilisateur macOS n'a pas de rôle PostgreSQL. Créer le rôle :
> ```bash
> psql postgres -c "CREATE ROLE $(whoami) WITH LOGIN SUPERUSER;"
> ```
> Puis relancer les commandes ci-dessus.

**Vérifier que les données sont bien chargées :**
```bash
psql -d outlander_gear -c "SELECT count(*) FROM products;"
# Doit afficher 21
```

---

### Étape 2 — Configurer et lancer le Backend

```bash
cd backend

# Installer les dépendances
npm install
```

**Configurer le fichier `.env` :**  
Ouvrir `backend/.env` et ajuster les identifiants PostgreSQL :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=votre_nom_utilisateur_mac    # résultat de : whoami
DB_PASSWORD=                          # vide par défaut sur macOS avec Homebrew
DB_NAME=outlander_gear
PORT=3000
JWT_SECRET=outlander-gear-dev-secret-change-me
JWT_EXPIRES_IN=7d
```

> **Astuce :** Sur macOS avec Homebrew/Postgres.app, le mot de passe est souvent vide et l'utilisateur est votre nom macOS. Tapez `whoami` dans le terminal pour le trouver.

**Lancer le serveur :**
```bash
npm run dev
```

Vous devriez voir :
```
🚀 Outlander Gear Co. API v2.0 — http://localhost:3000
```

**Tester l'API :**
```bash
# Dans un autre terminal
curl http://localhost:3000/api/products | head -c 200
```

---

### Étape 3 — Lancer le Frontend

```bash
# Ouvrir un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement Angular
npx ng serve
```

> La première compilation peut prendre 30-60 secondes.

Ouvrir le navigateur à : **http://localhost:4200**

---

## Comptes de test

| Rôle     | Email                      | Mot de passe |
|----------|----------------------------|--------------|
| Admin    | admin@outlander-gear.co    | Admin1234!   |
| Client   | marie.dupont@email.com     | Test1234!    |

---

## Structure du projet

```
website/
├── README.md
├── database/
│   ├── schema.sql              ← 8 tables (products, users, orders, cart, reviews…)
│   └── seed.sql                ← 21 produits, 7 catégories, 2 users, 5 avis
│
├── backend/                    ← API Node.js/Express en TypeScript
│   ├── .env                    ← Configuration locale (à modifier)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts           ← Point d'entrée (Express + middleware)
│       ├── config/database.ts  ← Pool de connexion PostgreSQL
│       ├── middleware/
│       │   ├── auth.ts         ← JWT authenticate + adminOnly
│       │   └── errorHandler.ts
│       ├── routes/
│       │   ├── auth.ts         ← POST /register, /login, GET /me
│       │   ├── products.ts     ← GET list (filtres, tri, pagination) + /featured + /:slug
│       │   ├── categories.ts   ← GET list + /:slug
│       │   ├── cart.ts         ← GET/POST/PUT/DELETE (auth required)
│       │   ├── orders.ts       ← GET/POST (transactionnel)
│       │   └── reviews.ts     ← GET/POST par produit
│       ├── types/index.ts      ← Interfaces TypeScript
│       └── validators/index.ts ← Schémas Zod
│
└── frontend/                   ← Angular 19 + TailwindCSS
    ├── package.json
    ├── angular.json
    ├── tailwind.config.js
    └── src/
        └── app/
            ├── app.component.*         ← Shell (navbar, footer)
            ├── app.config.ts           ← Providers + interceptor
            ├── app.routes.ts           ← Routing
            ├── interceptors/
            │   └── auth.interceptor.ts ← Auto-inject JWT
            ├── models/
            │   └── product.model.ts    ← Toutes les interfaces
            ├── services/
            │   ├── product.service.ts  ← API produits/catégories
            │   ├── cart.service.ts     ← Panier réactif
            │   └── auth.service.ts     ← Login/register/logout
            └── components/
                ├── product-list/       ← Accueil : hero, featured, grille, filtres
                ├── product-detail/     ← Fiche produit + avis + produits liés
                ├── cart/               ← Page panier
                ├── login/              ← Login/Inscription
                └── chat-copilot/       ← Widget chat IA (prêt pour intégration)
```

---

## Endpoints API

| Méthode | Route                         | Auth ? | Description                          |
|---------|-------------------------------|--------|--------------------------------------|
| GET     | /api/products                 | Non    | Liste avec filtres, tri, pagination  |
| GET     | /api/products/featured        | Non    | Produits mis en avant                |
| GET     | /api/products/:slug           | Non    | Détail + avis + produits liés        |
| GET     | /api/categories               | Non    | Toutes les catégories                |
| GET     | /api/categories/:slug         | Non    | Catégorie + ses produits             |
| POST    | /api/auth/register            | Non    | Créer un compte                     |
| POST    | /api/auth/login               | Non    | Se connecter (retourne JWT)          |
| GET     | /api/auth/me                  | Oui    | Profil utilisateur                   |
| GET     | /api/cart                     | Oui    | Voir son panier                     |
| POST    | /api/cart                     | Oui    | Ajouter un article                  |
| PUT     | /api/cart/:productId          | Oui    | Modifier la quantité                |
| DELETE  | /api/cart/:productId          | Oui    | Retirer un article                  |
| DELETE  | /api/cart                     | Oui    | Vider le panier                     |
| GET     | /api/orders                   | Oui    | Mes commandes                       |
| POST    | /api/orders                   | Oui    | Passer commande (depuis le panier)  |
| GET     | /api/orders/:id               | Oui    | Détail d'une commande               |
| GET     | /api/reviews/product/:id      | Non    | Avis d'un produit                   |
| POST    | /api/reviews/product/:id      | Oui    | Laisser un avis                     |

---

## Dépannage

### `command not found: psql`
PostgreSQL n'est pas dans votre PATH. Voir la section "PostgreSQL" ci-dessus.

### `FATAL: role "xxx" does not exist`
```bash
psql postgres -c "CREATE ROLE $(whoami) WITH LOGIN SUPERUSER;"
```

### `ECONNREFUSED` au démarrage du backend
PostgreSQL n'est pas lancé :
```bash
brew services start postgresql@16
```

### Le frontend ne charge aucun produit
- Vérifier que le backend tourne (`curl http://localhost:3000/api/products`)
- Vérifier que CORS autorise `localhost:4200` (c'est configuré par défaut)

### `Error: Module not found` dans le frontend
```bash
cd frontend && npm install
```
