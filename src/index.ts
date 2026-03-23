import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes";
import authRoutes from "./routes/authRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "UniNotes backend is running" });
});

app.use("/notes", noteRoutes);
app.use("/auth", authRoutes);
app.use("/favorites", favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});