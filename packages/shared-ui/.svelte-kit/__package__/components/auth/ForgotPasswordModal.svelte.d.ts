interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: {
        login: string;
        phone: string;
    }) => void;
    onclose?: () => void;
    onswitchtologin?: () => void;
}
declare const ForgotPasswordModal: import("svelte").Component<Props, {}, "">;
type ForgotPasswordModal = ReturnType<typeof ForgotPasswordModal>;
export default ForgotPasswordModal;
//# sourceMappingURL=ForgotPasswordModal.svelte.d.ts.map