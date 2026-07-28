-- ============================================================================
-- TakeCare Store Front — Content Database
-- Single SQLite database holding ALL textual/structural content rendered by
-- the site. Actual image files and inline SVG icon components are NEVER
-- stored here — they stay as local asset imports in the codebase. Where a
-- row needs to pick WHICH local icon/asset to use, it stores a symbolic
-- *_key (e.g. 'bell', 'state3') that the frontend maps to its own import —
-- never a file path, URL, or binary.
--
-- Conventions:
--   * snake_case identifiers.
--   * Singleton "one row of config" tables use id INTEGER PRIMARY KEY
--     CHECK (id = 1) so the app can upsert a single fixed row.
--   * List tables use sort_order INTEGER for display order.
--   * created_at / updated_at are ISO-8601 text, defaulted via triggers-free
--     application-level writes (kept simple for a content DB).
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. GLOBAL / SITE CHROME  (Header, Footer, Nav, promo strip, breadcrumbs)
-- ============================================================================

-- Reusable short UI strings (aria-labels / tooltips) referenced from many
-- components: Header/HeaderActions/MobileHeaderBar/MobileMenuDrawer, etc.
CREATE TABLE ui_labels (
    label_key   TEXT PRIMARY KEY,   -- e.g. 'cart', 'account', 'menu', 'close_menu', 'open_menu', 'primary_nav', 'mobile_primary_nav', 'get_app_cta'
    label_text  TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE header_content (
    id                    INTEGER PRIMARY KEY CHECK (id = 1),
    logo_alt_text         TEXT NOT NULL,             -- "CureBay"
    logo_aria_label       TEXT NOT NULL,              -- "CureBay — for a healthier India"
    notification_badge_count INTEGER NOT NULL DEFAULT 0,
    updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE nav_links (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    label        TEXT NOT NULL,            -- "Home", "Take Care ", "Our Services", "Our Team", "About Us", "Join Us"
    href         TEXT NOT NULL DEFAULT '#',
    is_active    INTEGER NOT NULL DEFAULT 0,  -- currently-highlighted nav item
    sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_nav_links_sort ON nav_links(sort_order);

-- Shared "Get Take Care" promo strip (GetTakeCareStrip desktop / GetTakeCareBarMobile)
CREATE TABLE promo_strip_content (
    id                          INTEGER PRIMARY KEY CHECK (id = 1),
    device_label_line1          TEXT NOT NULL,   -- "Tablet dispenser "
    device_label_line2          TEXT NOT NULL,   -- "(one time cost)"
    separator_symbol_1          TEXT NOT NULL DEFAULT '+',
    subscription_label_line1    TEXT NOT NULL,   -- "Subscription "
    subscription_label_line2    TEXT NOT NULL,   -- "Cost"
    separator_symbol_2          TEXT,            -- '=' (mobile bar only, nullable)
    price                       TEXT NOT NULL,   -- "₹1,698"
    cta_label                   TEXT NOT NULL,   -- "Get Take Care"
    scroll_target_id             TEXT NOT NULL DEFAULT 'subscription-plans',
    updated_at                  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE footer_link_groups (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,       -- "Services", "About"
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE footer_links (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id     INTEGER NOT NULL REFERENCES footer_link_groups(id) ON DELETE CASCADE,
    label        TEXT NOT NULL,
    href         TEXT,                -- nullable: currently plain text, not real links yet
    sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_footer_links_group ON footer_links(group_id);

CREATE TABLE footer_company_info (
    id               INTEGER PRIMARY KEY CHECK (id = 1),
    company_name     TEXT NOT NULL,   -- "CureBay Pharmacy Pvt. Ltd."
    address           TEXT NOT NULL,
    phone             TEXT NOT NULL,   -- "+91-8335 000 999"
    email_primary     TEXT NOT NULL,   -- "contact@curebay.com"
    email_secondary   TEXT NOT NULL,   -- "support@curebay.com"
    copyright_year    INTEGER NOT NULL,
    copyright_text    TEXT NOT NULL,   -- "All Rights Reserved by CureBay Pharmacy Pvt. Ltd."
    updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Generic breadcrumb, reusable for any sub-page (currently just the
-- Setup/Refill/Specifications flow page, but keyed by page so it scales).
CREATE TABLE breadcrumbs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    page_key      TEXT NOT NULL UNIQUE,   -- 'setup-refill-flow'
    home_label    TEXT NOT NULL,          -- "TakeCare"
    current_label TEXT NOT NULL           -- "Set Up, Refill & Specifications"
);

-- ============================================================================
-- 2. HERO / CONNECTED ECOSYSTEM  (Hero, HeroMobile, ConnectedEcosystem, EcosystemAccordion)
-- ============================================================================

CREATE TABLE hero_content (
    id                       INTEGER PRIMARY KEY CHECK (id = 1),
    subtitle                 TEXT NOT NULL,  -- "It dispenses, reminds & confirms."
    heading                  TEXT NOT NULL,  -- "Take Care"
    chip_right_text          TEXT NOT NULL,  -- "Your medicines. \nOn time. Every time."
    chip_left_text           TEXT NOT NULL,  -- "Peace of mind for you. \nTimely medication support \nfor your loved ones."
    chip_india_text          TEXT NOT NULL,  -- "Conceptualised.\nDesigned.\nMade in India."
    chip_qr_caption          TEXT NOT NULL,  -- "Scan the QR code to download the app."
    ecosystem_heading        TEXT NOT NULL,  -- "You can't be there every moment. \nTake Care can."
    ecosystem_footer_caption TEXT NOT NULL,  -- "Connect yourself to \na real-world healthcare ecosystem"
    phone_caption            TEXT NOT NULL,  -- "Yaa ! It comes with the specially curated \nTakeCare App for you"
    updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);

-- The 4 small ecosystem cards inside the Hero (Smart Dispenser / Take Care App / ...)
CREATE TABLE hero_ecosystem_cards (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    label        TEXT NOT NULL,       -- "Smart \nDispenser"
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE ecosystem_section_content (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    heading      TEXT NOT NULL,   -- "A connected Ecosystem" / "A connected ecosystem"
    subheading   TEXT NOT NULL,   -- "Every pill dispenser fails. Take Care isn't one."
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- The 5 "No more ..." ecosystem items (ConnectedEcosystem desktop / EcosystemAccordion mobile)
CREATE TABLE ecosystem_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    item_key     TEXT NOT NULL UNIQUE,  -- 'connected-to-curebay', 'works-24x7', '30-day-slots', 'medical-grade-build', 'magnetic-lock'
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    note         TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 3. MUM TOOK DOSE  (MumTookDose, MumTookDoseSectionTwo, AppreciationCard)
-- ============================================================================

CREATE TABLE mum_took_dose_content (
    id                 INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow            TEXT NOT NULL,   -- "For the ones who care."
    heading_line1      TEXT NOT NULL,   -- "Mum took"
    heading_line2      TEXT NOT NULL,   -- "her dose."
    subheading_line1   TEXT NOT NULL,   -- "Know in real time."
    subheading_line2   TEXT NOT NULL,   -- "From anywhere in the world."
    paragraph          TEXT NOT NULL,   -- SectionTwo intro paragraph
    updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE mum_took_dose_cards (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    icon_key     TEXT NOT NULL,   -- 'bell' | 'people' | 'calendar'
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE appreciation_card_content (
    id                   INTEGER PRIMARY KEY CHECK (id = 1),
    brand_name            TEXT NOT NULL,   -- "Take Care"
    timestamp_label        TEXT NOT NULL,   -- "2 mins ago"
    notification_title     TEXT NOT NULL,   -- "Mum took her 8:00 AM dose"
    notification_slot       TEXT NOT NULL,   -- "Slot 3"
    notification_medicine    TEXT NOT NULL,   -- "Metformin 500mg"
    notification_status      TEXT NOT NULL,   -- "On time"
    button_label            TEXT NOT NULL,   -- "Appreciate"
    updated_at              TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- 4. FEATURES SECTION  ("One device. Complete care.")
-- ============================================================================

CREATE TABLE features_section_content (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow      TEXT NOT NULL,   -- "CureBay Services"
    heading      TEXT NOT NULL,   -- "One device. Complete care."
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE feature_tabs (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    label             TEXT NOT NULL,   -- "Doctor", "Medicines", "Lab tests", "SOS", "Dose Management"
    accent_color       TEXT NOT NULL,   -- "#30956A"
    accent_light_color  TEXT NOT NULL,   -- "#E8FFF1"
    bold_text          TEXT NOT NULL,   -- "Book a doctor in a single tap."
    body_text          TEXT NOT NULL,
    is_wide            INTEGER NOT NULL DEFAULT 0,  -- spans 2 grid columns
    sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 5. NOBODY FALLS THROUGH THE CRACKS
-- ============================================================================

CREATE TABLE nobody_falls_content (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    heading       TEXT NOT NULL,   -- "Nobody falls through the cracks."
    subtext_line1  TEXT NOT NULL,   -- "One missed dose triggers"
    subtext_line2  TEXT NOT NULL,   -- "three parallel alerts."
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE nobody_falls_alert_cards (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    card_key             TEXT NOT NULL UNIQUE,   -- 'patient' | 'caregiver' | 'command-centre'
    label                TEXT NOT NULL,           -- "Patient", "Caregiver", "Command Centre"
    title                TEXT NOT NULL,
    subtitle             TEXT NOT NULL,
    body                 TEXT NOT NULL,
    primary_button_label   TEXT NOT NULL,
    secondary_button_label  TEXT NOT NULL,
    sort_order           INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 6. SET UP & REFILL / SPECIFICATIONS TEASER  (SetupSpecsSection)
-- ============================================================================

-- Two "acts" sharing one shape: the teaser card flips between a Setup pitch
-- and a Specifications pitch.
CREATE TABLE setup_specs_copy (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    act_key            TEXT NOT NULL UNIQUE,   -- 'setup' | 'specs'
    eyebrow            TEXT NOT NULL,
    heading_line1      TEXT NOT NULL,
    heading_line2      TEXT NOT NULL,
    body_line1         TEXT NOT NULL,
    body_line2         TEXT,                    -- mobile collapses body into one line; nullable
    cta_label          TEXT NOT NULL DEFAULT 'Explore the flow',
    sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 7. SETUP & REFILL FLOW PAGE  (SetupRefill intro + SetupRefillJourney timeline)
-- ============================================================================

CREATE TABLE setup_refill_intro_content (
    id             INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow        TEXT NOT NULL,   -- "Schedule. Load. Done. Refill"
    heading_line1  TEXT NOT NULL,   -- "Set up & Refill"
    heading_line2  TEXT NOT NULL,   -- "Reimagined."
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- The 4 named steps of the scroll-scrubbed journey: Schedule / Load / Done / Refill
CREATE TABLE setup_refill_journey_steps (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    step_key      TEXT NOT NULL UNIQUE,   -- 'schedule' | 'load' | 'done' | 'refill'
    badge_number  TEXT NOT NULL,          -- "1", "2", "3", "4"
    heading       TEXT NOT NULL,          -- "Schedule", "Load", "Done", "Refill"
    sort_order    INTEGER NOT NULL DEFAULT 0
);

-- Each step has multiple free-form paragraph beats (item1/item2/text2/text3/
-- text3Done/caregiverText/refillText/refillText2/...). Modelled as flexible
-- key->body rows per step rather than one fixed-column table, since the
-- number/shape of paragraphs differs per step.
CREATE TABLE setup_refill_journey_texts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    step_id      INTEGER NOT NULL REFERENCES setup_refill_journey_steps(id) ON DELETE CASCADE,
    text_key     TEXT NOT NULL,    -- 'item1' | 'item2' | 'text2' | 'text3' | 'text3_done' | 'caregiver_text' | 'refill_text' | 'refill_text2' | 'refill_text2_emphasis'
    body         TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_journey_texts_step ON setup_refill_journey_texts(step_id);

-- ============================================================================
-- 8. SPECIFICATIONS SECTION  ("Engineered to last.") + STORAGE CAPACITY
-- ============================================================================

CREATE TABLE specifications_content (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow       TEXT NOT NULL,   -- "Specifications"
    heading       TEXT NOT NULL,   -- "Engineered to last."
    subhead       TEXT NOT NULL,   -- "Precision, inside out. · Proof in every detail."
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Feature cards, grouped by which timeline state they appear in (state3 vs
-- the state8 recap uses slightly reworded body text).
CREATE TABLE specification_cards (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    state_key    TEXT NOT NULL,    -- 'state3' | 'state8'
    icon_key     TEXT NOT NULL,    -- symbolic icon reference, e.g. 'magnetic-lock'
    title        TEXT NOT NULL,    -- "Magnetic Lock"
    body         TEXT NOT NULL,
    col          INTEGER,          -- grid position (state3 layout)
    row          INTEGER,
    sort_order   INTEGER NOT NULL DEFAULT 0
);

-- Flexible storage stat pairs, reused by both Specifications (state 6/7) and
-- the standalone StorageCapacitySection.
CREATE TABLE specification_stats (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    group_key    TEXT NOT NULL,    -- 'specifications' | 'storage-capacity'
    number       TEXT NOT NULL,    -- "24", "48"
    unit         TEXT NOT NULL,    -- "mm Height", "mm height"
    label        TEXT NOT NULL,    -- "6 compartments", "2 compartments"
    sort_order   INTEGER NOT NULL DEFAULT 0
);

-- Flexible Storage Capacity copy block (Specifications state6/7 + standalone section)
CREATE TABLE storage_capacity_content (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    heading      TEXT NOT NULL,   -- "Flexible Storage Capacity"
    body         TEXT NOT NULL,
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- State-9 2x2 grid: Connectivity / Charging Input / Audio Integration
CREATE TABLE specification_connectivity_cards (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    variant            TEXT NOT NULL DEFAULT 'desktop',  -- 'desktop' | 'mobile' (body text differs slightly)
    title              TEXT NOT NULL,   -- "Connectivity", "Charging Input", "Audio Integration"
    body               TEXT,            -- nullable: Audio Integration body is an unfinished placeholder
    is_placeholder     INTEGER NOT NULL DEFAULT 0,
    sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 9. DOWNLOAD APP SECTION
-- ============================================================================

CREATE TABLE download_app_content (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    variant             TEXT NOT NULL UNIQUE,  -- 'desktop' | 'mobile'
    headline            TEXT NOT NULL,          -- "Get the  TakeCare app now !"
    subheading_line1     TEXT NOT NULL,
    subheading_line2     TEXT NOT NULL,
    qr_caption           TEXT,                   -- desktop only
    cta_label_line1       TEXT,                   -- mobile-only "Tap to Download"
    cta_label_line2       TEXT                    -- mobile-only "the Take Care app"
);

-- ============================================================================
-- 10. SUBSCRIPTION SECTION + CART DRAWER
-- ============================================================================

CREATE TABLE subscription_section_content (
    id                        INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow                    TEXT NOT NULL,   -- "Get your plan"
    heading                    TEXT NOT NULL,   -- "Take Care Subscription"
    device_price               TEXT NOT NULL,   -- "1,599"
    device_period_line1         TEXT NOT NULL,   -- "One"
    device_period_line2         TEXT NOT NULL,   -- "time cost"
    subscription_cost_label      TEXT NOT NULL,   -- "Subscription Cost"
    disclaimer_title            TEXT NOT NULL,   -- "Disclaimer"
    disclaimer_body             TEXT NOT NULL,
    updated_at                  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE subscription_plans (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_key              TEXT NOT NULL UNIQUE,  -- 'monthly' | 'yearly'
    title                 TEXT NOT NULL,          -- "Monthly plan"
    price_amount           TEXT NOT NULL,          -- "99"
    price_period_line1      TEXT NOT NULL,          -- "INR /"
    price_period_line2      TEXT NOT NULL,          -- "month"
    cta_label              TEXT NOT NULL,          -- "Get Started at ₹1,698"
    disclaimer_line1        TEXT NOT NULL,
    disclaimer_line2        TEXT NOT NULL,
    sort_order             INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE subscription_plan_features (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    icon_key     TEXT NOT NULL,   -- 'mobile' | 'warranty' | 'shield-check'
    text         TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cart_product (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    name         TEXT NOT NULL,   -- "Take Care tablet dispenser"
    tag          TEXT NOT NULL,   -- "One time payment"
    description  TEXT NOT NULL,
    qty_label    TEXT NOT NULL,   -- "Quantity"
    price        TEXT NOT NULL,   -- "₹1,599"
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE cart_static_text (
    id                          INTEGER PRIMARY KEY CHECK (id = 1),
    title                        TEXT NOT NULL,   -- "Your Cart"
    products_section_label         TEXT NOT NULL,   -- "Product" (desktop) / "Products" (mobile) — see variant col
    subscriptions_section_label     TEXT NOT NULL,   -- "Subscriptions"
    empty_subscription_title        TEXT NOT NULL,   -- "No subscription plan added."
    empty_subscription_subtitle      TEXT NOT NULL,   -- "Choose Monthly or Yearly below."
    checkout_cta_label              TEXT NOT NULL,   -- "Checkout"
    updated_at                     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- 11. FAQ SECTION
-- ============================================================================

CREATE TABLE faq_section_content (
    id                INTEGER PRIMARY KEY CHECK (id = 1),
    heading_line1      TEXT NOT NULL,   -- "Question ?"
    heading_line2      TEXT NOT NULL,   -- "Answers"
    updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE faq_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    question     TEXT NOT NULL,
    answer       TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 12. CHECKOUT / SHIPPING / PAYMENT FLOW
-- ============================================================================

CREATE TABLE checkout_steps (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    step_key     TEXT NOT NULL UNIQUE,  -- 'summary' | 'shipping' | 'payment'
    label        TEXT NOT NULL,         -- "Purchase Summery", "User Details & shipping address", "Payment"
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE checkout_section_content (
    id                        INTEGER PRIMARY KEY CHECK (id = 1),
    review_products_heading     TEXT NOT NULL,   -- "Review your products"
    subscriptions_heading       TEXT NOT NULL,   -- "Subscriptions"
    delivery_label              TEXT NOT NULL,   -- "Delivery"
    delivery_estimate           TEXT NOT NULL,   -- "Arrives in 2–4 days"
    subtotal_label              TEXT NOT NULL,   -- "Subtotal"
    delivery_charges_label       TEXT NOT NULL,   -- "Delivery charges"
    estimated_total_label        TEXT NOT NULL,   -- "Estimated Total"
    continue_payment_label       TEXT NOT NULL,   -- "Continue to Payment"
    back_label                  TEXT NOT NULL,   -- "Back"
    updated_at                  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE saved_addresses (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    text         TEXT NOT NULL,
    tag          TEXT,             -- "Default" on first demo address, nullable otherwise
    sort_order   INTEGER NOT NULL DEFAULT 0
);

-- Generic form field definitions, reused across ShippingDetailsPage and
-- ProfileModal (different form_key, same shape: label/placeholder/helper/required).
CREATE TABLE form_fields (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    form_key       TEXT NOT NULL,    -- 'shipping' | 'profile'
    field_key      TEXT NOT NULL,    -- 'first_name' | 'last_name' | 'email' | 'phone' | 'address_1' | ...
    label          TEXT NOT NULL,
    placeholder    TEXT,
    helper_text    TEXT,
    is_required    INTEGER NOT NULL DEFAULT 0,
    sort_order     INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX idx_form_fields_unique ON form_fields(form_key, field_key);

CREATE TABLE shipping_page_content (
    id                       INTEGER PRIMARY KEY CHECK (id = 1),
    login_prompt              TEXT NOT NULL,   -- "Already have an account?"
    login_cta_label            TEXT NOT NULL,   -- "Log in / Sign up"
    continue_label             TEXT NOT NULL,   -- "Continue"
    pincode_error_title         TEXT NOT NULL,   -- "Pincode not serviceable"
    pincode_error_body          TEXT NOT NULL,   -- "Choose a different delivery address or check coverage at curebay.com/serviceable"
    pincode_error_link_text      TEXT NOT NULL,   -- "curebay.com/serviceable"
    pincode_error_link_href      TEXT NOT NULL,
    updated_at                 TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE payment_options (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    option_key   TEXT NOT NULL UNIQUE,  -- 'all' | 'debit_card' | 'credit_card' | 'upi' | 'e_wallet' | 'netbanking' | 'cod'
    label        TEXT NOT NULL,
    subtext      TEXT,                  -- "(Not available for subscription orders)" — cod only
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE payment_page_content (
    id                     INTEGER PRIMARY KEY CHECK (id = 1),
    payment_mode_heading     TEXT NOT NULL,   -- "Payment Mode"
    contact_label            TEXT NOT NULL,   -- "Contact"
    shipping_address_label    TEXT NOT NULL,   -- "Shipping Address"
    change_label             TEXT NOT NULL,   -- "Change"
    address_note             TEXT NOT NULL,   -- "Address cannot be changed after dispatch"
    disclaimer_title         TEXT NOT NULL,   -- "No duplicate charges"
    disclaimer_body          TEXT NOT NULL,   -- "Fraud held payments are reviewed within 24 hrs — contact support@curebay.com"
    updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Payment-result "Status Card" shown after the Payment step's Pay Now
-- action (StatusCard.jsx) — 7 variants, one row each. Icon/colour choice
-- per variant stays in code (icons aren't DB-backed anywhere in this
-- schema); only the copy shown to the user lives here.
CREATE TABLE status_cards (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_key       TEXT NOT NULL UNIQUE,  -- 'payment_failed' | 'payment_in_progress' | 'payment_declined' | 'payment_interrupted' | 'confirmation_pending' | 'payment_under_review' | 'payment_successful'
    heading           TEXT NOT NULL,         -- "Payment failed"
    subheading        TEXT NOT NULL,         -- "Your order was not placed."
    primary_label     TEXT NOT NULL,         -- "Try again"
    secondary_label   TEXT,                  -- "Change payment method" — payment_failed only
    countdown_text    TEXT,                  -- "29:00 secs remaining" — payment_in_progress only
    footer_text       TEXT NOT NULL,         -- "Your cart is saved."
    sort_order        INTEGER NOT NULL DEFAULT 0
);

-- "Order Confirmation" page (OrderConfirmationPage.jsx) shown after the
-- payment_successful Status Card's "View Order" button. Icons/images stay
-- in code (same convention as everywhere else in this schema); only the
-- copy shown to the user lives here. `starts_from_prefix` and
-- `order_sent_prefix` are sentence prefixes, not full sentences — the
-- component appends the actual email/phone (real checkout-session data,
-- not DB content) after them at render time.
CREATE TABLE order_confirmation_content (
    id                       INTEGER PRIMARY KEY CHECK (id = 1),
    heading                  TEXT NOT NULL,   -- "Payment successful"
    subheading                TEXT NOT NULL,   -- "Your Take Care plan is now active & products will be delivered shortly"
    starts_from_label          TEXT NOT NULL,   -- "Starts from"
    starts_from_prefix         TEXT NOT NULL,   -- "Subscription will start once you login the Take care app using"
    renews_on_label            TEXT NOT NULL,   -- "Renews on"
    delivered_by_label         TEXT NOT NULL,   -- "Delivered by :"
    delivered_at_label         TEXT NOT NULL,   -- "Delivered at"
    order_number_prefix        TEXT NOT NULL,   -- "Order #"
    order_sent_prefix          TEXT NOT NULL,   -- "Order confirmation sent to"
    qr_heading_line1           TEXT NOT NULL,   -- "Scan the QR code"
    qr_heading_line2           TEXT NOT NULL,   -- "to download the app"
    qr_caption_line1           TEXT NOT NULL,   -- "Use your email ID to log in."
    qr_caption_line2           TEXT NOT NULL,   -- "OTP will be sent for verification"
    back_to_dashboard_label     TEXT NOT NULL,   -- "Back to dashboard"
    track_order_label          TEXT NOT NULL,   -- "Track Order"
    updated_at                TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- 13. PROFILE / OTP / DASHBOARD
-- ============================================================================

CREATE TABLE profile_modal_content (
    id             INTEGER PRIMARY KEY CHECK (id = 1),
    heading        TEXT NOT NULL,   -- "Create your Profile"
    consent_text    TEXT NOT NULL,
    terms_label     TEXT NOT NULL,   -- "Terms and Conditions"
    privacy_label   TEXT NOT NULL,   -- "Privacy Policy"
    submit_label    TEXT NOT NULL,   -- "Get Consent via OTP"
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE otp_modal_content (
    id                       INTEGER PRIMARY KEY CHECK (id = 1),
    heading_enter             TEXT NOT NULL,   -- "Enter OTP"
    otp_sent_template          TEXT NOT NULL,   -- "OTP sent to {phone}."
    success_text              TEXT NOT NULL,   -- "Registration Successful"
    verify_label              TEXT NOT NULL,   -- "Verify OTP"
    continue_label            TEXT NOT NULL,   -- "Continue"
    resend_countdown_template   TEXT NOT NULL,   -- "Resend SMS in {n} sec"
    resend_label              TEXT NOT NULL,   -- "Resend OTP"
    updated_at                TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE dashboard_content (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    title         TEXT NOT NULL,   -- "Profile"
    welcome_text   TEXT NOT NULL,   -- "Welcome,"
    member_tag    TEXT NOT NULL,   -- "CureBay · Take Care Member"
    logout_label  TEXT NOT NULL,   -- "Logout"
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE dashboard_abha_card (
    id                 INTEGER PRIMARY KEY CHECK (id = 1),
    id_label            TEXT NOT NULL,   -- "ABHA ID :"
    address_label        TEXT NOT NULL,   -- "ABHA Address :"
    not_created_chip      TEXT NOT NULL,   -- "ABHA not created"
    not_linked_value      TEXT NOT NULL,   -- "Not linked"
    create_cta_label      TEXT NOT NULL   -- "Create ABHA"
);

CREATE TABLE dashboard_personal_info_card (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    footer_text    TEXT NOT NULL   -- "Your name appears on your Take Care Subscription and orders."
);

CREATE TABLE dashboard_addresses_card (
    id             INTEGER PRIMARY KEY CHECK (id = 1),
    home_label      TEXT NOT NULL,   -- "Home"
    default_chip    TEXT NOT NULL,   -- "Default"
    empty_text      TEXT NOT NULL,   -- "No address added yet."
    footer_text     TEXT NOT NULL,   -- "Address cannot be changed after an order is dispatched."
    view_all_label   TEXT NOT NULL   -- "View All"
);

CREATE TABLE dashboard_contact_card (
    id                  INTEGER PRIMARY KEY CHECK (id = 1),
    email_label          TEXT NOT NULL,   -- "Email"
    not_provided_label    TEXT NOT NULL,   -- "Not provided"
    contact_label        TEXT NOT NULL,   -- "Contact"
    footer_text          TEXT NOT NULL
);

CREATE TABLE dashboard_subscription_card (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    empty_text     TEXT NOT NULL,   -- "No active subscription yet."
    active_chip    TEXT NOT NULL,   -- "Active"
    history_label  TEXT NOT NULL,   -- "History"
    manage_label   TEXT NOT NULL,   -- "Manage Subscription"
    footer_text    TEXT NOT NULL
);

CREATE TABLE dashboard_orders_card (
    id                  INTEGER PRIMARY KEY CHECK (id = 1),
    device_name          TEXT NOT NULL,   -- "TakeCare Tablet Dispenser"
    device_price_label    TEXT NOT NULL,   -- "₹1,599 · One-time"
    confirmed_chip        TEXT NOT NULL,   -- "Order Confirmed"
    empty_text           TEXT NOT NULL,   -- "No orders yet."
    filter_label         TEXT NOT NULL   -- "Filter by"
);

CREATE TABLE dashboard_notification_rows (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    label        TEXT NOT NULL,   -- "Order updates", "Subscription alerts", "Health reminders", "Promotions"
    sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE dashboard_general_card (
    id               INTEGER PRIMARY KEY CHECK (id = 1),
    language_label    TEXT NOT NULL,   -- "Language"
    language_value    TEXT NOT NULL,   -- "English"
    privacy_label     TEXT NOT NULL,   -- "Privacy & data"
    footer_text       TEXT NOT NULL
);

-- ============================================================================
-- 14. IMAGE ASSETS  (photo/background/product/scene images, GCP Storage URLs)
-- ============================================================================

-- Every photographic/illustrative image on the site (backgrounds, product &
-- device renders, phone/app mockups, scene illustrations). Deliberately
-- excludes small UI icon files, logos, badges, and QR codes — those stay as
-- local imports in the codebase, same convention as inline SVG icon
-- components. image_key is a stable symbolic reference the frontend maps to
-- a <img src>; url is a public Google Cloud Storage object URL
-- (https://storage.googleapis.com/<bucket>/<path>) that starts out as a
-- placeholder mirroring the current local asset path and gets overwritten
-- once the real files are uploaded to the real bucket.
CREATE TABLE image_assets (
    image_key   TEXT PRIMARY KEY,
    url         TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
