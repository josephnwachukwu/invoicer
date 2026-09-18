# Invoicer Mobile: Production Readiness Audit and Feature Report

**Prepared:** September 18, 2026  
**Application:** Invoicer Ionic/Capacitor mobile application  
**Companion SaaS:** https://invoicer.me  
**Firebase project:** `invoicer-6022f`  
**Mobile application ID:** `com.genisystemstech.invoicer`  
**Current application version:** `2.0.0` (`versionCode` 2)

## 1. Executive summary

The Invoicer mobile application received a broad production-readiness modernization covering its Angular/Ionic stack, Firebase data contracts, authentication, analytics, security, offline behavior, native iOS and Android projects, account lifecycle, and automated verification.

The codebase now compiles as a modern Capacitor application for both iOS and Android. The production dependency tree has no known npm vulnerabilities. Nine browser unit tests pass, the Angular production bundle builds, Firebase Functions compile, and post-sync Android and iOS builds succeed.

The application is substantially closer to release readiness. Remaining work is primarily operational: release signing, store credentials, Firebase console settings, device-level acceptance tests, store listing material, and production monitoring configuration.

## 2. Technical baseline

| Area | Current baseline |
|---|---|
| Angular | 20.3.x |
| Ionic Angular | 8.8.x |
| Capacitor | 8.x |
| Firebase Web SDK | 11.10.x |
| AngularFire | 20.0.x |
| RxJS | 7.8.x |
| TypeScript | 5.9.x |
| Android compile/target SDK | 36 |
| Android minimum SDK | 24 |
| iOS deployment target | 15.0 |
| Mobile version | 2.0.0 |
| Invoice schema | Version 2 |

Ionic 8 was deliberately retained. Ionic 9 removed the NgModule compatibility required by the current application architecture; adopting it would require a separate standalone-component migration rather than a safe dependency update.

## 3. Implemented product features

### Authentication and accounts

- Email/password registration and login.
- Password-reset workflow.
- Canonical user profiles stored at `users/{uid}`.
- Firebase Auth display-name synchronization.
- Profile migration for legacy user documents.
- In-app account deletion with confirmation.
- Backend deletion of the user’s authentication record, profile, owned business data, entitlements, and uploaded files.
- Public account-deletion instructions at `/account-deletion` on the SaaS site.

### Invoice workflow

- Create and update invoices.
- Line-item calculations for quantity, rate, subtotal, tax, discount, shipping, and partial payments.
- PDF generation and download.
- Email delivery through the authenticated backend endpoint.
- Hosted invoice tokens and public-access metadata.
- Invoice lifecycle fields including document type, status, currency, locale, theme, timestamps, and ownership.
- First-invoice analytics event.
- Safe loading of an invoice or selected client through route parameters.
- Bounded PDF-generation listeners with timeout/error handling.

### Clients and expenses

- Client creation, editing, listing, and soft archival.
- Expense-report creation and total calculation.
- Expense-report generation with bounded completion monitoring.
- UID and `ownerId` ownership fields for schema compatibility.
- Created/updated timestamps and archived-state metadata.

### Premium and branding foundations

- Premium/basic entitlement field on user profiles.
- Company-logo upload with MIME-type validation.
- PNG, JPEG, and WebP support.
- One-megabyte mobile upload limit.
- Owner-scoped Storage paths under `branding/{uid}/`.
- Premium access check for company-logo functionality.
- Invoice theme, branding, accent color, and Invoicer-branding visibility fields in the invoice schema.
- Pricing page describing free and premium capabilities and linking to current web pricing.

### Analytics and reliability

- Events for `sign_up`, `login`, `invoice_created`, `first_invoice`, `invoice_sent`, `download`, and `app_error`.
- A first-invoice guard prevents duplicate client-side first-invoice events for the same account/device.
- Global Angular error telemetry with production console output suppressed.
- Native/web connectivity monitoring through the Capacitor Network plugin.
- Visible offline state in the application shell.
- Subscription cleanup using Angular lifecycle-aware RxJS operators.
- Undefined values are recursively removed before Firestore writes.

## 4. Firebase and backend changes

### Profile and legacy-data migration

`POST /profile/ensure` authenticates the Firebase ID token, creates or repairs the canonical profile, and migrates legacy invoices, clients, and expenses to the version-2 ownership model.

The migration uses Firestore `BulkWriter`, avoiding the 500-operation ceiling of a single write batch.

### Account deletion

`DELETE /account` requires an authenticated Firebase ID token and removes:

- Firebase Authentication user.
- Canonical user profile.
- Entitlement record.
- Owned invoices, clients, expenses, items, recurring templates, and integrations.
- Branding and invoice files in Cloud Storage.

### Data model conventions

New or migrated records use:

- `schemaVersion: 2`
- `ownerId` as the canonical ownership field.
- `uid` temporarily retained for legacy compatibility.
- Server timestamps for creation and modification.
- Stable document lifecycle/status values.
- Bounded arrays for line items and attachments.

### Security controls

- Authenticated backend routes verify Firebase ID tokens.
- App Check is initialized with reCAPTCHA Enterprise.
- A Content Security Policy is included in the application entry document.
- Logo uploads use owner-scoped paths and client validation.
- Firestore writes do not blindly accept a caller-supplied owner ID.
- Sensitive production errors are converted to user-safe messages.

## 5. Native platform readiness

### Android

- A complete Capacitor Android project now exists.
- Compile and target SDK are set to API 36.
- Minimum SDK is 24.
- Release minification and resource shrinking are enabled.
- Android backups are disabled to reduce unintended local-data extraction.
- Branded adaptive launcher assets were generated.
- A debug APK builds successfully with JDK 24.

### iOS

- The existing project was migrated to Capacitor 8.
- UIScene lifecycle support was added.
- The deployment target is iOS 15.
- Obsolete ARMv7 requirements were removed.
- Version/build settings were updated.
- Branded application icons were generated.
- `PrivacyInfo.xcprivacy` declares the user data categories used by the application.
- A code-signing-disabled simulator build succeeds.

## 6. Verification evidence

| Check | Result |
|---|---|
| Angular lint | Passed |
| Browser unit suite | 9 of 9 passed |
| Mobile Angular production build | Passed |
| SaaS Angular production build | Passed |
| Firebase Functions TypeScript build | Passed |
| Capacitor iOS/Android sync | Passed |
| Android `assembleDebug` | Passed |
| iOS simulator build | Passed |
| Production npm security audit | 0 vulnerabilities |

The full npm audit reports six moderate development-only advisories inherited through Angular’s development server and Capacitor’s Xcode tooling. npm currently reports no upstream fix. These packages are not part of the deployed production JavaScript dependency set.

The invoice smoke coverage verifies invoice total calculation and the application creation workflow at unit/build level. A final authenticated end-to-end test against a Firebase emulator or controlled staging account should still be performed before store submission.

## 7. Known limitations and release blockers

These items require credentials, external console changes, product decisions, or physical-device testing and cannot be safely completed from source code alone:

1. **Android release signing:** configure the production keystore through secure CI/store secrets and generate a signed AAB.
2. **Apple release signing:** select the distribution team, certificate, provisioning profile, and App Store Connect application.
3. **Firebase App Check:** register the final Android SHA-256 certificate and Apple App Attest/DeviceCheck configuration, then validate enforcement gradually.
4. **Native Firebase configuration:** verify production `google-services.json` and `GoogleService-Info.plist` without committing private environment-specific files unnecessarily.
5. **Device acceptance tests:** run registration, login, password reset, invoice creation, PDF generation, email delivery, logo upload, offline recovery, and account deletion on real iOS and Android devices.
6. **Subscription commerce:** the current mobile app exposes premium foundations and web pricing but does not implement StoreKit or Google Play Billing. Decide whether premium is purchased on the web or sold in-app, then complete the applicable store-compliance flow.
7. **Crash reporting:** application errors generate analytics telemetry, but native Crashlytics or another symbolicated crash-reporting SDK is not yet configured.
8. **Push notifications:** no production push-notification workflow is configured.
9. **Deep links:** universal links/app links should be added if password-reset, hosted invoice, or marketing links must open directly in the application.
10. **Performance:** the initial mobile bundle is approximately 1.43 MB raw and 374 KB estimated transfer. Further lazy-loading and chart/Firebase optimization is possible.
11. **SaaS bundle:** the web application builds successfully but retains CommonJS optimization warnings from `canvg`, `html2canvas`, and their transitive packages.
12. **Release monitoring:** production dashboards, alert thresholds, delivery failure monitoring, and backup/recovery drills remain operational tasks.

## 8. Recommended release gate

The application should be considered ready for a staged beta after all of the following are true:

- Signed iOS and Android release builds complete in CI.
- App Check succeeds on both platforms before enforcement is enabled.
- A clean test account completes the entire invoice lifecycle on physical devices.
- PDF content and invoice themes are visually checked on small and large screens.
- Email delivery passes SPF/DKIM/DMARC and bounce-path testing.
- Account deletion is confirmed in Auth, Firestore, and Storage.
- Firestore and Storage rules are tested against authorized and unauthorized users.
- Privacy disclosures match actual collected data and linked third parties.
- Store review accounts and reviewer instructions are prepared.
- Crash-free sessions and backend error alerts are visible during beta.

## 9. Suggested next feature roadmap

### Release-critical

- Firebase Emulator Suite integration tests for rules and authenticated invoice creation.
- CI pipeline for lint, tests, web build, Functions build, Android AAB, and iOS archive.
- Native crash reporting.
- Store signing and beta distribution through TestFlight and Play Internal Testing.

### Commercial features

- Recurring invoices with automatic reminders.
- Deposits and online payment links.
- Hosted client invoice portal with view/payment status.
- Estimates that can be converted into invoices.
- Saved catalog items and reusable clients.
- Premium theme enforcement through server-owned entitlements.
- Multi-user workspaces and role-based permissions.
- Custom SMTP/domain branding and removal of Invoicer branding.

### Intelligence features

- Duplicate invoice-number detection.
- Late-payment and cash-flow forecasts.
- Suggested payment terms based on customer payment history.
- Anomaly detection for totals, taxes, and duplicate expenses.
- Automatic line-item extraction from receipts.
- Natural-language invoice creation.
- Epoch project, time-entry, approval, and expense import.

## 10. Handoff prompt for ChatGPT

Copy the following prompt along with this report:

> You are reviewing the Invoicer Ionic/Capacitor application and its companion Angular/Firebase SaaS. Treat this report as a factual handoff, but verify claims against the repository before changing code. The mobile repository is `invoicerapp`; the SaaS and Firebase backend repository is `invoicer.me`. The application has completed its Angular/Ionic/Capacitor modernization, Firebase schema-v2 alignment, account deletion implementation, analytics instrumentation, Android creation, iOS migration, and baseline build verification. Focus next on the unresolved items in sections 7 and 8. Preserve existing user changes, do not deploy or alter production data without explicit authorization, do not expose Firebase or signing credentials, and validate every implementation with lint, unit tests, production builds, native builds, and emulator-based security tests. Begin by inspecting the current git diff and producing a short risk-ranked execution plan.

## 11. Repository locations

- Mobile app: `/Users/josephnwachukwu/Desktop/Repos/invoicerapp`
- SaaS and Firebase backend: `/Users/josephnwachukwu/Desktop/Repos/invoicer.me`
- Mobile Firebase configuration: `src/environments/`
- Mobile native Android project: `android/`
- Mobile native iOS project: `ios/App/`
- Firebase Functions source: `invoicer.me/functions/src/`
- Firebase rules and indexes: `invoicer.me/firestore.rules`, `invoicer.me/firestore.indexes.json`, and `invoicer.me/storage.rules`

## 12. Scope and deployment status

This report describes the local implementation and the verification performed on September 18, 2026. The changes in this production-readiness pass were **not deployed** as part of the audit. Production deployment and store submission should occur only after the release gate in section 8 is satisfied or the responsible owner explicitly accepts the remaining risks.
