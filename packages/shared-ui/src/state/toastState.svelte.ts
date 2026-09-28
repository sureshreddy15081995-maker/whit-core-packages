// @common/shared-ui/src/state/toastState.svelte.ts

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

class ToastState {
  toasts = $state<ToastItem[]>([]);

  show(type: ToastType, titleOrMessage: string, message?: string, duration = 3500): string {
    const id = Math.random().toString(36).substring(2, 9);
    const finalTitle = message ? titleOrMessage : undefined;
    const finalMsg = message ? message : titleOrMessage;

    const item: ToastItem = {
      id,
      type,
      title: finalTitle,
      message: finalMsg,
      duration
    };

    this.toasts = [...this.toasts, item];

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  success(titleOrMessage: string, message?: string, duration?: number): string {
    return this.show('success', titleOrMessage, message, duration);
  }

  error(titleOrMessage: string, message?: string, duration?: number): string {
    return this.show('error', titleOrMessage, message, duration);
  }

  warning(titleOrMessage: string, message?: string, duration?: number): string {
    return this.show('warning', titleOrMessage, message, duration);
  }

  info(titleOrMessage: string, message?: string, duration?: number): string {
    return this.show('info', titleOrMessage, message, duration);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  clear() {
    this.toasts = [];
  }
}

export const toastState = new ToastState();
