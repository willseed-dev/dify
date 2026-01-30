"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@/app/components/base/icons/src/public/common");
const files_1 = require("@/app/components/base/icons/src/public/files");
const FileIcon = ({ type, className, }) => {
    switch (type) {
        case 'csv':
            return <files_1.Csv className={className}/>;
        case 'doc':
            return <files_1.Doc className={className}/>;
        case 'docx':
            return <files_1.Docx className={className}/>;
        case 'htm':
        case 'html':
            return <files_1.Html className={className}/>;
        case 'json':
            return <files_1.Json className={className}/>;
        case 'md':
        case 'markdown':
        case 'mdx':
            return <files_1.Md className={className}/>;
        case 'pdf':
            return <files_1.Pdf className={className}/>;
        case 'txt':
            return <files_1.Txt className={className}/>;
        case 'xls':
        case 'xlsx':
            return <files_1.Xlsx className={className}/>;
        case 'notion':
            return <common_1.Notion className={className}/>;
        default:
            return <files_1.Unknown className={className}/>;
    }
};
exports.default = FileIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwRUFBc0U7QUFDdEUsd0VBV3FEO0FBT3JELE1BQU0sUUFBUSxHQUFzQixDQUFDLEVBQ25DLElBQUksRUFDSixTQUFTLEdBQ1YsRUFBRSxFQUFFO0lBQ0gsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNiLEtBQUssS0FBSztZQUNSLE9BQU8sQ0FBQyxXQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQTtRQUN0QyxLQUFLLEtBQUs7WUFDUixPQUFPLENBQUMsV0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFHLENBQUE7UUFDdEMsS0FBSyxNQUFNO1lBQ1QsT0FBTyxDQUFDLFlBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFBO1FBQ3ZDLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxNQUFNO1lBQ1QsT0FBTyxDQUFDLFlBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFBO1FBQ3ZDLEtBQUssTUFBTTtZQUNULE9BQU8sQ0FBQyxZQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQTtRQUN2QyxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssVUFBVSxDQUFDO1FBQ2hCLEtBQUssS0FBSztZQUNSLE9BQU8sQ0FBQyxVQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQTtRQUNyQyxLQUFLLEtBQUs7WUFDUixPQUFPLENBQUMsV0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFHLENBQUE7UUFDdEMsS0FBSyxLQUFLO1lBQ1IsT0FBTyxDQUFDLFdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFBO1FBQ3RDLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxNQUFNO1lBQ1QsT0FBTyxDQUFDLFlBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFBO1FBQ3ZDLEtBQUssUUFBUTtZQUNYLE9BQU8sQ0FBQyxlQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQTtRQUN6QztZQUNFLE9BQU8sQ0FBQyxlQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQTtJQUM1QyxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTm90aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy9wdWJsaWMvY29tbW9uJ1xuaW1wb3J0IHtcbiAgQ3N2LFxuICBEb2MsXG4gIERvY3gsXG4gIEh0bWwsXG4gIEpzb24sXG4gIE1kLFxuICBQZGYsXG4gIFR4dCxcbiAgVW5rbm93bixcbiAgWGxzeCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy9wdWJsaWMvZmlsZXMnXG5cbnR5cGUgRmlsZUljb25Qcm9wcyA9IHtcbiAgdHlwZTogc3RyaW5nXG4gIGNsYXNzTmFtZT86IHN0cmluZ1xufVxuXG5jb25zdCBGaWxlSWNvbjogRkM8RmlsZUljb25Qcm9wcz4gPSAoe1xuICB0eXBlLFxuICBjbGFzc05hbWUsXG59KSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2Nzdic6XG4gICAgICByZXR1cm4gPENzdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgICBjYXNlICdkb2MnOlxuICAgICAgcmV0dXJuIDxEb2MgY2xhc3NOYW1lPXtjbGFzc05hbWV9IC8+XG4gICAgY2FzZSAnZG9jeCc6XG4gICAgICByZXR1cm4gPERvY3ggY2xhc3NOYW1lPXtjbGFzc05hbWV9IC8+XG4gICAgY2FzZSAnaHRtJzpcbiAgICBjYXNlICdodG1sJzpcbiAgICAgIHJldHVybiA8SHRtbCBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgICBjYXNlICdqc29uJzpcbiAgICAgIHJldHVybiA8SnNvbiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgICBjYXNlICdtZCc6XG4gICAgY2FzZSAnbWFya2Rvd24nOlxuICAgIGNhc2UgJ21keCc6XG4gICAgICByZXR1cm4gPE1kIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSAvPlxuICAgIGNhc2UgJ3BkZic6XG4gICAgICByZXR1cm4gPFBkZiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgICBjYXNlICd0eHQnOlxuICAgICAgcmV0dXJuIDxUeHQgY2xhc3NOYW1lPXtjbGFzc05hbWV9IC8+XG4gICAgY2FzZSAneGxzJzpcbiAgICBjYXNlICd4bHN4JzpcbiAgICAgIHJldHVybiA8WGxzeCBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgICBjYXNlICdub3Rpb24nOlxuICAgICAgcmV0dXJuIDxOb3Rpb24gY2xhc3NOYW1lPXtjbGFzc05hbWV9IC8+XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiA8VW5rbm93biBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz5cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlSWNvblxuIl19