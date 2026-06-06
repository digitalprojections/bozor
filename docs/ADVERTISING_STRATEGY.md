# Bozor Japan Advertising Strategy

## Goals

Advertising should create revenue without making the marketplace feel less trustworthy. Ads are managed through approved advertiser profiles, ad campaigns, and ad orders. The older `listing_type = advertisement` path can remain as a manual fallback, but normal marketplace items remain `listing_type = item`.

The first version should sell simple fixed-duration placements. CPM and CPC pricing need reliable traffic, impression tracking, click tracking, and advertiser reporting before they become fair to buyers or useful for us.

## Placement Model

All placements must be clearly labeled `Ad`.

| Placement | Purpose | Inventory | Launch price |
| --- | --- | ---: | ---: |
| Top banner | Highest visibility across shared layout | 2 rotating ads | ¥9,800/week or ¥29,800/month |
| Right rail | Persistent desktop attention beside content | 3 rotating ads | ¥6,800/week or ¥19,800/month |
| Sidebar | Contextual desktop placement under navigation | 3 rotating ads | ¥3,800/week or ¥9,800/month |
| Footer | Low-pressure brand reminder | 2 rotating ads | ¥2,000/week or ¥5,800/month |

Recommended launch discounts:

- 10% off two-week bookings.
- 20% off monthly bookings.
- 50% founding advertiser discount for the first three advertisers, capped at one month.

## Why Fixed Packages First

Fixed weekly/monthly pricing is best for the launch stage because:

- Advertisers know their spend before buying.
- We do not need mature impression forecasting yet.
- Low early traffic does not make CPM pricing look weak.
- Operations are simple: approve ad, set placement, start date, end date, priority.

Once the platform has enough traffic history, convert prices internally to effective CPM:

`eCPM = ad_price_jpy / impressions * 1000`

Use that to adjust package prices quarterly.

## Future Performance Pricing

Move to CPM/CPC only after the ad system records impressions and clicks accurately.

Suggested future floors:

- Site-wide display CPM: ¥300-¥800.
- Premium top banner CPM: ¥800-¥1,500.
- Sponsored in-feed listing CPM: ¥500-¥1,200.
- CPC option for direct-response advertisers: ¥30-¥120/click, depending on category quality.

Avoid pure CPC at launch. It shifts too much risk to the marketplace before click quality, fraud controls, and conversion reporting exist.

## Editorial and Safety Rules

- Ads must be visually distinct enough to avoid confusing users with organic listings.
- Every ad unit must show `Ad`.
- No deceptive titles, fake discounts, prohibited goods, unsafe claims, or impersonation.
- Ads should not auto-open, pop up, flash, cover content, or create accidental clicks.
- Ad listings should be excluded from organic marketplace search, recommendations, watchlists, sitemaps, and transaction flows unless a dedicated sponsored-listing product is intentionally added.

## Operational Workflow

1. User applies for an advertiser account.
2. Admin approves, rejects, or suspends the advertiser profile.
3. Approved advertiser creates an ad campaign with title, body, image, destination URL, package, and preferred start date.
4. The system creates one fixed-price ad order for the selected package.
5. Advertiser submits a payment reference after paying through the current manual/off-platform process.
6. Admin confirms payment, reviews the ad, sets dates/priority, and marks the campaign scheduled or active.
7. Shared layout loads paid active campaigns by placement and rotates available ads.
8. Future version records impressions and clicks to calculate eCPM and renewal pricing.

## Next Milestones

- Online payment checkout for ad packages.
- Impression and click tracking endpoints.
- Advertiser reporting page.
- Sponsored in-feed placement after disclosure and ranking rules are defined.
