import express, { Application } from "express";
import { routes } from "./routes";

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
	console.log("Server listening on port", PORT);
});
