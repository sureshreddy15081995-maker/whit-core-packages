interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    onsubmit?: (data: {
        login: string;
        password: string;
    }) => void;
    onclose?: () => void;
    onforgotpassword?: () => void;
    onswitchtoregister?: () => void;
}
declare const LoginModal: import("svelte").Component<Props, {}, "">;
type LoginModal = ReturnType<typeof LoginModal>;
export default LoginModal;
//# sourceMappingURL=LoginModal.svelte.d.ts.map