"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithEditOverlay = exports.Sizes = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/General/AppIcon',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Reusable avatar for applications and workflows. Supports emoji or uploaded imagery, rounded mode, edit overlays, and multiple sizes.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        icon: '🧭',
        background: '#FFEAD5',
        size: 'medium',
        rounded: false,
    },
};
exports.default = meta;
exports.Default = {
    render: args => (<div className="flex items-center gap-4">
      <_1.default {...args}/>
      <_1.default {...args} rounded icon="🧠" background="#E0F2FE"/>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<AppIcon icon="🧭" background="#FFEAD5" />
<AppIcon icon="🧠" background="#E0F2FE" rounded />
        `.trim(),
            },
        },
    },
};
exports.Sizes = {
    render: (args) => {
        const sizes = ['xs', 'tiny', 'small', 'medium', 'large', 'xl', 'xxl'];
        return (<div className="flex flex-wrap items-end gap-4">
        {sizes.map(size => (<div key={size} className="flex flex-col items-center gap-2">
            <_1.default {...args} size={size} icon="🚀" background="#E5DEFF"/>
            <span className="text-xs uppercase text-text-tertiary">{size}</span>
          </div>))}
      </div>);
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
{(['xs','tiny','small','medium','large','xl','xxl'] as const).map(size => (
  <AppIcon key={size} size={size} icon="🚀" background="#E5DEFF" />
))}
        `.trim(),
            },
        },
    },
};
exports.WithEditOverlay = {
    render: args => (<div className="flex items-center gap-4">
      <_1.default {...args} icon="🛠️" background="#E7F5FF" showEditIcon/>
      <_1.default {...args} iconType="image" background={undefined} imageUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' rx='16' fill='%23CBD5F5'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='30' font-family='Arial' fill='%231f2937'>AI</text></svg>" showEditIcon/>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<AppIcon icon="🛠️" background="#E7F5FF" showEditIcon />
<AppIcon
  iconType="image"
  imageUrl="data:image/svg+xml;utf8,&lt;svg ...&gt;"
  showEditIcon
/>
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHdCQUF1QjtBQUV2QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxzQkFBc0I7SUFDN0IsU0FBUyxFQUFFLFVBQU87SUFDbEIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxzSUFBc0k7YUFDbEo7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxJQUFJO1FBQ1YsVUFBVSxFQUFFLFNBQVM7UUFDckIsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsS0FBSztLQUNmO0NBQzZCLENBQUE7QUFFaEMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVU7SUFDNUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQ3RDO01BQUEsQ0FBQyxVQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDbEI7TUFBQSxDQUFDLFVBQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQzNEO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7OztTQUdMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsS0FBSyxHQUFVO0lBQzFCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2YsTUFBTSxLQUFLLEdBQWtELENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDcEgsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FDN0M7UUFBQSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNqQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsa0NBQWtDLENBQzFEO1lBQUEsQ0FBQyxVQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQzdEO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUNyRTtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNKO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7U0FJTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLGVBQWUsR0FBVTtJQUNwQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDdEM7TUFBQSxDQUFDLFVBQU8sQ0FDTixJQUFJLElBQUksQ0FBQyxDQUNULElBQUksQ0FBQyxLQUFLLENBQ1YsVUFBVSxDQUFDLFNBQVMsQ0FDcEIsWUFBWSxFQUVkO01BQUEsQ0FBQyxVQUFPLENBQ04sSUFBSSxJQUFJLENBQUMsQ0FDVCxRQUFRLENBQUMsT0FBTyxDQUNoQixVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDdEIsUUFBUSxDQUFDLHlSQUF5UixDQUNsUyxZQUFZLEVBRWhCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7Ozs7U0FPTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudFByb3BzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQXBwSWNvbiBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvR2VuZXJhbC9BcHBJY29uJyxcbiAgY29tcG9uZW50OiBBcHBJY29uLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnUmV1c2FibGUgYXZhdGFyIGZvciBhcHBsaWNhdGlvbnMgYW5kIHdvcmtmbG93cy4gU3VwcG9ydHMgZW1vamkgb3IgdXBsb2FkZWQgaW1hZ2VyeSwgcm91bmRlZCBtb2RlLCBlZGl0IG92ZXJsYXlzLCBhbmQgbXVsdGlwbGUgc2l6ZXMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdzOiB7XG4gICAgaWNvbjogJ/Cfp60nLFxuICAgIGJhY2tncm91bmQ6ICcjRkZFQUQ1JyxcbiAgICBzaXplOiAnbWVkaXVtJyxcbiAgICByb3VuZGVkOiBmYWxzZSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEFwcEljb24+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IERlZmF1bHQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgIDxBcHBJY29uIHsuLi5hcmdzfSAvPlxuICAgICAgPEFwcEljb24gey4uLmFyZ3N9IHJvdW5kZWQgaWNvbj1cIvCfp6BcIiBiYWNrZ3JvdW5kPVwiI0UwRjJGRVwiIC8+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48QXBwSWNvbiBpY29uPVwi8J+nrVwiIGJhY2tncm91bmQ9XCIjRkZFQUQ1XCIgLz5cbjxBcHBJY29uIGljb249XCLwn6egXCIgYmFja2dyb3VuZD1cIiNFMEYyRkVcIiByb3VuZGVkIC8+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgU2l6ZXM6IFN0b3J5ID0ge1xuICByZW5kZXI6IChhcmdzKSA9PiB7XG4gICAgY29uc3Qgc2l6ZXM6IEFycmF5PENvbXBvbmVudFByb3BzPHR5cGVvZiBBcHBJY29uPlsnc2l6ZSddPiA9IFsneHMnLCAndGlueScsICdzbWFsbCcsICdtZWRpdW0nLCAnbGFyZ2UnLCAneGwnLCAneHhsJ11cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1lbmQgZ2FwLTRcIj5cbiAgICAgICAge3NpemVzLm1hcChzaXplID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17c2l6ZX0gY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxBcHBJY29uIHsuLi5hcmdzfSBzaXplPXtzaXplfSBpY29uPVwi8J+agFwiIGJhY2tncm91bmQ9XCIjRTVERUZGXCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPntzaXplfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG57KFsneHMnLCd0aW55Jywnc21hbGwnLCdtZWRpdW0nLCdsYXJnZScsJ3hsJywneHhsJ10gYXMgY29uc3QpLm1hcChzaXplID0+IChcbiAgPEFwcEljb24ga2V5PXtzaXplfSBzaXplPXtzaXplfSBpY29uPVwi8J+agFwiIGJhY2tncm91bmQ9XCIjRTVERUZGXCIgLz5cbikpfVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFdpdGhFZGl0T3ZlcmxheTogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgPEFwcEljb25cbiAgICAgICAgey4uLmFyZ3N9XG4gICAgICAgIGljb249XCLwn5ug77iPXCJcbiAgICAgICAgYmFja2dyb3VuZD1cIiNFN0Y1RkZcIlxuICAgICAgICBzaG93RWRpdEljb25cbiAgICAgIC8+XG4gICAgICA8QXBwSWNvblxuICAgICAgICB7Li4uYXJnc31cbiAgICAgICAgaWNvblR5cGU9XCJpbWFnZVwiXG4gICAgICAgIGJhY2tncm91bmQ9e3VuZGVmaW5lZH1cbiAgICAgICAgaW1hZ2VVcmw9XCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzgwJyBoZWlnaHQ9JzgwJz48cmVjdCB3aWR0aD0nODAnIGhlaWdodD0nODAnIHJ4PScxNicgZmlsbD0nJTIzQ0JENUY1Jy8+PHRleHQgeD0nNTAlJyB5PSc1NCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZvbnQtc2l6ZT0nMzAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZmlsbD0nJTIzMWYyOTM3Jz5BSTwvdGV4dD48L3N2Zz5cIlxuICAgICAgICBzaG93RWRpdEljb25cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48QXBwSWNvbiBpY29uPVwi8J+boO+4j1wiIGJhY2tncm91bmQ9XCIjRTdGNUZGXCIgc2hvd0VkaXRJY29uIC8+XG48QXBwSWNvblxuICBpY29uVHlwZT1cImltYWdlXCJcbiAgaW1hZ2VVcmw9XCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwmbHQ7c3ZnIC4uLiZndDtcIlxuICBzaG93RWRpdEljb25cbi8+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19