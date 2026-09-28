interface HistoryItem {
    id: string | number;
    date: string;
    type?: string;
    gameName?: string;
    amount?: number | string;
    status?: string;
    currency?: string;
    [key: string]: any;
}
interface Props {
    items?: HistoryItem[];
    activeTab?: 'transactions' | 'games' | 'withdrawals' | 'bets';
    isLoading?: boolean;
    currency?: string;
    onfilter?: (dates: {
        startDate: string;
        endDate: string;
    }) => void;
    ontabchange?: (tab: string) => void;
}
declare const HistoryPanel: import("svelte").Component<Props, {}, "">;
type HistoryPanel = ReturnType<typeof HistoryPanel>;
export default HistoryPanel;
//# sourceMappingURL=HistoryPanel.svelte.d.ts.map