export interface HistoryEntry {
    date: string;
    tournament: string;
    location: string;
    result: string;
}

export const CHAMPIONSHIP_HISTORY: Record<string, HistoryEntry[]> = {
    'ENG': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '6. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '4. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '6. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '7. místo' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '4. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '7. místo' }
    ],
    'BEL': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '2. místo (vicemistr Evropy)' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '3. místo' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '2. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '2. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '2. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '2. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '4. místo' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '2. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '2. místo' }
    ],
    'CZE': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '4. místo' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '2. místo (finalista)' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '3. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '3. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '5. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '7. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '5. místo' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '7. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '5. místo' }
    ],
    'FRA': [
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '5. místo v B-divizi (celkově 13. místo)' }
    ],
    'IRL': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '12. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '12. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '2. místo v B-divizi (celkově 10. místo)' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '5. místo v B-divizi (celkově 13. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '7. místo v B-divizi (celkově 15. místo)' }
    ],
    'CAT': [
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Terrassa (Španělsko)', result: '7. místo' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '6. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '5. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '9. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '3. místo (bronzová medaile)' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '6. místo' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '8. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '4. místo' }
    ],
    'HUN': [
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '8. místo' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '8. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '10. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '7. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '8. místo' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '6. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '8. místo' }
    ],
    'GER': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '6. místo' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '4. místo' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '4. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '4. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '10. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '5. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '2. místo (vícemistr Evropy)' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '3. místo (bronzová medaile)' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '3. místo (bronzová medaile)' }
    ],
    'NED': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '1. místo (mistr Evropy)' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '1. místo (mistr Evropy)' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '1. místo (mistr Evropy)' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '1. místo (mistr Evropy)' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '1. místo (mistr Evropy)' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '1. místo (mistr Evropy)' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '1. místo (mistr Evropy)' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '1. místo (mistr Evropy)' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '1. místo (mistr Evropy)' }
    ],
    'POL': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '7. místo' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '10. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '9. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '8. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '9. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '1. místo v B-divizi (vítěz; celkově 9. místo)' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '1. místo v B-divizi (vítěz; celkově 9. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '1. místo v B-divizi (vítěz; celkově 9. místo)' }
    ],
    'POR': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '3. místo (bronzová medaile)' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '6. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '7. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '3. místo (bronzová medaile)' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '4. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (A-divize)', location: 'Frísko (Nizozemsko)', result: '3. místo (bronzová medaile)' },
        { date: '25.–30. 10. 2021', tournament: 'IKF EKC 2021 (A-divize)', location: 'Antverpy (Belgie)', result: '5. místo' },
        { date: '28. 10. – 2. 11. 2024', tournament: 'IKF EKC 2024 (A-divize)', location: 'Calonge i Sant Antoni (Španělsko)', result: '6. místo' }
    ],
    'RUS': [
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '7. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '8. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '6. místo' },
        { date: '22.–30. 10. 2016', tournament: 'IKF EKC 2016 (A-divize)', location: 'Dordrecht (Nizozemsko)', result: '8. místo' }
    ],
    'SCO': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '15. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '11. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '6. místo v B-divizi (celkově 14. místo)' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '4. místo v B-divizi (celkově 12. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '8. místo v B-divizi (celkově 16. místo)' }
    ],
    'SVK': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '8. místo' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '9. místo' },
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '13. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '14. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '3. místo v B-divizi (celkově 11. místo)' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '2. místo v B-divizi (celkově 10. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '4. místo v B-divizi (celkově 12. místo)' }
    ],
    'SRB': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '14. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '13. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '7. místo v B-divizi (celkově 15. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '6. místo v B-divizi (celkově 14. místo)' }
    ],
    'SUI': [
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '7. místo v B-divizi (celkově 15. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '5. místo v B-divizi (celkově 13. místo)' }
    ],
    'TUR': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '16. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '15. místo' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '3. místo v B-divizi (celkově 11. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '2. místo v B-divizi (celkově 10. místo)' }
    ],
    'GBR': [
        { date: '16.–19. 4. 1998', tournament: 'IKF EKC 1998 (A-divize)', location: 'Estoril (Portugalsko)', result: '5. místo' },
        { date: '31. 3. – 7. 4. 2002', tournament: 'IKF EKC 2002 (A-divize)', location: 'Katalánsko (Španělsko)', result: '5. místo' },
        { date: '16.–22. 4. 2006', tournament: 'IKF EKC 2006 (A-divize)', location: 'Budapešť (Maďarsko)', result: '5. místo' }
    ],
    'WAL': [
        { date: '22.–31. 10. 2010', tournament: 'IKF EKC 2010 (A-divize)', location: 'více měst (Nizozemsko)', result: '11. místo' },
        { date: '25. 10. – 2. 11. 2014', tournament: 'IKF EKC 2014 (A-divize)', location: 'Maia (Portugalsko)', result: '16. místo' },
        { date: '13.–21. 10. 2018', tournament: 'IKF EKC 2018 (B-divize)', location: 'Frísko (Nizozemsko)', result: '4. místo v B-divizi (celkově 12. místo)' },
        { date: '4.–9. 10. 2021', tournament: 'IKF EKC 2021 (B-divize)', location: 'Wrocław (Polsko)', result: '8. místo v B-divizi (celkově 16. místo)' },
        { date: '14.–19. 10. 2024', tournament: 'IKF EKC 2024 (B-divize)', location: 'Kemer (Turecko)', result: '3. místo v B-divizi (celkově 11. místo)' }
    ]
};
