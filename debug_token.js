import { config } from 'dotenv';
config();

const token = process.env.DISCORD_TOKEN;

console.log("--- Token Debugger ---");
if (!token) {
    console.log("❌ ERROR: No DISCORD_TOKEN found in process.env");
} else {
    console.log(`✅ Token loaded.`);
    console.log(`Length: ${token.length}`);
    console.log(`Preview: ${token.substring(0, 5)}...${token.substring(token.length - 5)}`);

    let hasIssues = false;
    if (token.includes(" ")) {
        console.log("❌ WARNING: Token contains spaces!");
        hasIssues = true;
    }
    if (token.includes("\r") || token.includes("\n")) {
        console.log("❌ WARNING: Token contains newlines!");
        hasIssues = true;
    }
    if (token.includes('"') || token.includes("'")) {
        console.log("❌ WARNING: Token contains quotes!");
        hasIssues = true;
    }

    if (token.split('.').length !== 3) {
        console.log("❌ ERROR: Token format looks wrong. It should have 3 parts separated by dots (e.g. xxxxx.yyyyy.zzzzz).");
        console.log("   -> Did you copy the 'Client Secret' or 'Public Key' by mistake?");
        console.log("   -> You must click 'Reset Token' in the 'Bot' tab of the Developer Portal.");
        hasIssues = true;
    }

    if (!hasIssues) {
        console.log("✅ Format looks correct.");
    }
}
console.log("----------------------");
