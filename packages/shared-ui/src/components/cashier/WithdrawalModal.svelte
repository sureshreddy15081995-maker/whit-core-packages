<!-- @common/shared-ui/src/components/cashier/WithdrawalModal.svelte -->
<script lang="ts">
  interface BankAccount {
    id: string | number;
    accountNumber: string;
    bankName: string;
    holderName?: string;
    ifsc?: string;
  }

  interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    currency?: string;
    availableBalance?: number;
    minWithdrawal?: number;
    maxWithdrawal?: number;
    bankAccounts?: BankAccount[];
    errorMessage?: string | null;
    onsubmit?: (data: { amount: number; account: BankAccount }) => void;
    onaddaccount?: () => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    isLoading = false,
    currency = 'USD',
    availableBalance = 0,
    minWithdrawal = 10,
    maxWithdrawal = 100000,
    bankAccounts = [],
    errorMessage = null,
    onsubmit,
    onaddaccount,
    onclose
  }: Props = $props();

  let selectedAccountId = $state<string | number>(bankAccounts[0]?.id ?? '');
  let amount = $state<number>(minWithdrawal);
  let localError = $state<string | null>(null);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    localError = null;

    if (!amount || amount < minWithdrawal || amount > maxWithdrawal) {
      localError = `Withdrawal amount must be between ${minWithdrawal} and ${maxWithdrawal} ${currency}`;
      return;
    }

    if (amount > availableBalance) {
      localError = 'Amount exceeds available balance';
      return;
    }

    const acct = bankAccounts.find((a) => a.id === selectedAccountId);
    if (!acct) {
      localError = 'Please select a valid bank account for payout';
      return;
    }

    onsubmit?.({ amount: Number(amount), account: acct });
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdraw-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="withdraw-title" class="modal-title">Withdraw Funds</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      <div class="balance-banner">
        <span class="label">Available for Withdrawal</span>
        <span class="value">{availableBalance} {currency}</span>
      </div>

      {#if errorMessage || localError}
        <div class="error-alert" role="alert">{errorMessage || localError}</div>
      {/if}

      <form onsubmit={handleSubmit} class="withdraw-form">
        <!-- Account Selection -->
        <div class="form-group">
          <div class="label-row">
            <label for="bank-acct">Destination Account</label>
            {#if onaddaccount}
              <button type="button" class="add-btn" onclick={onaddaccount}>+ Add New Account</button>
            {/if}
          </div>

          {#if bankAccounts.length > 0}
            <select id="bank-acct" bind:value={selectedAccountId} required disabled={isLoading}>
              {#each bankAccounts as b}
                <option value={b.id}>{b.bankName} - {b.accountNumber} ({b.holderName || 'Account'})</option>
              {/each}
            </select>
          {:else}
            <div class="no-accounts-alert">
              No linked accounts found. Please add a bank or mobile wallet first.
            </div>
          {/if}
        </div>

        <!-- Amount -->
        <div class="form-group">
          <label for="withdraw-amount">Amount ({currency})</label>
          <div class="input-with-currency">
            <span class="currency-prefix">{currency}</span>
            <input
              id="withdraw-amount"
              type="number"
              bind:value={amount}
              min={minWithdrawal}
              max={Math.min(maxWithdrawal, availableBalance)}
              required
              disabled={isLoading || bankAccounts.length === 0}
            />
          </div>
        </div>

        <button
          type="submit"
          class="submit-btn"
          disabled={isLoading || bankAccounts.length === 0 || amount <= 0 || amount > availableBalance}
        >
          {#if isLoading}
            Requesting Cashout...
          {:else}
            Withdraw {amount ? `${amount} ${currency}` : ''}
          {/if}
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99990;
    background: var(--theme-modal-overlay, rgba(0, 0, 0, 0.75));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(4px);
  }

  .modal-card {
    background: var(--theme-modal-bg, #1e293b);
    border: 1px solid var(--theme-card-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--theme-radius-lg, 16px);
    width: 100%;
    max-width: 440px;
    padding: 24px;
    box-shadow: var(--theme-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .modal-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--theme-text-primary, #f8fafc);
    margin: 0;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: var(--theme-text-muted, #64748b);
    cursor: pointer;
  }

  .balance-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: var(--theme-radius-md, 8px);
    margin-bottom: 16px;
  }

  .balance-banner .label {
    font-size: 0.82rem;
    color: #cbd5e1;
  }

  .balance-banner .value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--theme-primary, #f59e0b);
  }

  .error-alert {
    padding: 8px 12px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.84rem;
    margin-bottom: 14px;
  }

  .withdraw-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--theme-text-secondary, #94a3b8);
  }

  .add-btn {
    background: none;
    border: none;
    color: var(--theme-primary, #f59e0b);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
  }

  select {
    width: 100%;
    padding: 11px 14px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-md, 8px);
    color: #f8fafc;
    font-size: 0.92rem;
    box-sizing: border-box;
  }

  .no-accounts-alert {
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px dashed var(--theme-danger, #ef4444);
    border-radius: var(--theme-radius-sm, 6px);
    color: #fca5a5;
    font-size: 0.82rem;
  }

  .input-with-currency {
    position: relative;
    display: flex;
    align-items: center;
  }

  .currency-prefix {
    position: absolute;
    left: 14px;
    font-weight: 700;
    color: var(--theme-text-muted, #64748b);
    font-size: 0.9rem;
  }

  .input-with-currency input {
    padding-left: 58px;
  }

  input {
    width: 100%;
    padding: 11px 14px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-md, 8px);
    color: #f8fafc;
    font-size: 0.92rem;
    box-sizing: border-box;
  }

  .submit-btn {
    margin-top: 8px;
    padding: 13px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
