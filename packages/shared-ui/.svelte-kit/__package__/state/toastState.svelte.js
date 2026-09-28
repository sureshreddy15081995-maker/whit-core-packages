// @common/shared-ui/src/state/toastState.svelte.ts
class ToastState {
    toasts = $state([]);
    show(type, titleOrMessage, message, duration = 3500) {
        const id = Math.random().toString(36).substring(2, 9);
        const finalTitle = message ? titleOrMessage : undefined;
        const finalMsg = message ? message : titleOrMessage;
        const item = {
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
    success(titleOrMessage, message, duration) {
        return this.show('success', titleOrMessage, message, duration);
    }
    error(titleOrMessage, message, duration) {
        return this.show('error', titleOrMessage, message, duration);
    }
    warning(titleOrMessage, message, duration) {
        return this.show('warning', titleOrMessage, message, duration);
    }
    info(titleOrMessage, message, duration) {
        return this.show('info', titleOrMessage, message, duration);
    }
    dismiss(id) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }
    clear() {
        this.toasts = [];
    }
}
export const toastState = new ToastState();
