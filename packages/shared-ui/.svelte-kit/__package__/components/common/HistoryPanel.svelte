<!-- @common/shared-ui/src/components/common/HistoryPanel.svelte -->
<script lang="ts">
  import DatePicker from './DatePicker.svelte';

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
    onfilter?: (dates: { startDate: string; endDate: string }) => void;
    ontabchange?: (tab: string) => void;
  }

  let {
    items = [],
    activeTab = 'transactions',
    isLoading = false,
    currency = 'USD',
    onfilter,
    ontabchange
  }: Props = $props();

  const tabs = [
    { id: 'transactions', label: 'Transactions' },
    { id: 'games', label: 'Game History' },
    { id: 'withdrawals', label: 'Pending Withdrawals' },
    { id: 'bets', label: 'Bet History' }
  ];
</script>

<div class="history-panel-container">
  <header class="panel-header">
    <div class="tabs-row">
      {#each tabs as t}
        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === t.id}
          onclick={() => ontabchange?.(t.id)}
        >
          {t.label}
        </button>
      {/each}
    </div>

    <div class="filter-box">
      <DatePicker onchange={onfilter} />
    </div>
  </header>

  <div class="table-card">
    {#if isLoading}
      <div class="loading-state">
        <div class="spinner"></div>
        <span>Loading history records...</span>
      </div>
    {:else if items && items.length > 0}
      <div class="table-responsive">
        <table class="history-table">
          <thead>
            <tr>
              <th>ID / Ref</th>
              <th>Date & Time</th>
              <th>Type / Game</th>
              <th class="text-right">Amount</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each items as item}
              <tr>
                <td class="mono">{item.id || item.transactionId || item.gameId || '-'}</td>
                <td>{item.date || item.createdAt || item.time || '-'}</td>
                <td>{item.type || item.gameName || item.game || '-'}</td>
                <td class="text-right amount-col">
                  {#if item.amount !== undefined}
                    <span class="amount-val">{item.amount}</span>
                    <span class="currency-tag">{item.currency || currency}</span>
                  {:else}
                    -
                  {/if}
                </td>
                <td class="text-center">
                  {#if item.status}
                    {@const st = String(item.status).toLowerCase()}
                    <span
                      class="status-pill"
                      class:status-success={st.includes('success') || st.includes('approve') || st.includes('won')}
                      class:status-pending={st.includes('pending') || st.includes('open') || st.includes('process')}
                      class:status-failed={st.includes('fail') || st.includes('reject') || st.includes('cancel') || st.includes('lost')}
                    >
                      {item.status}
                    </span>
                  {:else}
                    -
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="empty-state">
        <div class="empty-icon">📜</div>
        <h4>No Records Found</h4>
        <p>There are no recorded items for the selected dates.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .history-panel-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .tabs-row {
    display: flex;
    gap: 6px;
    background: #0f172a;
    padding: 4px;
    border-radius: var(--theme-radius-md, 8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tab-btn {
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-radius: var(--theme-radius-sm, 6px);
    color: var(--theme-text-secondary, #94a3b8);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
  }

  .table-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--theme-radius-lg, 16px);
    overflow: hidden;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .history-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    color: #cbd5e1;
  }

  .history-table th {
    background: #152033;
    padding: 12px 16px;
    font-weight: 700;
    color: var(--theme-text-secondary, #94a3b8);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .history-table td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .history-table tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }

  .text-right { text-align: right; }
  .text-center { text-align: center; }

  .mono {
    font-family: monospace;
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .amount-val {
    font-weight: 700;
    color: #f8fafc;
  }

  .currency-tag {
    font-size: 0.72rem;
    color: var(--theme-text-muted, #64748b);
    margin-left: 4px;
  }

  .status-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: capitalize;
  }

  .status-success {
    background: rgba(16, 185, 129, 0.15);
    color: var(--theme-success, #10b981);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .status-pending {
    background: rgba(245, 158, 11, 0.15);
    color: var(--theme-warning, #f59e0b);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .status-failed {
    background: rgba(239, 68, 68, 0.15);
    color: var(--theme-danger, #ef4444);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .loading-state, .empty-state {
    padding: 50px 20px;
    text-align: center;
    color: var(--theme-text-secondary, #94a3b8);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--theme-primary, #f59e0b);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .empty-icon {
    font-size: 2.5rem;
  }

  .empty-state h4 {
    margin: 0;
    color: #f8fafc;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.85rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
