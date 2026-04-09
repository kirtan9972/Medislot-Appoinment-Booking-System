import app from "./app";
import connectDB from "./config/db";

console.log("Starting server...");

const PORT = Number(process.env.PORT) || 5001;

console.log("Connecting to DB...");
connectDB()
  .then(() => {
    console.log("Starting app listen...");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup aborted due to DB connection failure", error);
    process.exit(1);
  });