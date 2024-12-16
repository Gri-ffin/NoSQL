import { Router } from "express";
import { Db, ObjectId } from "mongodb";
import { KPI } from "../models/kpiModel";

const router = Router();

export default function (db: Db) {
    const collection = db.collection("kpis");

    // Create KPI
    router.post("/create", async (req, res) => {
        try {
            const kpi: KPI = req.body;
            const result = await collection.insertOne(kpi);
            res.status(201).json({ message: "KPI created", id: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: "Failed to create KPI" });
        }
    });

    // Read all KPIs (Dashboard)
    router.get("/dashboard", async (_, res) => {
        try {
            const kpis = await collection.find({}).toArray();
            res.json(kpis);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch KPIs" });
        }
    });

    // Update KPI
    router.put("/update/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData: Partial<KPI> = req.body;
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "KPI not found" });
            }

            res.json({ message: "KPI updated successfully" });
        } catch (err) {
            res.status(500).json({ error: "Failed to update KPI" });
        }
    });

    // Delete KPI
    router.delete("/delete/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "KPI not found" });
            }

            res.json({ message: "KPI deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: "Failed to delete KPI" });
        }
    });

    return router;
}
