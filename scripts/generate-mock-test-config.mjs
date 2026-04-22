import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const email = (process.env.MOCK_TEST_ADMIN_EMAIL || "").trim().toLowerCase();
const password = (process.env.MOCK_TEST_ADMIN_PASSWORD || "").trim();

const configPath = resolve(process.cwd(), "public", "mock-test.runtime-config.js");
mkdirSync(dirname(configPath), { recursive: true });

const configContent = `window.PR_MOCK_TEST_CONFIG = ${JSON.stringify({
  adminEmail: email,
  adminPassword: password,
}, null, 2)};\n`;

writeFileSync(configPath, configContent, "utf8");
console.log(`[mock-test-config] Generated ${configPath}`);
console.log(`[mock-test-config] adminEmail configured: ${email ? "yes" : "no"}`);
console.log(`[mock-test-config] adminPassword configured: ${password ? "yes" : "no"}`);
