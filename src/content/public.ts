export const publicContent = {
    event: {
        name: "European Korfball Championship",
        nameShort: "EKC",
        year: 2026,
        country: "Czechia",
        dates: {
            start: "2026-10-16",
            end: "2026-10-20",
            display: "October 16-20, 2026"
        }
    },
    cities: [
        {
            id: "prostejov",
            name: "Prostějov",
            role: "Main Venue"
        },
        {
            id: "otrokovice",
            name: "Otrokovice",
            role: "Secondary Venue"
        },
        {
            id: "zlin",
            name: "Zlín",
            role: "Secondary Venue"
        }
    ],
    contact: {
        general: {
            email: "info@korfbal.cz",
            phone: "+420 702 202 389"
        },
        volunteers: {
            email: "dobrovolnici@korfbal.cz"
        },
        media: {
            email: "press@ekc2026.cz"
        },
        teams: {
            email: "office@korfbal.cz"
        }
    },
    routes: {
        volunteerSignup: "/mobile/volunteer-signup",
        home: "/mobile/home",
        about: "/mobile/about",
        program: "/mobile/program",
        venues: "/mobile/venues",
        volunteers: "/mobile/volunteers",
        contact: "/mobile/contact",
        settings: "/mobile/settings"
    }
};
