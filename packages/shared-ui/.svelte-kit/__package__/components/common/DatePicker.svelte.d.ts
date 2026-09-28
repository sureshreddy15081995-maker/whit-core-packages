interface Props {
    startDate?: string;
    endDate?: string;
    label?: string;
    onchange?: (dates: {
        startDate: string;
        endDate: string;
    }) => void;
}
declare const DatePicker: import("svelte").Component<Props, {}, "">;
type DatePicker = ReturnType<typeof DatePicker>;
export default DatePicker;
//# sourceMappingURL=DatePicker.svelte.d.ts.map