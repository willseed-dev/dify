"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingPlaceholder = void 0;
const skeleton_1 = require("@/app/components/base/skeleton");
const classnames_1 = require("@/utils/classnames");
const other_1 = require("../../../base/icons/src/vender/other");
const title_1 = require("./title");
const LoadingPlaceholder = ({ className }) => (<div className={(0, classnames_1.cn)('h-2 rounded-sm bg-text-quaternary opacity-20', className)}/>);
exports.LoadingPlaceholder = LoadingPlaceholder;
const Placeholder = ({ wrapClassName, loadingFileName, }) => {
    return (<div className={wrapClassName}>
      <skeleton_1.SkeletonRow>
        <div className="flex h-10 w-10 items-center justify-center gap-2 rounded-[10px] border-[0.5px]
              border-components-panel-border bg-background-default p-1 backdrop-blur-sm">
          <div className="flex h-5 w-5 items-center justify-center">
            <other_1.Group className="text-text-tertiary"/>
          </div>
        </div>
        <div className="grow">
          <skeleton_1.SkeletonContainer>
            <div className="flex h-5 items-center">
              {loadingFileName
            ? (<title_1.default title={loadingFileName}/>)
            : (<skeleton_1.SkeletonRectangle className="w-[260px]"/>)}
            </div>
            <skeleton_1.SkeletonRow className="h-4">
              <skeleton_1.SkeletonRectangle className="w-[41px]"/>
              <skeleton_1.SkeletonPoint />
              <skeleton_1.SkeletonRectangle className="w-[180px]"/>
            </skeleton_1.SkeletonRow>
          </skeleton_1.SkeletonContainer>
        </div>
      </skeleton_1.SkeletonRow>
      <skeleton_1.SkeletonRectangle className="mt-3 w-[420px]"/>
    </div>);
};
exports.default = Placeholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQWlIO0FBQ2pILG1EQUF1QztBQUN2QyxnRUFBNEQ7QUFDNUQsbUNBQTJCO0FBT3BCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBMEIsRUFBRSxFQUFFLENBQUMsQ0FDM0UsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsOENBQThDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRyxDQUNsRixDQUFBO0FBRlksUUFBQSxrQkFBa0Isc0JBRTlCO0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUNuQixhQUFhLEVBQ2IsZUFBZSxHQUNULEVBQUUsRUFBRTtJQUNWLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDNUI7TUFBQSxDQUFDLHNCQUFXLENBQ1Y7UUFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUM7d0ZBQ29FLENBRTlFO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUN2RDtZQUFBLENBQUMsYUFBSyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsRUFDdkM7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkI7VUFBQSxDQUFDLDRCQUFpQixDQUNoQjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDcEM7Y0FBQSxDQUFDLGVBQWU7WUFDZCxDQUFDLENBQUMsQ0FDRSxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRyxDQUNsQztZQUNILENBQUMsQ0FBQyxDQUNFLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRyxDQUM1QyxDQUNQO1lBQUEsRUFBRSxHQUFHLENBQ0w7WUFBQSxDQUFDLHNCQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDMUI7Y0FBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQ3ZDO2NBQUEsQ0FBQyx3QkFBYSxDQUFDLEFBQUQsRUFDZDtjQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFDMUM7WUFBQSxFQUFFLHNCQUFXLENBQ2Y7VUFBQSxFQUFFLDRCQUFpQixDQUNyQjtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxzQkFBVyxDQUNiO01BQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQy9DO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2tlbGV0b25Db250YWluZXIsIFNrZWxldG9uUG9pbnQsIFNrZWxldG9uUmVjdGFuZ2xlLCBTa2VsZXRvblJvdyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9za2VsZXRvbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICcuLi8uLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvb3RoZXInXG5pbXBvcnQgVGl0bGUgZnJvbSAnLi90aXRsZSdcblxudHlwZSBQcm9wcyA9IHtcbiAgd3JhcENsYXNzTmFtZTogc3RyaW5nXG4gIGxvYWRpbmdGaWxlTmFtZT86IHN0cmluZ1xufVxuXG5leHBvcnQgY29uc3QgTG9hZGluZ1BsYWNlaG9sZGVyID0gKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9e2NuKCdoLTIgcm91bmRlZC1zbSBiZy10ZXh0LXF1YXRlcm5hcnkgb3BhY2l0eS0yMCcsIGNsYXNzTmFtZSl9IC8+XG4pXG5cbmNvbnN0IFBsYWNlaG9sZGVyID0gKHtcbiAgd3JhcENsYXNzTmFtZSxcbiAgbG9hZGluZ0ZpbGVOYW1lLFxufTogUHJvcHMpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17d3JhcENsYXNzTmFtZX0+XG4gICAgICA8U2tlbGV0b25Sb3c+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtMTAgdy0xMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgcm91bmRlZC1bMTBweF0gYm9yZGVyLVswLjVweF1cbiAgICAgICAgICAgICAgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWJhY2tncm91bmQtZGVmYXVsdCBwLTEgYmFja2Ryb3AtYmx1ci1zbVwiXG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC01IHctNSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxHcm91cCBjbGFzc05hbWU9XCJ0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgPFNrZWxldG9uQ29udGFpbmVyPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtNSBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAge2xvYWRpbmdGaWxlTmFtZVxuICAgICAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgICAgICA8VGl0bGUgdGl0bGU9e2xvYWRpbmdGaWxlTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctWzI2MHB4XVwiIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8U2tlbGV0b25Sb3cgY2xhc3NOYW1lPVwiaC00XCI+XG4gICAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LVs0MXB4XVwiIC8+XG4gICAgICAgICAgICAgIDxTa2VsZXRvblBvaW50IC8+XG4gICAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LVsxODBweF1cIiAvPlxuICAgICAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvU2tlbGV0b25Sb3c+XG4gICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwibXQtMyB3LVs0MjBweF1cIiAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYWNlaG9sZGVyXG4iXX0=