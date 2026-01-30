"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const Header = ({ title, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex flex-col border-b-[0.5px] border-divider-regular">
      <div className="system-md-semibold flex items-center px-2 py-1.5 text-text-primary">
        {title || t('title.pickTime', { ns: 'time' })}
      </div>
    </div>);
};
exports.default = React.memo(Header);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5QixpREFBOEM7QUFLOUMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxFQUNkLEtBQUssR0FDQyxFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1REFBdUQsQ0FDcEU7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0VBQW9FLENBQ2pGO1FBQUEsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQy9DO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHRpdGxlPzogc3RyaW5nXG59XG5jb25zdCBIZWFkZXIgPSAoe1xuICB0aXRsZSxcbn06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGJvcmRlci1iLVswLjVweF0gYm9yZGVyLWRpdmlkZXItcmVndWxhclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgZmxleCBpdGVtcy1jZW50ZXIgcHgtMiBweS0xLjUgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAge3RpdGxlIHx8IHQoJ3RpdGxlLnBpY2tUaW1lJywgeyBuczogJ3RpbWUnIH0pfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhIZWFkZXIpXG4iXX0=