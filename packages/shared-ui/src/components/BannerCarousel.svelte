<!-- @common/shared-ui/src/components/BannerCarousel.svelte -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

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

  let {
    banners = [],
    autoPlayInterval = 5000,
    showArrows = true,
    showDots = true,
    onbannerclick
  }: Props = $props();

  let currentIndex = $state(0);
  let timer: any = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function nextSlide() {
    if (banners.length <= 1) return;
    currentIndex = (currentIndex + 1) % banners.length;
  }

  function prevSlide() {
    if (banners.length <= 1) return;
    currentIndex = (currentIndex - 1 + banners.length) % banners.length;
  }

  function goToSlide(index: number) {
    currentIndex = index;
    restartAutoplay();
  }

  function startAutoplay() {
    stopAutoplay();
    if (autoPlayInterval > 0 && banners.length > 1) {
      timer = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }

  function handleTouchEnd(e: TouchEvent) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  }

  function handleBannerClick(banner: BannerItem) {
    if (onbannerclick) {
      onbannerclick(banner);
    } else if (banner.link || banner.actionUrl) {
      const url = banner.link || banner.actionUrl;
      window.open(url, '_self');
    }
  }

  onMount(() => {
    startAutoplay();
  });

  onDestroy(() => {
    stopAutoplay();
  });
</script>

{#if banners && banners.length > 0}
  <div
    class="banner-carousel-container"
    onmouseenter={stopAutoplay}
    onmouseleave={startAutoplay}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <div
      class="slides-track"
      style="transform: translateX(-{currentIndex * 100}%);"
    >
      {#each banners as banner, index}
        {@const imgSrc = banner.imageUrl || banner.image || ''}
        {@const mobileSrc = banner.mobileImage || imgSrc}
        <div
          class="slide-item"
          role="button"
          tabindex="0"
          onclick={() => handleBannerClick(banner)}
          onkeydown={(e) => e.key === 'Enter' && handleBannerClick(banner)}
        >
          <picture>
            {#if mobileSrc && mobileSrc !== imgSrc}
              <source media="(max-width: 640px)" srcset={mobileSrc} />
            {/if}
            <img
              src={imgSrc}
              alt={banner.title || `Banner ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              class="banner-image"
            />
          </picture>
        </div>
      {/each}
    </div>

    {#if showArrows && banners.length > 1}
      <button
        class="nav-btn prev"
        onclick={(e) => { e.stopPropagation(); prevSlide(); restartAutoplay(); }}
        aria-label="Previous Slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        class="nav-btn next"
        onclick={(e) => { e.stopPropagation(); nextSlide(); restartAutoplay(); }}
        aria-label="Next Slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    {/if}

    {#if showDots && banners.length > 1}
      <div class="dots-indicators">
        {#each banners as _, index}
          <button
            class="dot"
            class:active={index === currentIndex}
            onclick={(e) => { e.stopPropagation(); goToSlide(index); }}
            aria-label="Go to slide {index + 1}"
          ></button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .banner-carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--theme-radius-lg, 16px);
    background: #0f172a;
    box-shadow: var(--theme-shadow-md, 0 4px 6px -1px rgba(0,0,0,0.4));
  }

  .slides-track {
    display: flex;
    width: 100%;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .slide-item {
    flex: 0 0 100%;
    width: 100%;
    cursor: pointer;
    outline: none;
  }

  .banner-image {
    width: 100%;
    height: auto;
    max-height: 420px;
    object-fit: cover;
    display: block;
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.2s ease;
    z-index: 5;
  }

  .nav-btn:hover {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    transform: translateY(-50%) scale(1.1);
  }

  .nav-btn.prev {
    left: 12px;
  }

  .nav-btn.next {
    right: 12px;
  }

  .dots-indicators {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 5;
    background: rgba(0, 0, 0, 0.4);
    padding: 4px 10px;
    border-radius: var(--theme-radius-full, 9999px);
    backdrop-filter: blur(4px);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .dot.active {
    width: 20px;
    border-radius: 4px;
    background: var(--theme-primary, #f59e0b);
  }
</style>
