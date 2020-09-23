const puppeteer = require('puppeteer');

const APP = `http://localhost:${process.env.PORT || 8081}/`;

describe('Front-end Integration/Features', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
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
      await page.goto(APP); // takes a URL
      await page.waitForSelector('.form-group'); // takes a selector - waits for it to appear in page
      await page.focus('#link'); // fetches element (selector)
      await page.keyboard.type('www.sometestlink.com');
      const inputValue = await page.$eval('#link', (el) => el.value);
      expect(inputValue).toBe('www.sometestlink.com');
    });

    // TODO: Finish tests

    xit('renders the MarketsDisplay section', async () => {
      await page.goto(APP);
      await page.waitForSelector('.displayBox');
      const title = await page.$eval('h4', (el) => el.innerHTML);
      expect(title).toBe('Markets');
    });

    xit('renders the TotalsDisplay area', async () => {
      await page.goto(APP);
      await page.waitForSelector('#totals');
      const title = await page.$eval('strong', (el) => el.innerHTML); // $eval - runs document.querySelector in the page takes (selector, func) - func is el.SOMETHING - whatever you want to return (innerHTML, value, href)
      expect(title).toBe('Total Cards: ');
    });
  });
});
