This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker (VPS)

Le projet est dockerisé pour être déployé sur le VPS du frère de Samuel.

### Fichiers ajoutés

- `Dockerfile` — build multi-stage (deps → builder → runner), Node 22 Alpine, image finale en mode `output: standalone`, utilisateur non-root.
- `.dockerignore`
- `docker-compose.yml` — 3 services :
  - `app` (port 3000)
  - `db` (MySQL 8.4, volume `db_data`, **port non exposé** sur l'hôte par sécurité)
  - `migrate` (job ponctuel, profil `tools`, lance `npx prisma migrate deploy` via le stage `builder` — pas besoin de Node sur le VPS)
- `.env.example` — gabarit des variables d'environnement (à dupliquer en `.env`, jamais commité).
- `next.config.ts` — ajout de `output: "standalone"`.

### Commandes

```bash
docker compose up -d --build              # build + démarre app + db
docker compose run --rm migrate           # applique les migrations Prisma (une fois qu'il en existe)
docker compose down                       # arrête tout (ajouter -v pour supprimer aussi le volume db_data)
```

### Bugs pré-existants corrigés au passage (bloquaient tout build de prod, Docker ou pas)

- **Prisma 7** : le moteur par défaut (`"client"`, sans binaire Rust) exige un *driver adapter*. Ajout de `@prisma/adapter-mariadb` + `mariadb`, branché dans `lib/prisma.ts`.
- **`/rsvp`** : `useSearchParams()` utilisé sans `<Suspense>`, ce qui cassait le build statique. Le composant a été scindé (`RsvpContent` + wrapper `RsvpPage` avec `<Suspense>`).

### À faire avant un vrai déploiement

- ⚠️ **Aucune migration Prisma n'existe encore** (`prisma/migrations` est vide). Il faut lancer une fois `npx prisma migrate dev --name init` contre une base de dev, committer le résultat, puis utiliser le service `migrate` en prod.
- Préparer le `.env` réel sur le VPS (voir `.env.example` pour la liste des variables) — ne jamais transmettre les vraies valeurs par chat non chiffré.
- Décider avec le frère du mode de transfert du code vers le VPS (repo Git distant à créer, ou rsync/scp) et de la mise en place d'un reverse proxy (nginx/Caddy + HTTPS) devant le port 3000.
- Clé SSH dédiée générée pour l'accès au VPS : `~/.ssh/mariage` (privée, à ne jamais partager) / `~/.ssh/mariage.pub` (publique, transmise au frère pour `authorized_keys`).
