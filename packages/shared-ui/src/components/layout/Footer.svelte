<!-- @common/shared-ui/src/components/layout/Footer.svelte -->
<script lang="ts">
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

  let {
    siteName = 'Casino Platform',
    copyrightYear = new Date().getFullYear(),
    licenseText = 'Licensed and regulated under international gaming authority. 18+ Play responsibly.',
    links = [
      { name: 'Terms & Conditions', href: '/terms-conditions' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Responsible Gaming', href: '/responsible-play' },
      { name: 'Contact & Support', href: '/contact' }
    ],
    providerIcons = []
  }: Props = $props();
</script>

<footer class="common-footer">
  <div class="footer-container">
    {#if providerIcons && providerIcons.length > 0}
      <div class="payment-providers-row">
        {#each providerIcons as icon}
          <img src={icon} alt="Partner" class="partner-icon" />
        {/each}
      </div>
    {/if}

    <div class="responsible-gambling-badge">
      <span class="badge-18">18+</span>
      <p class="license-text">{licenseText}</p>
    </div>

    <div class="footer-links">
      {#each links as link}
        <a href={link.href} class="link-item">{link.name}</a>
      {/each}
    </div>

    <div class="copyright">
      &copy; {copyrightYear} {siteName}. All rights reserved.
    </div>
  </div>
</footer>

<style>
  .common-footer {
    background: #090d16;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 36px 16px 24px 16px;
    color: var(--theme-text-secondary, #94a3b8);
    font-size: 0.85rem;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
  }

  .payment-providers-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    opacity: 0.6;
    margin-bottom: 8px;
  }

  .partner-icon {
    height: 24px;
    object-fit: contain;
    filter: grayscale(1);
    transition: filter 0.2s;
  }

  .partner-icon:hover {
    filter: grayscale(0);
  }

  .responsible-gambling-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 600px;
  }

  .badge-18 {
    background: var(--theme-danger, #ef4444);
    color: #ffffff;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .license-text {
    font-size: 0.78rem;
    color: var(--theme-text-muted, #64748b);
    line-height: 1.4;
    margin: 0;
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 18px;
  }

  .link-item {
    color: #cbd5e1;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.82rem;
    transition: color 0.15s;
  }

  .link-item:hover {
    color: var(--theme-primary, #f59e0b);
  }

  .copyright {
    font-size: 0.76rem;
    color: var(--theme-text-muted, #64748b);
  }
</style>
