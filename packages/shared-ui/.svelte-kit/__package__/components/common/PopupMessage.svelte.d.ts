interface Props {
    isOpen?: boolean;
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
    onclose?: () => void;
}
declare const PopupMessage: import("svelte").Component<Props, {}, "">;
type PopupMessage = ReturnType<typeof PopupMessage>;
export default PopupMessage;
//# sourceMappingURL=PopupMessage.svelte.d.ts.map