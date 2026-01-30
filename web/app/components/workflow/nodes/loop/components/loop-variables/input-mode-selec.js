"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const pure_1 = require("@/app/components/base/select/pure");
const InputModeSelect = ({ value, onChange, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const options = [
        {
            label: 'Variable',
            value: 'variable',
        },
        {
            label: 'Constant',
            value: 'constant',
        },
    ];
    return (<pure_1.default options={options} value={value} onChange={onChange} popupProps={{
            title: t('nodes.loop.inputMode', { ns: 'workflow' }),
            className: 'w-[132px]',
        }}/>);
};
exports.default = InputModeSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbW9kZS1zZWxlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlucHV0LW1vZGUtc2VsZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQThDO0FBQzlDLDREQUEwRDtBQU0xRCxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQ3ZCLEtBQUssRUFDTCxRQUFRLEdBQ2EsRUFBRSxFQUFFO0lBQ3pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLE9BQU8sR0FBRztRQUNkO1lBQ0UsS0FBSyxFQUFFLFVBQVU7WUFDakIsS0FBSyxFQUFFLFVBQVU7U0FDbEI7UUFDRDtZQUNFLEtBQUssRUFBRSxVQUFVO1lBQ2pCLEtBQUssRUFBRSxVQUFVO1NBQ2xCO0tBQ0YsQ0FBQTtJQUVELE9BQU8sQ0FDTCxDQUFDLGNBQVUsQ0FDVCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakIsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2IsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ25CLFVBQVUsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxFQUFFLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUNwRCxTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLEVBQ0YsQ0FDSCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IFB1cmVTZWxlY3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3NlbGVjdC9wdXJlJ1xuXG50eXBlIElucHV0TW9kZVNlbGVjdFByb3BzID0ge1xuICB2YWx1ZT86IHN0cmluZ1xuICBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWRcbn1cbmNvbnN0IElucHV0TW9kZVNlbGVjdCA9ICh7XG4gIHZhbHVlLFxuICBvbkNoYW5nZSxcbn06IElucHV0TW9kZVNlbGVjdFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBvcHRpb25zID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnVmFyaWFibGUnLFxuICAgICAgdmFsdWU6ICd2YXJpYWJsZScsXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0NvbnN0YW50JyxcbiAgICAgIHZhbHVlOiAnY29uc3RhbnQnLFxuICAgIH0sXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxQdXJlU2VsZWN0XG4gICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgcG9wdXBQcm9wcz17e1xuICAgICAgICB0aXRsZTogdCgnbm9kZXMubG9vcC5pbnB1dE1vZGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICBjbGFzc05hbWU6ICd3LVsxMzJweF0nLFxuICAgICAgfX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0TW9kZVNlbGVjdFxuIl19