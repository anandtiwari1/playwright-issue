import { test, expect } from '@playwright/test';
import { getFulfilledResponse } from './helper/helper';

test('wait for response test', async ({ page }) => {
  
  await test.step("navigate to url", async() => {
    await page.goto('https://github.com');
  })
  
  const responseJson = await test.step("wait for response check", async() => {
    const uris = ['/login'];
    const responsePromise = getFulfilledResponse(page, uris, {
    responseData: 'Sign in to GitHub',
    requestMethod: "GET",
    });
    await page.getByRole('link', { name: 'Sign in' }).click();

    const response = await responsePromise;
    return await response.text();
  })
  await test.step("verify string", async() =>{
    expect(responseJson).toContain('Sign in to GitHub');
  })
});

