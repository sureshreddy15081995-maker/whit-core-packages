interface PaymentMethod {
    id: string | number;
    name: string;
    icon?: string;
    type?: string;
    min?: number;
    max?: number;
    requiresPhone?: boolean;
    requiresEmail?: boolean;
}
interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    currency?: string;
    methods?: PaymentMethod[];
    presets?: number[];
    minAmount?: number;
    maxAmount?: number;
    errorMessage?: string | null;
    onsubmit?: (data: {
        amount: number;
        method: PaymentMethod;
        phone?: string;
        email?: string;
    }) => void;
    onclose?: () => void;
}
declare const DepositModal: import("svelte").Component<Props, {}, "">;
type DepositModal = ReturnType<typeof DepositModal>;
export default DepositModal;
//# sourceMappingURL=DepositModal.svelte.d.ts.map