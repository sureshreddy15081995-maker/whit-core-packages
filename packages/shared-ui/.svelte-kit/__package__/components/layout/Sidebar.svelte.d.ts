interface NavItem {
    id: string;
    label: string;
    href?: string;
    icon?: string;
    badge?: string;
}
interface Props {
    isOpen?: boolean;
    items?: NavItem[];
    activeId?: string;
    onitemclick?: (item: NavItem) => void;
    onclose?: () => void;
}
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
//# sourceMappingURL=Sidebar.svelte.d.ts.map