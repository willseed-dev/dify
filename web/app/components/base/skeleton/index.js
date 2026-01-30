"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonPoint = exports.SkeletonRectangle = exports.SkeletonRow = exports.SkeletonContainer = void 0;
const classnames_1 = require("@/utils/classnames");
const SkeletonContainer = (props) => {
    const { className, children, ...rest } = props;
    return (<div className={(0, classnames_1.cn)('flex flex-col gap-1', className)} {...rest}>
      {children}
    </div>);
};
exports.SkeletonContainer = SkeletonContainer;
const SkeletonRow = (props) => {
    const { className, children, ...rest } = props;
    return (<div className={(0, classnames_1.cn)('flex items-center gap-2', className)} {...rest}>
      {children}
    </div>);
};
exports.SkeletonRow = SkeletonRow;
const SkeletonRectangle = (props) => {
    const { className, children, ...rest } = props;
    return (<div className={(0, classnames_1.cn)('my-1 h-2 rounded-sm bg-text-quaternary opacity-20', className)} {...rest}>
      {children}
    </div>);
};
exports.SkeletonRectangle = SkeletonRectangle;
const SkeletonPoint = (props) => {
    const { className, ...rest } = props;
    return (<div className={(0, classnames_1.cn)('text-xs font-medium text-text-quaternary', className)} {...rest}>·</div>);
};
exports.SkeletonPoint = SkeletonPoint;
/**
 * Usage
 * <SkeletonContainer>
 *  <SkeletonRow>
 *    <SkeletonRectangle className="w-96" />
 *    <SkeletonPoint />
 *    <SkeletonRectangle className="w-96" />
 *  </SkeletonRow>
 *  <SkeletonRow>
 *    <SkeletonRectangle className="w-96" />
 *  </SkeletonRow>
 * <SkeletonRow>
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbURBQXVDO0FBSWhDLE1BQU0saUJBQWlCLEdBQXNCLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDNUQsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUE7SUFDOUMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FDN0Q7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVBZLFFBQUEsaUJBQWlCLHFCQU83QjtBQUVNLE1BQU0sV0FBVyxHQUFzQixDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3RELE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQzlDLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx5QkFBeUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQ2pFO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFQWSxRQUFBLFdBQVcsZUFPdkI7QUFFTSxNQUFNLGlCQUFpQixHQUFzQixDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzVELE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQzlDLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxtREFBbUQsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQzNGO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFQWSxRQUFBLGlCQUFpQixxQkFPN0I7QUFFTSxNQUFNLGFBQWEsR0FBc0IsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUN4RCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQ3BDLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwQ0FBMEMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUM3RixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBTFksUUFBQSxhQUFhLGlCQUt6QjtBQUNEOzs7Ozs7Ozs7Ozs7R0FZRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ29tcG9uZW50UHJvcHMsIEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxudHlwZSBTa2VsZXRvblByb3BzID0gQ29tcG9uZW50UHJvcHM8J2Rpdic+XG5cbmV4cG9ydCBjb25zdCBTa2VsZXRvbkNvbnRhaW5lcjogRkM8U2tlbGV0b25Qcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBjbGFzc05hbWUsIGNoaWxkcmVuLCAuLi5yZXN0IH0gPSBwcm9wc1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBmbGV4LWNvbCBnYXAtMScsIGNsYXNzTmFtZSl9IHsuLi5yZXN0fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgU2tlbGV0b25Sb3c6IEZDPFNrZWxldG9uUHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjaGlsZHJlbiwgLi4ucmVzdCB9ID0gcHJvcHNcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggaXRlbXMtY2VudGVyIGdhcC0yJywgY2xhc3NOYW1lKX0gey4uLnJlc3R9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBTa2VsZXRvblJlY3RhbmdsZTogRkM8U2tlbGV0b25Qcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBjbGFzc05hbWUsIGNoaWxkcmVuLCAuLi5yZXN0IH0gPSBwcm9wc1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbignbXktMSBoLTIgcm91bmRlZC1zbSBiZy10ZXh0LXF1YXRlcm5hcnkgb3BhY2l0eS0yMCcsIGNsYXNzTmFtZSl9IHsuLi5yZXN0fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgU2tlbGV0b25Qb2ludDogRkM8U2tlbGV0b25Qcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBjbGFzc05hbWUsIC4uLnJlc3QgfSA9IHByb3BzXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKCd0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1xdWF0ZXJuYXJ5JywgY2xhc3NOYW1lKX0gey4uLnJlc3R9PsK3PC9kaXY+XG4gIClcbn1cbi8qKlxuICogVXNhZ2VcbiAqIDxTa2VsZXRvbkNvbnRhaW5lcj5cbiAqICA8U2tlbGV0b25Sb3c+XG4gKiAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwidy05NlwiIC8+XG4gKiAgICA8U2tlbGV0b25Qb2ludCAvPlxuICogICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctOTZcIiAvPlxuICogIDwvU2tlbGV0b25Sb3c+XG4gKiAgPFNrZWxldG9uUm93PlxuICogICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctOTZcIiAvPlxuICogIDwvU2tlbGV0b25Sb3c+XG4gKiA8U2tlbGV0b25Sb3c+XG4gKi9cbiJdfQ==