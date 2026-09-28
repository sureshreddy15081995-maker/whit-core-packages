interface Props {
    isOpen?: boolean;
    status?: 'success' | 'pending' | 'failed' | null;
    amount?: number | string;
    currency?: string;
    transactionId?: string | number;
    message?: string;
    onclose?: () => void;
}
declare const DepositStatusPopup: import("svelte").Component<Props, {}, "">;
type DepositStatusPopup = ReturnType<typeof DepositStatusPopup>;
export default DepositStatusPopup;
//# sourceMappingURL=DepositStatusPopup.svelte.d.ts.map