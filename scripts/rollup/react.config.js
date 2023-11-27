import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";
// 获取package信息
const reactJSON = getPackageJSON("react");
// 入口路径
const inputPath = resolvePkgPath("react");
// 打包路径
const outputPath = resolvePkgPath("react", true);

export default [
    {
        input: `${inputPath}/${reactJSON.module}`,
        output: {
            file: `${outputPath}/index.js`,
            name: "index.js",
            format: "umd"
        },
        plugins: [...getBaseRollupPlugins(), generatePackageJson({
            inputFolder: inputPath,
            outputFolder: outputPath,
            baseContents: ({name, description, version}) => {
                return {
                    name,
                    description,
                    version,
                    main: "index.js"
                };
            }
        })]
    },
    {
        input: `${inputPath}/src/jsx.ts`,
        output: [
            {
                file: `${outputPath}/jsx-runtime.js`,
                name: "jsx-runtime.js",
                format: "umd"
            },
            {
                file: `${outputPath}/jsx-dev-runtime.js`,
                name: "jsx-dev-runtime.js",
                format: "umd"
            }
        ],
        plugins: getBaseRollupPlugins()
    }
];