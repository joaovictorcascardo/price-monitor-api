import cron from "node-cron";
import { db } from "./database/connection";
import ScraperService from "./services/ScraperService";
import EmailService from "./services/EmailService";
import { ProductDTO } from "./dto/ProductDTO";
import { UserGetMeDTO } from "./dto/UserDTO";

class Scheduler {
  public run() {
    console.log("[Scheduler] Agendador iniciado.");

    cron.schedule("0 */4 * * *", async () => {
      console.log(
        "---------------npm run dev-------------------------------------------"
      );
      console.log(
        `[Scheduler] RODANDO O ROBÔ DE VERIFICAÇÃO... (${new Date().toLocaleTimeString()})`
      );

      const allProducts: ProductDTO[] = await db("products").select("*");

      if (allProducts.length === 0) {
        console.log("[Scheduler] Nenhum produto no banco. Dormindo.");
        return;
      }

      console.log(`[Scheduler] ${allProducts.length} produtos para verificar.`);

      for (const product of allProducts) {
        console.log(
          `[Scheduler] Verificando: ${product.name} (ID: ${product.id})`
        );

        const details = await ScraperService.fetchProductDetails(product.url);

        if (!details) {
          console.log(
            `[Scheduler] Falha ao verificar produto ID: ${product.id}. Pulando.`
          );
          continue;
        }

        await db("products").where({ id: product.id }).update({
          current_price: details.current_price,
          updated_at: new Date(),
        });

        if (
          details.current_price <= product.target_price &&
          details.current_price !== Number(product.current_price)
        ) {
          const user: UserGetMeDTO = await db("users")
            .select("id", "name", "email")
            .where({ id: product.user_id })
            .first();

          if (!user) {
            console.warn(
              `[Scheduler] Produto ${product.id} sem usuário. Pulando e-mail.`
            );
            continue;
          }

          console.log(
            `\nALERTA DE PREÇO ATINGIDO! (Enviando e-mail...)
             Produto: ${product.name}
             Usuário: ${user.email}
            \n`
          );
          await EmailService.sendPriceAlert(
            user,
            product,
            details.current_price
          );
        }
      }
    });
  }
}

export default new Scheduler();
