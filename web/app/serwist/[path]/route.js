"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.generateStaticParams = exports.revalidate = exports.dynamicParams = exports.dynamic = void 0;
const node_child_process_1 = require("node:child_process");
const node_crypto_1 = require("node:crypto");
const turbopack_1 = require("@serwist/turbopack");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const revision = (0, node_child_process_1.spawnSync)('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() || (0, node_crypto_1.randomUUID)();
_a = (0, turbopack_1.createSerwistRoute)({
    additionalPrecacheEntries: [{ url: `${basePath}/_offline.html`, revision }],
    swSrc: 'app/sw.ts',
    nextConfig: {
        basePath,
    },
}), exports.dynamic = _a.dynamic, exports.dynamicParams = _a.dynamicParams, exports.revalidate = _a.revalidate, exports.generateStaticParams = _a.generateStaticParams, exports.GET = _a.GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsMkRBQThDO0FBQzlDLDZDQUF3QztBQUN4QyxrREFBdUQ7QUFFdkQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLENBQUE7QUFDeEQsTUFBTSxRQUFRLEdBQUcsSUFBQSw4QkFBUyxFQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFBLHdCQUFVLEdBQUUsQ0FBQTtBQUVqRyxLQUFvRSxJQUFBLDhCQUFrQixFQUFDO0lBQ2xHLHlCQUF5QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQzNFLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFVBQVUsRUFBRTtRQUNWLFFBQVE7S0FDVDtDQUNGLENBQUMsRUFOYSxlQUFPLGVBQUUscUJBQWEscUJBQUUsa0JBQVUsa0JBQUUsNEJBQW9CLDRCQUFFLFdBQUcsVUFNMUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyByYW5kb21VVUlEIH0gZnJvbSAnbm9kZTpjcnlwdG8nXG5pbXBvcnQgeyBjcmVhdGVTZXJ3aXN0Um91dGUgfSBmcm9tICdAc2Vyd2lzdC90dXJib3BhY2snXG5cbmNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9QQVRIIHx8ICcnXG5jb25zdCByZXZpc2lvbiA9IHNwYXduU3luYygnZ2l0JywgWydyZXYtcGFyc2UnLCAnSEVBRCddLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnN0ZG91dD8udHJpbSgpIHx8IHJhbmRvbVVVSUQoKVxuXG5leHBvcnQgY29uc3QgeyBkeW5hbWljLCBkeW5hbWljUGFyYW1zLCByZXZhbGlkYXRlLCBnZW5lcmF0ZVN0YXRpY1BhcmFtcywgR0VUIH0gPSBjcmVhdGVTZXJ3aXN0Um91dGUoe1xuICBhZGRpdGlvbmFsUHJlY2FjaGVFbnRyaWVzOiBbeyB1cmw6IGAke2Jhc2VQYXRofS9fb2ZmbGluZS5odG1sYCwgcmV2aXNpb24gfV0sXG4gIHN3U3JjOiAnYXBwL3N3LnRzJyxcbiAgbmV4dENvbmZpZzoge1xuICAgIGJhc2VQYXRoLFxuICB9LFxufSlcbiJdfQ==