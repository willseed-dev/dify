"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: "node",
        include: ["**/*.test.js"],
        coverage: {
            provider: "v8",
            reporter: ["text", "text-summary"],
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.*", "src/**/*.spec.*"],
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZXN0LmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpdGVzdC5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBNkM7QUFFN0Msa0JBQWUsSUFBQSxxQkFBWSxFQUFDO0lBQzFCLElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxNQUFNO1FBQ25CLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztRQUN6QixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUM7WUFDbEMsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1NBQ2hEO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6IFwibm9kZVwiLFxuICAgIGluY2x1ZGU6IFtcIioqLyoudGVzdC5qc1wiXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6IFwidjhcIixcbiAgICAgIHJlcG9ydGVyOiBbXCJ0ZXh0XCIsIFwidGV4dC1zdW1tYXJ5XCJdLFxuICAgICAgaW5jbHVkZTogW1wic3JjLyoqLyoudHNcIl0sXG4gICAgICBleGNsdWRlOiBbXCJzcmMvKiovKi50ZXN0LipcIiwgXCJzcmMvKiovKi5zcGVjLipcIl0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl19