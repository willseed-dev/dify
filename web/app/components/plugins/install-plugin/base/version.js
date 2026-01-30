"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const index_1 = require("@/app/components/base/badge/index");
const Version = ({ hasInstalled, installedVersion, toInstallVersion, }) => {
    return (<>
      {!hasInstalled
            ? (<index_1.default className="mx-1" size="s" state={index_1.BadgeState.Default}>{toInstallVersion}</index_1.default>)
            : (<>
                <index_1.default className="mx-1" size="s" state={index_1.BadgeState.Warning}>
                  {`${installedVersion} -> ${toInstallVersion}`}
                </index_1.default>
                {/* <div className='flex px-0.5 justify-center items-center gap-0.5'>
              <div className='text-text-warning system-xs-medium'>Used in 3 apps</div>
              <RiInformation2Line className='w-4 h-4 text-text-tertiary' />
            </div> */}
              </>)}
    </>);
};
exports.default = React.memo(Version);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZlcnNpb24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBR1osK0JBQThCO0FBQzlCLDZEQUFxRTtBQUVyRSxNQUFNLE9BQU8sR0FBcUIsQ0FBQyxFQUNqQyxZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGdCQUFnQixHQUNqQixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQ0UsQ0FBQyxZQUFZO1lBQ1gsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxlQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGVBQUssQ0FBQyxDQUN2RjtZQUNILENBQUMsQ0FBQyxDQUNFLEVBQ0U7Z0JBQUEsQ0FBQyxlQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFVLENBQUMsT0FBTyxDQUFDLENBQ3pEO2tCQUFBLENBQUMsR0FBRyxnQkFBZ0IsT0FBTyxnQkFBZ0IsRUFBRSxDQUMvQztnQkFBQSxFQUFFLGVBQUssQ0FDUDtnQkFBQSxDQUFDOzs7cUJBR0ksQ0FDUDtjQUFBLEdBQUcsQ0FFWCxDQUNGO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFZlcnNpb25Qcm9wcyB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQmFkZ2UsIHsgQmFkZ2VTdGF0ZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9iYWRnZS9pbmRleCdcblxuY29uc3QgVmVyc2lvbjogRkM8VmVyc2lvblByb3BzPiA9ICh7XG4gIGhhc0luc3RhbGxlZCxcbiAgaW5zdGFsbGVkVmVyc2lvbixcbiAgdG9JbnN0YWxsVmVyc2lvbixcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge1xuICAgICAgICAhaGFzSW5zdGFsbGVkXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxCYWRnZSBjbGFzc05hbWU9XCJteC0xXCIgc2l6ZT1cInNcIiBzdGF0ZT17QmFkZ2VTdGF0ZS5EZWZhdWx0fT57dG9JbnN0YWxsVmVyc2lvbn08L0JhZGdlPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxCYWRnZSBjbGFzc05hbWU9XCJteC0xXCIgc2l6ZT1cInNcIiBzdGF0ZT17QmFkZ2VTdGF0ZS5XYXJuaW5nfT5cbiAgICAgICAgICAgICAgICAgIHtgJHtpbnN0YWxsZWRWZXJzaW9ufSAtPiAke3RvSW5zdGFsbFZlcnNpb259YH1cbiAgICAgICAgICAgICAgICA8L0JhZGdlPlxuICAgICAgICAgICAgICAgIHsvKiA8ZGl2IGNsYXNzTmFtZT0nZmxleCBweC0wLjUganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIGdhcC0wLjUnPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGV4dC10ZXh0LXdhcm5pbmcgc3lzdGVtLXhzLW1lZGl1bSc+VXNlZCBpbiAzIGFwcHM8L2Rpdj5cbiAgICAgICAgICAgICAgPFJpSW5mb3JtYXRpb24yTGluZSBjbGFzc05hbWU9J3ctNCBoLTQgdGV4dC10ZXh0LXRlcnRpYXJ5JyAvPlxuICAgICAgICAgICAgPC9kaXY+ICovfVxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgIClcbiAgICAgIH1cbiAgICA8Lz5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhWZXJzaW9uKVxuIl19