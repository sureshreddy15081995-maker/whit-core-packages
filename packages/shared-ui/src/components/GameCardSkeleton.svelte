<!-- @common/shared-ui/src/components/GameCardSkeleton.svelte -->
<script lang="ts">
  interface Props {
    count?: number;
  }
  let { count = 1 }: Props = $props();
</script>

{#each Array(count) as _}
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-image shimmer"></div>
    <div class="skeleton-info">
      <div class="skeleton-line title shimmer"></div>
      <div class="skeleton-line sub shimmer"></div>
    </div>
  </div>
{/each}

<style>
  .skeleton-card {
    display: flex;
    flex-direction: column;
    background-color: var(--theme-card-bg, #1e293b);
    border: 1px solid var(--theme-card-border, rgba(255, 255, 255, 0.05));
    border-radius: var(--theme-radius-md, 10px);
    overflow: hidden;
  }

  .skeleton-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: #182234;
  }

  .skeleton-info {
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .skeleton-line {
    border-radius: 4px;
    background: #1e2d42;
  }

  .skeleton-line.title {
    width: 75%;
    height: 14px;
  }

  .skeleton-line.sub {
    width: 45%;
    height: 10px;
  }

  .shimmer {
    position: relative;
    overflow: hidden;
  }

  .shimmer::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.05) 20%,
      rgba(255, 255, 255, 0.1) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer-anim 1.5s infinite;
    content: '';
  }

  @keyframes shimmer-anim {
    100% {
      transform: translateX(100%);
    }
  }
</style>
