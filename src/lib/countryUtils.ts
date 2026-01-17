/**
 * Mappings for ISO 3166-1 alpha-3 to alpha-2 (and special cases for flags)
 */
export const COUNTRY_MAP: Record<string, string> = {
    // Top IKF Europe
    'NED': 'nl', 'BEL': 'be', 'GER': 'de', 'CZE': 'cz', 'CAT': 'es-ct',
    'POR': 'pt', 'TUR': 'tr', 'ENG': 'gb-eng', 'HUN': 'hu', 'POL': 'pl',
    'SVK': 'sk', 'IRL': 'ie', 'SUI': 'ch', 'SRB': 'rs', 'WAL': 'gb-wls', 'FRA': 'fr',

    // Africa
    'MAR': 'ma', 'RSA': 'za', 'ZIM': 'zw', 'CIV': 'ci', 'GHA': 'gh', 'KEN': 'ke',

    // Americas
    'USA': 'us', 'BRA': 'br', 'ARG': 'ar', 'CAN': 'ca', 'DOM': 'do', 'COL': 'co', 'SUR': 'sr',

    // Asia
    'TPE': 'tw', 'CHN': 'cn', 'HKG': 'hk', 'JPN': 'jp', 'KOR': 'kr', 'IND': 'in', 'MAS': 'my',
    'THA': 'th', 'PHI': 'ph', 'INA': 'id', 'MAC': 'mo', 'PAK': 'pk',

    // Oceania
    'AUS': 'au', 'NZL': 'nz',

    // Rest of Europe
    'ITA': 'it', 'ESP': 'es', 'AUT': 'at', 'DEN': 'dk', 'GRE': 'gr', 'ARM': 'am', 'SWE': 'se',
    'FIN': 'fi', 'NOR': 'no', 'ROU': 'ro', 'UKR': 'ua', 'GEO': 'ge', 'LAT': 'lv', 'EST': 'ee',

    // Others
    'GBR': 'gb', 'SCO': 'gb-sct'
};

/**
 * Returns the URL for a country flag image.
 * Uses flagcdn.com as the provider.
 * 
 * @param countryCode ISO alpha-3 code (e.g. 'CZE')
 * @param width Image width in pixels
 * @returns Flag image URL
 */
export function getFlagUrl(countryCode: string | undefined, width: number = 160): string {
    if (!countryCode) return '';

    const code = countryCode.toUpperCase();

    // Custom handling for Catalonia
    if (code === 'CAT' || code === 'ES-CT') {
        return '/flags/cat.svg';
    }

    const alpha2 = COUNTRY_MAP[code] || code.toLowerCase().substring(0, 2);

    return `https://flagcdn.com/w${width}/${alpha2}.png`;
}
