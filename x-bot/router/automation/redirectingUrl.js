import puppeteer from "puppeteer";

const url =
    "https://x.com/i/oauth2/authorize?response_type=code&client_id=...";

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Open a visible browser for debugging
        slowMo: 100, // Slows down actions for better visibility
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000); // Increase timeout

    console.log("Navigating to URL...");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    console.log("Waiting for the authorization button...");

    try {
        await page.waitForSelector("button[data-testid='OAuth_Consent_Button']", {
            visible: true,
            timeout: 30000,
        });

        // Click the button
        console.log("Button found! Clicking...");
        await page.click("button[data-testid='OAuth_Consent_Button']");
    } catch (error) {
        console.error("❌ Button not found! Trying alternative method...");

        const [button] = await page.$x("//button[contains(., 'Authorize app')]");
        if (button) {
            console.log("✅ Found button using XPath! Clicking...");
            await button.click();
        } else {
            console.error("❌ Button still not found. Check the page structure.");
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await browser.close();
})();
