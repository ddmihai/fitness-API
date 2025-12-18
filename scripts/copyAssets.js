const { cpSync, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const assets = [
    {
        from: path.join(root, "src/app/views"),
        to: path.join(root, "dist/app/views"),
    },
    {
        from: path.join(root, "src/app/public"),
        to: path.join(root, "dist/app/public"),
    },
    {
        from: path.join(root, "../client/dist"),
        to: path.join(root, "dist/app/public/app"),
    },
];

for (const asset of assets) {
    if (!existsSync(asset.from)) {
        continue;
    }

    mkdirSync(path.dirname(asset.to), { recursive: true });
    cpSync(asset.from, asset.to, { recursive: true });
    console.log(`Copied ${asset.from} -> ${asset.to}`);
}
