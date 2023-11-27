import path from "path";
import fs from "fs";
import ts from "rollup-plugin-typescript2";
import cmj from "@rollup/plugin-commonjs";

const pkgPath = path.resolve(__dirname, "../../packages");
const distPath = path.resolve(__dirname, "../../dist/node_modules");

export function resolvePkgPath(pkgName, isDist) {
    if(isDist) {
        return `${distPath}/${pkgName}`;
    }
    return `${pkgPath}/${pkgName}`;
}

export function getPackageJSON(pkgName) {
    const path = resolvePkgPath(pkgName) + "/package.json";
    const string = fs.readFileSync(path, {encoding: "utf-8"});
    return JSON.parse(string);
}

export function getBaseRollupPlugins(typescript = {}) {
    return [
        cmj(),
        ts(typescript)
    ];
}