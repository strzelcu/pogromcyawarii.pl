# Deployment

## GitHub Pages

The repository is `strzelcu/pogromcyawarii.pl`. Enable hosting under **Settings → Pages → Build and deployment → Source → GitHub Actions**.

The workflow runs on pushes to `main` and supports manual dispatch. It builds with Ruby 3.3 and Jekyll, uploads the generated site, and deploys it through GitHub Pages. The build can pass while deployment fails if Pages has not been enabled.

The initial project URL is https://strzelcu.github.io/pogromcyawarii.pl/. Its configuration is:

```yaml
url: https://strzelcu.github.io
baseurl: /pogromcyawarii.pl
```

## Custom domain

After validating the GitHub Pages version:

1. Set `url: https://pogromcyawarii.pl` and `baseurl: ""` in `_config.yml`.
2. Add a root-level `CNAME` file containing `pogromcyawarii.pl`.
3. Configure that custom domain in the repository's Pages settings.
4. Update the domain's DNS using the current [GitHub custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
5. Preserve existing email-related MX and TXT records.
6. Enable HTTPS once GitHub has issued the certificate.
7. Check the homepage, navigation, images, canonical URL, and social metadata at the custom domain.

Domain migration requires access to the DNS provider. Committing a CNAME file alone does not redirect traffic from the existing host.

## Rollback

Revert the relevant source commit and let the workflow rebuild. For a DNS migration, retain the previous hosting details until the new domain has been verified.
