<!-- @common/shared-ui/src/components/auth/ResetPasswordModal.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    token?: string;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: { password: string; token: string }) => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    token = '',
    isLoading = false,
    errorMessage = null,
    onsubmit,
    onclose
  }: Props = $props();

  let newPassword = $state('');
  let confirmPassword = $state('');
  let localError = $state<string | null>(null);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    localError = null;

    if (newPassword.length < 8) {
      localError = 'Password must be at least 8 characters';
      return;
    }

    if (newPassword !== confirmPassword) {
      localError = 'Passwords do not match';
      return;
    }

    onsubmit?.({ password: newPassword, token });
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="reset-title" class="modal-title">Set New Password</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      {#if errorMessage || localError}
        <div class="error-alert" role="alert">{errorMessage || localError}</div>
      {/if}

      <form onsubmit={handleSubmit} class="reset-form">
        <div class="form-group">
          <label for="reset-pass">New Password</label>
          <input
            id="reset-pass"
            type="password"
            bind:value={newPassword}
            placeholder="Min 8 characters"
            required
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="reset-confirm">Confirm New Password</label>
          <input
            id="reset-confirm"
            type="password"
            bind:value={confirmPassword}
            placeholder="Re-enter new password"
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" class="submit-btn" disabled={isLoading || !newPassword || !confirmPassword}>
          {#if isLoading}
            Updating Password...
          {:else}
            Update Password
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
    max-width: 400px;
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

  .error-alert {
    padding: 8px 12px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.84rem;
    margin-bottom: 14px;
  }

  .reset-form {
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
</style>
