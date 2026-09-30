# Google Reviews

The business profile is [Pogromcy Awarii on Google](https://share.google/mKe3rNKmiIHc8blY0), at Osiedle Piastów Śląskich 14/11, Strzelce Opolskie. The profile link is stored in `_data/google_reviews.yml`.

## Current behavior

The page displays the configured Elfsight Google Reviews widget and a direct link to the business profile. Elfsight retrieves and refreshes reviews; ratings, review counts, and review text are not copied into the site. If `widget_id` is empty, the page displays only the profile link and does not load Elfsight.

## Enable automatic reviews

1. Sign in to the business owner's [Elfsight dashboard](https://dash.elfsight.com/).
2. Create a **Google Reviews** widget. Do not reuse the previous Facebook Reviews widget ID.
3. Select Pogromcy Awarii as its source. Confirm the business address above; the [Elfsight source guide](https://help.elfsight.com/article/164-ways-to-set-your-google-place-in-elfsight-google-reviews-widget) describes supported Google Maps links and Place IDs. If the Google Search share link is not accepted, find the business by name and address in the source picker.
4. Use a responsive grid or carousel, Polish labels, and colors that match the site: accent `#be352e`, text `#202321`, background `#f7f6f2`.
5. Save the widget and copy its installation code. From the class `elfsight-app-UUID`, put only the UUID into `widget_id` in `_data/google_reviews.yml`.
6. Build and publish. Check actual Google review cards on desktop and mobile, their attribution links, and the direct profile link.

The widget loads through the official Elfsight platform script only on the homepage and only when an ID is configured. The profile link stays available when JavaScript is disabled or the provider cannot load.

Elfsight controls review retrieval, refresh intervals, plan limits, and availability. Its [refresh documentation](https://help.elfsight.com/article/168-why-my-reviews-are-not-being-updated) currently describes a 72-hour cache, so new reviews may take time to appear. Check the account's plan before relying on it for production traffic.

No API keys or account credentials belong in this repository. The widget ID is a public installation identifier.
