"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscriptionList = void 0;
const use_triggers_1 = require("@/service/use-triggers");
const store_1 = require("../store");
const useSubscriptionList = () => {
    const detail = (0, store_1.usePluginStore)(state => state.detail);
    const { data: subscriptions, isLoading, refetch } = (0, use_triggers_1.useTriggerSubscriptions)(detail?.provider || '');
    return {
        detail,
        subscriptions,
        isLoading,
        refetch,
    };
};
exports.useSubscriptionList = useSubscriptionList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXN1YnNjcmlwdGlvbi1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXN1YnNjcmlwdGlvbi1saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlEQUFnRTtBQUNoRSxvQ0FBeUM7QUFFbEMsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUU7SUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBYyxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRXBELE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLHNDQUF1QixFQUFDLE1BQU0sRUFBRSxRQUFRLElBQUksRUFBRSxDQUFDLENBQUE7SUFFbkcsT0FBTztRQUNMLE1BQU07UUFDTixhQUFhO1FBQ2IsU0FBUztRQUNULE9BQU87S0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBWFksUUFBQSxtQkFBbUIsdUJBVy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJpZ2dlclN1YnNjcmlwdGlvbnMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXRyaWdnZXJzJ1xuaW1wb3J0IHsgdXNlUGx1Z2luU3RvcmUgfSBmcm9tICcuLi9zdG9yZSdcblxuZXhwb3J0IGNvbnN0IHVzZVN1YnNjcmlwdGlvbkxpc3QgPSAoKSA9PiB7XG4gIGNvbnN0IGRldGFpbCA9IHVzZVBsdWdpblN0b3JlKHN0YXRlID0+IHN0YXRlLmRldGFpbClcblxuICBjb25zdCB7IGRhdGE6IHN1YnNjcmlwdGlvbnMsIGlzTG9hZGluZywgcmVmZXRjaCB9ID0gdXNlVHJpZ2dlclN1YnNjcmlwdGlvbnMoZGV0YWlsPy5wcm92aWRlciB8fCAnJylcblxuICByZXR1cm4ge1xuICAgIGRldGFpbCxcbiAgICBzdWJzY3JpcHRpb25zLFxuICAgIGlzTG9hZGluZyxcbiAgICByZWZldGNoLFxuICB9XG59XG4iXX0=