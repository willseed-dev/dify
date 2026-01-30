"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.ValidationShowcase = exports.MultiLanguageTags = exports.StopSequences = exports.TagsWithSuggestions = exports.KeywordExtraction = exports.ProductCategories = exports.SearchFilters = exports.EmailTags = exports.SkillTags = exports.RequiredTags = exports.DisableAdd = exports.DisableRemove = exports.TabToConfirm = exports.WithInitialTags = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/TagInput',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Tag input component for managing a list of string tags. Features auto-sizing input, duplicate detection, length validation (max 20 chars), and customizable confirm key (Enter or Tab).',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        items: {
            control: 'object',
            description: 'Array of tag strings',
        },
        onChange: {
            action: 'changed',
            description: 'Change handler',
        },
        disableAdd: {
            control: 'boolean',
            description: 'Disable adding new tags',
        },
        disableRemove: {
            control: 'boolean',
            description: 'Disable removing tags',
        },
        customizedConfirmKey: {
            control: 'select',
            options: ['Enter', 'Tab'],
            description: 'Key to confirm tag creation',
        },
        placeholder: {
            control: 'text',
            description: 'Input placeholder text',
        },
        required: {
            control: 'boolean',
            description: 'Require non-empty tags',
        },
    },
    args: {
        onChange: (items) => {
            console.log('Tags updated:', items);
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const TagInputDemo = (args) => {
    const [items, setItems] = (0, react_1.useState)(args.items || []);
    return (<div style={{ width: '500px' }}>
      <_1.default {...args} items={items} onChange={(newItems) => {
            setItems(newItems);
            console.log('Tags updated:', newItems);
        }}/>
      {items.length > 0 && (<div className="mt-4 rounded-lg bg-gray-50 p-3">
          <div className="mb-2 text-xs font-medium text-gray-600">
            Current Tags (
            {items.length}
            ):
          </div>
          <div className="font-mono text-sm text-gray-800">
            {JSON.stringify(items, null, 2)}
          </div>
        </div>)}
    </div>);
};
// Default state (empty)
exports.Default = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: [],
        placeholder: 'Add a tag...',
        customizedConfirmKey: 'Enter',
    },
};
// With initial tags
exports.WithInitialTags = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: ['React', 'TypeScript', 'Next.js'],
        placeholder: 'Add more tags...',
        customizedConfirmKey: 'Enter',
    },
};
// Tab to confirm
exports.TabToConfirm = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: ['keyword1', 'keyword2'],
        placeholder: 'Press Tab to add...',
        customizedConfirmKey: 'Tab',
    },
};
// Disable remove
exports.DisableRemove = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: ['Permanent', 'Tags', 'Cannot be removed'],
        disableRemove: true,
        customizedConfirmKey: 'Enter',
    },
};
// Disable add
exports.DisableAdd = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: ['Read', 'Only', 'Mode'],
        disableAdd: true,
    },
};
// Required tags
exports.RequiredTags = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: [],
        placeholder: 'Add required tags...',
        required: true,
        customizedConfirmKey: 'Enter',
    },
};
// Real-world example - Skill tags
const SkillTagsDemo = () => {
    const [skills, setSkills] = (0, react_1.useState)(['JavaScript', 'React', 'Node.js']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold">Your Skills</h3>
      <p className="mb-4 text-sm text-gray-600">Add skills to your profile</p>
      <_1.default items={skills} onChange={setSkills} placeholder="Add a skill..." customizedConfirmKey="Enter"/>
      <div className="mt-4 text-xs text-gray-500">
        💡 Press Enter to add a tag. Max 20 characters. No duplicates allowed.
      </div>
    </div>);
};
exports.SkillTags = {
    render: () => <SkillTagsDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Email tags
const EmailTagsDemo = () => {
    const [recipients, setRecipients] = (0, react_1.useState)(['john@example.com', 'jane@example.com']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Send Email</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">To:</label>
          <_1.default items={recipients} onChange={setRecipients} placeholder="Add recipient email..." customizedConfirmKey="Enter"/>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Subject:</label>
          <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter subject..."/>
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
          <strong>
            Recipients (
            {recipients.length}
            ):
          </strong>
          {' '}
          {recipients.join(', ')}
        </div>
      </div>
    </div>);
};
exports.EmailTags = {
    render: () => <EmailTagsDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Search filters
const SearchFiltersDemo = () => {
    const [filters, setFilters] = (0, react_1.useState)(['urgent', 'pending']);
    const mockResults = [
        { id: 1, title: 'Task 1', tags: ['urgent', 'pending'] },
        { id: 2, title: 'Task 2', tags: ['urgent'] },
        { id: 3, title: 'Task 3', tags: ['pending', 'review'] },
        { id: 4, title: 'Task 4', tags: ['completed'] },
    ];
    const filteredResults = filters.length > 0
        ? mockResults.filter(item => filters.some(filter => item.tags.includes(filter)))
        : mockResults;
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Filter Tasks</h3>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Active Filters:</label>
        <_1.default items={filters} onChange={setFilters} placeholder="Add filter tag..." customizedConfirmKey="Enter"/>
      </div>
      <div className="mt-6">
        <div className="mb-3 text-sm font-medium text-gray-700">
          Results (
          {filteredResults.length}
          {' '}
          of
          {' '}
          {mockResults.length}
          )
        </div>
        <div className="space-y-2">
          {filteredResults.map(item => (<div key={item.id} className="rounded-lg bg-gray-50 p-3">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="mt-1 flex gap-1">
                {item.tags.map(tag => (<span key={tag} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {tag}
                  </span>))}
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
exports.SearchFilters = {
    render: () => <SearchFiltersDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Product categories
const ProductCategoriesDemo = () => {
    const [categories, setCategories] = (0, react_1.useState)(['Electronics', 'Computers']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter product name..." defaultValue="Laptop Pro 15"/>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Categories</label>
          <_1.default items={categories} onChange={setCategories} placeholder="Add category..." customizedConfirmKey="Enter"/>
          <p className="mt-1 text-xs text-gray-500">
            Add relevant categories to help users find this product
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
          <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={3} placeholder="Enter product description..."/>
        </div>
      </div>
    </div>);
};
exports.ProductCategories = {
    render: () => <ProductCategoriesDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Keyword extraction
const KeywordExtractionDemo = () => {
    const [keywords, setKeywords] = (0, react_1.useState)(['AI', 'machine learning', 'automation']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">SEO Keywords</h3>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Meta Keywords
        </label>
        <_1.default items={keywords} onChange={setKeywords} placeholder="Add keyword..." customizedConfirmKey="Enter" required/>
        <div className="mt-2 text-xs text-gray-500">
          Add relevant keywords for search engine optimization (max 20 characters each)
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <div className="mb-2 text-xs font-medium text-gray-600">Meta Tag Preview:</div>
        <code className="text-xs text-gray-700">
          &lt;meta name="keywords" content="
          {keywords.join(', ')}
          " /&gt;
        </code>
      </div>
    </div>);
};
exports.KeywordExtraction = {
    render: () => <KeywordExtractionDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Tags with suggestions
const TagsWithSuggestionsDemo = () => {
    const [tags, setTags] = (0, react_1.useState)(['design', 'frontend']);
    const suggestions = ['backend', 'devops', 'mobile', 'testing', 'security'];
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Project Tags</h3>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Add Tags
        </label>
        <_1.default items={tags} onChange={setTags} placeholder="Type or select..." customizedConfirmKey="Enter"/>
      </div>
      <div className="mt-4">
        <div className="mb-2 text-xs font-medium text-gray-600">Suggestions:</div>
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter(s => !tags.includes(s))
            .map(suggestion => (<button key={suggestion} className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200" onClick={() => setTags([...tags, suggestion])}>
                +
                {' '}
                {suggestion}
              </button>))}
        </div>
      </div>
    </div>);
};
exports.TagsWithSuggestions = {
    render: () => <TagsWithSuggestionsDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Stop sequences (Tab mode)
const StopSequencesDemo = () => {
    const [stopSequences, setStopSequences] = (0, react_1.useState)(['Human:', 'AI:']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">AI Model Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Temperature
          </label>
          <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full"/>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Stop Sequences
          </label>
          <_1.default items={stopSequences} onChange={setStopSequences} placeholder="Press Tab to add..." customizedConfirmKey="Tab"/>
          <p className="mt-1 text-xs text-gray-500">
            💡 Press Tab to add. Press Enter to insert ↵ (newline) in sequence.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Max Tokens
          </label>
          <input type="number" defaultValue="2000" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"/>
        </div>
      </div>
    </div>);
};
exports.StopSequences = {
    render: () => <StopSequencesDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Multi-language tags
const MultiLanguageTagsDemo = () => {
    const [tags, setTags] = (0, react_1.useState)(['Hello', '你好', 'Bonjour', 'Hola']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Internationalization</h3>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Greeting Translations
        </label>
        <_1.default items={tags} onChange={setTags} placeholder="Add translation..." customizedConfirmKey="Enter"/>
        <div className="mt-2 text-xs text-gray-500">
          Supports multi-language characters (max 20 characters)
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {tags.map((tag, index) => (<div key={index} className="rounded bg-gray-50 p-2 text-sm">
            <span className="font-mono">{tag}</span>
          </div>))}
      </div>
    </div>);
};
exports.MultiLanguageTags = {
    render: () => <MultiLanguageTagsDemo />,
    parameters: { controls: { disable: true } },
};
// Validation showcase
const ValidationShowcaseDemo = () => {
    const [tags, setTags] = (0, react_1.useState)(['valid-tag']);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Validation Rules</h3>
      <_1.default items={tags} onChange={setTags} placeholder="Try adding tags..." customizedConfirmKey="Enter" required/>
      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <div className="mb-2 text-sm font-medium text-blue-900">Validation Rules:</div>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>✓ Maximum 20 characters per tag</li>
          <li>✓ No duplicate tags allowed</li>
          <li>✓ Cannot add empty tags (when required=true)</li>
          <li>✓ Whitespace is automatically trimmed</li>
        </ul>
      </div>
      <div className="mt-4 rounded-lg bg-yellow-50 p-4">
        <div className="mb-2 text-sm font-medium text-yellow-900">Try these:</div>
        <ul className="space-y-1 text-xs text-yellow-800">
          <li>• Add "valid-tag" → Shows duplicate error</li>
          <li>• Add empty string → Shows empty error</li>
          <li>• Add "this-is-a-very-long-tag-name" → Shows length error</li>
        </ul>
      </div>
    </div>);
};
exports.ValidationShowcase = {
    render: () => <ValidationShowcaseDemo />,
    parameters: { controls: { disable: true } },
};
// Interactive playground
exports.Playground = {
    render: args => <TagInputDemo {...args}/>,
    args: {
        items: ['tag1', 'tag2'],
        placeholder: 'Add a tag...',
        customizedConfirmKey: 'Enter',
        disableAdd: false,
        disableRemove: false,
        required: false,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBd0I7QUFFeEIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsMEJBQTBCO0lBQ2pDLFNBQVMsRUFBRSxVQUFRO0lBQ25CLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUseUxBQXlMO2FBQ3JNO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsUUFBUTtZQUNqQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3BDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTSxFQUFFLFNBQVM7WUFDakIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QjtRQUNELFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSx5QkFBeUI7U0FDdkM7UUFDRCxhQUFhLEVBQUU7WUFDYixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsdUJBQXVCO1NBQ3JDO1FBQ0Qsb0JBQW9CLEVBQUU7WUFDcEIsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztZQUN6QixXQUFXLEVBQUUsNkJBQTZCO1NBQzNDO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsd0JBQXdCO1NBQ3RDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHdCQUF3QjtTQUN0QztLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7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QUFBLEVBQUUsRUFBRSxDQUNOO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLGtCQUFrQixHQUFVO0lBQ3ZDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEFBQUQsRUFBRztJQUN4QyxVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7Q0FDeEIsQ0FBQTtBQUVyQix5QkFBeUI7QUFDWixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQzFDLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDdkIsV0FBVyxFQUFFLGNBQWM7UUFDM0Isb0JBQW9CLEVBQUUsT0FBTztRQUM3QixVQUFVLEVBQUUsS0FBSztRQUNqQixhQUFhLEVBQUUsS0FBSztRQUNwQixRQUFRLEVBQUUsS0FBSztLQUNoQjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRhZ0lucHV0IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L1RhZ0lucHV0JyxcbiAgY29tcG9uZW50OiBUYWdJbnB1dCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdUYWcgaW5wdXQgY29tcG9uZW50IGZvciBtYW5hZ2luZyBhIGxpc3Qgb2Ygc3RyaW5nIHRhZ3MuIEZlYXR1cmVzIGF1dG8tc2l6aW5nIGlucHV0LCBkdXBsaWNhdGUgZGV0ZWN0aW9uLCBsZW5ndGggdmFsaWRhdGlvbiAobWF4IDIwIGNoYXJzKSwgYW5kIGN1c3RvbWl6YWJsZSBjb25maXJtIGtleSAoRW50ZXIgb3IgVGFiKS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgaXRlbXM6IHtcbiAgICAgIGNvbnRyb2w6ICdvYmplY3QnLFxuICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiB0YWcgc3RyaW5ncycsXG4gICAgfSxcbiAgICBvbkNoYW5nZToge1xuICAgICAgYWN0aW9uOiAnY2hhbmdlZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NoYW5nZSBoYW5kbGVyJyxcbiAgICB9LFxuICAgIGRpc2FibGVBZGQ6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBhZGRpbmcgbmV3IHRhZ3MnLFxuICAgIH0sXG4gICAgZGlzYWJsZVJlbW92ZToge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIHJlbW92aW5nIHRhZ3MnLFxuICAgIH0sXG4gICAgY3VzdG9taXplZENvbmZpcm1LZXk6IHtcbiAgICAgIGNvbnRyb2w6ICdzZWxlY3QnLFxuICAgICAgb3B0aW9uczogWydFbnRlcicsICdUYWInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnS2V5IHRvIGNvbmZpcm0gdGFnIGNyZWF0aW9uJyxcbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lucHV0IHBsYWNlaG9sZGVyIHRleHQnLFxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUmVxdWlyZSBub24tZW1wdHkgdGFncycsXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIG9uQ2hhbmdlOiAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdUYWdzIHVwZGF0ZWQ6JywgaXRlbXMpXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFRhZ0lucHV0PlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbi8vIEludGVyYWN0aXZlIGRlbW8gd3JhcHBlclxuY29uc3QgVGFnSW5wdXREZW1vID0gKGFyZ3M6IGFueSkgPT4ge1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlKGFyZ3MuaXRlbXMgfHwgW10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19PlxuICAgICAgPFRhZ0lucHV0XG4gICAgICAgIHsuLi5hcmdzfVxuICAgICAgICBpdGVtcz17aXRlbXN9XG4gICAgICAgIG9uQ2hhbmdlPXsobmV3SXRlbXMpID0+IHtcbiAgICAgICAgICBzZXRJdGVtcyhuZXdJdGVtcylcbiAgICAgICAgICBjb25zb2xlLmxvZygnVGFncyB1cGRhdGVkOicsIG5ld0l0ZW1zKVxuICAgICAgICB9fVxuICAgICAgLz5cbiAgICAgIHtpdGVtcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IHJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LWdyYXktNjAwXCI+XG4gICAgICAgICAgICBDdXJyZW50IFRhZ3MgKFxuICAgICAgICAgICAge2l0ZW1zLmxlbmd0aH1cbiAgICAgICAgICAgICk6XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1zbSB0ZXh0LWdyYXktODAwXCI+XG4gICAgICAgICAgICB7SlNPTi5zdHJpbmdpZnkoaXRlbXMsIG51bGwsIDIpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuLy8gRGVmYXVsdCBzdGF0ZSAoZW1wdHkpXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8VGFnSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIGl0ZW1zOiBbXSxcbiAgICBwbGFjZWhvbGRlcjogJ0FkZCBhIHRhZy4uLicsXG4gICAgY3VzdG9taXplZENvbmZpcm1LZXk6ICdFbnRlcicsXG4gIH0sXG59XG5cbi8vIFdpdGggaW5pdGlhbCB0YWdzXG5leHBvcnQgY29uc3QgV2l0aEluaXRpYWxUYWdzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxUYWdJbnB1dERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgaXRlbXM6IFsnUmVhY3QnLCAnVHlwZVNjcmlwdCcsICdOZXh0LmpzJ10sXG4gICAgcGxhY2Vob2xkZXI6ICdBZGQgbW9yZSB0YWdzLi4uJyxcbiAgICBjdXN0b21pemVkQ29uZmlybUtleTogJ0VudGVyJyxcbiAgfSxcbn1cblxuLy8gVGFiIHRvIGNvbmZpcm1cbmV4cG9ydCBjb25zdCBUYWJUb0NvbmZpcm06IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFRhZ0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBpdGVtczogWydrZXl3b3JkMScsICdrZXl3b3JkMiddLFxuICAgIHBsYWNlaG9sZGVyOiAnUHJlc3MgVGFiIHRvIGFkZC4uLicsXG4gICAgY3VzdG9taXplZENvbmZpcm1LZXk6ICdUYWInLFxuICB9LFxufVxuXG4vLyBEaXNhYmxlIHJlbW92ZVxuZXhwb3J0IGNvbnN0IERpc2FibGVSZW1vdmU6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFRhZ0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBpdGVtczogWydQZXJtYW5lbnQnLCAnVGFncycsICdDYW5ub3QgYmUgcmVtb3ZlZCddLFxuICAgIGRpc2FibGVSZW1vdmU6IHRydWUsXG4gICAgY3VzdG9taXplZENvbmZpcm1LZXk6ICdFbnRlcicsXG4gIH0sXG59XG5cbi8vIERpc2FibGUgYWRkXG5leHBvcnQgY29uc3QgRGlzYWJsZUFkZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8VGFnSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIGl0ZW1zOiBbJ1JlYWQnLCAnT25seScsICdNb2RlJ10sXG4gICAgZGlzYWJsZUFkZDogdHJ1ZSxcbiAgfSxcbn1cblxuLy8gUmVxdWlyZWQgdGFnc1xuZXhwb3J0IGNvbnN0IFJlcXVpcmVkVGFnczogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8VGFnSW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIGl0ZW1zOiBbXSxcbiAgICBwbGFjZWhvbGRlcjogJ0FkZCByZXF1aXJlZCB0YWdzLi4uJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBjdXN0b21pemVkQ29uZmlybUtleTogJ0VudGVyJyxcbiAgfSxcbn1cblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gU2tpbGwgdGFnc1xuY29uc3QgU2tpbGxUYWdzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3NraWxscywgc2V0U2tpbGxzXSA9IHVzZVN0YXRlKFsnSmF2YVNjcmlwdCcsICdSZWFjdCcsICdOb2RlLmpzJ10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNjAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi0yIHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPllvdXIgU2tpbGxzPC9oMz5cbiAgICAgIDxwIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1zbSB0ZXh0LWdyYXktNjAwXCI+QWRkIHNraWxscyB0byB5b3VyIHByb2ZpbGU8L3A+XG4gICAgICA8VGFnSW5wdXRcbiAgICAgICAgaXRlbXM9e3NraWxsc31cbiAgICAgICAgb25DaGFuZ2U9e3NldFNraWxsc31cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJBZGQgYSBza2lsbC4uLlwiXG4gICAgICAgIGN1c3RvbWl6ZWRDb25maXJtS2V5PVwiRW50ZXJcIlxuICAgICAgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAg8J+SoSBQcmVzcyBFbnRlciB0byBhZGQgYSB0YWcuIE1heCAyMCBjaGFyYWN0ZXJzLiBObyBkdXBsaWNhdGVzIGFsbG93ZWQuXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgU2tpbGxUYWdzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8U2tpbGxUYWdzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBFbWFpbCB0YWdzXG5jb25zdCBFbWFpbFRhZ3NEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbcmVjaXBpZW50cywgc2V0UmVjaXBpZW50c10gPSB1c2VTdGF0ZShbJ2pvaG5AZXhhbXBsZS5jb20nLCAnamFuZUBleGFtcGxlLmNvbSddKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzYwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5TZW5kIEVtYWlsPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+VG86PC9sYWJlbD5cbiAgICAgICAgICA8VGFnSW5wdXRcbiAgICAgICAgICAgIGl0ZW1zPXtyZWNpcGllbnRzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3NldFJlY2lwaWVudHN9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFkZCByZWNpcGllbnQgZW1haWwuLi5cIlxuICAgICAgICAgICAgY3VzdG9taXplZENvbmZpcm1LZXk9XCJFbnRlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+U3ViamVjdDo8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0zIHB5LTIgdGV4dC1zbVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHN1YmplY3QuLi5cIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1sZyBiZy1ibHVlLTUwIHAtMyB0ZXh0LXNtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICA8c3Ryb25nPlxuICAgICAgICAgICAgUmVjaXBpZW50cyAoXG4gICAgICAgICAgICB7cmVjaXBpZW50cy5sZW5ndGh9XG4gICAgICAgICAgICApOlxuICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgIHsnICd9XG4gICAgICAgICAge3JlY2lwaWVudHMuam9pbignLCAnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgRW1haWxUYWdzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8RW1haWxUYWdzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBTZWFyY2ggZmlsdGVyc1xuY29uc3QgU2VhcmNoRmlsdGVyc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtmaWx0ZXJzLCBzZXRGaWx0ZXJzXSA9IHVzZVN0YXRlKFsndXJnZW50JywgJ3BlbmRpbmcnXSlcblxuICBjb25zdCBtb2NrUmVzdWx0cyA9IFtcbiAgICB7IGlkOiAxLCB0aXRsZTogJ1Rhc2sgMScsIHRhZ3M6IFsndXJnZW50JywgJ3BlbmRpbmcnXSB9LFxuICAgIHsgaWQ6IDIsIHRpdGxlOiAnVGFzayAyJywgdGFnczogWyd1cmdlbnQnXSB9LFxuICAgIHsgaWQ6IDMsIHRpdGxlOiAnVGFzayAzJywgdGFnczogWydwZW5kaW5nJywgJ3JldmlldyddIH0sXG4gICAgeyBpZDogNCwgdGl0bGU6ICdUYXNrIDQnLCB0YWdzOiBbJ2NvbXBsZXRlZCddIH0sXG4gIF1cblxuICBjb25zdCBmaWx0ZXJlZFJlc3VsdHMgPSBmaWx0ZXJzLmxlbmd0aCA+IDBcbiAgICA/IG1vY2tSZXN1bHRzLmZpbHRlcihpdGVtID0+IGZpbHRlcnMuc29tZShmaWx0ZXIgPT4gaXRlbS50YWdzLmluY2x1ZGVzKGZpbHRlcikpKVxuICAgIDogbW9ja1Jlc3VsdHNcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc2MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+RmlsdGVyIFRhc2tzPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5BY3RpdmUgRmlsdGVyczo8L2xhYmVsPlxuICAgICAgICA8VGFnSW5wdXRcbiAgICAgICAgICBpdGVtcz17ZmlsdGVyc31cbiAgICAgICAgICBvbkNoYW5nZT17c2V0RmlsdGVyc31cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFkZCBmaWx0ZXIgdGFnLi4uXCJcbiAgICAgICAgICBjdXN0b21pemVkQ29uZmlybUtleT1cIkVudGVyXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMyB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICBSZXN1bHRzIChcbiAgICAgICAgICB7ZmlsdGVyZWRSZXN1bHRzLmxlbmd0aH1cbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIG9mXG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7bW9ja1Jlc3VsdHMubGVuZ3RofVxuICAgICAgICAgIClcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAge2ZpbHRlcmVkUmVzdWx0cy5tYXAoaXRlbSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW1cIj57aXRlbS50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIGZsZXggZ2FwLTFcIj5cbiAgICAgICAgICAgICAgICB7aXRlbS50YWdzLm1hcCh0YWcgPT4gKFxuICAgICAgICAgICAgICAgICAgPHNwYW4ga2V5PXt0YWd9IGNsYXNzTmFtZT1cInJvdW5kZWQgYmctYmx1ZS0xMDAgcHgtMiBweS0wLjUgdGV4dC14cyB0ZXh0LWJsdWUtNzAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0YWd9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFNlYXJjaEZpbHRlcnM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxTZWFyY2hGaWx0ZXJzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBQcm9kdWN0IGNhdGVnb3JpZXNcbmNvbnN0IFByb2R1Y3RDYXRlZ29yaWVzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoWydFbGVjdHJvbmljcycsICdDb21wdXRlcnMnXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc2MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+UHJvZHVjdCBEZXRhaWxzPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+UHJvZHVjdCBOYW1lPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcHgtMyBweS0yIHRleHQtc21cIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwcm9kdWN0IG5hbWUuLi5cIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPVwiTGFwdG9wIFBybyAxNVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+Q2F0ZWdvcmllczwvbGFiZWw+XG4gICAgICAgICAgPFRhZ0lucHV0XG4gICAgICAgICAgICBpdGVtcz17Y2F0ZWdvcmllc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDYXRlZ29yaWVzfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBZGQgY2F0ZWdvcnkuLi5cIlxuICAgICAgICAgICAgY3VzdG9taXplZENvbmZpcm1LZXk9XCJFbnRlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0xIHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgQWRkIHJlbGV2YW50IGNhdGVnb3JpZXMgdG8gaGVscCB1c2VycyBmaW5kIHRoaXMgcHJvZHVjdFxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+RGVzY3JpcHRpb248L2xhYmVsPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0zIHB5LTIgdGV4dC1zbVwiXG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwcm9kdWN0IGRlc2NyaXB0aW9uLi4uXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQcm9kdWN0Q2F0ZWdvcmllczogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFByb2R1Y3RDYXRlZ29yaWVzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBLZXl3b3JkIGV4dHJhY3Rpb25cbmNvbnN0IEtleXdvcmRFeHRyYWN0aW9uRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW2tleXdvcmRzLCBzZXRLZXl3b3Jkc10gPSB1c2VTdGF0ZShbJ0FJJywgJ21hY2hpbmUgbGVhcm5pbmcnLCAnYXV0b21hdGlvbiddKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzYwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5TRU8gS2V5d29yZHM8L2gzPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgTWV0YSBLZXl3b3Jkc1xuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8VGFnSW5wdXRcbiAgICAgICAgICBpdGVtcz17a2V5d29yZHN9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldEtleXdvcmRzfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQWRkIGtleXdvcmQuLi5cIlxuICAgICAgICAgIGN1c3RvbWl6ZWRDb25maXJtS2V5PVwiRW50ZXJcIlxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMiB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICBBZGQgcmVsZXZhbnQga2V5d29yZHMgZm9yIHNlYXJjaCBlbmdpbmUgb3B0aW1pemF0aW9uIChtYXggMjAgY2hhcmFjdGVycyBlYWNoKVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02IHJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTYwMFwiPk1ldGEgVGFnIFByZXZpZXc6PC9kaXY+XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICZsdDttZXRhIG5hbWU9XCJrZXl3b3Jkc1wiIGNvbnRlbnQ9XCJcbiAgICAgICAgICB7a2V5d29yZHMuam9pbignLCAnKX1cbiAgICAgICAgICBcIiAvJmd0O1xuICAgICAgICA8L2NvZGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgS2V5d29yZEV4dHJhY3Rpb246IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxLZXl3b3JkRXh0cmFjdGlvbkRlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gVGFncyB3aXRoIHN1Z2dlc3Rpb25zXG5jb25zdCBUYWdzV2l0aFN1Z2dlc3Rpb25zRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3RhZ3MsIHNldFRhZ3NdID0gdXNlU3RhdGUoWydkZXNpZ24nLCAnZnJvbnRlbmQnXSlcbiAgY29uc3Qgc3VnZ2VzdGlvbnMgPSBbJ2JhY2tlbmQnLCAnZGV2b3BzJywgJ21vYmlsZScsICd0ZXN0aW5nJywgJ3NlY3VyaXR5J11cblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc2MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+UHJvamVjdCBUYWdzPC9oMz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtYi0yIGJsb2NrIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgIEFkZCBUYWdzXG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxUYWdJbnB1dFxuICAgICAgICAgIGl0ZW1zPXt0YWdzfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRUYWdzfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSBvciBzZWxlY3QuLi5cIlxuICAgICAgICAgIGN1c3RvbWl6ZWRDb25maXJtS2V5PVwiRW50ZXJcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTYwMFwiPlN1Z2dlc3Rpb25zOjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0yXCI+XG4gICAgICAgICAge3N1Z2dlc3Rpb25zXG4gICAgICAgICAgICAuZmlsdGVyKHMgPT4gIXRhZ3MuaW5jbHVkZXMocykpXG4gICAgICAgICAgICAubWFwKHN1Z2dlc3Rpb24gPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAga2V5PXtzdWdnZXN0aW9ufVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyIHJvdW5kZWQgYmctZ3JheS0xMDAgcHgtMiBweS0xIHRleHQteHMgdGV4dC1ncmF5LTcwMCBob3ZlcjpiZy1ncmF5LTIwMFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0VGFncyhbLi4udGFncywgc3VnZ2VzdGlvbl0pfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgK1xuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAge3N1Z2dlc3Rpb259XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFRhZ3NXaXRoU3VnZ2VzdGlvbnM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxUYWdzV2l0aFN1Z2dlc3Rpb25zRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBTdG9wIHNlcXVlbmNlcyAoVGFiIG1vZGUpXG5jb25zdCBTdG9wU2VxdWVuY2VzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3N0b3BTZXF1ZW5jZXMsIHNldFN0b3BTZXF1ZW5jZXNdID0gdXNlU3RhdGUoWydIdW1hbjonLCAnQUk6J10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNjAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkFJIE1vZGVsIENvbmZpZ3VyYXRpb248L2gzPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICAgIFRlbXBlcmF0dXJlXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgIG1heD1cIjJcIlxuICAgICAgICAgICAgc3RlcD1cIjAuMVwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9XCIwLjdcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICAgIFN0b3AgU2VxdWVuY2VzXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGFnSW5wdXRcbiAgICAgICAgICAgIGl0ZW1zPXtzdG9wU2VxdWVuY2VzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3NldFN0b3BTZXF1ZW5jZXN9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlByZXNzIFRhYiB0byBhZGQuLi5cIlxuICAgICAgICAgICAgY3VzdG9taXplZENvbmZpcm1LZXk9XCJUYWJcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMSB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgIPCfkqEgUHJlc3MgVGFiIHRvIGFkZC4gUHJlc3MgRW50ZXIgdG8gaW5zZXJ0IOKGtSAobmV3bGluZSkgaW4gc2VxdWVuY2UuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICAgIE1heCBUb2tlbnNcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9XCIyMDAwXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcHgtMyBweS0yIHRleHQtc21cIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFN0b3BTZXF1ZW5jZXM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxTdG9wU2VxdWVuY2VzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBNdWx0aS1sYW5ndWFnZSB0YWdzXG5jb25zdCBNdWx0aUxhbmd1YWdlVGFnc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFt0YWdzLCBzZXRUYWdzXSA9IHVzZVN0YXRlKFsnSGVsbG8nLCAn5L2g5aW9JywgJ0JvbmpvdXInLCAnSG9sYSddKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzYwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5JbnRlcm5hdGlvbmFsaXphdGlvbjwvaDM+XG4gICAgICA8ZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICBHcmVldGluZyBUcmFuc2xhdGlvbnNcbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPFRhZ0lucHV0XG4gICAgICAgICAgaXRlbXM9e3RhZ3N9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldFRhZ3N9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJBZGQgdHJhbnNsYXRpb24uLi5cIlxuICAgICAgICAgIGN1c3RvbWl6ZWRDb25maXJtS2V5PVwiRW50ZXJcIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgU3VwcG9ydHMgbXVsdGktbGFuZ3VhZ2UgY2hhcmFjdGVycyAobWF4IDIwIGNoYXJhY3RlcnMpXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZ3JpZCBncmlkLWNvbHMtMiBnYXAtMlwiPlxuICAgICAgICB7dGFncy5tYXAoKHRhZywgaW5kZXgpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT1cInJvdW5kZWQgYmctZ3JheS01MCBwLTIgdGV4dC1zbVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vXCI+e3RhZ308L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IE11bHRpTGFuZ3VhZ2VUYWdzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8TXVsdGlMYW5ndWFnZVRhZ3NEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIFZhbGlkYXRpb24gc2hvd2Nhc2VcbmNvbnN0IFZhbGlkYXRpb25TaG93Y2FzZURlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFt0YWdzLCBzZXRUYWdzXSA9IHVzZVN0YXRlKFsndmFsaWQtdGFnJ10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNjAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlZhbGlkYXRpb24gUnVsZXM8L2gzPlxuICAgICAgPFRhZ0lucHV0XG4gICAgICAgIGl0ZW1zPXt0YWdzfVxuICAgICAgICBvbkNoYW5nZT17c2V0VGFnc31cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJUcnkgYWRkaW5nIHRhZ3MuLi5cIlxuICAgICAgICBjdXN0b21pemVkQ29uZmlybUtleT1cIkVudGVyXCJcbiAgICAgICAgcmVxdWlyZWRcbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1sZyBiZy1ibHVlLTUwIHAtNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWJsdWUtOTAwXCI+VmFsaWRhdGlvbiBSdWxlczo8L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInNwYWNlLXktMSB0ZXh0LXhzIHRleHQtYmx1ZS04MDBcIj5cbiAgICAgICAgICA8bGk+4pyTIE1heGltdW0gMjAgY2hhcmFjdGVycyBwZXIgdGFnPC9saT5cbiAgICAgICAgICA8bGk+4pyTIE5vIGR1cGxpY2F0ZSB0YWdzIGFsbG93ZWQ8L2xpPlxuICAgICAgICAgIDxsaT7inJMgQ2Fubm90IGFkZCBlbXB0eSB0YWdzICh3aGVuIHJlcXVpcmVkPXRydWUpPC9saT5cbiAgICAgICAgICA8bGk+4pyTIFdoaXRlc3BhY2UgaXMgYXV0b21hdGljYWxseSB0cmltbWVkPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IHJvdW5kZWQtbGcgYmcteWVsbG93LTUwIHAtNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXllbGxvdy05MDBcIj5UcnkgdGhlc2U6PC9kaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJzcGFjZS15LTEgdGV4dC14cyB0ZXh0LXllbGxvdy04MDBcIj5cbiAgICAgICAgICA8bGk+4oCiIEFkZCBcInZhbGlkLXRhZ1wiIOKGkiBTaG93cyBkdXBsaWNhdGUgZXJyb3I8L2xpPlxuICAgICAgICAgIDxsaT7igKIgQWRkIGVtcHR5IHN0cmluZyDihpIgU2hvd3MgZW1wdHkgZXJyb3I8L2xpPlxuICAgICAgICAgIDxsaT7igKIgQWRkIFwidGhpcy1pcy1hLXZlcnktbG9uZy10YWctbmFtZVwiIOKGkiBTaG93cyBsZW5ndGggZXJyb3I8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFZhbGlkYXRpb25TaG93Y2FzZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFZhbGlkYXRpb25TaG93Y2FzZURlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gSW50ZXJhY3RpdmUgcGxheWdyb3VuZFxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFRhZ0lucHV0RGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBpdGVtczogWyd0YWcxJywgJ3RhZzInXSxcbiAgICBwbGFjZWhvbGRlcjogJ0FkZCBhIHRhZy4uLicsXG4gICAgY3VzdG9taXplZENvbmZpcm1LZXk6ICdFbnRlcicsXG4gICAgZGlzYWJsZUFkZDogZmFsc2UsXG4gICAgZGlzYWJsZVJlbW92ZTogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICB9LFxufVxuIl19