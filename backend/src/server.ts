import app from "./app";
import config from "./config";


const port = Number(config.PORT ?? 9000);


if (config.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
  });
}

export default app;