"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const config_1 = require("@/config");
const use_ps_info_1 = require("./use-ps-info");
const PartnerStack = () => {
    const { saveOrUpdate, bind } = (0, use_ps_info_1.default)();
    (0, react_1.useEffect)(() => {
        if (!config_1.IS_CLOUD_EDITION)
            return;
        // Save PartnerStack info in cookie first. Because if user hasn't logged in, redirecting to login page would cause lose the partnerStack info in URL.
        saveOrUpdate();
        // bind PartnerStack info after user logged in
        bind();
    }, []);
    return null;
};
exports.default = React.memo(PartnerStack);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaUNBQWlDO0FBQ2pDLHFDQUEyQztBQUMzQywrQ0FBcUM7QUFFckMsTUFBTSxZQUFZLEdBQU8sR0FBRyxFQUFFO0lBQzVCLE1BQU0sRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBQSxxQkFBUyxHQUFFLENBQUE7SUFDMUMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksQ0FBQyx5QkFBZ0I7WUFDbkIsT0FBTTtRQUNSLHFKQUFxSjtRQUNySixZQUFZLEVBQUUsQ0FBQTtRQUNkLDhDQUE4QztRQUM5QyxJQUFJLEVBQUUsQ0FBQTtJQUNSLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IElTX0NMT1VEX0VESVRJT04gfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB1c2VQU0luZm8gZnJvbSAnLi91c2UtcHMtaW5mbydcblxuY29uc3QgUGFydG5lclN0YWNrOiBGQyA9ICgpID0+IHtcbiAgY29uc3QgeyBzYXZlT3JVcGRhdGUsIGJpbmQgfSA9IHVzZVBTSW5mbygpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFJU19DTE9VRF9FRElUSU9OKVxuICAgICAgcmV0dXJuXG4gICAgLy8gU2F2ZSBQYXJ0bmVyU3RhY2sgaW5mbyBpbiBjb29raWUgZmlyc3QuIEJlY2F1c2UgaWYgdXNlciBoYXNuJ3QgbG9nZ2VkIGluLCByZWRpcmVjdGluZyB0byBsb2dpbiBwYWdlIHdvdWxkIGNhdXNlIGxvc2UgdGhlIHBhcnRuZXJTdGFjayBpbmZvIGluIFVSTC5cbiAgICBzYXZlT3JVcGRhdGUoKVxuICAgIC8vIGJpbmQgUGFydG5lclN0YWNrIGluZm8gYWZ0ZXIgdXNlciBsb2dnZWQgaW5cbiAgICBiaW5kKClcbiAgfSwgW10pXG5cbiAgcmV0dXJuIG51bGxcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oUGFydG5lclN0YWNrKVxuIl19