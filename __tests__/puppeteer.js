const puppeteer = require('puppeteer');

const APP = `http://localhost:${process.env.PORT || 8081}/`;

describe('Front-end Integration/Features', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(() => {
    APP.destroy();
  });

  describe('Initial display', () => {
    it('loads successfully', async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector('.modal-body');
      const title = await page.$eval('h3', (el) => el.innerHTML);
      expect(title).toBe('LucidQL');
    });

    it('displays a usable input field for a Postgres URI', async () => {
      await page.goto(APP);
      await page.waitForSelector('.form-group');
      await page.focus('#link');
      await page.keyboard.type('www.sometestlink.com');
      const inputValue = await page.$eval('#link', (el) => el.value);
      expect(inputValue).toBe('www.sometestlink.com');
    });

    it('clicking on submit while input is empty does not close modal', async () => {
      await page.goto(APP);
      await page.waitForSelector('.modal-body');
      const title = await page.$eval('h3', (el) => el.innerHTML);
      await page.click('.submit');
      expect(title).toBe('LucidQL');
    });

    it('MySQL button exists on modal', async () => {
      await page.goto(APP);
      await page.waitForSelector('.modal-body');
      const mySQLButton = await page.$eval('.mySQL', (el) => el.innerHTML);
      expect(mySQLButton).toBe('Use MySQL Database');
    });

    it('Clicking MySQL button brings you to the MySQL page', async () => {
      await page.goto(APP);
      await page.waitForSelector('.modal-body');
      await page.click('.mySQL');
      const mySQLModal = await page.$eval('p', (el) => el.innerHTML);

      expect(mySQLModal).toBe('Please enter MySQL information below.');
    });

    it('clicking on close button closes the modal', async () => {
      await page.goto(APP);
      await page.waitForSelector('.form-group');
      await page.click('._modal-close-icon');
      const title = (await page.$('h3', (el) => el.innerHTML)) || null;
      expect(title).toBe(null);
    });
  });
  describe('Main Page', () => {
    it('successfully loads top navbar', async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      const topNav = (await page.$('.sticky-nav')) !== null;
      expect(topNav).toBe(true);
    });
    it('successfully loads footer navbar', async () => {
      const footerNav = (await page.$('.footer')) !== null;
      expect(footerNav).toBe(true);
    });
    it('successfully loads d3 graph container', async () => {
      const graphArea = (await page.$('.footer')) !== null;
      expect(graphArea).toBe(true);
    });
    it('successfully loads code mirror', async () => {
      const codeMirror = (await page.$('.CodeMirror')) !== null;
      expect(codeMirror).toBe(true);
    });
    it('successfully loads split bar in middle of page', async () => {
      const splitBar = (await page.$('.sc-htpNat.fXAXjb.sc-bdVaJa.cjjWdp')) !== null;
      expect(splitBar).toBe(true);
    });
  });
});
