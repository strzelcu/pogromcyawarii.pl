# Pogromcy awarii — Jekyll
Migracja https://pogromcyawarii.pl z WordPress do Jekyll. Zawartość i lokalne zdjęcia pochodzą z istniejącej strony.

## Uruchomienie
Ruby 3.3+, `bundle install`, `bundle exec jekyll serve`. Publikacja: GitHub Settings → Pages → Source → GitHub Actions. Workflow buduje i publikuje po zmianie main.

## Edycja
Treść: index.html. Układ: _layouts/default.html. Styl: assets/css/site.css. Zdjęcia: assets/images.

## Funkcje
Formularz przygotowuje email w programie pocztowym użytkownika. GitHub Pages nie obsługuje PHP ani WordPress WPForms. Nie ma serwerowej wysyłki ani przechowywania zgłoszeń. Nie wysyłaj formularza podczas testów.
Opinie korzystają z oryginalnego widgetu Elfsight; mapa z Google Maps. Te usługi pozostają zewnętrznymi zależnościami.

## Domena pogromcyawarii.pl
Najpierw sprawdź wersję na https://strzelcu.github.io/pogromcyawarii.pl/.
Następnie ustaw `url: https://pogromcyawarii.pl` i `baseurl: ""`, dodaj plik CNAME zawierający pogromcyawarii.pl i ustaw tę domenę w Pages. Ustaw DNS zgodnie z aktualną dokumentacją GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site . Zachowaj rekordy poczty MX/TXT. Włącz HTTPS po wydaniu certyfikatu. Dostęp do DNS jest potrzebny do przełączenia domeny.
