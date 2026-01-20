import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale files
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import programEN from './locales/en/program.json';
import teamsEN from './locales/en/teams.json';
import venuesEN from './locales/en/venues.json';
import volunteersEN from './locales/en/volunteers.json';
import settingsEN from './locales/en/settings.json';

import commonCS from './locales/cs/common.json';
import homeCS from './locales/cs/home.json';
import programCS from './locales/cs/program.json';
import teamsCS from './locales/cs/teams.json';
import venuesCS from './locales/cs/venues.json';
import volunteersCS from './locales/cs/volunteers.json';
import settingsCS from './locales/cs/settings.json';

import commonNL from './locales/nl/common.json';
import homeNL from './locales/nl/home.json';
import programNL from './locales/nl/program.json';
import teamsNL from './locales/nl/teams.json';
import venuesNL from './locales/nl/venues.json';
import volunteersNL from './locales/nl/volunteers.json';
import settingsNL from './locales/nl/settings.json';

import commonDE from './locales/de/common.json';
import homeDE from './locales/de/home.json';
import programDE from './locales/de/program.json';
import teamsDE from './locales/de/teams.json';
import venuesDE from './locales/de/venues.json';
import volunteersDE from './locales/de/volunteers.json';
import settingsDE from './locales/de/settings.json';

import commonFR from './locales/fr/common.json';
import homeFR from './locales/fr/home.json';
import programFR from './locales/fr/program.json';
import teamsFR from './locales/fr/teams.json';
import venuesFR from './locales/fr/venues.json';
import volunteersFR from './locales/fr/volunteers.json';
import settingsFR from './locales/fr/settings.json';

const resources = {
    en: {
        common: commonEN,
        home: homeEN,
        program: programEN,
        teams: teamsEN,
        venues: venuesEN,
        volunteers: volunteersEN,
        settings: settingsEN
    },
    cs: {
        common: commonCS,
        home: homeCS,
        program: programCS,
        teams: teamsCS,
        venues: venuesCS,
        volunteers: volunteersCS,
        settings: settingsCS
    },
    nl: {
        common: commonNL,
        home: homeNL,
        program: programNL,
        teams: teamsNL,
        venues: venuesNL,
        volunteers: volunteersNL,
        settings: settingsNL
    },
    de: {
        common: commonDE,
        home: homeDE,
        program: programDE,
        teams: teamsDE,
        venues: venuesDE,
        volunteers: volunteersDE,
        settings: settingsDE
    },
    fr: {
        common: commonFR,
        home: homeFR,
        program: programFR,
        teams: teamsFR,
        venues: venuesFR,
        volunteers: volunteersFR,
        settings: settingsFR
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'home', 'about', 'program', 'venues', 'volunteers', 'settings', 'contact'],

        interpolation: {
            escapeValue: false // React already escapes
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18n-language'
        }
    });

export default i18n;
