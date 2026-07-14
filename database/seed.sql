-- ============================================================================
-- TakeCare Store Front — Seed data
-- Populates every table in schema.sql with the actual live copy currently
-- hardcoded across the React components. Run after schema.sql on the same
-- database file. Idempotent-ish: DELETE-then-INSERT per table so re-running
-- this file doesn't create duplicates.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. GLOBAL / SITE CHROME
-- ============================================================================

DELETE FROM ui_labels;
INSERT INTO ui_labels (label_key, label_text) VALUES
  ('cart', 'Cart'),
  ('account', 'Account'),
  ('menu', 'Menu'),
  ('close_menu', 'Close menu'),
  ('open_menu', 'Open menu'),
  ('primary_nav', 'Primary'),
  ('mobile_primary_nav', 'Mobile primary'),
  ('get_app_cta', 'Get the App');

DELETE FROM header_content;
INSERT INTO header_content (id, logo_alt_text, logo_aria_label, notification_badge_count) VALUES
  (1, 'CureBay', 'CureBay — for a healthier India', 1);

DELETE FROM nav_links;
INSERT INTO nav_links (label, href, is_active, sort_order) VALUES
  ('Home', '#', 0, 0),
  ('Take Care ', '#', 1, 1),
  ('Our Services', '#', 0, 2),
  ('Our Team', '#', 0, 3),
  ('About Us', '#', 0, 4),
  ('Join Us', '#', 0, 5);

DELETE FROM promo_strip_content;
INSERT INTO promo_strip_content (
  id, device_label_line1, device_label_line2, separator_symbol_1,
  subscription_label_line1, subscription_label_line2, separator_symbol_2,
  price, cta_label, scroll_target_id
) VALUES (
  1, 'Tablet dispenser ', '(one time cost)', '+',
  'Subscription ', 'Cost', '=',
  '₹1,698', 'Get Take Care', 'subscription-plans'
);

DELETE FROM footer_link_groups;
INSERT INTO footer_link_groups (id, title, sort_order) VALUES
  (1, 'Services', 0),
  (2, 'About', 1);

DELETE FROM footer_links;
INSERT INTO footer_links (group_id, label, href, sort_order) VALUES
  (1, 'Membership', NULL, 0),
  (1, 'Totalcare', NULL, 1),
  (1, 'Consult a Doctor', NULL, 2),
  (1, 'Order Medicine', NULL, 3),
  (1, 'Book a Lab Test', NULL, 4),
  (1, 'Consult for Surgery', NULL, 5),
  (1, 'Concierge Services', NULL, 6),
  (2, 'Why CureBay', NULL, 0),
  (2, 'Our Team', NULL, 1),
  (2, 'Blogs', NULL, 2),
  (2, 'Media & News', NULL, 3),
  (2, 'Awards', NULL, 4),
  (2, 'Privacy Policy', NULL, 5),
  (2, 'Terms of Use', NULL, 6),
  (2, 'Return and Refund Policy', NULL, 7),
  (2, 'Medicine Delivery Policy', NULL, 8),
  (2, 'Careers', NULL, 9);

DELETE FROM footer_company_info;
INSERT INTO footer_company_info (id, company_name, address, phone, email_primary, email_secondary, copyright_year, copyright_text) VALUES (
  1, 'CureBay Pharmacy Pvt. Ltd.',
  'Plot No-A-98, Laxmi Sagar, Budha Nagar, Bhubaneswar, Khordha, Odisha, 751006',
  '+91-8335 000 999', 'contact@curebay.com', 'support@curebay.com',
  2024, 'All Rights Reserved by CureBay Pharmacy Pvt. Ltd.'
);

DELETE FROM breadcrumbs;
INSERT INTO breadcrumbs (page_key, home_label, current_label) VALUES
  ('setup-refill-flow', 'TakeCare', 'Set Up, Refill & Specifications');

-- ============================================================================
-- 2. HERO / CONNECTED ECOSYSTEM
-- ============================================================================

DELETE FROM hero_content;
INSERT INTO hero_content (
  id, subtitle, heading, chip_right_text, chip_left_text, chip_india_text,
  chip_qr_caption, ecosystem_heading, ecosystem_footer_caption, phone_caption
) VALUES (
  1,
  'It dispenses, reminds & confirms.',
  'Take Care',
  'Your medicines.
On time. Every time.',
  'Peace of mind for you.
Timely medication support
for your loved ones.',
  'Conceptualised.
Designed.
Made in India.',
  'Scan the QR code to download the app.',
  'You can''t be there every moment.
Take Care can.',
  'Connect yourself to
a real-world healthcare ecosystem',
  'Yaa ! It comes with the specially curated
TakeCare App for you'
);

DELETE FROM hero_ecosystem_cards;
INSERT INTO hero_ecosystem_cards (label, sort_order) VALUES
  ('Smart
Dispenser', 0),
  ('Take Care
App', 1),
  ('CureBay
Services', 2),
  ('24x7
Command Centre', 3);

DELETE FROM ecosystem_section_content;
INSERT INTO ecosystem_section_content (id, heading, subheading) VALUES
  (1, 'A connected Ecosystem', 'Every pill dispenser fails. Take Care isn''t one.');

DELETE FROM ecosystem_items;
INSERT INTO ecosystem_items (item_key, title, body, note, sort_order) VALUES
  ('connected-to-curebay', 'Connected to CureBay',
   'Consult doctors, order medications, book lab tests, manage doses, and access emergency support—all through the Take Care App.',
   'No more disconnected healthcare.', 0),
  ('works-24x7', 'Works 24x7',
   'One missed dose; instant alerts to you, your family & the 24×7 command centre.',
   'No more boxes
that just sit there.', 1),
  ('30-day-slots', '30-Day Slots',
   'Drop in a whole sealed strip — 30 days per slot, refilled monthly by CureBay.',
   'No more popping pills
from foil every day.', 2),
  ('medical-grade-build', 'Medical-Grade Build',
   'Medical-grade ABS, anti-microbial finish. Built to last, easy to wipe clean.',
   'No more cracks on the first drop.', 3),
  ('magnetic-lock', 'Magnetic lock',
   'Magnetic lock seals every slot.
An IR sensor confirms the dose the slot glows when it''s done.',
   'No more pills spilling in your bag.', 4);

-- ============================================================================
-- 3. MUM TOOK DOSE
-- ============================================================================

DELETE FROM mum_took_dose_content;
INSERT INTO mum_took_dose_content (
  id, eyebrow, heading_line1, heading_line2, subheading_line1, subheading_line2, paragraph
) VALUES (
  1, 'For the ones who care.', 'Mum took', 'her dose.', 'Know in real time.', 'From anywhere in the world.',
  'Over 55% of elderly patients managing chronic conditions miss doses regularly — most without their family''s knowledge. Medication non-adherence causes more than 1,25,000 preventable hospitalisations in India each year. Take Care gives you real-time visibility without requiring you to be there.'
);

DELETE FROM mum_took_dose_cards;
INSERT INTO mum_took_dose_cards (icon_key, title, body, sort_order) VALUES
  ('bell', 'Dose confirmed. Instantly.',
   'To eliminate follow-up calls, Take Care notifies you the moment a dose is taken or missed — medicine name, slot number, timestamp. The device syncs to the TakeCare app in under 30 seconds over Wi-Fi.', 0),
  ('people', 'Handles up to 8 medicines at once.',
   'To manage complex multi-drug regimens, each numbered compartment maps to one medicine and one time slot. The dispenser opens only the right drawer at the right time. No mix-ups. No double doses.', 1),
  ('calendar', 'Configure full schedule from your phone.',
   'Upload the prescription to set up care without a visit. CureBay verifies it, schedules, and delivers medicines to your parent''s door. You manage timings, refill alerts, and caregiver access. Your parent presses TAKEN, and you see it instantly.', 2);

DELETE FROM appreciation_card_content;
INSERT INTO appreciation_card_content (
  id, brand_name, timestamp_label, notification_title, notification_slot, notification_medicine, notification_status, button_label
) VALUES (
  1, 'Take Care', '2 mins ago', 'Mum took her 8:00 AM dose', 'Slot 3', 'Metformin 500mg', 'On time', 'Appreciate'
);

-- ============================================================================
-- 4. FEATURES SECTION
-- ============================================================================

DELETE FROM features_section_content;
INSERT INTO features_section_content (id, eyebrow, heading) VALUES
  (1, 'CureBay Services', 'One device. Complete care.');

DELETE FROM feature_tabs;
INSERT INTO feature_tabs (label, accent_color, accent_light_color, bold_text, body_text, is_wide, sort_order) VALUES
  ('Doctor', '#30956A', '#E8FFF1', 'Book a doctor in a single tap.',
   ' Schedule consultations, connect with trusted doctors, receive reminders, and manage appointments from the app or with a single tap on your TakeCare device.', 0, 0),
  ('Medicines', '#D29300', '#FFF4DC', 'Refill your medicines with a single tap.',
   ' Refill prescriptions, upload prescriptions, track medicine stock, and get expert support—all from the app or with a single tap on your TakeCare device. Our concierge team handles the rest.', 0, 1),
  ('Lab tests', '#005D8E', '#E1F1FA', 'Book lab tests with a single tap.',
   ' Browse tests, schedule home sample collection, and receive reports through the app or with a single tap on your TakeCare device. Our concierge team coordinates everything for you.', 0, 2),
  ('SOS', '#D82525', '#FFE9E9', 'Emergency Services. Get help when every second matters.',
   ' Trigger emergency assistance, instantly notify caregivers, and connect to support with a single tap on your TakeCare device or through the app.', 0, 3),
  ('Dose Management', '#008EB1', '#E2F6FC', 'Take the right medicine at the right time.',
   ' Only the scheduled slot glows at the right time. The display shows what''s next, sends reminders, and automatically logs each dose when the slot is closed.', 1, 4);

-- ============================================================================
-- 5. NOBODY FALLS THROUGH THE CRACKS
-- ============================================================================

DELETE FROM nobody_falls_content;
INSERT INTO nobody_falls_content (id, heading, subtext_line1, subtext_line2) VALUES
  (1, 'Nobody falls through the cracks.', 'One missed dose triggers', 'three parallel alerts.');

DELETE FROM nobody_falls_alert_cards;
INSERT INTO nobody_falls_alert_cards (card_key, label, title, subtitle, body, primary_button_label, secondary_button_label, sort_order) VALUES
  ('patient', 'Patient', 'Slot 1,5 & 7 :
Critical Dose Missed', 'High-risk medicine in Slot 2. was missed.',
   'Please take your medication now to stay on track with your treatment.', 'Mark as Taken', 'Need Help?', 0),
  ('caregiver', 'Caregiver', 'Slot 1,5 & 7 :
Critical Dose Missed', 'High-risk medicine in Slot 2. was missed.',
   'Please check on your loved one to ensure they have taken their medication and are safe.', 'Contact Patient', 'Contact Us', 1),
  ('command-centre', 'Command Centre', 'Immediate Follow-up Required', 'Patient missed a critical scheduled dose.',
   'Medicine Slot: 1, 5 & 7
Alert Level: High Priority', 'Contact Patient', 'Schedule Home Visit', 2);

-- ============================================================================
-- 6. SET UP & REFILL / SPECIFICATIONS TEASER
-- ============================================================================

DELETE FROM setup_specs_copy;
INSERT INTO setup_specs_copy (act_key, eyebrow, heading_line1, heading_line2, body_line1, body_line2, cta_label, sort_order) VALUES
  ('setup', 'Set Up & Refill', 'Load once. ', 'Forget for 30 days.',
   'See how prescription upload, scheduling, ', 'and monthly refill work — step by step.', 'Explore the flow', 0),
  ('specs', 'Specifications', 'Engineered ', 'to Last',
   'Dimensions, materials, connectivity, and', 'what makes the device built to last.', 'Explore the flow', 1);

-- ============================================================================
-- 7. SETUP & REFILL FLOW PAGE
-- ============================================================================

DELETE FROM setup_refill_intro_content;
INSERT INTO setup_refill_intro_content (id, eyebrow, heading_line1, heading_line2) VALUES
  (1, 'Schedule. Load. Done. Refill', 'Set up & Refill', 'Reimagined.');

DELETE FROM setup_refill_journey_steps;
INSERT INTO setup_refill_journey_steps (id, step_key, badge_number, heading, sort_order) VALUES
  (1, 'schedule', '1', 'Schedule', 0),
  (2, 'load', '2', 'Load', 1),
  (3, 'done', '3', 'Done', 2),
  (4, 'refill', '4', 'Refill', 3);

DELETE FROM setup_refill_journey_texts;
INSERT INTO setup_refill_journey_texts (step_id, text_key, body, sort_order) VALUES
  (1, 'item1', 'Open the TakeCare app and upload the prescription.', 0),
  (1, 'item2', 'Define your meal time & App configures schedule.', 1),
  (2, 'text2', 'Our Pharmacy fulfils order. CureBay medicines dispatched to door.', 0),
  (2, 'text3', 'Fill the numbered compartments with medicines once a month or our Swasth Mitra will fill for you.', 1),
  (3, 'text3_done', 'Take the medicine from the
green-lit slot. Close it after use
—the magnetic lid shuts
automatically, and the light
turns off to confirm it''s closed.', 0),
  (3, 'caregiver_text', 'Your Caregiver and Concierge Service are notified instantly.', 1),
  (4, 'refill_text', 'Both the patient and caregiver apps show each slot''s stock, so either of you can reorder a full month''s medicines before a slot empties.', 0),
  (4, 'refill_text2', 'When it arrives, refill it yourself
— or Swasth Mitra does it for
you. ', 1),
  (4, 'refill_text2_emphasis', 'Just once a month.', 2);

-- ============================================================================
-- 8. SPECIFICATIONS SECTION + STORAGE CAPACITY
-- ============================================================================

DELETE FROM specifications_content;
INSERT INTO specifications_content (id, eyebrow, heading, subhead) VALUES
  (1, 'Specifications', 'Engineered to last.', 'Precision, inside out. · Proof in every detail.');

DELETE FROM specification_cards;
INSERT INTO specification_cards (state_key, icon_key, title, body, col, row, sort_order) VALUES
  ('state3', 'magnetic-lock', 'Magnetic Lock',
   'A magnetic lock secures the slot with a single push, at dose time the right slot glows green. Take it and shut the slot; that close is the confirmation, IR sensors confirm each dose is taken.', 1, 1, 0),
  ('state3', 'medical-grade', 'Medical-grade build.',
   'Super White ABS / polycarbonate with a matte, anti-microbial finish — non-reflective and easy to wipe clean.', 2, 1, 1),
  ('state3', 'marked-for-everyone', 'Marked for everyone',
   'Each slot carries a number, a pull-arrow, and a Braille mark — moulded into the surface, never printed, so they never rub off. Built so low-vision and blind users find the right slot by touch.', 3, 1, 2),
  ('state3', 'see-whats-left', 'See what''s left',
   'A clear window on the front of each slot, with a slight inward tilt that nudges pills forward, shows how much medicine remains at a glance.', 1, 2, 3),
  ('state3', 'made-for-older-hands', 'Made for older hands',
   'The two everyday keys — Taken and Snooze — sit raised for a confident press; the rest stay flush so they''re never hit by accident.', 2, 2, 4),
  ('state3', 'stable-base', 'Stable base',
   'A 1 mm rubber mat grips the surface and seals each slot, blocking light bleed between stacked trays.', 3, 2, 5),
  ('state8', 'magnetic-lock', 'Magnetic Lock',
   'A magnetic lock secures the slot with a single push, at dose time the right slot glows green — no labels to read. Take it and shut the slot; that close is the confirmation, IR sensors confirm each dose is taken.', NULL, NULL, 0),
  ('state8', 'medical-grade', 'Medical-grade build.',
   'Super White ABS / polycarbonate with a matte, anti-microbial finish — non-reflective and easy to wipe clean.', NULL, NULL, 1),
  ('state8', 'stable-base', 'Stable base',
   'A 1 mm rubber mat grips the surface and seals each slot, blocking light bleed between stacked trays.', NULL, NULL, 2);

DELETE FROM specification_stats;
INSERT INTO specification_stats (group_key, number, unit, label, sort_order) VALUES
  ('specifications', '24', 'mm Height', '6 compartments', 0),
  ('specifications', '48', 'mm height', '2 compartments', 1),
  ('storage-capacity', '24', 'mm Height', '6 compartments', 0),
  ('storage-capacity', '48', 'mm height', '2 compartments', 1);

DELETE FROM storage_capacity_content;
INSERT INTO storage_capacity_content (id, heading, body) VALUES (
  1, 'Flexible Storage Capacity',
  'Six compartments are sized for routine medication schedules, while the two larger compartments offer up to three times the storage capacity — ideal for higher-volume medications, larger tablets, or extended dosing needs.'
);

DELETE FROM specification_connectivity_cards;
INSERT INTO specification_connectivity_cards (variant, title, body, is_placeholder, sort_order) VALUES
  ('desktop', 'Connectivity', '4G connectivity and nano-SIM tray with pin-hole release; high-tolerance fit.', 0, 0),
  ('desktop', 'Charging Input', 'Side-mounted charging input on the top-right panel.', 0, 1),
  ('desktop', 'Audio Integration', NULL, 1, 2);

-- ============================================================================
-- 9. DOWNLOAD APP SECTION
-- ============================================================================

DELETE FROM download_app_content;
INSERT INTO download_app_content (variant, headline, subheading_line1, subheading_line2, qr_caption, cta_label_line1, cta_label_line2) VALUES
  ('desktop', 'Get the  TakeCare app now !', 'Peace of mind for you. ', 'Timely medication support for your loved ones.', 'Scan to download the TakeCare app', NULL, NULL),
  ('mobile', 'Get the  TakeCare app now !', 'Peace of mind for you.', 'Timely medication support for your loved ones.', NULL, 'Tap to Download', 'the Take Care app');

-- ============================================================================
-- 10. SUBSCRIPTION SECTION + CART DRAWER
-- ============================================================================

DELETE FROM subscription_section_content;
INSERT INTO subscription_section_content (
  id, eyebrow, heading, device_price, device_period_line1, device_period_line2,
  subscription_cost_label, disclaimer_title, disclaimer_body
) VALUES (
  1, 'Get your plan', 'Take Care Subscription', '1,599', 'One', 'time cost',
  'Subscription Cost', 'Disclaimer',
  'Service availability and response times depend on your location and partner network. Emergency and concierge support timelines are applicable in select serviceable zones. Delivery and consultation timelines may vary based on availability and medical requirements. All benefits are valid only for the active subscription period and are non-transferable.'
);

DELETE FROM subscription_plans;
INSERT INTO subscription_plans (plan_key, title, price_amount, price_period_line1, price_period_line2, cta_label, disclaimer_line1, disclaimer_line2, sort_order) VALUES
  ('monthly', 'Monthly plan', '99', 'INR /', 'month', 'Get Started at ₹1,698',
   'One-time device purchase. Monthly subscription billing.', 'Save up to ₹100 every month on dedicated care.', 0),
  ('yearly', 'Yearly plan', '999', 'INR /', 'year', 'Get Started at ₹2,598',
   'One-time device purchase. Yearly subscription billing.', 'Save up to ₹1,000 every year on dedicated care.', 1);

DELETE FROM subscription_plan_features;
INSERT INTO subscription_plan_features (icon_key, text, sort_order) VALUES
  ('mobile', 'Free on boarding and set up.', 0),
  ('warranty', 'One year warranty on tablet dispenser.', 1),
  ('shield-check', 'Lifetime CureBay command Centre support.', 2);

DELETE FROM cart_product;
INSERT INTO cart_product (id, name, tag, description, qty_label, price) VALUES (
  1, 'Take Care tablet dispenser', 'One time payment',
  'Take Care is the smart dispenser that doses, reminds, and confirms. So you stop worrying and start trusting.',
  'Quantity', '₹1,599'
);

DELETE FROM cart_static_text;
INSERT INTO cart_static_text (id, title, products_section_label, subscriptions_section_label, empty_subscription_title, empty_subscription_subtitle, checkout_cta_label) VALUES (
  1, 'Your Cart', 'Product', 'Subscriptions', 'No subscription plan added.', 'Choose Monthly or Yearly below.', 'Checkout'
);

-- ============================================================================
-- 11. FAQ SECTION
-- ============================================================================

DELETE FROM faq_section_content;
INSERT INTO faq_section_content (id, heading_line1, heading_line2) VALUES
  (1, 'Question ?', 'Answers');

DELETE FROM faq_items;
INSERT INTO faq_items (question, answer, sort_order) VALUES
  ('What is Curebay TakeCare?', 'Curebay TakeCare is a connected medication management solution that combines a smart medication dispenser, mobile app, caregiver monitoring, and Curebay Care Team support to improve medication adherence.', 0),
  ('Who can use Curebay TakeCare?', 'Ideal for senior citizens, chronic disease patients, people taking multiple medicines, post-surgery patients, caregivers, hospitals, and home healthcare providers.', 1),
  ('How does it remind me to take medicines?', 'The device provides visual indicators, buzzer alerts, and app notifications at scheduled times.', 2),
  ('What happens if I miss a dose?', 'The device activates a buzzer, sends SMS alerts to the registered user/caregiver, records the missed dose, and a Curebay Support Executive calls the user to ensure the medicine is taken and provide assistance if required.', 3),
  ('Can it detect the wrong tray?', 'Yes. If an incorrect tray is opened, an instant wrong-tray alert is generated.', 4),
  ('Can my family monitor me remotely?', 'Yes. Authorized family members and caregivers can monitor medication adherence through the Curebay TakeCare app.', 5),
  ('Does Curebay TakeCare work with the internet?', 'Yes. It works with the internet for real-time synchronization, remote monitoring, SMS/app notifications, software updates, and cloud backup.', 6),
  ('Can it work if internet connectivity is temporarily unavailable?', 'Previously synchronized schedules continue to operate locally. Data is synchronized once connectivity is restored.', 7),
  ('Is there a mobile app?', 'Yes. Users and caregivers can manage schedules, receive reminders, monitor adherence, and receive alerts.', 8),
  ('Can doctors or caregivers update my medication schedule?', 'Yes. Authorized users can update medication schedules remotely.', 9),
  ('Can it manage multiple medicines?', 'Yes. Multiple medicines and multiple dosing schedules can be configured.', 10),
  ('Will I receive low battery alerts?', 'Yes. The device displays battery status and provides low-battery and charging notifications.', 11),
  ('Is my data secure?', 'Yes. Medication and user data are securely stored and accessible only to authorized users.', 12),
  ('Can I reorder medicines through Curebay?', 'Yes. Users can place medicine refill requests through the Curebay ecosystem (subject to service availability).', 13),
  ('Can I share adherence reports with my doctor?', 'Yes. Medication history and adherence reports can be shared with healthcare professionals.', 14),
  ('Is the device suitable for elderly users?', 'Yes. It features simple operation with automated reminders and caregiver support.', 15),
  ('What makes Curebay TakeCare different?', 'Unlike a standard smart pillbox, Curebay TakeCare combines connected technology with proactive human support from the Curebay Care Team.', 16),
  ('Where can I buy Curebay TakeCare?', 'Available through Curebay and its authorized partners.', 17),
  ('What support is available?', 'Curebay provides product onboarding, technical support, medication assistance, and customer care through phone, email, and chat.', 18),
  ('Does the device receive software updates?', 'Yes. Regular firmware and application updates help improve performance and security.', 19);

-- ============================================================================
-- 12. CHECKOUT / SHIPPING / PAYMENT FLOW
-- ============================================================================

DELETE FROM checkout_steps;
INSERT INTO checkout_steps (step_key, label, sort_order) VALUES
  ('summary', 'Purchase Summery', 0),
  ('shipping', 'User Details & shipping address', 1),
  ('payment', 'Payment', 2);

DELETE FROM checkout_section_content;
INSERT INTO checkout_section_content (
  id, review_products_heading, subscriptions_heading, delivery_label, delivery_estimate,
  subtotal_label, delivery_charges_label, estimated_total_label, continue_payment_label, back_label
) VALUES (
  1, 'Review your products', 'Subscriptions', 'Delivery', 'Arrives in 2–4 days',
  'Subtotal', 'Delivery charges', 'Estimated Total', 'Continue to Payment', 'Back'
);

DELETE FROM saved_addresses;
INSERT INTO saved_addresses (text, tag, sort_order) VALUES
  ('123 Mango Lane, Bangalore, Karnataka, 560001', 'Default', 0),
  ('456 Coconut Avenue, Mumbai, Maharashtra, 400001', NULL, 1),
  ('789 Spice Road, Delhi, 110001', NULL, 2);

DELETE FROM form_fields;
INSERT INTO form_fields (form_key, field_key, label, placeholder, helper_text, is_required, sort_order) VALUES
  ('shipping', 'first_name', 'First Name*', 'E.g. Emily', NULL, 1, 0),
  ('shipping', 'last_name', 'Last Name*', 'E.g. Smith', NULL, 1, 1),
  ('shipping', 'email', 'Email*', 'E.g. abc@gmail.com', 'Subscription will be activated on this email', 1, 2),
  ('shipping', 'phone', 'Phone No*', 'E.g. 98XXXXXXXX', NULL, 1, 3),
  ('shipping', 'address1', 'Address 1*', 'E.g. 123 Main Street', 'Address cannot be changed after dispatch', 1, 4),
  ('shipping', 'delivery_instructions', 'Delivery Instructions (Optional)', 'E.g. Leave at door, call before delivery', NULL, 0, 5),
  ('shipping', 'country', 'Country/Region*', 'India', NULL, 1, 6),
  ('shipping', 'state', 'State*', 'E.g. Maharashtra', NULL, 1, 7),
  ('shipping', 'city', 'City*', 'E.g. Mumbai', NULL, 1, 8),
  ('shipping', 'pincode', 'Pin code*', 'Eg. 450001', NULL, 1, 9),
  ('profile', 'first_name', 'First Name', 'Enter First Name', NULL, 0, 0),
  ('profile', 'last_name', 'Last Name', 'Enter Last Name', NULL, 0, 1),
  ('profile', 'gender', 'Gender', 'Eg. Male', NULL, 0, 2),
  ('profile', 'phone_number', 'Phone Number*', 'E.g. 98XXXXXXXX', NULL, 1, 3),
  ('profile', 'date_of_birth', 'Date of Birth*', 'Placeholder', NULL, 1, 4),
  ('profile', 'blood_group', 'Blood Group', 'eg. O+', NULL, 0, 5),
  ('profile', 'age', 'Age*', 'eg. 24', NULL, 1, 6),
  ('profile', 'address1', 'Address 1*', 'Enter Address 1', NULL, 1, 7),
  ('profile', 'country', 'Country', 'eg. India', NULL, 0, 8),
  ('profile', 'pincode', 'Pin code*', 'Placeholder', NULL, 1, 9),
  ('profile', 'city', 'City*', 'eg. Nardana', NULL, 1, 10),
  ('profile', 'state', 'State*', 'eg. Maharashtra', NULL, 1, 11);

DELETE FROM shipping_page_content;
INSERT INTO shipping_page_content (
  id, login_prompt, login_cta_label, continue_label,
  pincode_error_title, pincode_error_body, pincode_error_link_text, pincode_error_link_href
) VALUES (
  1, 'Already have an account?', 'Log in / Sign up', 'Continue',
  'Pincode not serviceable', 'Choose a different delivery address or check coverage at curebay.com/serviceable',
  'curebay.com/serviceable', 'https://curebay.com/#partners'
);

DELETE FROM payment_options;
INSERT INTO payment_options (option_key, label, subtext, sort_order) VALUES
  ('all', 'Pay via Debit/Credit/Netbanking/UPI', NULL, 0),
  ('debit', 'Pay via Debit Card', NULL, 1),
  ('credit', 'Pay via Credit Card', NULL, 2),
  ('upi', 'Pay via UPI', NULL, 3),
  ('ewallet', 'Pay via E-Wallet', NULL, 4),
  ('netbanking', 'Pay via Netbanking', NULL, 5),
  ('cod', 'Cash on delivery', '(Not available for subscription orders)', 6);

DELETE FROM payment_page_content;
INSERT INTO payment_page_content (
  id, payment_mode_heading, contact_label, shipping_address_label, change_label,
  address_note, disclaimer_title, disclaimer_body
) VALUES (
  1, 'Payment Mode', 'Contact', 'Shipping Address', 'Change',
  'Address cannot be changed after dispatch', 'No duplicate charges',
  'Fraud held payments are reviewed within 24 hrs — contact support@curebay.com'
);

-- ============================================================================
-- 13. PROFILE / OTP / DASHBOARD
-- ============================================================================

DELETE FROM profile_modal_content;
INSERT INTO profile_modal_content (id, heading, consent_text, terms_label, privacy_label, submit_label) VALUES (
  1, 'Create your Profile',
  'By checking  on this you are giving consent to Take Care the access to your account and login to it.',
  'Terms and Conditions', 'Privacy Policy', 'Get Consent via OTP'
);

DELETE FROM otp_modal_content;
INSERT INTO otp_modal_content (
  id, heading_enter, otp_sent_template, success_text, verify_label, continue_label,
  resend_countdown_template, resend_label
) VALUES (
  1, 'Enter OTP', 'OTP sent to {phone}.', 'Registration Successful', 'Verify OTP', 'Continue',
  'Resend SMS in {n} sec', 'Resend OTP'
);

DELETE FROM dashboard_content;
INSERT INTO dashboard_content (id, title, welcome_text, member_tag, logout_label) VALUES
  (1, 'Profile', 'Welcome,', 'CureBay · Take Care Member', 'Logout');

DELETE FROM dashboard_abha_card;
INSERT INTO dashboard_abha_card (id, id_label, address_label, not_created_chip, not_linked_value, create_cta_label) VALUES
  (1, 'ABHA ID :', 'ABHA Address :', 'ABHA not created', 'Not linked', 'Create ABHA');

DELETE FROM dashboard_personal_info_card;
INSERT INTO dashboard_personal_info_card (id, footer_text) VALUES
  (1, 'Your name appears on your Take Care Subscription and orders.');

DELETE FROM dashboard_addresses_card;
INSERT INTO dashboard_addresses_card (id, home_label, default_chip, empty_text, footer_text, view_all_label) VALUES
  (1, 'Home', 'Default', 'No address added yet.', 'Address cannot be changed after an order is dispatched.', 'View All');

DELETE FROM dashboard_contact_card;
INSERT INTO dashboard_contact_card (id, email_label, not_provided_label, contact_label, footer_text) VALUES
  (1, 'Email', 'Not provided', 'Contact', 'Your email activates your Take Care Subscription. Changing it affects your login.');

DELETE FROM dashboard_subscription_card;
INSERT INTO dashboard_subscription_card (id, empty_text, active_chip, history_label, manage_label, footer_text) VALUES
  (1, 'No active subscription yet.', 'Active', 'History', 'Manage Subscription', 'Your email activates your Take Care Subscription. Changing it affects your login.');

DELETE FROM dashboard_orders_card;
INSERT INTO dashboard_orders_card (id, device_name, device_price_label, confirmed_chip, empty_text, filter_label) VALUES
  (1, 'TakeCare Tablet Dispenser', '₹1,599 · One-time', 'Order Confirmed', 'No orders yet.', 'Filter by');

DELETE FROM dashboard_notification_rows;
INSERT INTO dashboard_notification_rows (label, sort_order) VALUES
  ('Order updates', 0),
  ('Subscription alerts', 1),
  ('Health reminders', 2),
  ('Promotions', 3);

DELETE FROM dashboard_general_card;
INSERT INTO dashboard_general_card (id, language_label, language_value, privacy_label, footer_text) VALUES
  (1, 'Language', 'English', 'Privacy & data', 'Your email activates your Take Care Subscription. Changing it affects your login.');

-- ============================================================================
-- 14. IMAGE ASSETS
-- ============================================================================

DELETE FROM image_assets;
INSERT INTO image_assets (image_key, url) VALUES
  -- Hero (web) -----------------------------------------------------------
  ('hero-product', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Pill_dispenser.png'),
  ('hero-product-sm', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Pill_dispenser.png'),
  ('hero-app-phone', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Mobile_img.png'),

  -- Hero (mobile) ----------------------------------------------------------
  ('hero-mobile', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Mobile_img.png'),
  ('hero-mobile-bg-dark', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Hero_img_1.jpg'),
  ('hero-mobile-bg-light', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/hero-mobile-bg-light.jpg'),

  -- Hero / ConnectedEcosystem (web, Figma-sourced) --------------------------
  ('figma-hero-product', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Pill_dispenser.png'),
  ('figma-hero-bg-living', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/hero-mobile-bg-light.jpg'),
  ('figma-hero-bg-night', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Hero_img_1.jpg'),
  ('figma-hero-eco-section-bg', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-section-bg.png'),
  ('figma-hero-eco-card-app', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-card-app.png'),
  ('figma-hero-eco-card-command', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-card-command.png'),
  ('figma-hero-eco-card-curebay', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-card-curebay.png'),
  ('figma-hero-eco-card-dispenser', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-card-dispenser.png'),
  ('figma-hero-phone-app', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Mobile_img.png'),
  ('figma-hero-plate-247', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_1.jpg'),
  ('figma-hero-plate-30day-drawers', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_0.jpg'),
  ('figma-hero-plate-curebay-connected', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/plate-curebay-connected.png'),
  ('figma-hero-plate-magnetic-lock', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_3.jpg'),
  ('figma-hero-plate-medical', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_2.jpg'),

  -- EcosystemAccordion (mobile) ---------------------------------------------
  ('mobile-eco-section-bg', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/eco-section-bg%20(1).png'),
  ('mobile-plate-base', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/plate-base.jpg'),
  ('mobile-plate-247', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_1.jpg'),
  ('mobile-plate-30day-overlay', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_0.jpg'),
  ('mobile-plate-curebay-connected', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/plate-curebay-connected.png'),
  ('mobile-plate-magnetic-lock', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_3.jpg'),
  ('mobile-plate-medical-overlay', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Hero_section/Img_2.jpg'),

  -- Features (web) -----------------------------------------------------------
  ('features-features-state0-doctor', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Features_section/Feature_web_0.png'),
  ('features-features-state1-medicines', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Features_section/Feature_web_1.png'),
  ('features-features-state2-labtest', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Features_section/Feature_web_2.png'),
  ('features-features-state3-emergency', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Features_section/Feature_web_3.png'),
  ('features-features-state4-dose', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Features_section/Feature_web_4.png'),

  -- Features (mobile) ---------------------------------------------------------
  ('mobile-features-mobile-doctor', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Mobile%20Assets/Take%20Care%20Mobile%20Assets/HomePage_Assets/Features_section/Features_img_0.png'),
  ('mobile-features-mobile-medicines', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Mobile%20Assets/Take%20Care%20Mobile%20Assets/HomePage_Assets/Features_section/Features_img_1.png'),
  ('mobile-features-mobile-lb-test', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Mobile%20Assets/Take%20Care%20Mobile%20Assets/HomePage_Assets/Features_section/Features_img_2.png'),
  ('mobile-features-mobile-sos', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Mobile%20Assets/Take%20Care%20Mobile%20Assets/HomePage_Assets/Features_section/Features_img_3.png'),
  ('mobile-features-mobile-dose-management', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Mobile%20Assets/Take%20Care%20Mobile%20Assets/HomePage_Assets/Features_section/Features_img_4.png'),

  -- MumTookDose ----------------------------------------------------------------
  ('mum-took-dose-background', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Mum_took_dose_section/mum%20took%20dose%20Background.png'),
  ('background-mumtookdosetwo', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Mum_took_dose_section/Background%20mumtookdosetwo.png'),
  ('mumdose-bg', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Mum_took_dose_section/mumdose-bg.png'),
  ('mumdose-pillbox', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Mum_took_dose_section/Pill_Dispenser_img.png'),

  -- NobodyFalls ------------------------------------------------------------
  ('nobody-falls-nobody-falls-scene', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/nobody-falls-scene.png'),
  ('nobody-falls-nobody-falls-state2', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/nobody-falls-state2.png'),
  ('nobody-falls-topview-topview-00', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-00.png'),
  ('nobody-falls-topview-topview-01', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-01.png'),
  ('nobody-falls-topview-topview-02', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-02.png'),
  ('nobody-falls-topview-topview-03', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-03.png'),
  ('nobody-falls-topview-topview-blank', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-blank.png'),
  ('nobody-falls-topview-topview-missed', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Nobody_falls_through_the_cracks_Section/topview-missed.png'),

  -- SetupRefillJourney -----------------------------------------------------
  ('setup-refill-bg-state1', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/bg-state1.png'),
  ('setup-refill-bg-state18', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/bg-state18.png'),
  ('setup-refill-phone1', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_1_1.png'),
  ('setup-refill-phone2-s2', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_1_2.png'),
  ('setup-refill-phone3-s3', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_1_3.png'),
  ('setup-refill-phone4-s4', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_1_4.png'),
  ('setup-refill-person-s6', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Delivery_boy_img_2_1.png'),
  ('setup-refill-pill-dispenser-s8', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Pill_Dispenser_img_2_2.png'),
  ('setup-refill-pill-dispenser-s9', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Pill_Dispenser_img_2_3.png'),
  ('setup-refill-phone-s10', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_4_2.png'),
  ('setup-refill-phone-s13', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_3_1.png'),
  ('setup-refill-dispenser-s14', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Pill_Dispenser_img_3_1.png'),
  ('setup-refill-phone-s14', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_3_2.png'),
  ('setup-refill-dispenser-s15', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Pill_Dispenser_img_3_2.png'),
  ('setup-refill-phone-s15', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_3_3.png'),
  ('setup-refill-phone-s16', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_3_3.png'),
  ('setup-refill-phone-s18', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_4_1.png'),
  ('setup-refill-phone-s20', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/mobile_img_4_2.png'),
  ('setup-refill-rx-card', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Rx_img.png'),
  ('setup-refill-set-refill-reimagined-mobile-blue-bg', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Set_%26_refill_reimagined_MOBILE%20blue%20bg.png'),
  ('setup-refill-set-refill-reimagined-mobile-green-bg-img', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Set_%26_refill_reimagined_MOBILE%20green%20bg%20img.png'),

  -- SetupSpecsSection ---------------------------------------------------
  ('setup-specs-device-specs-hero', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_0.png'),
  ('setup-specs-rx-document', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Set_up_%26_refill_section/Rx_img.png'),
  ('setup-specs-phone-fill-medicines', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/phone-fill-medicines.png'),
  ('setup-specs-phone-daily-schedule', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/phone-daily-schedule.png'),
  ('setup-specs-phone-allotment-success', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/phone-allotment-success.png'),

  -- SpecificationsSection ------------------------------------------------
  ('specifications-spec-device', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_0.png'),
  ('specifications-spec-device-mobile', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_0.png'),
  ('specifications-spec-state1', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_1.png'),
  ('specifications-spec-state6', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_2.png'),
  ('specifications-spec-state9', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/Set%20Up_Refill_%26_Specifications_page_Assets/Specifications_section/Specs_img_3.png'),



  -- DownloadAppSection -----------------------------------------------------
  ('download-app-phone-frame', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Download_Totalcare_App_banner_section/phone-frame.png'),

  -- Subscription / Cart / Checkout ------------------------------------------
  ('subscription-device', 'https://storage.googleapis.com/d2c-ruralos-assets/TakeCare%20D2C%20Website/Take%20Care%20Web%20Assets/Take%20Care%20Web%20Assets/HomePage_Assets/Subscription_section/Dispenser_%26_mobile_live_img.png');
