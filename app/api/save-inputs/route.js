import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

export async function POST(req, res) {
  try {
    await connectMongo();
    const { name, email } = await req.json();

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const newLead = new Lead({ name, email });
    await newLead.save();

    return res.status(200).json({ message: "Inputs saved successfully" });
  } catch (error) {
    console.error("Error saving inputs:", error);
    return res.status(500).json({ message: "Failed to save inputs" });
  }
}