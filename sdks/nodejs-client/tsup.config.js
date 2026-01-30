"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    outDir: "dist",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHN1cC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0c3VwLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFvQztBQUVwQyxrQkFBZSxJQUFBLG1CQUFZLEVBQUM7SUFDMUIsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ3ZCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNmLEdBQUcsRUFBRSxJQUFJO0lBQ1QsS0FBSyxFQUFFLElBQUk7SUFDWCxTQUFTLEVBQUUsSUFBSTtJQUNmLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsTUFBTSxFQUFFLE1BQU07Q0FDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidHN1cFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnRyeTogW1wic3JjL2luZGV4LnRzXCJdLFxuICBmb3JtYXQ6IFtcImVzbVwiXSxcbiAgZHRzOiB0cnVlLFxuICBjbGVhbjogdHJ1ZSxcbiAgc291cmNlbWFwOiB0cnVlLFxuICBzcGxpdHRpbmc6IGZhbHNlLFxuICB0cmVlc2hha2U6IHRydWUsXG4gIG91dERpcjogXCJkaXN0XCIsXG59KTtcbiJdfQ==