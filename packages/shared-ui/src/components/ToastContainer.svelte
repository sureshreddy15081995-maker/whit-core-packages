<!-- @common/shared-ui/src/components/ToastContainer.svelte -->
<script lang="ts">
  import { toastState } from '../state/toastState.svelte';
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each toastState.toasts as toast (toast.id)}
    <div class="toast-item {toast.type}" role="alert">
      <div class="toast-icon">
        {#if toast.type === 'success'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {:else if toast.type === 'error'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        {:else if toast.type === 'warning'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        {/if}
      </div>

      <div class="toast-content">
        {#if toast.title}
          <div class="toast-title">{toast.title}</div>
        {/if}
        <div class="toast-message">{toast.message}</div>
      </div>

      <button
        type="button"
        class="toast-close"
        onclick={() => toastState.dismiss(toast.id)}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 99999;
    max-width: 380px;
    width: calc(100% - 40px);
    pointer-events: none;
  }

  .toast-item {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--theme-radius-md, 10px);
    background: #1e293b;
    color: #f8fafc;
    border-left: 4px solid;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
  }

  .toast-item.success {
    border-left-color: var(--theme-success, #10b981);
  }
  .toast-item.success .toast-icon {
    color: var(--theme-success, #10b981);
  }

  .toast-item.error {
    border-left-color: var(--theme-danger, #ef4444);
  }
  .toast-item.error .toast-icon {
    color: var(--theme-danger, #ef4444);
  }

  .toast-item.warning {
    border-left-color: var(--theme-warning, #f59e0b);
  }
  .toast-item.warning .toast-icon {
    color: var(--theme-warning, #f59e0b);
  }

  .toast-item.info {
    border-left-color: var(--theme-secondary, #3b82f6);
  }
  .toast-item.info .toast-icon {
    color: var(--theme-secondary, #3b82f6);
  }

  .toast-icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .toast-content {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    font-weight: 700;
    font-size: 0.88rem;
    margin-bottom: 2px;
  }

  .toast-message {
    font-size: 0.82rem;
    color: #cbd5e1;
    line-height: 1.4;
    word-break: break-word;
  }

  .toast-close {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    align-self: flex-start;
  }

  .toast-close:hover {
    color: #ffffff;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
