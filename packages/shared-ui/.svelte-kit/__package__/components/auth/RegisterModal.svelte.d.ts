interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    errorMessage?: string | null;
    currency?: string;
    requireEmail?: boolean;
    requirePhone?: boolean;
    requireReferral?: boolean;
    onsubmit?: (data: any) => void;
    onclose?: () => void;
    onswitchtologin?: () => void;
}
declare const RegisterModal: import("svelte").Component<Props, {}, "">;
type RegisterModal = ReturnType<typeof RegisterModal>;
export default RegisterModal;
//# sourceMappingURL=RegisterModal.svelte.d.ts.map