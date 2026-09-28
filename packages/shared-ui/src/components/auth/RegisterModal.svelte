<!-- @common/shared-ui/src/components/auth/RegisterModal.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    currency?: string;
    requireEmail?: boolean;
    requirePhone?: boolean;
    requireReferral?: boolean;
    onsubmit?: (data: any) => void;
    onclose?: () => void;
    onswitchtologin?: () => void;
  }

  let {
    isOpen = false,
    isLoading = false,
    errorMessage = null,
    currency = 'USD',
    requireEmail = true,
    requirePhone = true,
    requireReferral = false,
    onsubmit,
    onclose,
    onswitchtologin
  }: Props = $props();

  let login = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let phone = $state('');
  let email = $state('');
  let referralCode = $state('');
  let agreeTerms = $state(true);
  let localError = $state<string | null>(null);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    localError = null;

    if (password !== confirmPassword) {
      localError = 'Passwords do not match';
      return;
    }
    if (!agreeTerms) {
      localError = 'You must agree to the Terms & Conditions';
      return;
    }

    const payload: any = {
      login: login.trim(),
      password,
      currency
    };
    if (phone) payload.phone = phone.trim();
    if (email) payload.email = email.trim();
    if (referralCode) payload.referralCode = referralCode.trim();

    onsubmit?.(payload);
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="reg-title" class="modal-title">Create Account</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      {#if errorMessage || localError}
        <div class="error-alert" role="alert">
          {errorMessage || localError}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="reg-form">
        <div class="form-group">
          <label for="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            bind:value={login}
            placeholder="Choose username"
            required
            disabled={isLoading}
          />
        </div>

        {#if requirePhone}
          <div class="form-group">
            <label for="reg-phone">Mobile Number</label>
            <input
              id="reg-phone"
              type="tel"
              bind:value={phone}
              placeholder="e.g. 712345678"
              required={requirePhone}
              disabled={isLoading}
            />
          </div>
        {/if}

        {#if requireEmail}
          <div class="form-group">
            <label for="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              bind:value={email}
              placeholder="Enter email"
              required={requireEmail}
              disabled={isLoading}
            />
          </div>
        {/if}

        <div class="form-row">
          <div class="form-group">
            <label for="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              bind:value={password}
              placeholder="Min 8 chars"
              required
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="reg-confirm">Confirm</label>
            <input
              id="reg-confirm"
              type="password"
              bind:value={confirmPassword}
              placeholder="Confirm password"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {#if requireReferral}
          <div class="form-group">
            <label for="reg-ref">Referral Code (Optional)</label>
            <input
              id="reg-ref"
              type="text"
              bind:value={referralCode}
              placeholder="Promo or referral code"
              disabled={isLoading}
            />
          </div>
        {/if}

        <label class="checkbox-label">
          <input type="checkbox" bind:checked={agreeTerms} required />
          <span>I am 18+ and agree to the Terms & Conditions</span>
        </label>

        <button type="submit" class="submit-btn" disabled={isLoading || !login || !password}>
          {#if isLoading}
            Creating Account...
          {:else}
            Register Now
          {/if}
        </button>
      </form>

      {#if onswitchtologin}
        <footer class="modal-footer">
          <span>Already have an account?</span>
          <button type="button" class="switch-link" onclick={onswitchtologin}>Sign In</button>
        </footer>
      {/if}
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
    padding: 10px 14px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.85rem;
    margin-bottom: 14px;
  }

  .reg-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--theme-text-secondary, #94a3b8);
  }

  input[type='text'],
  input[type='password'],
  input[type='tel'],
  input[type='email'] {
    width: 100%;
    padding: 10px 12px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-md, 8px);
    color: #f8fafc;
    font-size: 0.9rem;
    box-sizing: border-box;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--theme-text-secondary, #94a3b8);
    cursor: pointer;
  }

  .submit-btn {
    margin-top: 6px;
    padding: 12px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-footer {
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.88rem;
    color: var(--theme-text-secondary, #94a3b8);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 14px;
  }

  .switch-link {
    background: none;
    border: none;
    color: var(--theme-primary, #f59e0b);
    cursor: pointer;
    font-weight: 600;
  }
</style>
