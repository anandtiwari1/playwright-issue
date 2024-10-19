import { Page } from "@playwright/test";
export interface RequestOptions {
    responseData?: string;
    requestMethod?: string;
    responseStatus?: number;
    timeout?: number;
  }

/**
 * wait for the correct request urls, request method, check for the correct response data and return the response object
 * @param page
 * @param uris - An array of URI patterns to match against the response URL.
 * @param options - Additional options for configuring the wait and validation.
 */
export async function getFulfilledResponse(page: Page, uris: string[], options: RequestOptions) {
    const { responseData, requestMethod, responseStatus = 200, timeout = 30000 } = options;
    return page.waitForResponse(
      async (res) => {
        const url = new URL(res.url()).pathname;
        const isUriMatched = uris.some((uri) => url.includes(uri));
        if (!isUriMatched) {
          return false;
        }
        if (requestMethod && res.request().method() !== requestMethod) {
          return false; // If requestMethod is provided and doesn't match, return false.
        }
        if (responseData) {
          const responseBody = await res.text();
          const isResponseDataMatched = responseBody.includes(responseData);
          return res.status() === responseStatus && isUriMatched && isResponseDataMatched;
        } else {
          return res.status() === responseStatus && isUriMatched;
        }
      },
      { timeout: timeout }
    );
  }