import type { Snippet } from 'svelte';
interface Props {
    isLoggedIn?: boolean;
    username?: string | null;
    balance?: number | string;
    currency?: string;
    avatarUrl?: string;
    logoUrl?: string;
    siteName?: string;
    onloginclick?: () => void;
    onregisterclick?: () => void;
    ondepositclick?: () => void;
    onprofileclick?: () => void;
    onlogoutclick?: () => void;
    ontogglesidebar?: () => void;
    children?: Snippet;
}
declare const Header: import("svelte").Component<Props, {}, "">;
type Header = ReturnType<typeof Header>;
export default Header;
//# sourceMappingURL=Header.svelte.d.ts.map