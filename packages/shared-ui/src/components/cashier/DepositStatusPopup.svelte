<!-- @common/shared-ui/src/components/cashier/DepositStatusPopup.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    status?: 'success' | 'pending' | 'failed' | null;
    amount?: number | string;
    currency?: string;
    transactionId?: string | number;
    message?: string;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    status = 'success',
    amount = '',
    currency = 'USD',
    transactionId = '',
    message = '',
    onclose
  }: Props = $props();
</script>

{#if isOpen && status}
  <div class="status-backdrop" onclick={onclose} role="presentation">
    <div
      class="status-card"
      class:is-success={status === 'success'}
      class:is-pending={status === 'pending'}
      class:is-failed={status === 'failed'}
      role="dialog"
      aria-modal="true"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="icon-circle">
        {#if status === 'success'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else if status === 'pending'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        {:else}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        {/if}
      </div>

      <h2 class="status-heading">
        {#if status === 'success'}
          Deposit Successful!
        {:else if status === 'pending'}
          Deposit Pending Approval
        {:else}
          Deposit Failed
        {/if}
      </h2>

      {#if amount}
        <div class="amount-tag">
          {amount} {currency}
        </div>
      {/if}

      <p class="status-description">
        {#if message}
          {message}
        {:else if status === 'success'}
          Your account has been credited successfully. Good luck playing!
        {:else if status === 'pending'}
          We are awaiting confirmation from your payment provider. This usually takes 1-2 minutes.
        {:else}
          Your transaction could not be completed. Please verify your payment details and retry.
        {/if}
      </p>

      {#if transactionId}
        <div class="ref-row">
          <span>Reference ID:</span>
          <strong>{transactionId}</strong>
        </div>
      {/if}

      <button type="button" class="btn-done" onclick={onclose}>
        {status === 'failed' ? 'Close & Try Again' : 'Done'}
      </button>
    </div>
  </div>
{/if}

<style>
  .status-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99995;
    background: var(--theme-modal-overlay, rgba(0, 0, 0, 0.75));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(4px);
  }

  .status-card {
    background: var(--theme-modal-bg, #1e293b);
    border: 1px solid var(--theme-card-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--theme-radius-lg, 16px);
    width: 100%;
    max-width: 380px;
    padding: 28px 24px;
    text-align: center;
    box-shadow: var(--theme-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
  }

  .icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto 16px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .is-success .icon-circle {
    background: rgba(16, 185, 129, 0.15);
    color: var(--theme-success, #10b981);
    border: 2px solid var(--theme-success, #10b981);
  }

  .is-pending .icon-circle {
    background: rgba(245, 158, 11, 0.15);
    color: var(--theme-warning, #f59e0b);
    border: 2px solid var(--theme-warning, #f59e0b);
  }

  .is-failed .icon-circle {
    background: rgba(239, 68, 68, 0.15);
    color: var(--theme-danger, #ef4444);
    border: 2px solid var(--theme-danger, #ef4444);
  }

  .status-heading {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--theme-text-primary, #f8fafc);
    margin: 0 0 8px 0;
  }

  .amount-tag {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--theme-primary, #f59e0b);
    margin-bottom: 12px;
  }

  .status-description {
    font-size: 0.88rem;
    color: var(--theme-text-secondary, #94a3b8);
    line-height: 1.45;
    margin: 0 0 16px 0;
  }

  .ref-row {
    font-size: 0.78rem;
    color: var(--theme-text-muted, #64748b);
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    gap: 6px;
  }

  .btn-done {
    width: 100%;
    padding: 12px;
    border-radius: var(--theme-radius-md, 8px);
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
  }
</style>
