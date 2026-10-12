import { test, expect } from '@playwright/test';
test('client creates shipment, staff quotes, client approves and staff returns equipment', async ({
  page,
}) => {
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Klient demo', exact: true }).click();
  await page.getByRole('link', { name: 'Nowe zgłoszenie', exact: true }).click();
  await page.getByLabel('Producent').fill('Asus');
  await page.getByLabel('Model', { exact: false }).fill('ZenBook 14');
  await page
    .getByLabel('Opis usterki')
    .fill('Laptop nie ładuje akumulatora po podłączeniu zasilacza.');
  await page.getByLabel('Dołączone akcesoria').fill('Zasilacz');
  await page.getByRole('button', { name: 'Sprawdź podsumowanie' }).click();
  await expect(page.getByRole('heading', { name: 'Asus ZenBook 14' })).toBeVisible();
  await page.getByRole('button', { name: 'Zatwierdź zgłoszenie' }).click();
  await expect(page).toHaveURL(/\/panel\/zgloszenia\/PA-/);
  const detail = page.url();
  await page.getByRole('button', { name: 'Przygotuj przesyłkę demo' }).click();
  await expect(page.getByText('ETYKIETA DEMO — NIE NADAWAJ PACZKI')).toBeVisible();
  await page.reload();
  await expect(page.getByText('W drodze do serwisu', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Wyloguj', exact: true }).click();
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Serwis demo', exact: true }).click();
  await page.goto(detail);
  await page.getByRole('button', { name: 'Potwierdź przyjęcie sprzętu' }).click();
  await page.getByRole('button', { name: 'Rozpocznij diagnostykę' }).click();
  await page.getByLabel('Diagnoza').fill('Wymiana uszkodzonego gniazda ładowania.');
  await page.getByLabel('Kwota brutto').fill('350');
  await page.getByRole('button', { name: 'Przekaż wycenę klientowi' }).click();
  await expect(page.getByRole('button', { name: 'Zakończ naprawę i nadaj zwrot' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Wyloguj', exact: true }).click();
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Klient demo', exact: true }).click();
  await page.goto(detail);
  await page.getByRole('button', { name: 'Akceptuję wycenę' }).click();
  await page.getByRole('button', { name: 'Wyloguj', exact: true }).click();
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Serwis demo', exact: true }).click();
  await page.goto(detail);
  await page.getByRole('button', { name: 'Zakończ naprawę i nadaj zwrot' }).click();
  await page.getByRole('button', { name: 'Potwierdź zakończenie' }).click();
  await expect(page.locator('.status-badge')).toHaveText('Zakończone');
  await expect(page.locator('.label-demo')).toHaveCount(2);
});
test('registration, own list, profile persistence and client access restriction', async ({
  page,
}) => {
  await page.goto('/rejestracja');
  await page.getByLabel('Imię i nazwisko').fill('Jan Testowy');
  await page.getByLabel('Email', { exact: false }).fill('jan@example.com');
  await page.getByLabel('Telefon').fill('500100200');
  await page.getByLabel('Ulica i numer').fill('Testowa 1');
  await page.getByLabel('Kod pocztowy').fill('47-100');
  await page.getByLabel('Miejscowość').fill('Strzelce Opolskie');
  await page.getByRole('button', { name: 'Utwórz konto', exact: true }).click();
  await expect(page.getByText('Tutaj pojawią się Twoje naprawy.')).toBeVisible();
  await page.goto('/panel/zgloszenia/PA-DEMO-001');
  await expect(page.getByText('Zgłoszenie jest niedostępne.')).toBeVisible();
  await page.goto('/serwis/uzytkownicy');
  await expect(page.getByText('Ta część jest dostępna dla pracowników serwisu.')).toBeVisible();
  await expect(page.locator('table')).toHaveCount(0);
  await page.goto('/panel/profil');
  await page.getByLabel('Telefon').fill('500999888');
  await page.getByRole('button', { name: 'Zapisz profil' }).click();
  await page.reload();
  await expect(page.getByLabel('Telefon')).toHaveValue('500999888');
});
test('mobile navigation, gallery and mock API validation', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('link', { name: 'Zgłoś naprawę', exact: true }).first().click();
  await expect(page).toHaveURL(/\/panel\/nowe/);
  await page.goto('/');
  await page.locator('.gallery a').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const result = await request.post('/api/demo/repairs', { data: { input: {}, userId: '' } });
  expect(result.status()).toBe(400);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('rejected quote leads to return without repair and corrupted storage can be reset', async ({
  page,
}) => {
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Klient demo', exact: true }).click();
  await page.goto('/panel/zgloszenia/PA-DEMO-001');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Odrzucam wycenę' }).click();
  await expect(page.getByText('Decyzja: odrzucona', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Wyloguj', exact: true }).click();
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Serwis demo', exact: true }).click();
  await page.goto('/panel/zgloszenia/PA-DEMO-001');
  await expect(page.getByRole('button', { name: 'Rozpocznij diagnostykę' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Zwróć sprzęt bez naprawy' }).click();
  await page.getByRole('button', { name: 'Potwierdź zakończenie' }).click();
  await expect(page.locator('.status-badge')).toHaveText('Zakończone');
  await page.evaluate(() => localStorage.setItem('pogromcy-demo-v1', '{invalid'));
  await page.reload();
  await expect(page.locator('.demo-notice [role=alert]')).toContainText(
    'Nie można odczytać zapisu demo',
  );
  await page.goto('/logowanie');
  await page.getByRole('button', { name: 'Serwis demo', exact: true }).click();
  await page.goto('/serwis');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Resetuj demo' }).click();
  await expect(page.getByRole('heading', { name: 'Zaloguj się do swojego konta.' })).toBeVisible();
});
