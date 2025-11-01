import { chromium, Page } from "playwright";

interface ProductDetails {
  name: string;
  current_price: number;
  image_url: string;
}

class ScraperService {
  private cleanPrice(priceText: string): number {
    const cleaned = priceText
      .replace(/R\$\s?/, "")
      .replace(/\./g, "")
      .replace(/,/, ".");

    return parseFloat(cleaned);
  }

  private async safeExtractText(
    page: Page,
    selector: string
  ): Promise<string | null> {
    try {
      await page.waitForSelector(selector, { timeout: 7000 });
      return await page.locator(selector).first().textContent();
    } catch (error) {
      console.warn(`[Scraper] Seletor de TEXTO não encontrado: ${selector}`);
      return null;
    }
  }

  private async safeExtractAttribute(
    page: Page,
    selector: string,
    attribute: string
  ): Promise<string | null> {
    try {
      await page.waitForSelector(selector, { timeout: 7000 });
      return await page.locator(selector).first().getAttribute(attribute);
    } catch (error) {
      console.warn(`[Scraper] Seletor de ATRIBUTO não encontrado: ${selector}`);
      return null;
    }
  }

  public async fetchProductDetails(
    url: string
  ): Promise<ProductDetails | null> {
    let browser = null;
    try {
      console.log(`[Scraper] Iniciando scrape para: ${url}`);

      browser = await chromium.launch({ headless: true });

      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

      try {
        const cookieButtonSelector =
          "#onetrust-accept-btn-handler, #sp-cc-accept";
        await page.waitForSelector(cookieButtonSelector, { timeout: 5000 });
        console.log(
          "[Scraper] Pop-up de cookie encontrado. Clicando em 'Aceitar'."
        );
        await page.click(cookieButtonSelector);
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log(
          "[Scraper] Pop-up de cookie não encontrado (ou já aceito)."
        );
      }

      let nameText = await page.title();
      if (!nameText) {
        throw new Error("Não foi possível encontrar o TÍTULO da página.");
      }
      nameText = nameText.split("|")[0].trim();

      const SELECTOR_PRECO =
        "h4[class*='text-secondary-500'], span.a-price-whole";

      let priceText = await this.safeExtractText(page, SELECTOR_PRECO);

      if (!priceText) {
        priceText = await this.safeExtractText(
          page,
          "span[data-a-color='base'] .a-offscreen"
        );
      }

      if (!priceText)
        throw new Error("Não foi possível encontrar o PREÇO do produto.");

      const SELECTOR_IMAGEM = "div.swiper-slide-active img, img#landingImage";

      const imageUrl = await this.safeExtractAttribute(
        page,
        SELECTOR_IMAGEM,
        "src"
      );
      if (!imageUrl)
        throw new Error("Não foi possível encontrar a IMAGEM do produto.");

      const cleanedPrice = this.cleanPrice(priceText);
      const cleanedName = nameText.trim();

      console.log(`[Scraper] Sucesso: ${cleanedName} - R$ ${cleanedPrice}`);

      await browser.close();

      return {
        name: cleanedName,
        current_price: cleanedPrice,
        image_url: imageUrl,
      };
    } catch (error: any) {
      console.error(`[Scraper] FALHA no scrape de ${url}:`, error.message);
      if (browser) {
        await browser.close();
      }
      return null;
    }
  }
}

export default new ScraperService();
