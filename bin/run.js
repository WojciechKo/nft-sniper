const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const fetchFloorPrice = async (browser, sniper) => {
  const page = await browser.newPage();
  await page.goto(sniper.link, { waitUntil: "networkidle0" });
  floorPrice = await page
    .$eval(
      ".react-item-ItemListCard__link:nth-child(1)",
      (el) => el.textContent
    )
    .then((floor) => floor.match(/.*Price(?<price>[^\s]*)\s.*/).groups.price)
    .then(parseFloat);

  page.close();

  return floorPrice;
};

const runBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./bin/data",
  });

  const mainPage = await browser.newPage();
  await mainPage.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0" });

  await mainPage.exposeFunction("fetchFloorPrice", async (sniper) => {
    const floorPrice = await fetchFloorPrice(browser, sniper);

    mainPage.evaluate(
      (detail) => {
        window.dispatchEvent(
          new CustomEvent(`floorPriceFetched-${detail.sniper._id}`, { detail })
        );
      },
      { sniper, floorPrice }
    );
  });

  return { mainPage, browser };
};

const { exec } = require("child_process");

const executeCmd = async (command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  console.log("Run web applicaton")
  await executeCmd("BROWSER=none yarn start");
  await delay(3000);

  console.log("Run browser")
  const { mainPage, browser } = await runBrowser();

  await mainPage.$$eval(
    "div.MuiPaper-root > div:nth-child(1) > button:nth-child(4)",
    (elHandles) => elHandles.forEach((el) => el.click())
  );
})();
