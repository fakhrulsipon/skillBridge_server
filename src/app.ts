import express from "express"
import cors from "cors"

import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api", router)

// Error Handling Middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;