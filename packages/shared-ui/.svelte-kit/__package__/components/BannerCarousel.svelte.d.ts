interface BannerItem {
    id?: string | number;
    imageUrl?: string;
    image?: string;
    mobileImage?: string;
    title?: string;
    actionUrl?: string;
    link?: string;
    [key: string]: any;
}
interface Props {
    banners?: BannerItem[];
    autoPlayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    onbannerclick?: (banner: BannerItem) => void;
}
declare const BannerCarousel: import("svelte").Component<Props, {}, "">;
type BannerCarousel = ReturnType<typeof BannerCarousel>;
export default BannerCarousel;
//# sourceMappingURL=BannerCarousel.svelte.d.ts.map