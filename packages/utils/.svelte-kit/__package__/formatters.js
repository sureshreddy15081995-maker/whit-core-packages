// @common/utils/src/formatters.ts
export function formatDate(dateVal, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!dateVal)
        return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime()))
        return '';
    const pad = (n) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
export function formatCurrency(val, currency = 'USD', locale = 'en-US') {
    if (val === null || val === undefined || val === '')
        return '0.00';
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num))
        return '0.00';
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }
    catch (e) {
        return `${currency} ${num.toFixed(2)}`;
    }
}
export function numberFormatter(val, decimals = 2) {
    if (val === null || val === undefined || val === '')
        return '0.00';
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num))
        return '0.00';
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
export function providerNameFormatter(provider) {
    if (!provider)
        return '';
    return provider
        .replace(/(gv|hd)$/i, '')
        .replace(/_/g, ' ')
        .trim()
        .toUpperCase();
}
export function truncateText(text, maxLength = 30) {
    if (!text || text.length <= maxLength)
        return text || '';
    return text.slice(0, maxLength) + '...';
}
