import { expect, type Page, test } from '@playwright/test';

const cityResult = {
  id: 3448439,
  name: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  admin1: 'São Paulo',
  country: 'Brasil',
};

interface MockRequestCounts {
  geocoding: number;
  forecast: number;
}

async function blockExternalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
  );
  await page.route('https://fonts.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, body: '' }),
  );
}

async function mockWeatherApis(
  page: Page,
  currentTemperature = 0,
  geocodingBody: Record<string, unknown> = { results: [cityResult] },
  dailyBody: Record<string, unknown> = {
    time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
    weather_code: [0, 1, 2, 3, 61],
    temperature_2m_max: [10, 11, 12, 13, 14],
    temperature_2m_min: [1, 2, 3, 4, 5],
  },
): Promise<MockRequestCounts> {
  const requests = { geocoding: 0, forecast: 0 };

  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    requests.geocoding += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(geocodingBody),
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    requests.forecast += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-11-11T09:00',
          temperature_2m: currentTemperature,
          weather_code: 0,
        },
        daily: dailyBody,
      }),
    });
  });

  return requests;
}

test('busca uma cidade, mostra a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  const requests = await mockWeatherApis(page);
  await blockExternalFonts(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByText('0.0°C')).toBeVisible();
  expect(requests.geocoding).toBe(1);
  expect(requests.forecast).toBe(1);

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(page.getByText('32.0°F')).toBeVisible();
  expect(requests.forecast).toBe(1);
});

test('mostra estado vazio quando geocoding retorna results vazio', async ({ page }) => {
  const requests = await mockWeatherApis(page, 0, { results: [] });
  await blockExternalFonts(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Cidade sem resultados');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  expect(requests.geocoding).toBe(1);
  expect(requests.forecast).toBe(0);
});

test('exibe forecast parcial sem valores inválidos ou inventados', async ({ page }) => {
  const requests = await mockWeatherApis(
    page,
    18.2,
    { results: [cityResult] },
    {
      time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
      weather_code: [0],
      temperature_2m_max: [10],
      temperature_2m_min: [],
    },
  );
  await blockExternalFonts(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);
  await expect(page.getByText('10.0°C')).toBeVisible();
  await expect(page.getByText('Condição indisponível').first()).toBeVisible();
  await expect(page.getByText('—').first()).toBeVisible();
  await expect(page.getByText(/NaN|undefined|null/)).toHaveCount(0);
  expect(requests.geocoding).toBe(1);
  expect(requests.forecast).toBe(1);
});

test('renderiza o clima corretamente no viewport mobile 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const requests = await mockWeatherApis(page, 18.2);
  await blockExternalFonts(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByText('18.2°C')).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'São Paulo', exact: true }).getByText('Céu limpo'),
  ).toBeVisible();
  expect(requests.geocoding).toBe(1);
  expect(requests.forecast).toBe(1);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
