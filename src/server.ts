import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import kpiRoutes from "./routes/kpiRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/";
const dbName = "kpi_db";

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
async function startServer() {
    try {
        const client = new MongoClient(mongoURI);
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);

        // KPI Routes
        app.use("/kpi", kpiRoutes(db));

        // Dashboard route
        app.get("/dashboard", async (req, res) => {
            try {
                const data = await db.collection("kpis").find({}).toArray();
                res.json(data);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch dashboard data" });
            }
        });

        // Start Server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();

