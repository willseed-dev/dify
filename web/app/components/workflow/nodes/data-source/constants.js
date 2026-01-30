"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCAL_FILE_OUTPUT = exports.COMMON_OUTPUT = void 0;
const types_1 = require("@/app/components/workflow/types");
exports.COMMON_OUTPUT = [
    {
        name: 'datasource_type',
        type: types_1.VarType.string,
        description: 'local_file, online_document, website_crawl',
    },
];
exports.LOCAL_FILE_OUTPUT = [
    {
        name: 'file',
        type: types_1.VarType.file,
        description: 'file',
        subItems: [
            {
                name: 'name',
                type: types_1.VarType.string,
                description: 'file name',
            },
            {
                name: 'size',
                type: types_1.VarType.number,
                description: 'file size',
            },
            {
                name: 'type',
                type: types_1.VarType.string,
                description: 'file type',
            },
            {
                name: 'extension',
                type: types_1.VarType.string,
                description: 'file extension',
            },
            {
                name: 'mime_type',
                type: types_1.VarType.string,
                description: 'file mime type',
            },
            {
                name: 'transfer_method',
                type: types_1.VarType.string,
                description: 'file transfer method',
            },
            {
                name: 'url',
                type: types_1.VarType.string,
                description: 'file url',
            },
            {
                name: 'related_id',
                type: types_1.VarType.string,
                description: 'file related id',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUF5RDtBQUU1QyxRQUFBLGFBQWEsR0FBRztJQUMzQjtRQUNFLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO1FBQ3BCLFdBQVcsRUFBRSw0Q0FBNEM7S0FDMUQ7Q0FDRixDQUFBO0FBRVksUUFBQSxpQkFBaUIsR0FBRztJQUMvQjtRQUNFLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGVBQU8sQ0FBQyxJQUFJO1FBQ2xCLFdBQVcsRUFBRSxNQUFNO1FBQ25CLFFBQVEsRUFBRTtZQUNSO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxlQUFPLENBQUMsTUFBTTtnQkFDcEIsV0FBVyxFQUFFLFdBQVc7YUFDekI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsZUFBTyxDQUFDLE1BQU07Z0JBQ3BCLFdBQVcsRUFBRSxXQUFXO2FBQ3pCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO2dCQUNwQixXQUFXLEVBQUUsV0FBVzthQUN6QjtZQUNEO2dCQUNFLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsZUFBTyxDQUFDLE1BQU07Z0JBQ3BCLFdBQVcsRUFBRSxnQkFBZ0I7YUFDOUI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO2dCQUNwQixXQUFXLEVBQUUsZ0JBQWdCO2FBQzlCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGlCQUFpQjtnQkFDdkIsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO2dCQUNwQixXQUFXLEVBQUUsc0JBQXNCO2FBQ3BDO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO2dCQUNwQixXQUFXLEVBQUUsVUFBVTthQUN4QjtZQUNEO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsZUFBTyxDQUFDLE1BQU07Z0JBQ3BCLFdBQVcsRUFBRSxpQkFBaUI7YUFDL0I7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgQ09NTU9OX09VVFBVVCA9IFtcbiAge1xuICAgIG5hbWU6ICdkYXRhc291cmNlX3R5cGUnLFxuICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uOiAnbG9jYWxfZmlsZSwgb25saW5lX2RvY3VtZW50LCB3ZWJzaXRlX2NyYXdsJyxcbiAgfSxcbl1cblxuZXhwb3J0IGNvbnN0IExPQ0FMX0ZJTEVfT1VUUFVUID0gW1xuICB7XG4gICAgbmFtZTogJ2ZpbGUnLFxuICAgIHR5cGU6IFZhclR5cGUuZmlsZSxcbiAgICBkZXNjcmlwdGlvbjogJ2ZpbGUnLFxuICAgIHN1Ykl0ZW1zOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBuYW1lJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzaXplJyxcbiAgICAgICAgdHlwZTogVmFyVHlwZS5udW1iZXIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBzaXplJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSB0eXBlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdleHRlbnNpb24nLFxuICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIGV4dGVuc2lvbicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWltZV90eXBlJyxcbiAgICAgICAgdHlwZTogVmFyVHlwZS5zdHJpbmcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBtaW1lIHR5cGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3RyYW5zZmVyX21ldGhvZCcsXG4gICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgdHJhbnNmZXIgbWV0aG9kJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd1cmwnLFxuICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIHVybCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncmVsYXRlZF9pZCcsXG4gICAgICAgIHR5cGU6IFZhclR5cGUuc3RyaW5nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgcmVsYXRlZCBpZCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5dXG4iXX0=