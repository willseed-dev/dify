"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageIcon = exports.CustomEmoji = exports.Default = void 0;
const _1 = require(".");
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" ry="40" fill="%23EEF2FF"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="34" font-family="Arial" fill="%233256D4">AI</text></svg>';
const meta = {
    title: 'Base/General/AnswerIcon',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Circular avatar used for assistant answers. Supports emoji, solid background colour, or uploaded imagery.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        icon: '🤖',
        background: '#D5F5F6',
    },
};
exports.default = meta;
const StoryWrapper = (children) => (<div className="flex items-center gap-6">
    {children}
  </div>);
exports.Default = {
    render: args => StoryWrapper(<div className="h-16 w-16">
      <_1.default {...args}/>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<div className="h-16 w-16">
  <AnswerIcon icon="🤖" background="#D5F5F6" />
</div>
        `.trim(),
            },
        },
    },
};
exports.CustomEmoji = {
    render: args => StoryWrapper(<>
      <div className="h-16 w-16">
        <_1.default {...args} icon="🧠" background="#FEE4E2"/>
      </div>
      <div className="h-16 w-16">
        <_1.default {...args} icon="🛠️" background="#EEF2FF"/>
      </div>
    </>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<div className="flex gap-4">
  <div className="h-16 w-16">
    <AnswerIcon icon="🧠" background="#FEE4E2" />
  </div>
  <div className="h-16 w-16">
    <AnswerIcon icon="🛠️" background="#EEF2FF" />
  </div>
</div>
        `.trim(),
            },
        },
    },
};
exports.ImageIcon = {
    render: args => StoryWrapper(<div className="h-16 w-16">
      <_1.default {...args} iconType="image" imageUrl={SAMPLE_IMAGE} background={undefined}/>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<AnswerIcon
  iconType="image"
  imageUrl="data:image/svg+xml;utf8,&lt;svg ...&gt;"
/>
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHdCQUEwQjtBQUUxQixNQUFNLFlBQVksR0FBRyxpU0FBaVMsQ0FBQTtBQUV0VCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx5QkFBeUI7SUFDaEMsU0FBUyxFQUFFLFVBQVU7SUFDckIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwyR0FBMkc7YUFDdkg7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxJQUFJO1FBQ1YsVUFBVSxFQUFFLFNBQVM7S0FDdEI7Q0FDZ0MsQ0FBQTtBQUVuQyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUM1QyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQ3RDO0lBQUEsQ0FBQyxRQUFRLENBQ1g7RUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFFWSxRQUFBLE9BQU8sR0FBVTtJQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQzFCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO01BQUEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDdkI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7OztTQUlMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsV0FBVyxHQUFVO0lBQ2hDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FDMUIsRUFDRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO1FBQUEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQ3REO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUN4QjtRQUFBLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUN2RDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsR0FBRyxDQUNKO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7Ozs7O1NBU0wsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxTQUFTLEdBQVU7SUFDOUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUMxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUN4QjtNQUFBLENBQUMsVUFBVSxDQUNULElBQUksSUFBSSxDQUFDLENBQ1QsUUFBUSxDQUFDLE9BQU8sQ0FDaEIsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ3ZCLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUUxQjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7OztTQUtMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQW5zd2VySWNvbiBmcm9tICcuJ1xuXG5jb25zdCBTQU1QTEVfSU1BR0UgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjgwXCI+PHJlY3Qgd2lkdGg9XCI4MFwiIGhlaWdodD1cIjgwXCIgcng9XCI0MFwiIHJ5PVwiNDBcIiBmaWxsPVwiJTIzRUVGMkZGXCIvPjx0ZXh0IHg9XCI1MCVcIiB5PVwiNTUlXCIgZG9taW5hbnQtYmFzZWxpbmU9XCJtaWRkbGVcIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIGZvbnQtc2l6ZT1cIjM0XCIgZm9udC1mYW1pbHk9XCJBcmlhbFwiIGZpbGw9XCIlMjMzMjU2RDRcIj5BSTwvdGV4dD48L3N2Zz4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9HZW5lcmFsL0Fuc3dlckljb24nLFxuICBjb21wb25lbnQ6IEFuc3dlckljb24sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdDaXJjdWxhciBhdmF0YXIgdXNlZCBmb3IgYXNzaXN0YW50IGFuc3dlcnMuIFN1cHBvcnRzIGVtb2ppLCBzb2xpZCBiYWNrZ3JvdW5kIGNvbG91ciwgb3IgdXBsb2FkZWQgaW1hZ2VyeS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBpY29uOiAn8J+klicsXG4gICAgYmFja2dyb3VuZDogJyNENUY1RjYnLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgQW5zd2VySWNvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBTdG9yeVdyYXBwZXIgPSAoY2hpbGRyZW46IFJlYWN0Tm9kZSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC02XCI+XG4gICAge2NoaWxkcmVufVxuICA8L2Rpdj5cbilcblxuZXhwb3J0IGNvbnN0IERlZmF1bHQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gU3RvcnlXcmFwcGVyKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0xNiB3LTE2XCI+XG4gICAgICA8QW5zd2VySWNvbiB7Li4uYXJnc30gLz5cbiAgICA8L2Rpdj4sXG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48ZGl2IGNsYXNzTmFtZT1cImgtMTYgdy0xNlwiPlxuICA8QW5zd2VySWNvbiBpY29uPVwi8J+kllwiIGJhY2tncm91bmQ9XCIjRDVGNUY2XCIgLz5cbjwvZGl2PlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbUVtb2ppOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IFN0b3J5V3JhcHBlcihcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTE2IHctMTZcIj5cbiAgICAgICAgPEFuc3dlckljb24gey4uLmFyZ3N9IGljb249XCLwn6egXCIgYmFja2dyb3VuZD1cIiNGRUU0RTJcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTYgdy0xNlwiPlxuICAgICAgICA8QW5zd2VySWNvbiB7Li4uYXJnc30gaWNvbj1cIvCfm6DvuI9cIiBiYWNrZ3JvdW5kPVwiI0VFRjJGRlwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz4sXG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTRcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJoLTE2IHctMTZcIj5cbiAgICA8QW5zd2VySWNvbiBpY29uPVwi8J+noFwiIGJhY2tncm91bmQ9XCIjRkVFNEUyXCIgLz5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3NOYW1lPVwiaC0xNiB3LTE2XCI+XG4gICAgPEFuc3dlckljb24gaWNvbj1cIvCfm6DvuI9cIiBiYWNrZ3JvdW5kPVwiI0VFRjJGRlwiIC8+XG4gIDwvZGl2PlxuPC9kaXY+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgSW1hZ2VJY29uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IFN0b3J5V3JhcHBlcihcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTYgdy0xNlwiPlxuICAgICAgPEFuc3dlckljb25cbiAgICAgICAgey4uLmFyZ3N9XG4gICAgICAgIGljb25UeXBlPVwiaW1hZ2VcIlxuICAgICAgICBpbWFnZVVybD17U0FNUExFX0lNQUdFfVxuICAgICAgICBiYWNrZ3JvdW5kPXt1bmRlZmluZWR9XG4gICAgICAvPlxuICAgIDwvZGl2PixcbiAgKSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxBbnN3ZXJJY29uXG4gIGljb25UeXBlPVwiaW1hZ2VcIlxuICBpbWFnZVVybD1cImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCZsdDtzdmcgLi4uJmd0O1wiXG4vPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==