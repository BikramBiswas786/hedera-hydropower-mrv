require("dotenv").config();
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const root = path.join(__dirname, "..");
function useProfile(profileName) {
  const src = path.join(root, "config", profileName);
  const dst = path.join(root, "config", "project-profile.json");
  fs.copyFileSync(src, dst);
  console.log(`Using profile: ${profileName}`);
}
async function main() {
  console.log("=== Transparent Classic Demo ===");
  useProfile("profile-device-direct.json");
  execSync("node scripts/demo-extreme-cost-saver.js", {
    stdio: "inherit",
    cwd: root
  });
}
main().catch(console.error);
