interface Props {
    isOpen?: boolean;
    token?: string;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: {
        password: string;
        token: string;
    }) => void;
    onclose?: () => void;
}
declare const ResetPasswordModal: import("svelte").Component<Props, {}, "">;
type ResetPasswordModal = ReturnType<typeof ResetPasswordModal>;
export default ResetPasswordModal;
//# sourceMappingURL=ResetPasswordModal.svelte.d.ts.map