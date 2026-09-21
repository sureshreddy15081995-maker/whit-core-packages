# Common TypeScript Packages (`common-ts`)

A modular TypeScript monorepo providing shared services, stores, game launchers, cashier workflows, and UI state across multiple gaming and betting web applications (e.g., **Betakwaaba**, **DC2bet**, **USKOBET**, and new sites).

---

## 📁 Repository Structure

```text
common-ts/
│
├── packages/
│   ├── auth/
│   │   ├── src/
│   │   │   ├── services/loginService.ts
│   │   │   ├── stores/authStore.ts
│   │   │   ├── utils/validation.ts
│   │   │   ├── environment.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── game/
│   │   ├── src/
│   │   │   ├── gameLauncher/
│   │   │   │   ├── launchgame.ts
│   │   │   │   ├── provider.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── urlbuilder.ts
│   │   │   ├── repository/gameRepository.ts
│   │   │   ├── services/gamecmsService.ts
│   │   │   ├── stores/
│   │   │   │   ├── gameRepositoryStore.ts
│   │   │   │   └── gameStore.ts
│   │   │   ├── types/game.ts
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   └── gameSorter.ts
│   │   │   ├── workers/game.worker.ts
│   │   │   ├── environment.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── cashier/
│   │   ├── src/
│   │   │   ├── services/cashierService.ts
│   │   │   ├── stores/cashierStore.ts
│   │   │   ├── environment.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── profile/
│   │   ├── src/
│   │   │   ├── services/playerService.ts
│   │   │   ├── environment.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── shared-ui/
│       ├── src/
│       │   ├── stores/uistore.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── tsconfig.base.json
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 1. How to Initialize and Push to Git

To push this `common-ts` repository to your Git host (GitHub, GitLab, Bitbucket):

### Step 1: Initialize Git
Open your command terminal:
```bash
cd D:\suresh\suresh\sveltekit\common-ts
git init
```

### Step 2: Stage and Commit All Files
```bash
git add .
git commit -m "feat: initial commit of common-ts shared packages"
```

### Step 3: Add Your Remote Repository and Push
Create a new empty repository in your GitHub/GitLab organization (e.g. `https://github.com/your-org/common-ts.git`), then run:
```bash
git branch -M main
git remote add origin https://github.com/your-org/common-ts.git
git push -u origin main
```

---

## 📦 2. How to Publish & Use via CMD in New Sites

Depending on your organization's infrastructure, choose one of the following methods:

### Method A: Publish to GitHub Packages / Private NPM (Recommended)

#### 1. Add `.npmrc` in `common-ts`:
Create a `.npmrc` file in `common-ts/` (or in user home `~/.npmrc`):
```ini
@company:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```
*(Replace `@company` with your organization scope name if different).*

#### 2. Build and Publish:
```bash
cd D:\suresh\suresh\sveltekit\common-ts
npm run build
npm publish --workspaces --access restricted
```

#### 3. Install in Any Site (e.g., Betakwaaba, DC2bet, or New Site):
In the project directory:
```bash
cd D:\suresh\suresh\sveltekit\betakwaaba

# Add the same .npmrc pointing to your registry, then install:
npm install @common/auth@1.0.0
npm install @common/game@1.0.0
npm install @common/cashier@1.0.0
npm install @common/profile@1.0.0
npm install @common/shared-ui@1.0.0
```

---

### Method B: Local Linking for Development (Instant No-Publish Workflow)

During local development across sibling project directories (`betakwaaba`, `DC2bet`, etc.):

```bash
cd D:\suresh\suresh\sveltekit\betakwaaba

# Install directly from the local folder:
npm install file:../common-ts/packages/shared-ui
npm install file:../common-ts/packages/cashier
npm install file:../common-ts/packages/profile
npm install file:../common-ts/packages/auth
npm install file:../common-ts/packages/game
```
Whenever you update code in `common-ts`, run `npm run build` in `common-ts` and your site will immediately reflect the changes.

---

### Method C: Single Packed Tarballs via CMD

You can also generate `.tgz` packages via command line and distribute or install them directly:
```bash
cd D:\suresh\suresh\sveltekit\common-ts
npm run build

# Generate tarballs for each package
npm pack -w @common/shared-ui
npm pack -w @common/cashier
npm pack -w @common/profile
npm pack -w @common/auth
npm pack -w @common/game
```
Then install in your site:
```bash
npm install ../common-ts/company-auth-1.0.0.tgz
```

---

## ⚙️ 3. Multi-Site Configuration (`skinId` & Endpoints)

Each site has its own `skinId` (e.g. `'betakwaaba'`, `'DC2bet'`) and base URL. You can configure this once at app startup in your root layout (e.g. `src/routes/+layout.svelte` or `src/hooks.client.ts`):

```typescript
import { setAppEnvironment } from '@common/auth'; // or from @common/game / @common/cashier

setAppEnvironment({
    production: true,
    skinId: 'betakwaaba', // or 'DC2bet'
    baseUrl: '',
    Domain: 'https://staging.betakwaaba.com',
    cmsUrl: 'https://cms.betakwaaba.com'
});
```

---

## 💻 4. Code Usage Examples

### 1. Authentication & Validation (`@common/auth`)
```typescript
import { LoginService, authStore, validateEmail, validatePassword } from '@common/auth';

// Reactive store subscription
$authStore.loading;
$authStore.playerLoggedIn.loggedIn;

// Login action
const result = await LoginService.onLogin({
    username: 'player1',
    password: 'password123'
});
```

### 2. Game Launch & Repository (`@common/game`)
```typescript
import { launchGame, gameStore, gameRepository, activeProviders } from '@common/game';

// Launch a game
const gameUrl = await launchGame(selectedGame);

// Fetch games and providers
await gameStore.loadData();
```

### 3. Cashier & Transactions (`@common/cashier`)
```typescript
import { cashierService, cashierStore } from '@common/cashier';

// Fetch balance
await cashierService.onCashierGetBalance();

// Reactive balance state
$cashierStore.balance;
```

### 4. Player Profile (`@common/profile`)
```typescript
import { playerService } from '@common/profile';

await playerService.onPlayerGetProfile();
```

### 5. Shared UI & Toasts (`@common/shared-ui`)
```typescript
import { uiStore } from '@common/shared-ui';

// Trigger UI toast or modal
uiStore.showToast('success', 'Welcome', 'Login successful!');
uiStore.openLogin();
```

---

## 🛠️ Build and Development Scripts

In the root `common-ts/` folder:
- **`npm run build`**: Compiles all packages in dependency order to ESM (`dist/*.js`) and TypeScript declarations (`dist/*.d.ts`).
- **`npm run clean`**: Cleans up all `dist/` folders.
