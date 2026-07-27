import { db } from './db.js';

const one = (sql) => db.prepare(sql).get();
const all = (sql) => db.prepare(sql).all();

export function getContent() {
  const footerLinkGroups = all('SELECT * FROM footer_link_groups ORDER BY sort_order');
  const footerLinks = all('SELECT * FROM footer_links ORDER BY sort_order');

  const journeySteps = all('SELECT * FROM setup_refill_journey_steps ORDER BY sort_order');
  const journeyTexts = all('SELECT * FROM setup_refill_journey_texts ORDER BY sort_order');

  return {
    header: {
      labels: all('SELECT * FROM ui_labels'),
      header: one('SELECT * FROM header_content WHERE id = 1'),
      navLinks: all('SELECT * FROM nav_links ORDER BY sort_order'),
      promoStrip: one('SELECT * FROM promo_strip_content WHERE id = 1'),
    },
    footer: {
      linkGroups: footerLinkGroups.map((group) => ({
        ...group,
        links: footerLinks.filter((link) => link.group_id === group.id),
      })),
      companyInfo: one('SELECT * FROM footer_company_info WHERE id = 1'),
    },
    breadcrumbs: all('SELECT * FROM breadcrumbs'),

    hero: {
      content: one('SELECT * FROM hero_content WHERE id = 1'),
      ecosystemCards: all('SELECT * FROM hero_ecosystem_cards ORDER BY sort_order'),
      ecosystemSection: one('SELECT * FROM ecosystem_section_content WHERE id = 1'),
      ecosystemItems: all('SELECT * FROM ecosystem_items ORDER BY sort_order'),
    },

    mumTookDose: {
      content: one('SELECT * FROM mum_took_dose_content WHERE id = 1'),
      cards: all('SELECT * FROM mum_took_dose_cards ORDER BY sort_order'),
      appreciationCard: one('SELECT * FROM appreciation_card_content WHERE id = 1'),
    },

    features: {
      content: one('SELECT * FROM features_section_content WHERE id = 1'),
      tabs: all('SELECT * FROM feature_tabs ORDER BY sort_order'),
    },

    nobodyFalls: {
      content: one('SELECT * FROM nobody_falls_content WHERE id = 1'),
      alertCards: all('SELECT * FROM nobody_falls_alert_cards ORDER BY sort_order'),
    },

    setupSpecs: {
      copy: all('SELECT * FROM setup_specs_copy ORDER BY sort_order'),
    },

    setupRefillJourney: {
      intro: one('SELECT * FROM setup_refill_intro_content WHERE id = 1'),
      steps: journeySteps.map((step) => ({
        ...step,
        texts: journeyTexts.filter((text) => text.step_id === step.id),
      })),
    },

    specifications: {
      content: one('SELECT * FROM specifications_content WHERE id = 1'),
      cards: all('SELECT * FROM specification_cards ORDER BY sort_order'),
      stats: all('SELECT * FROM specification_stats ORDER BY sort_order'),
      storageCapacity: one('SELECT * FROM storage_capacity_content WHERE id = 1'),
      connectivityCards: all('SELECT * FROM specification_connectivity_cards ORDER BY sort_order'),
    },

    downloadApp: all('SELECT * FROM download_app_content'),

    subscription: {
      content: one('SELECT * FROM subscription_section_content WHERE id = 1'),
      plans: all('SELECT * FROM subscription_plans ORDER BY sort_order'),
      planFeatures: all('SELECT * FROM subscription_plan_features ORDER BY sort_order'),
      cartProduct: one('SELECT * FROM cart_product WHERE id = 1'),
      cartStaticText: one('SELECT * FROM cart_static_text WHERE id = 1'),
    },

    faq: {
      content: one('SELECT * FROM faq_section_content WHERE id = 1'),
      items: all('SELECT * FROM faq_items ORDER BY sort_order'),
    },

    checkout: {
      steps: all('SELECT * FROM checkout_steps ORDER BY sort_order'),
      section: one('SELECT * FROM checkout_section_content WHERE id = 1'),
      savedAddresses: all('SELECT * FROM saved_addresses ORDER BY sort_order'),
      formFields: all('SELECT * FROM form_fields ORDER BY sort_order'),
      shipping: one('SELECT * FROM shipping_page_content WHERE id = 1'),
      paymentOptions: all('SELECT * FROM payment_options ORDER BY sort_order'),
      payment: one('SELECT * FROM payment_page_content WHERE id = 1'),
      statusCards: all('SELECT * FROM status_cards ORDER BY sort_order'),
    },

    profile: {
      profileModal: one('SELECT * FROM profile_modal_content WHERE id = 1'),
      otpModal: one('SELECT * FROM otp_modal_content WHERE id = 1'),
      dashboard: one('SELECT * FROM dashboard_content WHERE id = 1'),
      abhaCard: one('SELECT * FROM dashboard_abha_card WHERE id = 1'),
      personalInfoCard: one('SELECT * FROM dashboard_personal_info_card WHERE id = 1'),
      addressesCard: one('SELECT * FROM dashboard_addresses_card WHERE id = 1'),
      contactCard: one('SELECT * FROM dashboard_contact_card WHERE id = 1'),
      subscriptionCard: one('SELECT * FROM dashboard_subscription_card WHERE id = 1'),
      ordersCard: one('SELECT * FROM dashboard_orders_card WHERE id = 1'),
      notificationRows: all('SELECT * FROM dashboard_notification_rows ORDER BY sort_order'),
      generalCard: one('SELECT * FROM dashboard_general_card WHERE id = 1'),
    },

    images: Object.fromEntries(
      all('SELECT image_key, url FROM image_assets').map((row) => [row.image_key, row.url]),
    ),
  };
}
