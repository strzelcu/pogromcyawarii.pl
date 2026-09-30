# Pogromcy awarii

A responsive Jekyll website for the computer repair business at [pogromcyawarii.pl](https://pogromcyawarii.pl), migrated from WordPress. Project documentation is written in English; customer-facing content remains in Polish.

## Run locally

Use Ruby 3.3 or newer and Bundler:

```sh
bundle install
bundle exec jekyll serve --baseurl ""
```

Open http://127.0.0.1:4000. The empty base URL makes local assets resolve from the server root. Production uses `/pogromcyawarii.pl` until the custom domain is configured.

## Project structure

- `index.html`: landing page, service descriptions, gallery, and contact details.
- `_layouts/default.html`: shared metadata, navigation, footer, and gallery dialog.
- `assets/css/site.css`: responsive styling and motion preferences.
- `assets/js/site.js`: navigation, slideshow, scroll reveals, gallery viewer, and email preparation.
- `assets/images/`: locally stored original website photographs and branding.
- `_config.yml`: Jekyll configuration and production URL.
- `.github/workflows/pages.yml`: build and GitHub Pages deployment.

## Features

The site includes responsive navigation, service cards, an accessible gallery dialog, a manual slideshow, and subtle scroll animations. Animations respect `prefers-reduced-motion`. Content and gallery links remain usable without JavaScript.

The contact form prepares a message in the visitor's mail application. The visitor must send it there. The site does not deliver email on a server or store submissions. GitHub Pages cannot execute the original WordPress/PHP form.

Reviews use the existing Elfsight widget. The location map uses Google Maps. These services require network access and may load after the page's own content.

## Documentation

- [Development and validation](docs/DEVELOPMENT.md)
- [GitHub Pages and custom domain setup](docs/DEPLOYMENT.md)

Original content, photos, branding, and business details were migrated from the existing website. Confirm business details with the owner before changing them.
