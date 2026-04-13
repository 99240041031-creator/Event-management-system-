/**
 * Sanitizes IDs by stripping known string prefixes and converting to numeric form.
 * Frontend IDs like "hk-201" or "ev-102" are converted to 201 or 102.
 */
export const toNumericId = (id: string | number): number => {
    if (typeof id === 'number') return id;
    if (!id) return 0;
    
    // Remove any non-numeric prefix (e.g., "hk-", "ev-", "s-", "f-")
    const sanitized = id.replace(/^[a-z]+-/, '');
    const numeric = parseInt(sanitized, 10);
    
    return isNaN(numeric) ? 0 : numeric;
};
