import { app } from "./app";
import { config } from "./config/env";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
