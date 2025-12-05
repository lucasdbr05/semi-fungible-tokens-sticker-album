import fs from "fs";
import { ethers } from "hardhat";
import path from "path";

async function main() {
  const Swap = await ethers.getContractFactory("ERC1155SignedSwap");
  const swap = await Swap.deploy();

  await swap.waitForDeployment();
  const address = await swap.getAddress();
  console.log("✅ ERC1155Swap deployed at:", address);

  // 2️⃣ Load config.json (assuming it’s in project root)
  const configPath = path.join(__dirname, "../../contract-info.json");
  const configRaw = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configRaw);

  // 3️⃣ Update swap_adress (keep original spelling)
  config.swap_adress = address;

  // 4️⃣ Write back prettified JSON
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📝 Updated contract-info.json with new swap_adress:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
