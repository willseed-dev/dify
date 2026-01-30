"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_react_1 = require("@vitejs/plugin-react");
const vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)(), (0, plugin_react_1.default)()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'json-summary'],
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZXN0LmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpdGVzdC5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBd0M7QUFDeEMsNkRBQStDO0FBQy9DLDBDQUE0QztBQUU1QyxrQkFBZSxJQUFBLHFCQUFZLEVBQUM7SUFDMUIsT0FBTyxFQUFFLENBQUMsSUFBQSw2QkFBYSxHQUFFLEVBQUUsSUFBQSxzQkFBSyxHQUFTLENBQUM7SUFDMUMsSUFBSSxFQUFFO1FBQ0osV0FBVyxFQUFFLE9BQU87UUFDcEIsT0FBTyxFQUFFLElBQUk7UUFDYixVQUFVLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztRQUNqQyxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDO1NBQzNDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3RzY29uZmlnUGF0aHMoKSwgcmVhY3QoKSBhcyBhbnldLFxuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBzZXR1cEZpbGVzOiBbJy4vdml0ZXN0LnNldHVwLnRzJ10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2pzb24tc3VtbWFyeSddLFxuICAgIH0sXG4gIH0sXG59KVxuIl19