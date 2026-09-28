interface FooterLink {
    name: string;
    href: string;
}
interface Props {
    siteName?: string;
    copyrightYear?: number;
    licenseText?: string;
    links?: FooterLink[];
    providerIcons?: string[];
}
declare const Footer: import("svelte").Component<Props, {}, "">;
type Footer = ReturnType<typeof Footer>;
export default Footer;
//# sourceMappingURL=Footer.svelte.d.ts.map