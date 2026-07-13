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

### Déploiement en production — état actuel

Le site est en ligne : **https://josianeetstephane.fr** (VPS Ubuntu 24.04, IP `51.75.21.221`).

- **Accès** : uniquement par clé SSH dédiée `~/.ssh/mariage` (utilisateur `ubuntu`) — l'authentification par mot de passe a été désactivée côté serveur (`/etc/ssh/sshd_config.d/50-cloud-init.conf`), le mot de passe initial transmis par le frère n'est plus utilisable.
- **Reverse proxy / HTTPS** : Caddy (`/etc/caddy/Caddyfile`), certificat Let's Encrypt automatique et renouvelé tout seul. Service `caddy` activé au démarrage.
- **Pare-feu** : `ufw` actif, seuls les ports 22 (SSH), 80 et 443 sont ouverts.
- **App** : code dans `~/mariage-sj` sur le serveur, lancé via `docker compose up -d` (services `app` + `db`, `restart: unless-stopped` → redémarre automatiquement si le serveur reboote).
- **Base de données** : 93 invités importés sont en place (écart constaté le 2026-07-13 avec les 168 mentionnés précédemment ici — à vérifier auprès de Samuel). Le `.env` de prod (mots de passe DB générés aléatoirement, `NEXTAUTH_SECRET` dédié) vit uniquement sur le serveur dans `~/mariage-sj/.env` (permissions 600) — jamais commité, jamais transmis par chat.
- **Compte admin** créé (`nataltek@gmail.com`), mot de passe généré aléatoirement et communiqué une seule fois à Samuel.

### Reste à faire

- **Cloudinary** : clés pas encore renseignées → l'upload d'images depuis le dashboard admin ne fonctionnera pas tant qu'elles ne sont pas ajoutées dans le `.env` du serveur.
- **Resend** : clé API renseignée (2026-07-13). En attente de la vérification du domaine `josianeetstephane.fr` (DNS ajoutés par le frère de Samuel côté OVH, statut Resend `pending` au 2026-07-13 — propagation en cours). Tant que non vérifié, `EMAIL_FROM` reste sur `onboarding@resend.dev`, qui n'autorise l'envoi que vers l'adresse du compte Resend (`goure2@gmail.com`), pas vers les invités. Une fois `verified`, basculer `EMAIL_FROM` sur `Josiane & Stéphane <billets@josianeetstephane.fr>` et redémarrer l'app.
- Si le mot de passe VPS d'origine (transmis par le frère) est réutilisé ailleurs, le faire changer côté panel d'hébergement — il n'est plus exploitable en SSH mais reste valable pour une éventuelle console web du fournisseur.

### Faille de sécurité corrigée (2026-07-13)

`/api/guests`, `GET /api/rsvp` et la modération `/api/gallery/[id]` (PATCH/DELETE) étaient accessibles **sans authentification** en prod : le middleware (`proxy.ts`) ne protège que `/admin/*` et `/api/admin/*`, pas ces routes. N'importe qui connaissant l'URL pouvait lire la liste complète des invités (noms, emails, téléphones, tokens RSVP) et modifier/supprimer des invités ou réponses RSVP arbitrairement.

Corrigé via `lib/auth-guard.ts` (`requireAdmin()`, vérifie le JWT NextAuth) ajouté sur ces handlers. Restent volontairement publics : `POST /api/rsvp` (soumission invité), `GET /api/guests/by-token/[token]` (lookup par token personnel), `GET`/`POST /api/gallery` (consultation/upload invité). Voir commit `703daa1`.

## Invités & liens RSVP personnalisés

Chaque invité importé via `/admin/guests` reçoit un code unique (`token`) et un lien personnel `/rsvp?g=<token>` qui pré-remplit son nom et lui permet de confirmer sa présence, choisir son menu et indiquer le nombre de personnes.

> **À faire avant l'envoi des invitations** : Samuel doit transmettre le fichier avec la liste des invités (nom, téléphone, adresse, groupe) pour l'import via `/admin/guests` → bouton "Import CSV" (format attendu : `nom,téléphone,adresse,groupe`, une ligne par invité).

## Authentification & Dashboard de contenu (CMS léger)

Avant, tout le texte du site (dates, lieux, FAQ, photos de la galerie) était codé en dur dans le JSX — il fallait modifier le code et redéployer pour le moindre changement. Le dashboard admin (`/admin/content`) permet maintenant de modifier ce contenu sans toucher au code, avec effet immédiat sur le site public (pas de rebuild nécessaire).

### Fichiers ajoutés

- **Authentification** (NextAuth, Credentials + bcrypt) :
  - `lib/auth.ts` — config NextAuth, vérifie email + mot de passe contre la table `AdminUser`
  - `app/api/auth/[...nextauth]/route.ts` — handler NextAuth
  - `proxy.ts` (racine du projet) — protège `/admin/*` et `/api/admin/*` ; redirige vers `/admin/login` si non connecté (Next.js 16 a renommé `middleware.ts` → `proxy.ts`)
  - `app/admin/login/page.tsx` — page de connexion
  - `scripts/create-admin.ts` — crée/réinitialise un compte admin
  - `app/admin/(dashboard)/` — toutes les pages admin existantes (Dashboard, RSVP, Invités, Galerie) déplacées dans ce groupe de routes pour partager la nav (`components/admin/AdminNav.tsx`) sans l'imposer à la page de login
- **Contenu dynamique** :
  - Modèle Prisma `ContentSection` (clé + JSON) — une ligne par section éditable
  - `lib/content/sections.ts` — schémas Zod + valeurs par défaut (= texte d'origine) pour 4 sections : `general` (noms, date, deadline RSVP, hashtag), `venues` (les 2 lieux), `event_faq`, `gallery_highlights` (cartes de la galerie)
  - `lib/content.ts` — lecture des sections avec repli automatique sur les valeurs par défaut si la base n'a pas encore été modifiée
  - `app/api/admin/content/[key]/route.ts` — API GET/PUT pour chaque section
  - `app/api/admin/upload/route.ts` + `lib/cloudinary.ts` — upload d'images vers Cloudinary
  - `app/admin/(dashboard)/content/page.tsx` — l'écran du dashboard (4 onglets), `components/admin/ArrayEditor.tsx` (listes éditables : FAQ, cartes galerie), `components/admin/ImageUploadField.tsx`
  - Pages publiques `app/(public)/page.tsx`, `event/`, `gallery/`, `rsvp/` et `components/layout/Footer.tsx` : lisent maintenant le contenu dynamique au lieu de textes codés en dur. `export const dynamic = "force-dynamic"` ajouté sur les layouts/pages concernés — **sans ça, Next.js mettrait ces pages en cache statique au build et les modifications du dashboard n'apparaîtraient jamais en prod.**
- Hors-scope pour l'instant (texte toujours codé en dur, même pattern à réutiliser plus tard) : timeline/anecdotes de `/story`, liste de cadeaux, copy de la navbar.

### Tester en local

La base `db` du `docker-compose.yml` n'expose pas son port sur l'hôte (volontaire, pour la prod). Pour que `npm run dev` lancé directement sur ta machine puisse s'y connecter, un fichier **`docker-compose.override.yml`** (non commité, local uniquement) expose `127.0.0.1:3307` → port 3306 du conteneur (3306 était déjà pris par un autre MySQL local). `.env.local` pointe vers ce port.

```bash
docker compose up -d db                  # démarre juste la base (avec le port 3307 exposé localement)
npm run dev

# première fois : créer un compte admin
npx tsx scripts/create-admin.ts --email=toi@example.com --password=ton-mot-de-passe
```

Puis : `http://localhost:3000/admin` → redirige vers `/admin/login` si non connecté → une fois connecté, `/admin/content` permet d'éditer les 4 sections. Toute modification doit apparaître immédiatement sur les pages publiques correspondantes (`/`, `/event`, `/gallery`, `/rsvp`), sans redémarrer le serveur.

> Note : le driver `@prisma/adapter-mariadb` n'accepte pas le hostname `localhost` dans la chaîne de connexion (bug du parseur) — toujours utiliser `127.0.0.1`.

### Cloudinary (upload d'images)

Pas encore configuré. Pour tester l'upload de photos depuis le dashboard (onglet "Galerie" ou champ photo des lieux) :

1. Créer un compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Renseigner `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` dans `.env.local` (en local) ou `.env` (sur le VPS)
3. Redémarrer le serveur

`next.config.ts` autorise déjà le domaine `res.cloudinary.com` pour `next/image`.

## Envoi des billets par email (Resend)

Dans `/admin/guests`, chaque invité au statut **Confirmé** avec un email renseigné a un bouton "Envoyer le billet" (icône avion en papier). Il génère le QR code d'accès et l'envoie par email (pièce jointe + aperçu dans le corps du mail). Une fois envoyé, le bouton passe au vert avec la date d'envoi (survol pour voir), et redevient cliquable pour renvoyer si besoin.

### Fichiers ajoutés

- `lib/email.ts` — client Resend + template HTML du billet
- `app/api/guests/[id]/send-ticket/route.ts` — génère le QR code (`qrcode`, déjà utilisé pour le QR admin existant) et envoie l'email ; vérifie que l'invité est confirmé et a un email avant d'envoyer
- Colonne `ticket_sent_at` sur `Guest` (migration `20260712010000_guest_ticket_sent_at`) pour savoir si/quand le billet a été envoyé

### État actuel (2026-07-13)

- `RESEND_API_KEY` renseignée en local et sur le VPS.
- Domaine `josianeetstephane.fr` ajouté dans Resend (Dashboard → Domains), enregistrements DNS transmis au frère de Samuel pour ajout côté OVH. Statut Resend : `pending` (propagation DNS en cours).
- Tant que le domaine n'est pas `verified`, `EMAIL_FROM` reste sur `onboarding@resend.dev` (adresse de test Resend) : l'envoi fonctionne uniquement vers l'adresse du compte Resend (`goure2@gmail.com`), pas vers les invités.

### Une fois le domaine `verified` dans Resend

1. Mettre à jour `EMAIL_FROM` dans `.env` (VPS) :
   ```
   EMAIL_FROM=Josiane & Stéphane <billets@josianeetstephane.fr>
   ```
2. Redémarrer l'app (`docker compose up -d --build app` sur le VPS)

Aucune modification de code nécessaire.
