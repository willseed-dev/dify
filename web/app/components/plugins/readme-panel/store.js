"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReadmePanelStore = exports.ReadmeShowType = void 0;
const zustand_1 = require("zustand");
var ReadmeShowType;
(function (ReadmeShowType) {
    ReadmeShowType["drawer"] = "drawer";
    ReadmeShowType["modal"] = "modal";
})(ReadmeShowType || (exports.ReadmeShowType = ReadmeShowType = {}));
exports.useReadmePanelStore = (0, zustand_1.create)(set => ({
    currentPluginDetail: undefined,
    setCurrentPluginDetail: (detail, showType) => set({
        currentPluginDetail: !detail
            ? undefined
            : {
                detail,
                showType: showType ?? ReadmeShowType.drawer,
            },
    }),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBZ0M7QUFFaEMsSUFBWSxjQUdYO0FBSEQsV0FBWSxjQUFjO0lBQ3hCLG1DQUFpQixDQUFBO0lBQ2pCLGlDQUFlLENBQUE7QUFDakIsQ0FBQyxFQUhXLGNBQWMsOEJBQWQsY0FBYyxRQUd6QjtBQVVZLFFBQUEsbUJBQW1CLEdBQUcsSUFBQSxnQkFBTSxFQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RCxtQkFBbUIsRUFBRSxTQUFTO0lBQzlCLHNCQUFzQixFQUFFLENBQUMsTUFBcUIsRUFBRSxRQUF5QixFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDaEYsbUJBQW1CLEVBQUUsQ0FBQyxNQUFNO1lBQzFCLENBQUMsQ0FBQyxTQUFTO1lBQ1gsQ0FBQyxDQUFDO2dCQUNFLE1BQU07Z0JBQ04sUUFBUSxFQUFFLFFBQVEsSUFBSSxjQUFjLENBQUMsTUFBTTthQUM1QztLQUNOLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luRGV0YWlsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgY3JlYXRlIH0gZnJvbSAnenVzdGFuZCdcblxuZXhwb3J0IGVudW0gUmVhZG1lU2hvd1R5cGUge1xuICBkcmF3ZXIgPSAnZHJhd2VyJyxcbiAgbW9kYWwgPSAnbW9kYWwnLFxufVxuXG50eXBlIFNoYXBlID0ge1xuICBjdXJyZW50UGx1Z2luRGV0YWlsPzoge1xuICAgIGRldGFpbDogUGx1Z2luRGV0YWlsXG4gICAgc2hvd1R5cGU6IFJlYWRtZVNob3dUeXBlXG4gIH1cbiAgc2V0Q3VycmVudFBsdWdpbkRldGFpbDogKGRldGFpbD86IFBsdWdpbkRldGFpbCwgc2hvd1R5cGU/OiBSZWFkbWVTaG93VHlwZSkgPT4gdm9pZFxufVxuXG5leHBvcnQgY29uc3QgdXNlUmVhZG1lUGFuZWxTdG9yZSA9IGNyZWF0ZTxTaGFwZT4oc2V0ID0+ICh7XG4gIGN1cnJlbnRQbHVnaW5EZXRhaWw6IHVuZGVmaW5lZCxcbiAgc2V0Q3VycmVudFBsdWdpbkRldGFpbDogKGRldGFpbD86IFBsdWdpbkRldGFpbCwgc2hvd1R5cGU/OiBSZWFkbWVTaG93VHlwZSkgPT4gc2V0KHtcbiAgICBjdXJyZW50UGx1Z2luRGV0YWlsOiAhZGV0YWlsXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiB7XG4gICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgIHNob3dUeXBlOiBzaG93VHlwZSA/PyBSZWFkbWVTaG93VHlwZS5kcmF3ZXIsXG4gICAgICAgIH0sXG4gIH0pLFxufSkpXG4iXX0=