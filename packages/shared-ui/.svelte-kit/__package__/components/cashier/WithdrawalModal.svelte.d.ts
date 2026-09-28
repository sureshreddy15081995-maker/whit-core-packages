interface BankAccount {
    id: string | number;
    accountNumber: string;
    bankName: string;
    holderName?: string;
    ifsc?: string;
}
interface Props {
    isOpen?: boolean;
    isLoading?: boolean;
    currency?: string;
    availableBalance?: number;
    minWithdrawal?: number;
    maxWithdrawal?: number;
    bankAccounts?: BankAccount[];
    errorMessage?: string | null;
    onsubmit?: (data: {
        amount: number;
        account: BankAccount;
    }) => void;
    onaddaccount?: () => void;
    onclose?: () => void;
}
declare const WithdrawalModal: import("svelte").Component<Props, {}, "">;
type WithdrawalModal = ReturnType<typeof WithdrawalModal>;
export default WithdrawalModal;
//# sourceMappingURL=WithdrawalModal.svelte.d.ts.map