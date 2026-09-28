export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface ToastItem {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}
declare class ToastState {
    toasts: ToastItem[];
    show(type: ToastType, titleOrMessage: string, message?: string, duration?: number): string;
    success(titleOrMessage: string, message?: string, duration?: number): string;
    error(titleOrMessage: string, message?: string, duration?: number): string;
    warning(titleOrMessage: string, message?: string, duration?: number): string;
    info(titleOrMessage: string, message?: string, duration?: number): string;
    dismiss(id: string): void;
    clear(): void;
}
export declare const toastState: ToastState;
export {};
//# sourceMappingURL=toastState.svelte.d.ts.map