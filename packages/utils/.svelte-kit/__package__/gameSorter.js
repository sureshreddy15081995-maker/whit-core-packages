// @common/utils/src/gameSorter.ts
export function arrangeGamesByProvider(games) {
    if (!Array.isArray(games))
        return {};
    const grouped = {};
    for (const g of games) {
        const prov = (g.provider || 'other').toLowerCase().trim();
        if (!grouped[prov]) {
            grouped[prov] = [];
        }
        grouped[prov].push(g);
    }
    return grouped;
}
export function sortGamesByPopularity(games) {
    if (!Array.isArray(games))
        return [];
    return [...games].sort((a, b) => {
        const popA = a.isPopular || a.popularity || 0;
        const popB = b.isPopular || b.popularity || 0;
        return popB - popA;
    });
}
