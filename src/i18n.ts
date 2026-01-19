import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale files
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import aboutEN from './locales/en/about.json';
import programEN from './locales/en/program.json';
import venuesEN from './locales/en/venues.json';
import volunteersEN from './locales/en/volunteers.json';
import signupEN from './locales/en/signup.json';
import settingsEN from './locales/en/settings.json';
import contactEN from './locales/en/contact.json';

import commonCS from './locales/cs/common.json';
import homeCS from './locales/cs/home.json';
import aboutCS from './locales/cs/about.json';
import programCS from './locales/cs/program.json';
import venuesCS from './locales/cs/venues.json';
import volunteersCS from './locales/cs/volunteers.json';
import signupCS from './locales/cs/signup.json';
import settingsCS from './locales/cs/settings.json';
import contactCS from './locales/cs/contact.json';

import commonNL from './locales/nl/common.json';
import homeNL from './locales/nl/home.json';
import aboutNL from './locales/nl/about.json';
import programNL from './locales/nl/program.json';
import venuesNL from './locales/nl/venues.json';
import volunteersNL from './locales/nl/volunteers.json';
import signupNL from './locales/nl/signup.json';
import settingsNL from './locales/nl/settings.json';
import contactNL from './locales/nl/contact.json';

import commonDE from './locales/de/common.json';
import homeDE from './locales/de/home.json';
import aboutDE from './locales/de/about.json';
import programDE from './locales/de/program.json';
import venuesDE from './locales/de/venues.json';
import volunteersDE from './locales/de/volunteers.json';
import signupDE from './locales/de/signup.json';
import settingsDE from './locales/de/settings.json';
import contactDE from './locales/de/contact.json';

import commonFR from './locales/fr/common.json';
import homeFR from './locales/fr/home.json';
import aboutFR from './locales/fr/about.json';
import programFR from './locales/fr/program.json';
import venuesFR from './locales/fr/venues.json';
import volunteersFR from './locales/fr/volunteers.json';
import signupFR from './locales/fr/signup.json';
import settingsFR from './locales/fr/settings.json';
import contactFR from './locales/fr/contact.json';

const resources = {
    en: {
        common: commonEN,
        home: homeEN,
        about: aboutEN,
        program: programEN,
        venues: venuesEN,
        volunteers: volunteersEN,
        signup: signupEN,
        settings: settingsEN,
        contact: contactEN
    },
    cs: {
        common: commonCS,
        home: homeCS,
        about: aboutCS,
        program: programCS,
        venues: venuesCS,
        volunteers: volunteersCS,
        signup: signupCS,
        settings: settingsCS,
        contact: contactCS
    },
    nl: {
        common: commonNL,
        home: homeNL,
        about: aboutNL,
        program: programNL,
        venues: venuesNL,
        volunteers: volunteersNL,
        signup: signupNL,
        settings: settingsNL,
        contact: contactNL
    },
    de: {
        common: commonDE,
        home: homeDE,
        about: aboutDE,
        program: programDE,
        venues: venuesDE,
        volunteers: volunteersDE,
        signup: signupDE,
        settings: settingsDE,
        contact: contactDE
    },
    fr: {
        common: commonFR,
        home: homeFR,
        about: aboutFR,
        program: programFR,
        venues: venuesFR,
        volunteers: volunteersFR,
        signup: signupFR,
        settings: settingsFR,
        contact: contactFR
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'home', 'about', 'program', 'venues', 'volunteers', 'signup', 'settings', 'contact'],

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
