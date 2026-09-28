<!-- @common/shared-ui/src/components/layout/Header.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    isLoggedIn?: boolean;
    username?: string | null;
    balance?: number | string;
    currency?: string;
    avatarUrl?: string;
    logoUrl?: string;
    siteName?: string;
    onloginclick?: () => void;
    onregisterclick?: () => void;
    ondepositclick?: () => void;
    onprofileclick?: () => void;
    onlogoutclick?: () => void;
    ontogglesidebar?: () => void;
    children?: Snippet;
  }

  let {
    isLoggedIn = false,
    username = '',
    balance = '0.00',
    currency = 'USD',
    avatarUrl = '',
    logoUrl = '',
    siteName = 'Casino',
    onloginclick,
    onregisterclick,
    ondepositclick,
    onprofileclick,
    onlogoutclick,
    ontogglesidebar,
    children
  }: Props = $props();

  let showUserMenu = $state(false);
</script>

<header class="common-header">
  <div class="header-left">
    <button
      type="button"
      class="mobile-menu-btn"
      onclick={ontogglesidebar}
      aria-label="Toggle Navigation"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <a href="/" class="brand-logo" aria-label="{siteName} Home">
      {#if logoUrl}
        <img src={logoUrl} alt={siteName} class="logo-img" />
      {:else}
        <span class="logo-text">{siteName}</span>
      {/if}
    </a>

    {#if children}
      <div class="nav-links">
        {@render children()}
      </div>
    {/if}
  </div>

  <div class="header-right">
    {#if isLoggedIn}
      <!-- Balance Display -->
      <div class="balance-badge">
        <span class="currency-tag">{currency}</span>
        <span class="balance-num">{balance}</span>
      </div>

      <!-- Deposit Button -->
      <button type="button" class="btn-deposit" onclick={ondepositclick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Deposit</span>
      </button>

      <!-- User Profile Menu -->
      <div class="user-menu-wrapper">
        <button
          type="button"
          class="user-profile-btn"
          onclick={() => (showUserMenu = !showUserMenu)}
          aria-label="User Account"
        >
          {#if avatarUrl}
            <img src={avatarUrl} alt="" class="user-avatar" />
          {:else}
            <div class="user-avatar-placeholder">
              {(username || 'U')[0].toUpperCase()}
            </div>
          {/if}
          <span class="user-name-text">{username}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {#if showUserMenu}
          <!-- Backdrop to close user menu -->
          <div class="menu-backdrop" onclick={() => (showUserMenu = false)} role="presentation"></div>
          <div class="user-dropdown-menu">
            <button
              class="dropdown-item"
              onclick={() => { showUserMenu = false; onprofileclick?.(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Profile & Security
            </button>
            <button
              class="dropdown-item"
              onclick={() => { showUserMenu = false; ondepositclick?.(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              Cashier / Deposit
            </button>
            <div class="menu-divider"></div>
            <button
              class="dropdown-item logout"
              onclick={() => { showUserMenu = false; onlogoutclick?.(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Guest Auth Buttons -->
      <button type="button" class="btn-login" onclick={onloginclick}>Sign In</button>
      <button type="button" class="btn-register" onclick={onregisterclick}>Register</button>
    {/if}
  </div>
</header>

<style>
  .common-header {
    height: 64px;
    background: #0f172a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-menu-btn {
    background: none;
    border: none;
    color: #f8fafc;
    padding: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  .brand-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-img {
    height: 38px;
    object-fit: contain;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--theme-primary, #f59e0b);
    letter-spacing: 0.5px;
  }

  .nav-links {
    display: none;
    margin-left: 20px;
    align-items: center;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    .nav-links {
      display: flex;
    }
  }

  .balance-badge {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 12px;
    border-radius: var(--theme-radius-full, 9999px);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .currency-tag {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--theme-text-muted, #64748b);
  }

  .balance-num {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--theme-primary, #f59e0b);
  }

  .btn-deposit {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    padding: 8px 16px;
    border-radius: var(--theme-radius-full, 9999px);
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.2s;
  }

  .btn-deposit:hover {
    opacity: 0.9;
  }

  .user-menu-wrapper {
    position: relative;
  }

  .user-profile-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #f8fafc;
    padding: 4px;
  }

  .user-avatar, .user-avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-avatar-placeholder {
    background: var(--theme-secondary, #3b82f6);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .user-name-text {
    font-size: 0.85rem;
    font-weight: 600;
    display: none;
  }

  @media (min-width: 640px) {
    .user-name-text {
      display: inline-block;
    }
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1001;
  }

  .user-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 200px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--theme-radius-md, 10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    padding: 6px 0;
    z-index: 1002;
  }

  .dropdown-item {
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: #cbd5e1;
    font-size: 0.85rem;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  .dropdown-item.logout {
    color: var(--theme-danger, #ef4444);
  }

  .menu-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 6px 0;
  }

  .btn-login {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #f8fafc;
    padding: 8px 16px;
    border-radius: var(--theme-radius-full, 9999px);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-register {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    padding: 8px 18px;
    border-radius: var(--theme-radius-full, 9999px);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
  }
</style>
