export function removeDateFormat(value) {
    if (!value)
        return '';
    return value
        .replace('T', ' ')
        .replace('[UTC]', '')
        .replace(/Z$/, '')
        .replace(/\.\d+/, '')
        .trim();
}
export function replace(value, strToReplace, replacementStr) {
    if (!value || !strToReplace || !replacementStr) {
        return value;
    }
    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return value.replace(new RegExp(escapeRegex(strToReplace), 'g'), replacementStr);
}
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
export const providerNameFormatter = (provider) => {
    return provider.replace(/(?:hd|zn|gv|lahd)$/, '').toUpperCase();
};
