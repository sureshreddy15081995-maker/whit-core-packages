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
declare const OTPModal: import("svelte").Component<Props, {}, "">;
type OTPModal = ReturnType<typeof OTPModal>;
export default OTPModal;
//# sourceMappingURL=OTPModal.svelte.d.ts.map