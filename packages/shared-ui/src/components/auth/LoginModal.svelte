<!-- @common/shared-ui/src/components/auth/LoginModal.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: { login: string; password: string }) => void;
    onclose?: () => void;
    onforgotpassword?: () => void;
    onswitchtoregister?: () => void;
  }

  let {
    isOpen = false,
    isLoading = false,
    errorMessage = null,
    onsubmit,
    onclose,
    onforgotpassword,
    onswitchtoregister
  }: Props = $props();

  let login = $state('');
  let password = $state('');
  let showPassword = $state(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!login.trim() || !password) return;
    onsubmit?.({ login: login.trim(), password });
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="login-title" class="modal-title">Sign In</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      {#if errorMessage}
        <div class="error-alert" role="alert">
          {errorMessage}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="login-form">
        <div class="form-group">
          <label for="login-username">Username or Mobile</label>
          <input
            id="login-username"
            type="text"
            bind:value={login}
            placeholder="Enter username or mobile"
            required
            disabled={isLoading}
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <div class="label-row">
            <label for="login-password">Password</label>
            {#if onforgotpassword}
              <button
                type="button"
                class="link-btn"
                onclick={onforgotpassword}
              >
                Forgot Password?
              </button>
            {/if}
          </div>
          <div class="password-wrapper">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              placeholder="Enter password"
              required
              disabled={isLoading}
              autocomplete="current-password"
            />
            <button
              type="button"
              class="eye-btn"
              onclick={() => (showPassword = !showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {#if showPassword}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              {:else}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {/if}
            </button>
          </div>
        </div>

        <button type="submit" class="submit-btn" disabled={isLoading || !login || !password}>
          {#if isLoading}
            <span class="btn-spinner"></span> Signing in...
          {:else}
            Sign In
          {/if}
        </button>
      </form>

      {#if onswitchtoregister}
        <footer class="modal-footer">
          <span>Don't have an account?</span>
          <button type="button" class="switch-link" onclick={onswitchtoregister}>Create Account</button>
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
    max-width: 420px;
    padding: 24px;
    box-shadow: var(--theme-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
    animation: modalPop 0.25s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
    line-height: 1;
  }

  .close-btn:hover {
    color: var(--theme-text-primary, #f8fafc);
  }

  .error-alert {
    padding: 10px 14px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.85rem;
    margin-bottom: 16px;
  }

  .login-form {
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

  .link-btn, .switch-link {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.82rem;
    color: var(--theme-primary, #f59e0b);
    cursor: pointer;
    font-weight: 600;
  }

  .link-btn:hover, .switch-link:hover {
    text-decoration: underline;
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
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--theme-primary, #f59e0b);
  }

  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .eye-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .submit-btn {
    margin-top: 8px;
    padding: 12px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.88rem;
    color: var(--theme-text-secondary, #94a3b8);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 16px;
  }

  @keyframes modalPop {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
