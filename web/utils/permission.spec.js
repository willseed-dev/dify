"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datasets_1 = require("@/models/datasets");
/**
 * Test suite for permission utility functions
 * Tests dataset edit permission logic based on user roles and dataset settings
 */
const permission_1 = require("./permission");
describe('permission', () => {
    /**
     * Tests hasEditPermissionForDataset which checks if a user can edit a dataset
     * Based on three permission levels:
     * - onlyMe: Only the creator can edit
     * - allTeamMembers: All team members can edit
     * - partialMembers: Only specified members can edit
     */
    describe('hasEditPermissionForDataset', () => {
        const userId = 'user-123';
        const creatorId = 'creator-456';
        const otherUserId = 'user-789';
        it('returns true when permission is onlyMe and user is creator', () => {
            const config = {
                createdBy: userId,
                partialMemberList: [],
                permission: datasets_1.DatasetPermission.onlyMe,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(true);
        });
        it('returns false when permission is onlyMe and user is not creator', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [],
                permission: datasets_1.DatasetPermission.onlyMe,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(false);
        });
        it('returns true when permission is allTeamMembers for any user', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [],
                permission: datasets_1.DatasetPermission.allTeamMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(true);
            expect((0, permission_1.hasEditPermissionForDataset)(otherUserId, config)).toBe(true);
            expect((0, permission_1.hasEditPermissionForDataset)(creatorId, config)).toBe(true);
        });
        it('returns true when permission is partialMembers and user is in list', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [userId, otherUserId],
                permission: datasets_1.DatasetPermission.partialMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(true);
        });
        it('returns false when permission is partialMembers and user is not in list', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [otherUserId],
                permission: datasets_1.DatasetPermission.partialMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(false);
        });
        it('returns false when permission is partialMembers with empty list', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [],
                permission: datasets_1.DatasetPermission.partialMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(userId, config)).toBe(false);
        });
        it('creator is not automatically granted access with partialMembers permission', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [userId],
                permission: datasets_1.DatasetPermission.partialMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(creatorId, config)).toBe(false);
        });
        it('creator has access when included in partialMemberList', () => {
            const config = {
                createdBy: creatorId,
                partialMemberList: [creatorId, userId],
                permission: datasets_1.DatasetPermission.partialMembers,
            };
            expect((0, permission_1.hasEditPermissionForDataset)(creatorId, config)).toBe(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGVybWlzc2lvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQXFEO0FBQ3JEOzs7R0FHRztBQUNILDZDQUEwRDtBQUUxRCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQjs7Ozs7O09BTUc7SUFDSCxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQTtRQUN6QixNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUE7UUFDL0IsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFBO1FBRTlCLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7WUFDcEUsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3JCLFVBQVUsRUFBRSw0QkFBaUIsQ0FBQyxNQUFNO2FBQ3JDLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBQSx3Q0FBMkIsRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1lBQ3pFLE1BQU0sTUFBTSxHQUFHO2dCQUNiLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixpQkFBaUIsRUFBRSxFQUFFO2dCQUNyQixVQUFVLEVBQUUsNEJBQWlCLENBQUMsTUFBTTthQUNyQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUEsd0NBQTJCLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxNQUFNLE1BQU0s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c3Npb24gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbi8qKlxuICogVGVzdCBzdWl0ZSBmb3IgcGVybWlzc2lvbiB1dGlsaXR5IGZ1bmN0aW9uc1xuICogVGVzdHMgZGF0YXNldCBlZGl0IHBlcm1pc3Npb24gbG9naWMgYmFzZWQgb24gdXNlciByb2xlcyBhbmQgZGF0YXNldCBzZXR0aW5nc1xuICovXG5pbXBvcnQgeyBoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQgfSBmcm9tICcuL3Blcm1pc3Npb24nXG5cbmRlc2NyaWJlKCdwZXJtaXNzaW9uJywgKCkgPT4ge1xuICAvKipcbiAgICogVGVzdHMgaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0IHdoaWNoIGNoZWNrcyBpZiBhIHVzZXIgY2FuIGVkaXQgYSBkYXRhc2V0XG4gICAqIEJhc2VkIG9uIHRocmVlIHBlcm1pc3Npb24gbGV2ZWxzOlxuICAgKiAtIG9ubHlNZTogT25seSB0aGUgY3JlYXRvciBjYW4gZWRpdFxuICAgKiAtIGFsbFRlYW1NZW1iZXJzOiBBbGwgdGVhbSBtZW1iZXJzIGNhbiBlZGl0XG4gICAqIC0gcGFydGlhbE1lbWJlcnM6IE9ubHkgc3BlY2lmaWVkIG1lbWJlcnMgY2FuIGVkaXRcbiAgICovXG4gIGRlc2NyaWJlKCdoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgdXNlcklkID0gJ3VzZXItMTIzJ1xuICAgIGNvbnN0IGNyZWF0b3JJZCA9ICdjcmVhdG9yLTQ1NidcbiAgICBjb25zdCBvdGhlclVzZXJJZCA9ICd1c2VyLTc4OSdcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBwZXJtaXNzaW9uIGlzIG9ubHlNZSBhbmQgdXNlciBpcyBjcmVhdG9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGVkQnk6IHVzZXJJZCxcbiAgICAgICAgcGFydGlhbE1lbWJlckxpc3Q6IFtdLFxuICAgICAgICBwZXJtaXNzaW9uOiBEYXRhc2V0UGVybWlzc2lvbi5vbmx5TWUsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJJZCwgY29uZmlnKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIHBlcm1pc3Npb24gaXMgb25seU1lIGFuZCB1c2VyIGlzIG5vdCBjcmVhdG9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGVkQnk6IGNyZWF0b3JJZCxcbiAgICAgICAgcGFydGlhbE1lbWJlckxpc3Q6IFtdLFxuICAgICAgICBwZXJtaXNzaW9uOiBEYXRhc2V0UGVybWlzc2lvbi5vbmx5TWUsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJJZCwgY29uZmlnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIHBlcm1pc3Npb24gaXMgYWxsVGVhbU1lbWJlcnMgZm9yIGFueSB1c2VyJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGVkQnk6IGNyZWF0b3JJZCxcbiAgICAgICAgcGFydGlhbE1lbWJlckxpc3Q6IFtdLFxuICAgICAgICBwZXJtaXNzaW9uOiBEYXRhc2V0UGVybWlzc2lvbi5hbGxUZWFtTWVtYmVycyxcbiAgICAgIH1cbiAgICAgIGV4cGVjdChoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQodXNlcklkLCBjb25maWcpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KG90aGVyVXNlcklkLCBjb25maWcpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KGNyZWF0b3JJZCwgY29uZmlnKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0cnVlIHdoZW4gcGVybWlzc2lvbiBpcyBwYXJ0aWFsTWVtYmVycyBhbmQgdXNlciBpcyBpbiBsaXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGVkQnk6IGNyZWF0b3JJZCxcbiAgICAgICAgcGFydGlhbE1lbWJlckxpc3Q6IFt1c2VySWQsIG90aGVyVXNlcklkXSxcbiAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJJZCwgY29uZmlnKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIHBlcm1pc3Npb24gaXMgcGFydGlhbE1lbWJlcnMgYW5kIHVzZXIgaXMgbm90IGluIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIGNyZWF0ZWRCeTogY3JlYXRvcklkLFxuICAgICAgICBwYXJ0aWFsTWVtYmVyTGlzdDogW290aGVyVXNlcklkXSxcbiAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJJZCwgY29uZmlnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiBwZXJtaXNzaW9uIGlzIHBhcnRpYWxNZW1iZXJzIHdpdGggZW1wdHkgbGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgY3JlYXRlZEJ5OiBjcmVhdG9ySWQsXG4gICAgICAgIHBhcnRpYWxNZW1iZXJMaXN0OiBbXSxcbiAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJJZCwgY29uZmlnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ2NyZWF0b3IgaXMgbm90IGF1dG9tYXRpY2FsbHkgZ3JhbnRlZCBhY2Nlc3Mgd2l0aCBwYXJ0aWFsTWVtYmVycyBwZXJtaXNzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGVkQnk6IGNyZWF0b3JJZCxcbiAgICAgICAgcGFydGlhbE1lbWJlckxpc3Q6IFt1c2VySWRdLFxuICAgICAgICBwZXJtaXNzaW9uOiBEYXRhc2V0UGVybWlzc2lvbi5wYXJ0aWFsTWVtYmVycyxcbiAgICAgIH1cbiAgICAgIGV4cGVjdChoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQoY3JlYXRvcklkLCBjb25maWcpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnY3JlYXRvciBoYXMgYWNjZXNzIHdoZW4gaW5jbHVkZWQgaW4gcGFydGlhbE1lbWJlckxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIGNyZWF0ZWRCeTogY3JlYXRvcklkLFxuICAgICAgICBwYXJ0aWFsTWVtYmVyTGlzdDogW2NyZWF0b3JJZCwgdXNlcklkXSxcbiAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICB9XG4gICAgICBleHBlY3QoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KGNyZWF0b3JJZCwgY29uZmlnKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19