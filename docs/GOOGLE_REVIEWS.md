# Google Reviews

The business profile is [Pogromcy Awarii on Google](https://share.google/mKe3rNKmiIHc8blY0), at Osiedle Piastów Śląskich 14/11, Strzelce Opolskie. The application profile link and public widget class are in `components/google-reviews.tsx`; the footer repeats the profile link. `_data/google_reviews.yml` is retained only for the original Jekyll reference.

## Current behavior

The page displays the configured Elfsight Google Reviews widget and a direct link to the business profile. Elfsight retrieves and refreshes reviews; ratings, review counts, and review text are not copied into the site. The current app retains the existing widget UUID. To remove the embed, remove its widget container and `Script` from `components/google-reviews.tsx`, retaining the profile link.

## Enable automatic reviews

1. Sign in to the business owner's [Elfsight dashboard](https://dash.elfsight.com/).
2. Create a **Google Reviews** widget. Do not reuse the previous Facebook Reviews widget ID.
3. Select Pogromcy Awarii as its source. Confirm the business address above; the [Elfsight source guide](https://help.elfsight.com/article/164-ways-to-set-your-google-place-in-elfsight-google-reviews-widget) describes supported Google Maps links and Place IDs. If the Google Search share link is not accepted, find the business by name and address in the source picker.
4. Use a responsive grid or carousel, Polish labels, and colors that match the site: accent `#be352e`, text `#202321`, background `#f7f6f2`.
5. Save the widget and copy its installation code. From the class `elfsight-app-UUID`, update the widget class in `components/google-reviews.tsx`.
6. Build and publish. Check actual Google review cards on desktop and mobile, their attribution links, and the direct profile link.

The widget loads through the official Elfsight platform script only on the homepage using Next.js Script with `lazyOnload`. The profile link stays available when JavaScript is disabled or the provider cannot load.

Elfsight controls review retrieval, refresh intervals, plan limits, and availability. Its [refresh documentation](https://help.elfsight.com/article/168-why-my-reviews-are-not-being-updated) currently describes a 72-hour cache, so new reviews may take time to appear. Check the account's plan before relying on it for production traffic.

No API keys or account credentials belong in this repository. The widget ID is a public installation identifier.
