
// Map of TOP 16 European IKF Member countries and their federations
// Source: https://korfball.sport/ikf-members/

export interface IKFMember {
    countryName: string;
    federationName: string;
    code: string; // ISO Alpha-3
    rank: number;
}

export const IKF_MEMBERS: Record<string, IKFMember> = {
    // 1. Netherlands
    'NED': { code: 'NED', countryName: 'Netherlands', federationName: 'Koninklijk Nederlands KorfbalVerbond (KNKV)', rank: 1 },
    // 2. Belgium
    'BEL': { code: 'BEL', countryName: 'Belgium', federationName: 'Royal Belgian Korfball Federation (KBKB)', rank: 2 },
    // 3. Germany
    'GER': { code: 'GER', countryName: 'Germany', federationName: 'Deutscher Turner-Bund e.V (DTB)', rank: 4 },
    // 4. Czech Republic
    'CZE': { code: 'CZE', countryName: 'Czech Republic', federationName: 'Czech Korfball Association (CKA)', rank: 5 },
    // 5. Catalonia
    'CAT': { code: 'CAT', countryName: 'Catalonia', federationName: 'Federacio Catalana de Korfbal (FCK)', rank: 6 },
    // 6. Portugal
    'POR': { code: 'POR', countryName: 'Portugal', federationName: 'Federação Portuguesa de Corfebol (FPC)', rank: 7 },
    // 7. Türkiye (Turkey)
    'TUR': { code: 'TUR', countryName: 'Türkiye', federationName: 'Developing Sports Federation of Türkiye (DSFT)', rank: 13 },
    // 8. England
    'ENG': { code: 'ENG', countryName: 'England', federationName: 'English Korfball Association (EKA)', rank: 15 },
    // 9. Hungary
    'HUN': { code: 'HUN', countryName: 'Hungary', federationName: 'Hungarian Korfball Association (HKA)', rank: 18 },
    // 10. Poland
    'POL': { code: 'POL', countryName: 'Poland', federationName: 'Polski Związek Korfballu (PZKorf)', rank: 19 },
    // 11. Slovakia
    'SVK': { code: 'SVK', countryName: 'Slovakia', federationName: 'Slovak Korfball Association (SAK)', rank: 20 },
    // 12. Ireland
    'IRL': { code: 'IRL', countryName: 'Ireland', federationName: 'Irish Korfball Association (IKA)', rank: 22 },
    // 13. Switzerland
    'SUI': { code: 'SUI', countryName: 'Switzerland', federationName: 'Fédération Suisse de Korfball', rank: 24 },
    // 14. Serbia
    'SRB': { code: 'SRB', countryName: 'Serbia', federationName: 'Korfball Federation of Serbia', rank: 26 },
    // 15. Wales
    'WAL': { code: 'WAL', countryName: 'Wales', federationName: 'Welsh Korfball Association (WKA)', rank: 27 },
    // 16. France
    'FRA': { code: 'FRA', countryName: 'France', federationName: 'Fédération Korfbal France', rank: 29 },
};
