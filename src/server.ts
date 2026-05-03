import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
