import { app } from "./app";
import dotenv from "dotenv";
import Scheduler from "./scheduler";

dotenv.config();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`[SERVER] Servidor rodando em http://localhost:${PORT}`);

  Scheduler.run();
});
