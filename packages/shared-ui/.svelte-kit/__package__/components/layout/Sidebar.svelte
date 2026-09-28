<!-- @common/shared-ui/src/components/layout/Sidebar.svelte -->
<script lang="ts">
  interface NavItem {
    id: string;
    label: string;
    href?: string;
    icon?: string;
    badge?: string;
  }

  interface Props {
    isOpen?: boolean;
    items?: NavItem[];
    activeId?: string;
    onitemclick?: (item: NavItem) => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    items = [
      { id: 'lobby', label: 'All Games', href: '/' },
      { id: 'slots', label: 'Slots', href: '/slots' },
      { id: 'live', label: 'Live Casino', href: '/live-casino' },
      { id: 'crash', label: 'Crash / Aviator', href: '/crash', badge: 'HOT' },
      { id: 'promotions', label: 'Promotions', href: '/promotions' },
      { id: 'vip', label: 'VIP Club', href: '/vip' }
    ],
    activeId = 'lobby',
    onitemclick,
    onclose
  }: Props = $props();

  function handleClick(item: NavItem) {
    onitemclick?.(item);
    onclose?.();
  }
</script>

{#if isOpen}
  <div class="sidebar-backdrop" onclick={onclose} role="presentation"></div>
{/if}

<aside class="common-sidebar" class:open={isOpen}>
  <div class="sidebar-header">
    <span class="sidebar-title">Menu</span>
    <button type="button" class="close-btn" onclick={onclose} aria-label="Close sidebar">&times;</button>
  </div>

  <nav class="sidebar-nav">
    {#each items as item}
      <a
        href={item.href || '#'}
        class="nav-entry"
        class:active={activeId === item.id}
        onclick={(e) => {
          if (!item.href || item.href === '#') e.preventDefault();
          handleClick(item);
        }}
      >
        {#if item.icon}
          <span class="entry-icon">{item.icon}</span>
        {/if}
        <span class="entry-label">{item.label}</span>
        {#if item.badge}
          <span class="entry-badge">{item.badge}</span>
        {/if}
      </a>
    {/each}
  </nav>
</aside>

<style>
  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99980;
    backdrop-filter: blur(2px);
  }

  .common-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background: #0f172a;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 99985;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    display: flex;
    flex-direction: column;
  }

  .common-sidebar.open {
    transform: translateX(0);
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
  }

  .sidebar-nav {
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }

  .nav-entry {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--theme-radius-md, 8px);
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
  }

  .nav-entry:hover {
    background: #1e293b;
    color: #ffffff;
  }

  .nav-entry.active {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
  }

  .entry-badge {
    margin-left: auto;
    font-size: 0.68rem;
    font-weight: 800;
    padding: 2px 6px;
    background: var(--theme-danger, #ef4444);
    color: #ffffff;
    border-radius: 4px;
  }
</style>
