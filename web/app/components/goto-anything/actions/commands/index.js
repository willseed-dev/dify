"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterSlashCommands = exports.SlashCommandProvider = exports.registerSlashCommands = exports.slashAction = exports.SlashCommandRegistry = exports.slashCommandRegistry = exports.unregisterCommands = exports.registerCommands = exports.executeCommand = void 0;
// Command bus (for extending with custom commands)
var command_bus_1 = require("./command-bus");
Object.defineProperty(exports, "executeCommand", { enumerable: true, get: function () { return command_bus_1.executeCommand; } });
Object.defineProperty(exports, "registerCommands", { enumerable: true, get: function () { return command_bus_1.registerCommands; } });
Object.defineProperty(exports, "unregisterCommands", { enumerable: true, get: function () { return command_bus_1.unregisterCommands; } });
// Command registry system (for extending with custom commands)
var registry_1 = require("./registry");
Object.defineProperty(exports, "slashCommandRegistry", { enumerable: true, get: function () { return registry_1.slashCommandRegistry; } });
Object.defineProperty(exports, "SlashCommandRegistry", { enumerable: true, get: function () { return registry_1.SlashCommandRegistry; } });
// Command system exports
var slash_1 = require("./slash");
Object.defineProperty(exports, "slashAction", { enumerable: true, get: function () { return slash_1.slashAction; } });
var slash_2 = require("./slash");
Object.defineProperty(exports, "registerSlashCommands", { enumerable: true, get: function () { return slash_2.registerSlashCommands; } });
Object.defineProperty(exports, "SlashCommandProvider", { enumerable: true, get: function () { return slash_2.SlashCommandProvider; } });
Object.defineProperty(exports, "unregisterSlashCommands", { enumerable: true, get: function () { return slash_2.unregisterSlashCommands; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBbUQ7QUFDbkQsNkNBS3NCO0FBSHBCLDZHQUFBLGNBQWMsT0FBQTtBQUNkLCtHQUFBLGdCQUFnQixPQUFBO0FBQ2hCLGlIQUFBLGtCQUFrQixPQUFBO0FBRXBCLCtEQUErRDtBQUMvRCx1Q0FBdUU7QUFBOUQsZ0hBQUEsb0JBQW9CLE9BQUE7QUFBRSxnSEFBQSxvQkFBb0IsT0FBQTtBQUVuRCx5QkFBeUI7QUFDekIsaUNBQXFDO0FBQTVCLG9HQUFBLFdBQVcsT0FBQTtBQUNwQixpQ0FBOEY7QUFBckYsOEdBQUEscUJBQXFCLE9BQUE7QUFBRSw2R0FBQSxvQkFBb0IsT0FBQTtBQUFFLGdIQUFBLHVCQUF1QixPQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tbWFuZCBidXMgKGZvciBleHRlbmRpbmcgd2l0aCBjdXN0b20gY29tbWFuZHMpXG5leHBvcnQge1xuICB0eXBlIENvbW1hbmRIYW5kbGVyLFxuICBleGVjdXRlQ29tbWFuZCxcbiAgcmVnaXN0ZXJDb21tYW5kcyxcbiAgdW5yZWdpc3RlckNvbW1hbmRzLFxufSBmcm9tICcuL2NvbW1hbmQtYnVzJ1xuLy8gQ29tbWFuZCByZWdpc3RyeSBzeXN0ZW0gKGZvciBleHRlbmRpbmcgd2l0aCBjdXN0b20gY29tbWFuZHMpXG5leHBvcnQgeyBzbGFzaENvbW1hbmRSZWdpc3RyeSwgU2xhc2hDb21tYW5kUmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5J1xuXG4vLyBDb21tYW5kIHN5c3RlbSBleHBvcnRzXG5leHBvcnQgeyBzbGFzaEFjdGlvbiB9IGZyb20gJy4vc2xhc2gnXG5leHBvcnQgeyByZWdpc3RlclNsYXNoQ29tbWFuZHMsIFNsYXNoQ29tbWFuZFByb3ZpZGVyLCB1bnJlZ2lzdGVyU2xhc2hDb21tYW5kcyB9IGZyb20gJy4vc2xhc2gnXG5cbmV4cG9ydCB0eXBlIHsgU2xhc2hDb21tYW5kSGFuZGxlciB9IGZyb20gJy4vdHlwZXMnXG4iXX0=