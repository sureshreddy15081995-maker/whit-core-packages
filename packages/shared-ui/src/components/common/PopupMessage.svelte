<!-- @common/shared-ui/src/components/common/PopupMessage.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    type = 'info',
    title = 'Notification',
    message = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
    onconfirm,
    oncancel,
    onclose
  }: Props = $props();

  function handleConfirm() {
    onconfirm?.();
    onclose?.();
  }

  function handleCancel() {
    oncancel?.();
    onclose?.();
  }
</script>

{#if isOpen}
  <div class="popup-backdrop" onclick={onclose} role="presentation">
    <div
      class="popup-card"
      role="dialog"
      aria-modal="true"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="type-icon {type}">
        {#if type === 'success'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {:else if type === 'error'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        {:else if type === 'warning'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        {/if}
      </div>

      <h3 class="popup-title">{title}</h3>
      <p class="popup-body">{message}</p>

      <div class="popup-actions">
        {#if showCancel}
          <button type="button" class="btn-cancel" onclick={handleCancel}>{cancelText}</button>
        {/if}
        <button type="button" class="btn-confirm" onclick={handleConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99992;
    background: var(--theme-modal-overlay, rgba(0, 0, 0, 0.75));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(4px);
  }

  .popup-card {
    background: var(--theme-modal-bg, #1e293b);
    border: 1px solid var(--theme-card-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--theme-radius-lg, 16px);
    width: 100%;
    max-width: 380px;
    padding: 24px;
    text-align: center;
    box-shadow: var(--theme-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
  }

  .type-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    margin: 0 auto 14px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .type-icon.success { background: rgba(16, 185, 129, 0.15); color: var(--theme-success, #10b981); }
  .type-icon.error { background: rgba(239, 68, 68, 0.15); color: var(--theme-danger, #ef4444); }
  .type-icon.warning { background: rgba(245, 158, 11, 0.15); color: var(--theme-warning, #f59e0b); }
  .type-icon.info { background: rgba(59, 130, 246, 0.15); color: var(--theme-secondary, #3b82f6); }

  .popup-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--theme-text-primary, #f8fafc);
    margin: 0 0 8px 0;
  }

  .popup-body {
    font-size: 0.88rem;
    color: var(--theme-text-secondary, #94a3b8);
    line-height: 1.45;
    margin: 0 0 20px 0;
  }

  .popup-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn-confirm {
    flex: 1;
    padding: 11px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-cancel {
    flex: 1;
    padding: 11px;
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
  }
</style>
