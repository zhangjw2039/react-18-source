import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";
// 获取package信息
const reactJSON = getPackageJSON("react-dom");
// 入口路径
const inputPath = resolvePkgPath("react-dom");
// 打包路径
const outputPath = resolvePkgPath("react-dom", true);

export default [
    { 
        input: `${inputPath}/${reactJSON.module}`,
        output: [
            {
                file: `${outputPath}/index.js`,
                name: "index.js",
                // format: "umd"
                format: "es"
            },
            {
                file: `${outputPath}/client.js`,
                name: "client.js",
                // format: "umd"
                format: "es"
            }
        ],
        plugins: [
            ...getBaseRollupPlugins(), 
            alias({
                entries: {
                    hostConfig: `${inputPath}/src/hostConfig.ts`
                }
            }),
            generatePackageJson({
                inputFolder: inputPath,
                outputFolder: outputPath,
                baseContents: ({name, description, version}) => {
                    return {
                        name,
                        description,
                        version,
                        peerDependencies: {
                            react: version
                        },
                        main: "index.js"
                    };
                }
            })
        ]
    }
];