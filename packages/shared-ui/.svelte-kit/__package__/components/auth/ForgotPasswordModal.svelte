<!-- @common/shared-ui/src/components/auth/ForgotPasswordModal.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: { login: string; phone: string }) => void;
    onclose?: () => void;
    onswitchtologin?: () => void;
  }

  let {
    isOpen = false,
    isLoading = false,
    errorMessage = null,
    onsubmit,
    onclose,
    onswitchtologin
  }: Props = $props();

  let login = $state('');
  let phone = $state('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!login.trim() || !phone.trim()) return;
    onsubmit?.({ login: login.trim(), phone: phone.trim() });
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="forgot-title" class="modal-title">Reset Password</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      <p class="subtitle">Enter your username and registered mobile number to receive a verification OTP.</p>

      {#if errorMessage}
        <div class="error-alert" role="alert">{errorMessage}</div>
      {/if}

      <form onsubmit={handleSubmit} class="forgot-form">
        <div class="form-group">
          <label for="forgot-username">Username</label>
          <input
            id="forgot-username"
            type="text"
            bind:value={login}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="forgot-phone">Registered Mobile Number</label>
          <input
            id="forgot-phone"
            type="tel"
            bind:value={phone}
            placeholder="Enter mobile number"
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" class="submit-btn" disabled={isLoading || !login || !phone}>
          {#if isLoading}
            Sending OTP...
          {:else}
            Send Verification Code
          {/if}
        </button>
      </form>

      {#if onswitchtologin}
        <footer class="modal-footer">
          <span>Remember your password?</span>
          <button type="button" class="switch-link" onclick={onswitchtologin}>Back to Sign In</button>
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
    max-width: 400px;
    padding: 24px;
    box-shadow: var(--theme-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .modal-title {
    font-size: 1.3rem;
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

  .subtitle {
    font-size: 0.85rem;
    color: var(--theme-text-secondary, #94a3b8);
    margin-bottom: 18px;
    line-height: 1.4;
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

  .forgot-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
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

  input {
    width: 100%;
    padding: 10px 12px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-md, 8px);
    color: #f8fafc;
    font-size: 0.9rem;
    box-sizing: border-box;
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
    font-size: 0.86rem;
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
