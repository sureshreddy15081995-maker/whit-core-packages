# Complete Implementation & Usage Guide: Shared Packages Monorepo

This document provides a step-by-step guide on how to manage, publish, and consume the shared TypeScript packages across all websites (**Betakwaaba**, **DC2bet**, **USKOBET**, and any future sites).

---

## 📌 Recommended Git Repository Names

When creating the repository on GitHub, GitLab, or Bitbucket, choose a name based on your organization preference:

| Rank | Repository Name | Why It Is Good |
| :--- | :--- | :--- |
| 🥇 **#1 (Recommended)** | **`igaming-common-ts`** | Clear, professional, and instantly tells anyone what industry and tech stack this belongs to. |
| 🥈 **#2** | **`whit-core-packages`** (or `<company>-core-packages`) | Company-scoped, standard for enterprise monorepos. |
| 🥉 **#3** | **`gaming-sdk-ts`** | Highlights that this is a client SDK/library for your platforms. |
| 4 | **`common-ts`** | Short, matches current folder name. |

---

## 🚀 Step 1: Push to Git

### 1. Create an empty repository on GitHub/GitLab
Create a new repository named `igaming-common-ts` (or your preferred name).

### 2. Push from command line
Open PowerShell in the `common-ts` directory:
```bash
cd D:\suresh\suresh\sveltekit\common-ts

# Link to your remote repository:
git remote add origin https://github.com/YOUR_ORGANIZATION/igaming-common-ts.git

# Push the main branch:
git push -u origin main
```

---

## 📦 Step 2: How to Install in Your Sites (Betakwaaba, DC2bet, New Sites)

You have two primary ways to install these packages into any site:

### Way A: Local Folder Installation (Fastest for Local Development)
No npm registry required. You can install directly from the sibling directory:

```bash
cd D:\suresh\suresh\sveltekit\betakwaaba

npm install file:../common-ts/packages/shared-ui
npm install file:../common-ts/packages/cashier
npm install file:../common-ts/packages/profile
npm install file:../common-ts/packages/auth
npm install file:../common-ts/packages/game
```
This updates `betakwaaba/package.json` with:
```json
"dependencies": {
  "@common/auth": "file:../common-ts/packages/auth",
  "@common/cashier": "file:../common-ts/packages/cashier",
  "@common/game": "file:../common-ts/packages/game",
  "@common/profile": "file:../common-ts/packages/profile",
  "@common/shared-ui": "file:../common-ts/packages/shared-ui"
}
```

---

### Way B: Private GitHub Packages / NPM Registry (Recommended for Production & CI/CD)

#### 1. Configure `.npmrc` in your user home (`~/.npmrc`) or in each site:
```ini
@company:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

#### 2. Publish from `common-ts`:
```bash
cd D:\suresh\suresh\sveltekit\common-ts
npm run build
npm publish --workspaces --access restricted
```

#### 3. Install in any site via CMD:
```bash
cd D:\suresh\suresh\sveltekit\betakwaaba

npm install @common/auth@1.0.0
npm install @common/game@1.0.0
npm install @common/cashier@1.0.0
npm install @common/profile@1.0.0
npm install @common/shared-ui@1.0.0
```

---

## ⚙️ Step 3: Configure Each Site at Startup

Different sites have different brand IDs (`skinId`), domains, and API endpoints. 
Configure this **once** in the site's root layout (`src/routes/+layout.svelte` or `src/hooks.client.ts`):

### In Betakwaaba (`D:\suresh\suresh\sveltekit\betakwaaba\src\routes\+layout.svelte`):
```typescript
<script lang="ts">
    import { setAppEnvironment } from '@common/auth';

    setAppEnvironment({
        production: true,
        skinId: 'betakwaaba',
        baseUrl: '',
        Domain: 'https://staging.betakwaaba.com',
        cmsUrl: 'https://cms.betakwaaba.com'
    });
</script>
```

### In DC2bet (`D:\suresh\suresh\sveltekit\DC2bet\src\routes\+layout.svelte`):
```typescript
<script lang="ts">
    import { setAppEnvironment } from '@common/auth';

    setAppEnvironment({
        production: true,
        skinId: 'DC2bet',
        baseUrl: '',
        Domain: 'https://dc2bet.com',
        cmsUrl: 'https://cms.dc2bet.com'
    });
</script>
```

---

## 🔄 Step 4: How to Migrate Existing Code (Before vs After)

### 1. Authentication (`Login.svelte`, `Register.svelte`)
#### ❌ Before:
```typescript
import { LoginService } from '$lib/services/loginService';
import { authStore } from '$lib/stores/authStore';
import { validateEmail, validatePassword } from '$lib/utils/validation';
```
#### ✅ After:
```typescript
import { LoginService, authStore, validateEmail, validatePassword } from '@common/auth';
```

---

### 2. Game Launcher & Game Grid (`GameCard.svelte`, `+page.svelte`)
#### ❌ Before:
```typescript
import { launchGame } from '$lib/gameLauncher/launchGame';
import { gameStore, activeProviders } from '$lib/stores/gameStore';
import { gameRepository } from '$lib/repository/gameRepository';
```
#### ✅ After:
```typescript
import { launchGame, gameStore, activeProviders, gameRepository } from '@common/game';
```

---

### 3. Cashier & Deposit (`deposit/+page.svelte`, `balance/+page.svelte`)
#### ❌ Before:
```typescript
import { cashierService } from '$lib/services/cashierService';
import { cashierStore } from '$lib/stores/cashierStore';
```
#### ✅ After:
```typescript
import { cashierService, cashierStore } from '@common/cashier';
```

---

### 4. Player Profile & Account (`profile/+page.svelte`)
#### ❌ Before:
```typescript
import { playerService } from '$lib/services/playerService';
```
#### ✅ After:
```typescript
import { playerService } from '@common/profile';
```

---

### 5. UI Toasts & Modals
#### ❌ Before:
```typescript
import { uiStore } from '$lib/stores/uiStore';
```
#### ✅ After:
```typescript
import { uiStore } from '@common/shared-ui';
```

---

## 🛠️ Step 5: How to Update Packages When You Make Code Changes

When you add a new feature or fix a bug in `common-ts`:

1. Edit the file in `common-ts/packages/<package-name>/src/`
2. Bump the version in `package.json` (e.g. `1.0.0` -> `1.0.1`):
   ```bash
   npm --workspace @common/auth version patch
   ```
3. Rebuild the packages:
   ```bash
   npm run build
   ```
4. Commit and push to Git:
   ```bash
   git add .
   git commit -m "feat(auth): add new auth feature"
   git push origin main
   ```
5. Update in your site:
   ```bash
   cd D:\suresh\suresh\sveltekit\betakwaaba
   npm update @common/auth
   ```
