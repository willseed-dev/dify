"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const types_1 = require("@/app/components/workflow/types");
const parameter_type_utils_1 = require("../utils/parameter-type-utils");
const generic_table_1 = require("./generic-table");
const ParameterTable = ({ title, parameters, onChange, readonly, placeholder, contentType, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    // Memoize typeOptions to prevent unnecessary re-renders that cause SimpleSelect state resets
    const typeOptions = (0, react_1.useMemo)(() => (0, parameter_type_utils_1.createParameterTypeOptions)(contentType), [contentType]);
    // Define columns based on component type - matching prototype design
    const columns = [
        {
            key: 'key',
            title: t('nodes.triggerWebhook.varName', { ns: 'workflow' }),
            type: 'input',
            width: 'flex-1',
            placeholder: t('nodes.triggerWebhook.varNamePlaceholder', { ns: 'workflow' }),
        },
        {
            key: 'type',
            title: t('nodes.triggerWebhook.varType', { ns: 'workflow' }),
            type: 'select',
            width: 'w-[120px]',
            placeholder: t('nodes.triggerWebhook.varType', { ns: 'workflow' }),
            options: typeOptions,
        },
        {
            key: 'required',
            title: t('nodes.triggerWebhook.required', { ns: 'workflow' }),
            type: 'switch',
            width: 'w-[88px]',
        },
    ];
    // Choose sensible default type for new rows according to content type
    const defaultTypeValue = typeOptions[0]?.value || 'string';
    // Empty row template for new rows
    const emptyRowData = {
        key: '',
        type: defaultTypeValue,
        required: false,
    };
    const tableData = parameters.map(param => ({
        key: param.name,
        type: param.type,
        required: param.required,
    }));
    const handleDataChange = (data) => {
        // For text/plain, enforce single text body semantics: keep only first non-empty row and force string type
        // For application/octet-stream, enforce single file body semantics: keep only first non-empty row and force file type
        const isTextPlain = (contentType || '').toLowerCase() === 'text/plain';
        const isOctetStream = (contentType || '').toLowerCase() === 'application/octet-stream';
        const normalized = data
            .filter(row => typeof row.key === 'string' && row.key.trim() !== '')
            .map(row => ({
            name: String(row.key),
            type: isTextPlain ? types_1.VarType.string : isOctetStream ? types_1.VarType.file : (0, parameter_type_utils_1.normalizeParameterType)(row.type),
            required: Boolean(row.required),
        }));
        const newParams = (isTextPlain || isOctetStream)
            ? normalized.slice(0, 1)
            : normalized;
        onChange(newParams);
    };
    return (<generic_table_1.default title={title} columns={columns} data={tableData} onChange={handleDataChange} readonly={readonly} placeholder={placeholder || t('nodes.triggerWebhook.noParameters', { ns: 'workflow' })} emptyRowData={emptyRowData} showHeader={true}/>);
};
exports.default = ParameterTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyYW1ldGVyLXRhYmxlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUlaLCtCQUE4QjtBQUM5QixpQ0FBK0I7QUFDL0IsaURBQThDO0FBQzlDLDJEQUF5RDtBQUN6RCx3RUFBa0c7QUFDbEcsbURBQTBDO0FBVzFDLE1BQU0sY0FBYyxHQUE0QixDQUFDLEVBQy9DLEtBQUssRUFDTCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsV0FBVyxHQUNaLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5Qiw2RkFBNkY7SUFDN0YsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFLENBQy9CLElBQUEsaURBQTBCLEVBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBRXpELHFFQUFxRTtJQUNyRSxNQUFNLE9BQU8sR0FBbUI7UUFDOUI7WUFDRSxHQUFHLEVBQUUsS0FBSztZQUNWLEtBQUssRUFBRSxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7WUFDNUQsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUsUUFBUTtZQUNmLFdBQVcsRUFBRSxDQUFDLENBQUMseUNBQXlDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDOUU7UUFDRDtZQUNFLEdBQUcsRUFBRSxNQUFNO1lBQ1gsS0FBSyxFQUFFLENBQUMsQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUM1RCxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxXQUFXO1lBQ2xCLFdBQVcsRUFBRSxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFB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LCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgV2ViaG9va1BhcmFtZXRlciB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBDb2x1bW5Db25maWcsIEdlbmVyaWNUYWJsZVJvdyB9IGZyb20gJy4vZ2VuZXJpYy10YWJsZSdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgVmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBjcmVhdGVQYXJhbWV0ZXJUeXBlT3B0aW9ucywgbm9ybWFsaXplUGFyYW1ldGVyVHlwZSB9IGZyb20gJy4uL3V0aWxzL3BhcmFtZXRlci10eXBlLXV0aWxzJ1xuaW1wb3J0IEdlbmVyaWNUYWJsZSBmcm9tICcuL2dlbmVyaWMtdGFibGUnXG5cbnR5cGUgUGFyYW1ldGVyVGFibGVQcm9wcyA9IHtcbiAgdGl0bGU6IHN0cmluZ1xuICBwYXJhbWV0ZXJzOiBXZWJob29rUGFyYW1ldGVyW11cbiAgb25DaGFuZ2U6IChwYXJhbXM6IFdlYmhvb2tQYXJhbWV0ZXJbXSkgPT4gdm9pZFxuICByZWFkb25seT86IGJvb2xlYW5cbiAgcGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgY29udGVudFR5cGU/OiBzdHJpbmdcbn1cblxuY29uc3QgUGFyYW1ldGVyVGFibGU6IEZDPFBhcmFtZXRlclRhYmxlUHJvcHM+ID0gKHtcbiAgdGl0bGUsXG4gIHBhcmFtZXRlcnMsXG4gIG9uQ2hhbmdlLFxuICByZWFkb25seSxcbiAgcGxhY2Vob2xkZXIsXG4gIGNvbnRlbnRUeXBlLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICAvLyBNZW1vaXplIHR5cGVPcHRpb25zIHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmUtcmVuZGVycyB0aGF0IGNhdXNlIFNpbXBsZVNlbGVjdCBzdGF0ZSByZXNldHNcbiAgY29uc3QgdHlwZU9wdGlvbnMgPSB1c2VNZW1vKCgpID0+XG4gICAgY3JlYXRlUGFyYW1ldGVyVHlwZU9wdGlvbnMoY29udGVudFR5cGUpLCBbY29udGVudFR5cGVdKVxuXG4gIC8vIERlZmluZSBjb2x1bW5zIGJhc2VkIG9uIGNvbXBvbmVudCB0eXBlIC0gbWF0Y2hpbmcgcHJvdG90eXBlIGRlc2lnblxuICBjb25zdCBjb2x1bW5zOiBDb2x1bW5Db25maWdbXSA9IFtcbiAgICB7XG4gICAgICBrZXk6ICdrZXknLFxuICAgICAgdGl0bGU6IHQoJ25vZGVzLnRyaWdnZXJXZWJob29rLnZhck5hbWUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgIHdpZHRoOiAnZmxleC0xJyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCdub2Rlcy50cmlnZ2VyV2ViaG9vay52YXJOYW1lUGxhY2Vob2xkZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAga2V5OiAndHlwZScsXG4gICAgICB0aXRsZTogdCgnbm9kZXMudHJpZ2dlcldlYmhvb2sudmFyVHlwZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgIHdpZHRoOiAndy1bMTIwcHhdJyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCdub2Rlcy50cmlnZ2VyV2ViaG9vay52YXJUeXBlJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIG9wdGlvbnM6IHR5cGVPcHRpb25zLFxuICAgIH0sXG4gICAge1xuICAgICAga2V5OiAncmVxdWlyZWQnLFxuICAgICAgdGl0bGU6IHQoJ25vZGVzLnRyaWdnZXJXZWJob29rLnJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIHR5cGU6ICdzd2l0Y2gnLFxuICAgICAgd2lkdGg6ICd3LVs4OHB4XScsXG4gICAgfSxcbiAgXVxuXG4gIC8vIENob29zZSBzZW5zaWJsZSBkZWZhdWx0IHR5cGUgZm9yIG5ldyByb3dzIGFjY29yZGluZyB0byBjb250ZW50IHR5cGVcbiAgY29uc3QgZGVmYXVsdFR5cGVWYWx1ZTogVmFyVHlwZSA9IHR5cGVPcHRpb25zWzBdPy52YWx1ZSB8fCAnc3RyaW5nJ1xuXG4gIC8vIEVtcHR5IHJvdyB0ZW1wbGF0ZSBmb3IgbmV3IHJvd3NcbiAgY29uc3QgZW1wdHlSb3dEYXRhOiBHZW5lcmljVGFibGVSb3cgPSB7XG4gICAga2V5OiAnJyxcbiAgICB0eXBlOiBkZWZhdWx0VHlwZVZhbHVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgfVxuXG4gIGNvbnN0IHRhYmxlRGF0YTogR2VuZXJpY1RhYmxlUm93W10gPSBwYXJhbWV0ZXJzLm1hcChwYXJhbSA9PiAoe1xuICAgIGtleTogcGFyYW0ubmFtZSxcbiAgICB0eXBlOiBwYXJhbS50eXBlLFxuICAgIHJlcXVpcmVkOiBwYXJhbS5yZXF1aXJlZCxcbiAgfSkpXG5cbiAgY29uc3QgaGFuZGxlRGF0YUNoYW5nZSA9IChkYXRhOiBHZW5lcmljVGFibGVSb3dbXSkgPT4ge1xuICAgIC8vIEZvciB0ZXh0L3BsYWluLCBlbmZvcmNlIHNpbmdsZSB0ZXh0IGJvZHkgc2VtYW50aWNzOiBrZWVwIG9ubHkgZmlyc3Qgbm9uLWVtcHR5IHJvdyBhbmQgZm9yY2Ugc3RyaW5nIHR5cGVcbiAgICAvLyBGb3IgYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtLCBlbmZvcmNlIHNpbmdsZSBmaWxlIGJvZHkgc2VtYW50aWNzOiBrZWVwIG9ubHkgZmlyc3Qgbm9uLWVtcHR5IHJvdyBhbmQgZm9yY2UgZmlsZSB0eXBlXG4gICAgY29uc3QgaXNUZXh0UGxhaW4gPSAoY29udGVudFR5cGUgfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0L3BsYWluJ1xuICAgIGNvbnN0IGlzT2N0ZXRTdHJlYW0gPSAoY29udGVudFR5cGUgfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG5cbiAgICBjb25zdCBub3JtYWxpemVkID0gZGF0YVxuICAgICAgLmZpbHRlcihyb3cgPT4gdHlwZW9mIHJvdy5rZXkgPT09ICdzdHJpbmcnICYmIChyb3cua2V5IGFzIHN0cmluZykudHJpbSgpICE9PSAnJylcbiAgICAgIC5tYXAocm93ID0+ICh7XG4gICAgICAgIG5hbWU6IFN0cmluZyhyb3cua2V5KSxcbiAgICAgICAgdHlwZTogaXNUZXh0UGxhaW4gPyBWYXJUeXBlLnN0cmluZyA6IGlzT2N0ZXRTdHJlYW0gPyBWYXJUeXBlLmZpbGUgOiBub3JtYWxpemVQYXJhbWV0ZXJUeXBlKChyb3cudHlwZSBhcyBzdHJpbmcpKSxcbiAgICAgICAgcmVxdWlyZWQ6IEJvb2xlYW4ocm93LnJlcXVpcmVkKSxcbiAgICAgIH0pKVxuXG4gICAgY29uc3QgbmV3UGFyYW1zOiBXZWJob29rUGFyYW1ldGVyW10gPSAoaXNUZXh0UGxhaW4gfHwgaXNPY3RldFN0cmVhbSlcbiAgICAgID8gbm9ybWFsaXplZC5zbGljZSgwLCAxKVxuICAgICAgOiBub3JtYWxpemVkXG5cbiAgICBvbkNoYW5nZShuZXdQYXJhbXMpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxHZW5lcmljVGFibGVcbiAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG4gICAgICBkYXRhPXt0YWJsZURhdGF9XG4gICAgICBvbkNoYW5nZT17aGFuZGxlRGF0YUNoYW5nZX1cbiAgICAgIHJlYWRvbmx5PXtyZWFkb25seX1cbiAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlciB8fCB0KCdub2Rlcy50cmlnZ2VyV2ViaG9vay5ub1BhcmFtZXRlcnMnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgZW1wdHlSb3dEYXRhPXtlbXB0eVJvd0RhdGF9XG4gICAgICBzaG93SGVhZGVyPXt0cnVlfVxuICAgIC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFyYW1ldGVyVGFibGVcbiJdfQ==