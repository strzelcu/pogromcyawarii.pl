# Development and validation

## Build

```sh
bundle install
bundle exec jekyll build --trace
```

Generated files are written to `_site/`. Do not commit generated output, dependency directories, or local runtime files.

## Preview

```sh
bundle exec jekyll serve --baseurl ""
```

Visit http://127.0.0.1:4000. Refresh after changes if necessary. The production URL and base path remain configured in `_config.yml`.

## Editing

Update customer-facing Polish copy in `index.html`. Keep one primary `h1` heading and use `h2` for page sections. Preserve existing anchor IDs because navigation and incoming links use them.

Gallery thumbnails link to their larger local images. With JavaScript enabled, these links open a native modal dialog. Without JavaScript, they open the image directly. Ctrl/Cmd-click retains normal browser behavior.

The slideshow is manual; it does not automatically advance. Visitors can use its buttons, horizontal swiping, or arrow keys while the slideshow has focus. The gallery dialog supports previous/next buttons, arrow keys, Escape, and focus return to the originating thumbnail.

Scroll reveals use IntersectionObserver. If it is unavailable, content stays visible. When the operating system requests reduced motion, animations and smooth scrolling are disabled.

## Validation checklist

- Build with Jekyll without errors.
- Check desktop and narrow mobile widths for horizontal overflow.
- Verify navigation opens, closes, and reaches the correct section.
- Check slideshow buttons, count, swipe behavior, and arrow keys.
- Open gallery images; verify next/previous, Escape, and focus return.
- Confirm photos load and the original service scope and contact details remain accurate.
- Check focus visibility and keyboard access.
- Check the reduced-motion setting.
- Verify the contact form's required fields without sending a real enquiry.
- Allow time for the external reviews and map to load.

## Dependencies and privacy

There are no frontend package dependencies. Jekyll and WEBrick are declared in the Gemfile. Elfsight and Google Maps are external embeds; their availability and privacy behavior are controlled by their providers. The email form does not send data to a separate form processing service.
