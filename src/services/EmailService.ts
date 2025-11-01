import nodemailer from "nodemailer";
import { ProductDTO } from "../dto/ProductDTO";
import { UserGetMeDTO } from "../dto/UserDTO";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 2525),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPriceAlert(
    user: UserGetMeDTO,
    product: ProductDTO,
    newPrice: number
  ) {
    console.log(
      `[EmailService] Preparando e-mail de alerta para ${user.email}...`
    );
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Alerta de Preço! - ${product.name}`,

        html: `
          <h1>Olá, ${user.name}!</h1>
          <p>Temos uma ótima notícia! O produto que você está monitorando atingiu o preço desejado:</p>
          <hr>
          
          <h3>${product.name}</h3>
          <img src="${product.image_url}" alt="${product.name}" width="200" />
          
          <p>Preço Alvo: <strong>R$ ${product.target_price}</strong></p>
          <p>Preço Atual: <strong>R$ ${newPrice}</strong></p>
          
          <a href="${product.url}" target="_blank">
            <button style="background-color: #FF6500; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Ver produto agora!
            </button>
          </a>
          
          <hr>
          <p><small>Você recebeu este e-mail porque cadastrou este produto no Price Monitor API.</small></p>
        `,
      });
      console.log(
        `[EmailService] E-mail enviado com sucesso para ${user.email}.`
      );
    } catch (error) {
      console.error("[EmailService] Erro ao enviar e-mail:", error);
    }
  }
}

export default new EmailService();
