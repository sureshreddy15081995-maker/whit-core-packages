<!-- @common/shared-ui/src/components/common/DatePicker.svelte -->
<script lang="ts">
  interface Props {
    startDate?: string;
    endDate?: string;
    label?: string;
    onchange?: (dates: { startDate: string; endDate: string }) => void;
  }

  let {
    startDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    endDate = new Date().toISOString().split('T')[0],
    label = 'Filter by Date',
    onchange
  }: Props = $props();

  let start = $state(startDate);
  let end = $state(endDate);

  function handleStartChange(e: Event) {
    start = (e.target as HTMLInputElement).value;
    onchange?.({ startDate: start, endDate: end });
  }

  function handleEndChange(e: Event) {
    end = (e.target as HTMLInputElement).value;
    onchange?.({ startDate: start, endDate: end });
  }
</script>

<div class="common-datepicker-group">
  {#if label}
    <span class="picker-label">{label}</span>
  {/if}
  <div class="inputs-row">
    <div class="date-field">
      <span class="field-tag">From</span>
      <input type="date" value={start} onchange={handleStartChange} />
    </div>
    <div class="date-field">
      <span class="field-tag">To</span>
      <input type="date" value={end} min={start} onchange={handleEndChange} />
    </div>
  </div>
</div>

<style>
  .common-datepicker-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .picker-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--theme-text-secondary, #94a3b8);
  }

  .inputs-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .date-field {
    display: flex;
    align-items: center;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-md, 8px);
    overflow: hidden;
  }

  .field-tag {
    padding: 0 10px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--theme-text-muted, #64748b);
    text-transform: uppercase;
  }

  input[type='date'] {
    background: transparent;
    border: none;
    padding: 8px 10px 8px 0;
    color: #f8fafc;
    font-size: 0.85rem;
    outline: none;
    color-scheme: dark;
  }
</style>
