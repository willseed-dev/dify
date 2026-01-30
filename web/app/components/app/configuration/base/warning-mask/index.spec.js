"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
describe('WarningMask', () => {
    // Rendering of title, description, and footer content
    describe('Rendering', () => {
        it('should display provided title, description, and footer node', () => {
            const footer = <button type="button">Retry</button>;
            // Arrange
            (0, react_1.render)(<index_1.default title="Access Restricted" description="Only workspace owners may modify this section." footer={footer}/>);
            // Assert
            expect(react_1.screen.getByText('Access Restricted')).toBeInTheDocument();
            expect(react_1.screen.getByText('Only workspace owners may modify this section.')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5QixtQ0FBaUM7QUFFakMsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0Isc0RBQXNEO0lBQ3RELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDbkQsVUFBVTtZQUNWLElBQUEsY0FBTSxFQUNKLENBQUMsZUFBVyxDQUNWLEtBQUssQ0FBQyxtQkFBbUIsQ0FDekIsV0FBVyxDQUFDLGdEQUFnRCxDQUM1RCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDZixDQUNILENBQUE7WUFFRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDakUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDOUYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFdhcm5pbmdNYXNrIGZyb20gJy4vaW5kZXgnXG5cbmRlc2NyaWJlKCdXYXJuaW5nTWFzaycsICgpID0+IHtcbiAgLy8gUmVuZGVyaW5nIG9mIHRpdGxlLCBkZXNjcmlwdGlvbiwgYW5kIGZvb3RlciBjb250ZW50XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHByb3ZpZGVkIHRpdGxlLCBkZXNjcmlwdGlvbiwgYW5kIGZvb3RlciBub2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZm9vdGVyID0gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCI+UmV0cnk8L2J1dHRvbj5cbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdhcm5pbmdNYXNrXG4gICAgICAgICAgdGl0bGU9XCJBY2Nlc3MgUmVzdHJpY3RlZFwiXG4gICAgICAgICAgZGVzY3JpcHRpb249XCJPbmx5IHdvcmtzcGFjZSBvd25lcnMgbWF5IG1vZGlmeSB0aGlzIHNlY3Rpb24uXCJcbiAgICAgICAgICBmb290ZXI9e2Zvb3Rlcn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FjY2VzcyBSZXN0cmljdGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPbmx5IHdvcmtzcGFjZSBvd25lcnMgbWF5IG1vZGlmeSB0aGlzIHNlY3Rpb24uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdSZXRyeScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==