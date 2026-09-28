<!-- @common/shared-ui/src/components/cashier/DepositModal.svelte -->
<script lang="ts">
  interface PaymentMethod {
    id: string | number;
    name: string;
    icon?: string;
    type?: string;
    min?: number;
    max?: number;
    requiresPhone?: boolean;
    requiresEmail?: boolean;
  }

  interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    currency?: string;
    methods?: PaymentMethod[];
    presets?: number[];
    minAmount?: number;
    maxAmount?: number;
    errorMessage?: string | null;
    onsubmit?: (data: { amount: number; method: PaymentMethod; phone?: string; email?: string }) => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    isLoading = false,
    currency = 'USD',
    methods = [
      { id: 'c2b', name: 'Mobile Money / C2B', requiresPhone: true, min: 10, max: 100000 },
      { id: 'crypto', name: 'Crypto Deposit', min: 20, max: 500000 },
      { id: 'card', name: 'Credit/Debit Card', requiresEmail: true, min: 10, max: 50000 }
    ],
    presets = [100, 200, 500, 1000, 2000, 5000],
    minAmount = 10,
    maxAmount = 500000,
    errorMessage = null,
    onsubmit,
    onclose
  }: Props = $props();

  let selectedMethod = $state<PaymentMethod>(methods[0]);
  let amount = $state<number>(presets[0] || 100);
  let phone = $state('');
  let email = $state('');
  let validationError = $state<string | null>(null);

  function selectPreset(val: number) {
    amount = val;
    validationError = null;
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    validationError = null;

    if (!amount || amount < minAmount || amount > maxAmount) {
      validationError = `Amount must be between ${minAmount} and ${maxAmount} ${currency}`;
      return;
    }

    if (selectedMethod?.requiresPhone && !phone.trim()) {
      validationError = 'Please enter your mobile phone number for deposit';
      return;
    }

    onsubmit?.({
      amount: Number(amount),
      method: selectedMethod,
      phone: phone.trim(),
      email: email.trim()
    });
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deposit-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="deposit-title" class="modal-title">Deposit Funds</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      {#if errorMessage || validationError}
        <div class="error-alert" role="alert">{errorMessage || validationError}</div>
      {/if}

      <form onsubmit={handleSubmit} class="deposit-form">
        <!-- Payment Methods Selector -->
        <div class="form-group">
          <label for="method-selector">Select Payment Method</label>
          <div id="method-selector" class="methods-grid">
            {#each methods as m}
              <button
                type="button"
                class="method-btn"
                class:active={selectedMethod?.id === m.id}
                onclick={() => (selectedMethod = m)}
              >
                {#if m.icon}
                  <img src={m.icon} alt="" class="method-icon" />
                {/if}
                <span>{m.name}</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Presets -->
        <div class="form-group">
          <label for="presets-row">Select Amount ({currency})</label>
          <div id="presets-row" class="presets-row">
            {#each presets as p}
              <button
                type="button"
                class="preset-btn"
                class:active={amount === p}
                onclick={() => selectPreset(p)}
              >
                +{p}
              </button>
            {/each}
          </div>
        </div>

        <!-- Custom Amount -->
        <div class="form-group">
          <label for="deposit-amount">Or Enter Custom Amount</label>
          <div class="input-with-currency">
            <span class="currency-prefix">{currency}</span>
            <input
              id="deposit-amount"
              type="number"
              bind:value={amount}
              min={minAmount}
              max={maxAmount}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {#if selectedMethod?.requiresPhone}
          <div class="form-group">
            <label for="deposit-phone">Mobile Phone (M-Pesa / Mobile Money)</label>
            <input
              id="deposit-phone"
              type="tel"
              bind:value={phone}
              placeholder="e.g. 712345678"
              required
              disabled={isLoading}
            />
          </div>
        {/if}

        <button type="submit" class="submit-btn" disabled={isLoading || !amount || amount <= 0}>
          {#if isLoading}
            Processing Deposit...
          {:else}
            Deposit {amount ? `${amount} ${currency}` : ''}
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
    margin-bottom: 18px;
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

  .error-alert {
    padding: 8px 12px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.84rem;
    margin-bottom: 14px;
  }

  .deposit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--theme-text-secondary, #94a3b8);
  }

  .methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 8px;
  }

  .method-btn {
    padding: 10px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--theme-radius-md, 8px);
    color: #cbd5e1;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .method-btn.active {
    border-color: var(--theme-primary, #f59e0b);
    background: rgba(245, 158, 11, 0.12);
    color: var(--theme-primary, #f59e0b);
  }

  .presets-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .preset-btn {
    padding: 9px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--theme-radius-sm, 6px);
    color: #f8fafc;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .preset-btn:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  .preset-btn.active {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border-color: var(--theme-primary, #f59e0b);
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
