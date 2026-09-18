export interface PolicySection {
  id: string;
  heading: string;
  content: string[];
  subsections?: { title: string; points: string[] }[];
  highlightBox?: {
    title: string;
    description: string;
    details: { label: string; value: string }[];
  };
}

export interface LegalPolicyDoc {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  governingLaw: string;
  sections: PolicySection[];
}

export const POLICIES_LEGAL_DOCS: Record<string, LegalPolicyDoc> = {
  'about-us': {
    slug: 'about-us',
    title: 'About HARWALKART',
    subtitle: 'Har Din Ka Hissa • Every One Local Shop • Pure Spices & Local Commerce',
    badge: 'Our Story & Mission',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.4.0',
    governingLaw: 'Governed by Laws of India • Registered in Pune MIDC, Maharashtra',
    sections: [
      {
        id: 'story',
        heading: '1. The HARWALKART Story & Vision',
        content: [
          'HARWALKART was founded with a singular conviction: India\'s neighborhood retail ecosystem is the cultural and economic lifeline of the nation. For generations, local kirana merchants, regional spice grinders, dry fruit traders, and neighborhood retailers have served Indian families with unparalleled personal care and trust.',
          'Yet in an era of aggressive digital aggregation, small retailers often find themselves sidelined by high commission fees, opaque algorithms, and distant supply chains. HARWALKART bridges this divide through a community-centric local marketplace platform that brings neighborhood shops directly to customers\' fingertips.',
          'With our slogan “Har Din Ka Hissa” (A part of every single day), HARWALKART is built for every Indian household that values speed, local trust, and uncompromising purity in their daily kitchen essentials.'
        ]
      },
      {
        id: 'dual-model',
        heading: '2. Our Dual Marketplace Model',
        content: [
          'HARWALKART operates on a unique hybrid commerce architecture that solves two distinct customer needs:',
        ],
        subsections: [
          {
            title: 'A. Hyperlocal Neighborhood Shop Marketplace',
            points: [
              'Customers discover and order directly from verified brick-and-mortar retailers in their exact PIN code area.',
              'Orders are prepared and dispatched directly by the local shopkeeper within 2 to 4 hours.',
              'Empowers local micro-merchants with geo-targeted video commerce showcases and digital storefronts with an industry-lowest flat 2% platform facilitation fee.'
            ]
          },
          {
            title: 'B. Authentic In-House Brand: Kitchen Shakti',
            points: [
              'HARWALKART\'s own certified culinary line featuring 100% stone-ground, Agmark-certified pure Indian spices, pulses, and kitchen essentials.',
              'Crafted using traditional cold-milling techniques to lock in natural volatile essential oils, aroma, and health nutrients.',
              'Shipped nationwide across 19,000+ PIN codes with pesticide-tested and laboratory-certified quality guarantees.'
            ]
          }
        ]
      },
      {
        id: 'brands-family',
        heading: '3. Harwalkart House of Brands',
        content: [
          'To ensure authentic quality across essential consumer categories, HARWALKART nurtures specialized in-house brands:',
        ],
        subsections: [
          {
            title: 'Kitchen Shakti (Pure Spices & Culinary Essentials)',
            points: [
              'Turmeric (Haldi), Red Chilli (Mirchi), Coriander (Dhaniya), Cumin (Jeera), Garam Masala, Kitchen King, Mustard, and premium whole spices with zero artificial coloring or starch fillers.'
            ]
          },
          {
            title: 'NutriFlow (Healthy Food & Daily Staples)',
            points: [
              'Cold-pressed cooking oils, unpolished pulses, premium raw dry fruits, stone-ground flours, and organic jaggery.'
            ]
          },
          {
            title: 'Rupabhoom™ & GrahShorya™ (Wellness & Home Care)',
            points: [
              'Traditional Ayurvedic herbal wellness and high-performance eco-conscious home hygiene cleaning formulations.'
            ]
          }
        ]
      },
      {
        id: 'entity-details',
        heading: '4. Corporate Identity & Official Head Office',
        content: [
          'HARWALKART is an Indian proprietary enterprise dedicated to compliant, transparent, and consumer-centric digital commerce.'
        ],
        highlightBox: {
          title: 'Official Head Office & Corporate Registry',
          description: 'Official registered establishment information for all legal, corporate, and regulatory correspondence:',
          details: [
            { label: 'Registered Enterprise', value: 'HARWALKART' },
            { label: 'Founder & Proprietor', value: 'SharanKumar Harwalkar' },
            { label: 'Official Head Office', value: 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220' },
            { label: 'Helpline & Support', value: '+91 9372207811 (9 AM to 9 PM IST)' },
            { label: 'Official Corporate Email', value: 'harwalkart@gmail.com' },
            { label: 'Official Website', value: 'https://harwalkart.in (Marketplace Web Application)' }
          ]
        }
      }
    ]
  },

  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy & Data Protection Policy',
    subtitle: 'Compliant with Digital Personal Data Protection (DPDP) Act, 2023 & Information Technology Act, 2000',
    badge: 'Legal & Privacy Compliance',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '3.1.0',
    governingLaw: 'Digital Personal Data Protection Act, 2023 • IT Act Section 43A Rules, 2011',
    sections: [
      {
        id: 'dpdp-commitment',
        heading: '1. Our Privacy Commitment & Statutory Framework',
        content: [
          'HARWALKART (“We”, “Our”, “Platform”) values the trust and confidence you place in us when sharing your personal information. We are strictly committed to safeguarding the privacy of our consumers, registered sellers, and delivery partners.',
          'This Privacy Policy is published in adherence to the Digital Personal Data Protection (DPDP) Act, 2023, Section 43A of the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.',
          'By accessing HARWALKART or transacting through our marketplace, you acknowledge and consent to the collection, processing, and lawful retention of your information as outlined herein.'
        ]
      },
      {
        id: 'data-collected',
        heading: '2. Information We Collect & Why',
        content: [
          'We collect only the minimum required information necessary to execute orders, coordinate hyperlocal logistics, and comply with Indian taxation statutes:',
        ],
        subsections: [
          {
            title: 'A. Personal & Contact Identifiers',
            points: [
              'Customer Name, Mobile Telephone Number, and Email Address to authenticate accounts, send delivery OTPs, and provide digital GST invoices.',
              'Delivery Address, Landmark, City, State, and 6-digit Postal PIN Code for dispatching orders.'
            ]
          },
          {
            title: 'B. Location & Geolocation Coordinates',
            points: [
              'With your permission, we capture device location coordinates or postal PIN code solely to match you with serviceable local stores within a 5–15 km radius and calculate express delivery transit times.',
              'We never track your background location when the application is closed or not in active use.'
            ]
          },
          {
            title: 'C. Zero Storage of Financial Credentials',
            points: [
              'HARWALKART DOES NOT collect, process, or store sensitive banking passwords, Debit/Credit Card CVV numbers, or UPI PINs on any server.',
              'All digital payments are routed via Reserve Bank of India (RBI) authorized PCI-DSS compliant payment aggregators (e.g. Razorpay, BHIM UPI).',
              'For Cash on Delivery (COD) transactions, physical currency settlement is completed directly at your doorstep upon OTP handoff.'
            ]
          }
        ]
      },
      {
        id: 'data-usage',
        heading: '3. Lawful Purpose & Data Processing',
        content: [
          'Your information is processed strictly for legitimate commerce purposes:',
          '1. Order Verification & Delivery: Transmitting your delivery name, address, and masked phone number to the allocated merchant and courier partner to effectuate doorstep delivery.',
          '2. Transaction Invoicing & Tax Records: Generating compliant GST B2C tax invoices as mandated by the Central Goods and Services Tax Act, 2017.',
          '3. Customer Grievance & Returns: Verifying return requests, defective item claims, and dispatching replacements.',
          '4. Anti-Fraud & Account Protection: Preventing duplicate accounts, unauthorized payment attempts, and abusive activity.'
        ]
      },
      {
        id: 'data-sharing',
        heading: '4. Absolute Prohibition on Selling Personal Data',
        content: [
          'HARWALKART has an uncompromising, ironclad policy: We NEVER sell, rent, lease, or trade your personal data, mobile numbers, or order histories to third-party telemarketers, data brokers, or external advertising syndicates.',
          'Information is shared solely with verified ecosystem partners (e.g., the specific seller preparing your order and the assigned courier partner) strictly on a need-to-know basis to fulfill your delivery.'
        ]
      },
      {
        id: 'user-rights',
        heading: '5. Your Rights as a Data Principal under DPDP Act',
        content: [
          'Under the Digital Personal Data Protection Act, 2023, you enjoy full statutory rights over your personal data:',
        ],
        subsections: [
          {
            title: 'Rights Summary',
            points: [
              'Right to Access & Summary: Review all personal information, order ledgers, and saved addresses stored in your customer account dashboard.',
              'Right to Correction & Update: Update your telephone number, delivery address, or name at any time in Profile Settings.',
              'Right to Erasure & Account Deletion: Submit an account closure request to have your personal data permanently wiped, subject only to statutory tax retention rules under the CGST Act (which requires preserving financial invoice ledgers for the mandatory audit period).',
              'Right to Nominate: Designate a nominee in case of death or incapacity to manage your account.'
            ]
          }
        ]
      },
      {
        id: 'grievance-officer',
        heading: '6. Grievance Redressal Officer & Data Protection Officer',
        content: [
          'In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020 and the DPDP Act, 2023, any privacy concern or grievance may be submitted directly to our designated Grievance Officer:'
        ],
        highlightBox: {
          title: 'Statutory Data Protection & Grievance Contact',
          description: 'Timely, legally bound redressal for all privacy and personal data inquiries:',
          details: [
            { label: 'Grievance Officer', value: 'Nodal Privacy Officer, HARWALKART' },
            { label: 'Official Privacy Email', value: 'harwalkart@gmail.com' },
            { label: 'Phone Helpline', value: '+91 9372207811 (Mon–Sat, 9:00 AM – 7:00 PM IST)' },
            { label: 'Head Office Address', value: 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220' },
            { label: 'Acknowledgment Time', value: 'Within 48 hours of receipt of written notice' },
            { label: 'Statutory Resolution', value: 'Within 30 days from date of receipt' }
          ]
        }
      }
    ]
  },

  'terms-conditions': {
    slug: 'terms-conditions',
    title: 'Terms & Conditions of Marketplace Use',
    subtitle: 'Governed by Consumer Protection (E-Commerce) Rules, 2020 & Indian Contract Act, 1872',
    badge: 'User & Merchant Agreement',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.8.0',
    governingLaw: 'Laws of India • Exclusive Jurisdiction: Courts of Pune, Maharashtra',
    sections: [
      {
        id: 'agreement-scope',
        heading: '1. Acceptance of Terms & Platform Overview',
        content: [
          'Welcome to HARWALKART. These Terms and Conditions constitute a legally binding electronic agreement between you (“User”, “Customer”, “Buyer”) and HARWALKART (Proprietor: SharanKumar Harwalkar, having its Head Office at Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220).',
          'By registering, browsing, adding items to cart, or purchasing products on the HARWALKART web application, you explicitly agree to be bound by these Terms, along with our Privacy Policy, Refund Policy, and Shipping Policy.',
          'If you do not agree with any provision herein, you must immediately discontinue use of the platform.'
        ]
      },
      {
        id: 'marketplace-role',
        heading: '2. Dual Platform Capacity: Intermediary & Direct Seller',
        content: [
          'In accordance with Rule 4 & 5 of the Consumer Protection (E-Commerce) Rules, 2020:',
        ],
        subsections: [
          {
            title: 'A. Intermediary Marketplace Role (Third-Party Local Shops)',
            points: [
              'For products sold by independent neighborhood kirana stores, dry fruit shops, and local retailers, HARWALKART operates strictly as an electronic marketplace intermediary under Section 79 of the Information Technology Act, 2000.',
              'The contract of sale for such third-party goods is strictly bipartite between the buyer and the registered merchant.',
              'HARWALKART facilitates digital discovery, customer support, and payment settlement at our standard 2% merchant facilitation fee.'
            ]
          },
          {
            title: 'B. Direct Seller Capacity (Kitchen Shakti & Own Brands)',
            points: [
              'For items bearing the Kitchen Shakti, NutriFlow, Rupabhoom™, and GrahShorya™ trademarks, HARWALKART acts as the direct manufacturer/seller and assumes full product liability for purity, packaging integrity, Agmark/FSSAI certification, and dispatch.'
            ]
          }
        ]
      },
      {
        id: 'pricing-mrp',
        heading: '3. Strict Maximum Retail Price (MRP) & Pricing Integrity',
        content: [
          'In compliance with the Legal Metrology (Packaged Commodities) Rules, 2011 and Consumer Protection regulations:',
          '1. All product listings must clearly display the Maximum Retail Price (MRP) inclusive of all taxes.',
          '2. No merchant is permitted to list, advertise, or charge a price higher than the printed MRP on the package. Any merchant found violating this rule is subject to immediate listing delisting and financial penalty.',
          '3. Any discounts, promotional coupons, or loyalty point redemptions applied at checkout reduce the net payable amount below the printed MRP.'
        ]
      },
      {
        id: 'orders-fulfillment',
        heading: '4. Order Placement, OTP Verification & Cancellation',
        content: [
          '1. Order Acceptance: An order is deemed accepted once the order summary is generated, inventory is confirmed, and a unique Order ID is issued.',
          '2. Doorstep OTP Security: For consumer safety and delivery authentication, orders may require a numeric 4-digit Delivery OTP communicated via SMS to the buyer\'s registered phone number. Handover is complete only upon successful OTP entry.',
          '3. Cancellation by Customer: Orders may be cancelled with zero penalty prior to dispatch by accessing the My Orders section in your account.',
          '4. Cancellation by Merchant/Platform: In the rare event of sudden stock depletion, inaccurate pricing caused by technical glitch, or unserviceable address, HARWALKART will cancel the order and trigger an immediate 100% refund to the source account.'
        ]
      },
      {
        id: 'intellectual-property',
        heading: '5. Intellectual Property & Trademarks',
        content: [
          'The trade names “HARWALKART”, the HARWALKART logo, “Kitchen Shakti”, “Har Din Ka Hissa”, and proprietary software algorithms are protected intellectual properties owned by SharanKumar Harwalkar / HARWALKART.',
          'Any reproduction, copying, framing, or unauthorized scraping of product catalogs, videos, or brand assets without explicit written authorization is strictly prohibited under Indian Copyright and Trademark laws.'
        ]
      },
      {
        id: 'jurisdiction',
        heading: '6. Governing Law & Dispute Resolution',
        content: [
          'These Terms shall be interpreted and governed in accordance with the substantive laws of India.',
          'Any legal claim, dispute, or proceeding arising out of or in connection with the platform or orders placed herein shall be subject to the exclusive jurisdiction of the competent courts located in Pune, Maharashtra, India.'
        ]
      }
    ]
  },

  'refund-policy': {
    slug: 'refund-policy',
    title: 'Refund & Return Policy',
    subtitle: '7-Day Hassle-Free Customer Redressal • Compliant with Consumer Protection (E-Commerce) Rules, 2020',
    badge: 'Customer Protection Guarantee',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.5.0',
    governingLaw: 'Consumer Protection (E-Commerce) Rules, 2020 • Section 18 of Consumer Protection Act',
    sections: [
      {
        id: 'customer-first',
        heading: '1. Our Customer-Centric Resolution Promise',
        content: [
          'At HARWALKART, we believe consumer satisfaction is the cornerstone of local commerce. If you receive an item that is damaged, defective, expired, or different from what you ordered, we provide a streamlined, hassle-free 7-Day Return and Refund Guarantee.',
          'Our return policy strictly follows the Consumer Protection (E-Commerce) Rules, 2020, which prohibits unfair trade practices and ensures buyers have clear remedies for substandard or non-conforming goods.'
        ]
      },
      {
        id: 'return-window',
        heading: '2. 7-Day Return Window & Eligible Conditions',
        content: [
          'Customers may request a return or full replacement within seven (7) calendar days from the date and timestamp of delivery under the following conditions:',
        ],
        subsections: [
          {
            title: 'Eligible Situations for 100% Refund or Free Replacement',
            points: [
              'Damaged or Tampered Packaging: Products arrived with broken seals, crushed containers, or torn pouches during transit.',
              'Expired or Past Best-Before: Item received is past its expiration date or within 7 days of expiration.',
              'Wrong Item or Missing Quantity: Incorrect brand, weight, variant, or missing units delivered.',
              'Quality Defect in Kitchen Shakti Spices: Verified grievance regarding taste, aroma, or stone-ground purity in our in-house spice range.'
            ]
          },
          {
            title: 'Non-Returnable Items (Due to Health & Hygiene Standards)',
            points: [
              'Perishable dairy products (fresh milk, paneer, curd) and freshly cut fruits/vegetables, unless delivered spoiled or damaged at the exact time of delivery.',
              'Spices and grocery bags where original outer manufacturer packaging has been discarded or substantially consumed.',
              'Personal care and wellness items with broken hygiene protective seals, unless delivered expired or leaking.'
            ]
          }
        ]
      },
      {
        id: 'return-process',
        heading: '3. Step-by-Step Return Process',
        content: [
          'Initiating a return is simple and transparent:',
          'Step 1 - Raise Request: Navigate to My Account -> My Orders -> Select the Order -> Click “Request Return/Refund”, or contact our Support Desk via WhatsApp / Phone at +91 9372207811 with clear photos of the issue.',
          'Step 2 - Verification: Our local shop coordinator or central Kitchen Shakti team reviews the request within 2 to 4 business hours.',
          'Step 3 - Free Doorstep Pickup: For physical returns, our delivery partner collects the item from your doorstep at zero return shipping charge to you.',
          'Step 4 - Instant Replacement or Refund: Choose either an instant direct replacement dispatched right away or a 100% monetary refund.'
        ]
      },
      {
        id: 'refund-timeline',
        heading: '4. Refund Modes & Timelines',
        content: [
          'Once a refund is approved by our resolution team, the amount is disbursed without delay based on your original payment method:',
        ],
        subsections: [
          {
            title: 'Payout Channels & Speed',
            points: [
              'Harwalkart Store Credit / Wallet: Instant (within 2 to 4 hours of approval). Can be used immediately across all stores.',
              'UPI Payments (GPay, PhonePe, Paytm, BHIM): Credited back to original UPI VPA within 24 to 48 business hours.',
              'Debit / Credit Cards & Net Banking: Processed via payment gateway within 5 to 7 working banking days as per standard RBI inter-bank clearing cycles.',
              'Cash on Delivery (COD) Orders: Refunded instantly to customer\'s verified UPI VPA or bank account via IMPS/NEFT upon customer submitting details in the support portal.'
            ]
          }
        ]
      },
      {
        id: 'cancellation-terms',
        heading: '5. Order Cancellation & Pre-Dispatch Refunds',
        content: [
          'If you cancel an order before the local merchant or warehouse packs and dispatches it, 100% of your paid amount is refunded immediately without any cancellation fee or deduction.',
          'If a merchant cancels an order due to unanticipated stock exhaustion, any charged amount is refunded immediately, and a compensatory loyalty point credit is applied to your customer wallet.'
        ]
      }
    ]
  },

  'shipping-policy': {
    slug: 'shipping-policy',
    title: 'Shipping & PIN Code Policy',
    subtitle: 'Hyperlocal Same-Day PIN Code Delivery & Pan-India Express Logistics',
    badge: 'Logistics & PIN Code Serviceability',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.6.0',
    governingLaw: 'Consumer Protection (E-Commerce) Rules, 2020 • Motor Vehicles Logistics Regulations',
    sections: [
      {
        id: 'dual-shipping',
        heading: '1. Two Distinct Shipping Channels',
        content: [
          'HARWALKART operates two complementary fulfillment pipelines engineered to optimize delivery speed and product freshness:'
        ],
        subsections: [
          {
            title: '1. Hyperlocal Neighborhood Shop Deliveries',
            points: [
              'Service Radius: Orders are routed to verified merchants within 5 to 15 kilometers of the customer\'s specified delivery PIN code.',
              'Delivery Speed: Superfast 2 to 4 hours express delivery or scheduled same-day delivery slots.',
              'Fulfillment Partners: Dispatched by neighborhood store delivery fleets and dedicated local Harwalkart rider partners.',
              'Categories Covered: Daily groceries, fresh essentials, pulses, snacks, local sweets, and personal care.'
            ]
          },
          {
            title: '2. Pan-India Nationwide Shipping (Kitchen Shakti & Own Brands)',
            points: [
              'Service Radius: Covering 19,000+ Postal PIN codes across all 28 States and 8 Union Territories of India.',
              'Delivery Speed: 2 to 5 business days transit time depending on city tier (Metro: 2-3 days; Tier-2/3: 3-5 days; Remote/Northeast: 5-7 days).',
              'Logistics Partners: Tier-1 national courier networks including Delhivery, Blue Dart, Xpressbees, and India Post EMS.',
              'Categories Covered: Kitchen Shakti 100% Pure Spices, NutriFlow health staples, Rupabhoom™, and GrahShorya™.'
            ]
          }
        ]
      },
      {
        id: 'pin-verification',
        heading: '2. PIN Code Serviceability Check',
        content: [
          '1. To verify delivery availability, enter your 6-digit Indian PIN code in the header selector or on any product page.',
          '2. The platform instantly displays available local stores, estimated delivery times, and shipping fee breakdowns.',
          '3. If your PIN code has no active local shops registered yet, you can still order our Kitchen Shakti range directly for Pan-India express delivery!'
        ]
      },
      {
        id: 'charges-tiers',
        heading: '3. Shipping Charges & Free Delivery Thresholds',
        content: [
          'We maintain transparent, fair shipping charges with zero hidden handling surcharges:',
          '• Local Store Orders: Nominal delivery fee of ₹20 to ₹40 depending on travel distance. Orders above ₹3,000 enjoy FREE Delivery from participating stores.',
          '• Kitchen Shakti Direct Orders: Flat standard shipping of ₹49 for small orders. Orders above ₹399 or spice value packs qualify for 100% FREE Pan-India Shipping.',
          '• All delivery fees are transparently itemized in your order summary before payment.'
        ]
      },
      {
        id: 'tracking-handoff',
        heading: '4. Real-Time Tracking & Delivery OTP Protocol',
        content: [
          '1. Live Order Tracking: Receive real-time status updates via SMS and within the “Track Order” section of the app (Order Placed -> Store Preparing -> Out for Delivery -> Delivered).',
          '2. Secure Delivery OTP: A secure 4-digit numeric OTP is issued to the customer\'s registered phone when the order goes out for delivery. The rider completes the handover only upon validating this OTP.',
          '3. Unsuccessful Delivery Attempts: If a customer is unreachable, the delivery partner will attempt delivery up to two (2) times before returning the shipment to the store or origin warehouse.'
        ]
      }
    ]
  },

  'gst-compliance': {
    slug: 'gst-compliance',
    title: 'GST & Seller Compliance Framework',
    subtitle: 'Statutory Adherence to CGST Act, 2017 • Section 52 TCS • FSSAI Regulations',
    badge: 'Tax & Regulatory Compliance',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.7.0',
    governingLaw: 'Central Goods and Services Tax Act, 2017 • FSSAI Act, 2006 • Legal Metrology Act, 2009',
    sections: [
      {
        id: 'gst-architecture',
        heading: '1. GST Architecture & Legal Mandate',
        content: [
          'HARWALKART operates in strict compliance with the Central Goods and Services Tax (CGST) Act, 2017, State GST (SGST) Acts, and the Integrated Goods and Services Tax (IGST) Act, 2017.',
          'As an Electronic Commerce Operator (ECO), HARWALKART provides transparent, audit-ready fiscal reporting and automated tax invoice generation for all transactions conducted across our marketplace.'
        ]
      },
      {
        id: 'section52-tcs',
        heading: '2. Section 52 TCS (Tax Collected at Source)',
        content: [
          'In mandatory adherence to Section 52 of the CGST Act, 2017:',
        ],
        subsections: [
          {
            title: 'TCS Computation & Remittance',
            points: [
              'HARWALKART collects Tax Collected at Source (TCS) at the statutory rate of 1.0% (0.5% CGST + 0.5% SGST for intra-state sales, or 1.0% IGST for inter-state supplies) on the net value of taxable supplies made by third-party sellers.',
              'The collected TCS is deposited into the Government Treasury on or before the 10th day of every calendar month following the month of deduction.',
              'HARWALKART files statutory Form GSTR-8 on the official GST Common Portal. The TCS credits reflect automatically in the merchant\'s Electronic Cash Ledger, enabling sellers to offset their monthly GST liability.'
            ]
          }
        ]
      },
      {
        id: 'invoicing-hsn',
        heading: '3. Compliant Invoicing & HSN / SAC Codes',
        content: [
          '1. B2C & B2B Tax Invoices: Every transaction generates a GST-compliant invoice detailing Merchant Legal Name, GSTIN, HSN Code, Taxable Value, CGST/SGST/IGST breakdown, Customer State, and Place of Supply.',
          '2. Platform Facilitation Fee (2% Commission): HARWALKART charges a flat 2.0% platform facilitation fee on gross item sales. We issue a monthly GST Tax Invoice under Service Accounting Code (SAC 998311), enabling registered merchants to claim 100% Input Tax Credit (ITC).'
        ]
      },
      {
        id: 'merchant-kyc-fssai',
        heading: '4. Mandatory Merchant KYC & FSSAI Standards',
        content: [
          'To protect consumer health and prevent illicit commerce, every merchant must complete rigorous onboarding verification:',
        ],
        subsections: [
          {
            title: 'Mandatory Compliance Documents',
            points: [
              'Food Safety (FSSAI): Every seller offering edible groceries, spices, dairy, or prepared snacks must upload a valid 14-digit FSSAI Registration / State / Central License.',
              'Identity & Tax Proofs: Verified PAN of proprietor/entity, Aadhaar of authorized signatory, and active GSTIN (or statutory small-scale turnover exemption affidavit).',
              'Bank Account Verification: Penny-drop automated bank verification to ensure seller payouts are credited strictly to the legal entity matching the KYC documents.'
            ]
          }
        ]
      },
      {
        id: 'prohibited-products',
        heading: '5. Zero Tolerance: Counterfeit & Adulterated Goods',
        content: [
          '1. HARWALKART enforces a strict zero-tolerance policy against counterfeit items, expired packaging, parallel illicit imports, and adulterated food products.',
          '2. Any seller listing adulterated spices or counterfeit goods faces immediate suspension of their merchant account, forfeiture of platform privileges, and reporting to relevant statutory authorities (FSSAI and Consumer Affairs).'
        ]
      }
    ]
  },

  'help-desk': {
    slug: 'help-desk',
    title: 'Help & Contact Desk',
    subtitle: 'Customer Helpline • WhatsApp Support • Statutory Grievance Redressal Mechanism',
    badge: 'Customer Support & Inquiries',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'August 24, 2026',
    version: '2.4.0',
    governingLaw: 'Rule 5(9) of Consumer Protection (E-Commerce) Rules, 2020',
    sections: [
      {
        id: 'omnichannel-support',
        heading: '1. Omnichannel Assistance & Working Hours',
        content: [
          'The HARWALKART Customer Support Desk is dedicated to assisting you with order tracking, store delivery inquiries, Kitchen Shakti spice orders, return requests, and seller onboarding questions.',
          'We believe in human, courteous, and prompt resolution. Contact our team through any of our official channels below:'
        ],
        highlightBox: {
          title: 'Official Customer Helpline & Contact Channels',
          description: 'Official direct contact points for customers and merchants across India:',
          details: [
            { label: 'Customer Care Helpline', value: '+91 9372207811 (9:00 AM – 9:00 PM IST, Monday to Sunday)' },
            { label: 'Official Support Email', value: 'harwalkart@gmail.com' },
            { label: 'WhatsApp Instant Desk', value: '+91 9372207811 (Live order updates & photo verification)' },
            { label: 'Head Office Address', value: 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220' },
            { label: 'Average Response Time', value: 'Under 15 minutes during business hours' },
            { label: 'Order Tracking Portal', value: 'Track Order tab available 24/7 on harwalkart.in' }
          ]
        }
      },
      {
        id: 'grievance-statutory',
        heading: '2. Statutory Grievance Redressal Mechanism',
        content: [
          'In mandatory compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020:',
          '1. Any consumer or registered merchant with an unresolved grievance may escalate directly to our appointed Grievance Officer.',
          '2. We guarantee an official acknowledgment with a unique Ticket Reference Number within forty-eight (48) hours of receipt.',
          '3. Redressal and formal written resolution is completed within thirty (30) days from the date of receipt of the grievance.'
        ],
        subsections: [
          {
            title: 'Grievance Officer Information',
            points: [
              'Designation: Grievance Redressal Officer, HARWALKART',
              'Email for Formal Notices: harwalkart@gmail.com (Mark subject line: "ATTN: STATUTORY GRIEVANCE")',
              'Postal Address: Grievance Desk, Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220',
              'Phone Helpline: +91 9372207811'
            ]
          }
        ]
      },
      {
        id: 'quick-faq',
        heading: '3. Frequently Asked Questions (Quick Help)',
        content: [
          'Find quick answers to our most common customer inquiries:',
        ],
        subsections: [
          {
            title: 'Q: How do I track my active order?',
            points: [
              'Click "Track Order" in the top navigation bar or under My Account -> My Orders. Enter your Order ID (e.g., HK-ORD-xxxxx) to see real-time dispatch and rider updates.'
            ]
          },
          {
            title: 'Q: What if I receive a broken or expired item?',
            points: [
              'Take a photo and send it via WhatsApp or our Support Form within 7 days of delivery. We will process an immediate free replacement or 100% refund.'
            ]
          },
          {
            title: 'Q: How does a local shop register on Harwalkart?',
            points: [
              'Click "Register Shop" in the header or footer, enter your Shop Name, PIN code, FSSAI/GSTIN, and phone number. Our onboarding team verifies your store within 24 hours.'
            ]
          },
          {
            title: 'Q: Are Kitchen Shakti spices genuine and certified pure?',
            points: [
              'Yes! Kitchen Shakti is Harwalkart\'s flagship in-house brand. Every batch is 100% stone-ground from premium raw harvest, Agmark-certified, and tested for zero adulterants, synthetic dyes, or starches.'
            ]
          }
        ]
      }
    ]
  }
};
