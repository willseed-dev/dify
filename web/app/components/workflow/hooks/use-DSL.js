"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDSL = void 0;
const hooks_store_1 = require("@/app/components/workflow/hooks-store");
const useDSL = () => {
    const exportCheck = (0, hooks_store_1.useHooksStore)(s => s.exportCheck);
    const handleExportDSL = (0, hooks_store_1.useHooksStore)(s => s.handleExportDSL);
    return {
        exportCheck,
        handleExportDSL,
    };
};
exports.useDSL = useDSL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLURTTC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1EU0wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUVBQXFFO0FBRTlELE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFBLDJCQUFhLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDckQsTUFBTSxlQUFlLEdBQUcsSUFBQSwyQkFBYSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBRTdELE9BQU87UUFDTCxXQUFXO1FBQ1gsZUFBZTtLQUNoQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBUlksUUFBQSxNQUFNLFVBUWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlSG9va3NTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3Mtc3RvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VEU0wgPSAoKSA9PiB7XG4gIGNvbnN0IGV4cG9ydENoZWNrID0gdXNlSG9va3NTdG9yZShzID0+IHMuZXhwb3J0Q2hlY2spXG4gIGNvbnN0IGhhbmRsZUV4cG9ydERTTCA9IHVzZUhvb2tzU3RvcmUocyA9PiBzLmhhbmRsZUV4cG9ydERTTClcblxuICByZXR1cm4ge1xuICAgIGV4cG9ydENoZWNrLFxuICAgIGhhbmRsZUV4cG9ydERTTCxcbiAgfVxufVxuIl19