import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.route";
import { ErrorHandler, NotFoundHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("*", NotFoundHandler);

app.use(ErrorHandler);

app.listen(3000, () => {
    console.log("start");
});
