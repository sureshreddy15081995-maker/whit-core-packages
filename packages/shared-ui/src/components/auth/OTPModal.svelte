<!-- @common/shared-ui/src/components/auth/OTPModal.svelte -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  interface Props {
    isOpen?: boolean;
    mobile?: string;
    isLoading?: boolean;
    errorMessage?: string | null;
    timerSeconds?: number;
    onsubmit?: (otp: string) => void;
    onresend?: () => void;
    onclose?: () => void;
  }

  let {
    isOpen = false,
    mobile = '',
    isLoading = false,
    errorMessage = null,
    timerSeconds = 60,
    onsubmit,
    onresend,
    onclose
  }: Props = $props();

  let digits = $state(['', '', '', '', '', '']);
  let countdown = $state(timerSeconds);
  let intervalTimer: any = null;
  let inputRefs: HTMLInputElement[] = [];

  function startCountdown() {
    countdown = timerSeconds;
    if (intervalTimer) clearInterval(intervalTimer);
    intervalTimer = setInterval(() => {
      if (countdown > 0) {
        countdown--;
      } else {
        clearInterval(intervalTimer);
        intervalTimer = null;
      }
    }, 1000);
  }

  function handleInput(index: number, e: Event) {
    const input = e.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    digits[index] = val ? val[val.length - 1] : '';

    if (val && index < 5) {
      inputRefs[index + 1]?.focus();
    }

    const fullCode = digits.join('');
    if (fullCode.length === 6) {
      onsubmit?.(fullCode);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const paste = e.clipboardData?.getData('text') || '';
    const cleanDigits = paste.replace(/\D/g, '').slice(0, 6).split('');
    cleanDigits.forEach((d, i) => {
      digits[i] = d;
    });
    if (cleanDigits.length === 6) {
      onsubmit?.(digits.join(''));
    }
  }

  function handleResend() {
    if (countdown > 0) return;
    digits = ['', '', '', '', '', ''];
    startCountdown();
    onresend?.();
  }

  onMount(() => {
    startCountdown();
  });

  onDestroy(() => {
    if (intervalTimer) clearInterval(intervalTimer);
  });
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onclose} role="presentation">
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
      onclick={(e) => e.stopPropagation()}
    >
      <header class="modal-header">
        <h2 id="otp-title" class="modal-title">Verification Code</h2>
        <button type="button" class="close-btn" onclick={onclose} aria-label="Close modal">&times;</button>
      </header>

      <p class="subtitle">
        Enter the 6-digit code sent to
        <span class="mobile-highlight">{mobile || 'your phone'}</span>
      </p>

      {#if errorMessage}
        <div class="error-alert" role="alert">{errorMessage}</div>
      {/if}

      <div class="otp-inputs" onpaste={handlePaste}>
        {#each digits as digit, index}
          <input
            bind:this={inputRefs[index]}
            type="text"
            inputmode="numeric"
            maxlength="1"
            value={digit}
            oninput={(e) => handleInput(index, e)}
            onkeydown={(e) => handleKeyDown(index, e)}
            class="otp-box"
            disabled={isLoading}
          />
        {/each}
      </div>

      <div class="resend-row">
        {#if countdown > 0}
          <span class="countdown">Resend code in {countdown}s</span>
        {:else}
          <button type="button" class="resend-btn" onclick={handleResend} disabled={isLoading}>
            Resend Code
          </button>
        {/if}
      </div>

      <button
        type="button"
        class="verify-btn"
        disabled={isLoading || digits.join('').length < 6}
        onclick={() => onsubmit?.(digits.join(''))}
      >
        {#if isLoading}
          Verifying...
        {:else}
          Verify & Continue
        {/if}
      </button>
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
    text-align: center;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .modal-title {
    font-size: 1.25rem;
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
    font-size: 0.88rem;
    color: var(--theme-text-secondary, #94a3b8);
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .mobile-highlight {
    color: var(--theme-primary, #f59e0b);
    font-weight: 600;
  }

  .error-alert {
    padding: 8px 12px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--theme-danger, #ef4444);
    color: #fca5a5;
    border-radius: var(--theme-radius-sm, 6px);
    font-size: 0.84rem;
    margin-bottom: 16px;
  }

  .otp-inputs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .otp-box {
    width: 44px;
    height: 52px;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--theme-radius-md, 8px);
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s;
  }

  .otp-box:focus {
    border-color: var(--theme-primary, #f59e0b);
  }

  .resend-row {
    margin-bottom: 20px;
    font-size: 0.85rem;
  }

  .countdown {
    color: var(--theme-text-muted, #64748b);
  }

  .resend-btn {
    background: none;
    border: none;
    color: var(--theme-primary, #f59e0b);
    font-weight: 600;
    cursor: pointer;
  }

  .verify-btn {
    width: 100%;
    padding: 12px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
  }

  .verify-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
