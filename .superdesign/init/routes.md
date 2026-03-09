# Routes

- **Framework**: React Router v7 (createBrowserRouter)
- **Config file**: `src/app/router.tsx`
- **Root wrapper**: `RootLayout` (all routes); renders `<Outlet />`, `GlobalFooter`, `CoreAIFab`, `DemoSwitcher`

## Route mapping

| Path | Component | Layout / guards |
|------|-----------|-----------------|
| `/` | Login | RootLayout |
| `/verify` | VerifyCode | RootLayout |
| `/forgot` | ForgotPassword | RootLayout |
| `/forgot/verify` | ForgotPasswordVerify | RootLayout |
| `/reset` | ResetPassword | RootLayout |
| `/help` | HelpCenter | RootLayout |
| `/signup` | Signup | RootLayout |
| `/dashboard` | PreEnrollment | RootLayout, ProtectedRoute |
| `/demo` | DemoDashboard | RootLayout |
| `/dashboard/classic` | Dashboard | RootLayout, ProtectedRoute |
| `/dashboard/post-enrollment` | PostEnrollmentDashboard | RootLayout, ProtectedRoute |
| `/dashboard/investment-portfolio` | InvestmentPortfolioPage | RootLayout, ProtectedRoute |
| `/profile` | Profile | RootLayout, ProtectedRoute |
| `/enrollment` | EnrollmentLayout (Outlet) | RootLayout, ProtectedRoute |
| `/enrollment` (index) | EnrollmentManagement | EnrollmentLayout |
| `/enrollment/manage/:planId` | PlanDetailManagement | EnrollmentLayout |
| `/enrollment/choose-plan` | ChoosePlan | EnrollmentLayout |
| `/enrollment/plans` | PlansPage | EnrollmentLayout |
| `/enrollment/contribution` | Contribution | EnrollmentLayout |
| `/enrollment/future-contributions` | FutureContributions | EnrollmentLayout |
| `/enrollment/investments` | EnrollmentInvestmentsContent | EnrollmentLayout, EnrollmentInvestmentsGuard |
| `/enrollment/review` | EnrollmentReviewContent | EnrollmentLayout |
| `/transactions` | TransactionIntelligenceHub | RootLayout, ProtectedRoute |
| `/transactions/legacy` | TransactionsPage | RootLayout, ProtectedRoute |
| `/transactions/:transactionType/start` | TransactionApplicationRouter | RootLayout, ProtectedRoute |
| `/transactions/:transactionType/:transactionId` | TransactionApplicationRouter | RootLayout, ProtectedRoute |
| `/transactions/:transactionId` | TransactionAnalysis | RootLayout, ProtectedRoute |
| `/settings` | SettingsHub | RootLayout, ProtectedRoute |
| `/settings/theme` | ThemeSettings | RootLayout, ProtectedRoute |
| `/investments` | InvestmentsPage | RootLayout, ProtectedRoute, InvestmentProvider, InvestmentsLayout |

## Router config (full)

See `src/app/router.tsx` for the full `createBrowserRouter([...])` tree with `RootLayout` as single root element and nested children.
