"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.ContactMethods = void 0;
const zod_1 = require("zod");
const ContactMethod = zod_1.z.union([
    zod_1.z.literal('email'),
    zod_1.z.literal('phone'),
    zod_1.z.literal('whatsapp'),
    zod_1.z.literal('sms'),
]);
exports.ContactMethods = ContactMethod.options.map(({ value }) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
}));
exports.UserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .regex(/^[A-Z]/, 'Name must start with a capital letter')
        .min(3, 'Name must be at least 3 characters long'),
    surname: zod_1.z
        .string()
        .min(3, 'Surname must be at least 3 characters long')
        .regex(/^[A-Z]/, 'Surname must start with a capital letter'),
    isAcceptingTerms: zod_1.z.boolean().refine(val => val, {
        message: 'You must accept the terms and conditions',
    }),
    contact: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().optional(),
        preferredContactMethod: ContactMethod,
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUI7QUFFdkIsTUFBTSxhQUFhLEdBQUcsT0FBQyxDQUFDLEtBQUssQ0FBQztJQUM1QixPQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixPQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixPQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUNyQixPQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztDQUNqQixDQUFDLENBQUE7QUFFVyxRQUFBLGNBQWMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEUsS0FBSztJQUNMLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0NBQ3RELENBQUMsQ0FBQyxDQUFBO0FBRVUsUUFBQSxVQUFVLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxJQUFJLEVBQUUsT0FBQztTQUNKLE1BQU0sRUFBRTtTQUNSLEtBQUssQ0FBQyxRQUFRLEVBQUUsdUNBQXVDLENBQUM7U0FDeEQsR0FBRyxDQUFDLENBQUMsRUFBRSx5Q0FBeUMsQ0FBQztJQUNwRCxPQUFPLEVBQUUsT0FBQztTQUNQLE1BQU0sRUFBRTtTQUNSLEdBQUcsQ0FBQyxDQUFDLEVBQUUsNENBQTRDLENBQUM7U0FDcEQsS0FBSyxDQUFDLFFBQVEsRUFBRSwwQ0FBMEMsQ0FBQztJQUM5RCxnQkFBZ0IsRUFBRSxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO1FBQy9DLE9BQU8sRUFBRSwwQ0FBMEM7S0FDcEQsQ0FBQztJQUNGLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2hCLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDO1FBQ2hELEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzVCLHNCQUFzQixFQUFFLGFBQWE7S0FDdEMsQ0FBQztDQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHogfSBmcm9tICd6b2QnXG5cbmNvbnN0IENvbnRhY3RNZXRob2QgPSB6LnVuaW9uKFtcbiAgei5saXRlcmFsKCdlbWFpbCcpLFxuICB6LmxpdGVyYWwoJ3Bob25lJyksXG4gIHoubGl0ZXJhbCgnd2hhdHNhcHAnKSxcbiAgei5saXRlcmFsKCdzbXMnKSxcbl0pXG5cbmV4cG9ydCBjb25zdCBDb250YWN0TWV0aG9kcyA9IENvbnRhY3RNZXRob2Qub3B0aW9ucy5tYXAoKHsgdmFsdWUgfSkgPT4gKHtcbiAgdmFsdWUsXG4gIGxhYmVsOiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpLFxufSkpXG5cbmV4cG9ydCBjb25zdCBVc2VyU2NoZW1hID0gei5vYmplY3Qoe1xuICBuYW1lOiB6XG4gICAgLnN0cmluZygpXG4gICAgLnJlZ2V4KC9eW0EtWl0vLCAnTmFtZSBtdXN0IHN0YXJ0IHdpdGggYSBjYXBpdGFsIGxldHRlcicpXG4gICAgLm1pbigzLCAnTmFtZSBtdXN0IGJlIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBsb25nJyksXG4gIHN1cm5hbWU6IHpcbiAgICAuc3RyaW5nKClcbiAgICAubWluKDMsICdTdXJuYW1lIG11c3QgYmUgYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIGxvbmcnKVxuICAgIC5yZWdleCgvXltBLVpdLywgJ1N1cm5hbWUgbXVzdCBzdGFydCB3aXRoIGEgY2FwaXRhbCBsZXR0ZXInKSxcbiAgaXNBY2NlcHRpbmdUZXJtczogei5ib29sZWFuKCkucmVmaW5lKHZhbCA9PiB2YWwsIHtcbiAgICBtZXNzYWdlOiAnWW91IG11c3QgYWNjZXB0IHRoZSB0ZXJtcyBhbmQgY29uZGl0aW9ucycsXG4gIH0pLFxuICBjb250YWN0OiB6Lm9iamVjdCh7XG4gICAgZW1haWw6IHouc3RyaW5nKCkuZW1haWwoJ0ludmFsaWQgZW1haWwgYWRkcmVzcycpLFxuICAgIHBob25lOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgcHJlZmVycmVkQ29udGFjdE1ldGhvZDogQ29udGFjdE1ldGhvZCxcbiAgfSksXG59KVxuXG5leHBvcnQgdHlwZSBVc2VyID0gei5pbmZlcjx0eXBlb2YgVXNlclNjaGVtYT5cbiJdfQ==