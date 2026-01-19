import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

// Placeholders
import { AdminDashboard } from './features/admin/AdminDashboard';
import { PlaceholderPage } from './features/placeholders/PlaceholderPage';
import { UnderConstructionPage } from './features/placeholders/UnderConstructionPage';
import { SettingsPage } from './features/settings/SettingsPage';

import { DelegationLayout } from './features/delegation/DelegationLayout';
import { BasicsStep } from './features/delegation/steps/BasicsStep';
import { AccommodationStep } from './features/delegation/steps/AccommodationStep';
import { TransportStep } from './features/delegation/steps/TransportStep';
import { TrainingStep } from './features/delegation/steps/TrainingStep';
import { MealsStep } from './features/delegation/steps/MealsStep';
import { BillingStep } from './features/delegation/steps/BillingStep';
import { ConfirmationStep } from './features/delegation/steps/ConfirmationStep';

// Admin
import { HotelsList } from './features/admin/HotelsList';
import { OffersList } from './features/admin/OffersList';
import { OfferDetail } from './features/admin/OfferDetail';
import { HotelDetail } from './features/admin/HotelDetail';
import { DailyCapacities } from './features/admin/DailyCapacities';
import { EventPricingPage } from './features/admin/EventPricingPage';
import TournamentDrawPage from './features/admin/matches/TournamentDrawPage';
import { AdminLayout } from './features/admin/AdminLayout';
// Accommodation Module Components
import { AccommodationLayout } from './features/admin/accommodation/AccommodationLayout';
import { AccommodationOverviewPage } from './features/admin/accommodation/AccommodationOverviewPage';
import { AccommodationAllocationsPage } from './features/admin/accommodation/AccommodationAllocationsPage';
import { AccommodationReportPage } from './features/admin/accommodation/AccommodationReportPage';
import { AllocationDetail } from './features/admin/accommodation/AllocationDetail';
import { DelegationsList } from './features/admin/delegations/DelegationsList';
import { AdminDelegationWizard } from './features/admin/delegations/AdminDelegationWizard';
import { DelegationGallery } from './features/admin/DelegationGallery';
import { TeamsListPage } from './features/teams/TeamsListPage';
import { MatchesPage } from './features/matches/MatchesPage';
import { PartnersPage } from './features/public/PartnersPage';
import VenueAdminPage from './features/admin/matches/VenueAdminPage';
import MatchResultsPage from './features/admin/matches/MatchResultsPage';
import TeamRostersPage from './features/admin/matches/TeamRostersPage';
import { TasksPage } from './features/admin/TasksPage';
import { VolunteersPage } from './features/admin/VolunteersPage';
import { VolunteerRegistrationPage } from './features/public/VolunteerRegistrationPage';

// Mobile Public Pages
import { MobileLayout } from './components/mobile/MobileLayout';
import { MobileHomePage } from './features/public-mobile/MobileHomePage';
import { MobileTeamsPage } from './features/public-mobile/MobileTeamsPage';
import { MobileProgramPage } from './features/public-mobile/MobileProgramPage';
import { MobileVenuesPage } from './features/public-mobile/MobileVenuesPage';
import { MobileVolunteersPage, MobileContactPage } from './features/public-mobile/MobilePages';
import { MobileSettingsPage } from './features/public-mobile/MobileSettingsPage';
import { MobileVolunteerSignupPage } from './features/public-mobile/MobileVolunteerSignupPage';
import { MobileThankYouPage } from './features/public-mobile/MobileThankYouPage';
import { RootRedirect } from './components/RootRedirect';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'system') {
      root.removeAttribute('data-theme');
      return;
    }

    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render or just let CSS handle it since we removed data-theme
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Mobile Public Routes - Separate from desktop */}
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<MobileHomePage />} />
          <Route path="teams" element={<MobileTeamsPage />} />
          <Route path="program" element={<MobileProgramPage />} />
          <Route path="venues" element={<MobileVenuesPage />} />
          <Route path="volunteers" element={<MobileVolunteersPage />} />
          <Route path="contact" element={<MobileContactPage />} />
          <Route path="settings" element={<MobileSettingsPage />} />
          <Route path="volunteer-signup" element={<MobileVolunteerSignupPage />} />
          <Route path="thank-you" element={<MobileThankYouPage />} />
        </Route>

        {/* Desktop Routes - Unchanged */}
        <Route element={<AppLayout />}>
          {/* Root route - auto-detect device and redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Section - Root and Dashboard */}
          <Route path="/admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="hotels" element={<HotelsList />} />
              <Route path="hotels/:id" element={<HotelDetail />} />
              <Route path="hotels/pricing" element={<EventPricingPage />} />
              <Route path="matches/draw" element={<TournamentDrawPage />} />
              <Route path="venues" element={<VenueAdminPage />} />
              <Route path="results" element={<MatchResultsPage />} />
              <Route path="rosters" element={<TeamRostersPage />} />
              <Route path="hotel-offers" element={<OffersList />} />
              <Route path="hotel-offers/:id" element={<OfferDetail />} />
              <Route path="daily-capacities" element={<DailyCapacities />} />

              <Route path="delegations" element={<DelegationsList />} />

              {/* Admin Delegation Edit/Details */}
              <Route path="delegations/:id" element={<AdminDelegationWizard />}>
                <Route index element={<Navigate to="basics" replace />} />
                <Route path="basics" element={<BasicsStep />} />
                <Route path="accommodation" element={<AccommodationStep />} />
                <Route path="transport" element={<TransportStep />} />
                <Route path="training" element={<TrainingStep />} />
                <Route path="meals" element={<MealsStep />} />
                <Route path="billing" element={<BillingStep />} />
                <Route path="confirmation" element={<ConfirmationStep />} />
              </Route>
              <Route path="gallery" element={<DelegationGallery />} />

              {/* Admin Delegation Entry */}
              <Route path="delegations/new" element={<AdminDelegationWizard />}>
                <Route index element={<Navigate to="basics" replace />} />
                <Route path="basics" element={<BasicsStep />} />
                <Route path="accommodation" element={<AccommodationStep />} />
                <Route path="transport" element={<TransportStep />} />
                <Route path="training" element={<TrainingStep />} />
                <Route path="meals" element={<MealsStep />} />
                <Route path="billing" element={<BillingStep />} />
                <Route path="confirmation" element={<ConfirmationStep />} />
              </Route>

              {/* Accommodation Module */}
              <Route path="accommodation" element={<AccommodationLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<AccommodationOverviewPage />} />
                <Route path="allocations" element={<AccommodationAllocationsPage />} />
                <Route path="allocations/:id" element={<AllocationDetail />} />
                <Route path="report" element={<AccommodationReportPage />} />
              </Route>

              {/* Legacy redirects */}
              <Route path="reports/accommodation" element={<Navigate to="/admin/accommodation/report" replace />} />
              <Route path="accommodation/reports" element={<Navigate to="/admin/accommodation/report" replace />} />

              <Route path="tasks" element={<TasksPage />} />
              <Route path="volunteers">
                <Route index element={<VolunteersPage />} />
                <Route path="register" element={<VolunteerRegistrationPage />} />
              </Route>
            </Route>
          </Route>

          {/* Delegation Wizard */}
          <Route path="/delegation" element={<DelegationLayout />}>
            <Route index element={<Navigate to="basics" replace />} />
            <Route path="basics" element={<BasicsStep />} />
            <Route path="accommodation" element={<AccommodationStep />} />
            <Route path="transport" element={<TransportStep />} />
            <Route path="training" element={<TrainingStep />} />
            <Route path="meals" element={<MealsStep />} />
            <Route path="billing" element={<BillingStep />} />
            <Route path="confirmation" element={<ConfirmationStep />} />
          </Route>

          {/* Main App Modules */}
          <Route path="/teams" element={<TeamsListPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/logistics" element={<UnderConstructionPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/volunteers/register" element={<VolunteerRegistrationPage />} />
          <Route path="/transport" element={<PlaceholderPage title="Transport" subtitle="Shuttle schedules and visuals" />} />
          <Route path="/meals" element={<PlaceholderPage title="Meals" subtitle="Catering and dining schedules" />} />

          {/* Backward compatibility and System */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/notifications" element={<PlaceholderPage title="Notifications" subtitle="System alerts and messages" />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
