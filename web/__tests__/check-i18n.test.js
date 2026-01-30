"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_vm_1 = require("node:vm");
const typescript_1 = require("typescript");
describe('i18n:check script functionality', () => {
    const testDir = node_path_1.default.join(__dirname, '../i18n-test');
    const testEnDir = node_path_1.default.join(testDir, 'en-US');
    const testZhDir = node_path_1.default.join(testDir, 'zh-Hans');
    // Helper function that replicates the getKeysFromLanguage logic
    async function getKeysFromLanguage(language, testPath = testDir) {
        return new Promise((resolve, reject) => {
            const folderPath = node_path_1.default.resolve(testPath, language);
            const allKeys = [];
            if (!node_fs_1.default.existsSync(folderPath)) {
                resolve([]);
                return;
            }
            node_fs_1.default.readdir(folderPath, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                const translationFiles = files.filter(file => /\.(ts|js)$/.test(file));
                translationFiles.forEach((file) => {
                    const filePath = node_path_1.default.join(folderPath, file);
                    const fileName = file.replace(/\.[^/.]+$/, '');
                    const camelCaseFileName = fileName.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
                    try {
                        const content = node_fs_1.default.readFileSync(filePath, 'utf8');
                        const moduleExports = {};
                        const context = {
                            exports: moduleExports,
                            module: { exports: moduleExports },
                            require,
                            console,
                            __filename: filePath,
                            __dirname: folderPath,
                        };
                        node_vm_1.default.runInNewContext((0, typescript_1.transpile)(content), context);
                        const translationObj = context.module.exports.default || context.module.exports;
                        if (!translationObj || typeof translationObj !== 'object')
                            throw new Error(`Error parsing file: ${filePath}`);
                        const nestedKeys = [];
                        const iterateKeys = (obj, prefix = '') => {
                            for (const key in obj) {
                                const nestedKey = prefix ? `${prefix}.${key}` : key;
                                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                                    // This is an object (but not array), recurse into it but don't add it as a key
                                    iterateKeys(obj[key], nestedKey);
                                }
                                else {
                                    // This is a leaf node (string, number, boolean, array, etc.), add it as a key
                                    nestedKeys.push(nestedKey);
                                }
                            }
                        };
                        iterateKeys(translationObj);
                        const fileKeys = nestedKeys.map(key => `${camelCaseFileName}.${key}`);
                        allKeys.push(...fileKeys);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                resolve(allKeys);
            });
        });
    }
    beforeEach(() => {
        // Clean up and create test directories
        if (node_fs_1.default.existsSync(testDir))
            node_fs_1.default.rmSync(testDir, { recursive: true });
        node_fs_1.default.mkdirSync(testDir, { recursive: true });
        node_fs_1.default.mkdirSync(testEnDir, { recursive: true });
        node_fs_1.default.mkdirSync(testZhDir, { recursive: true });
    });
    afterEach(() => {
        // Clean up test files
        if (node_fs_1.default.existsSync(testDir))
            node_fs_1.default.rmSync(testDir, { recursive: true });
    });
    describe('Key extraction logic', () => {
        it('should extract only leaf node keys, not intermediate objects', async () => {
            const testContent = `const translation = {
  simple: 'Simple Value',
  nested: {
    level1: 'Level 1 Value',
    deep: {
      level2: 'Level 2 Value'
    }
  },
  array: ['not extracted'],
  number: 42,
  boolean: true
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'test.ts'), testContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toEqual([
                'test.simple',
                'test.nested.level1',
                'test.nested.deep.level2',
                'test.array',
                'test.number',
                'test.boolean',
            ]);
            // Should not include intermediate object keys
            expect(keys).not.toContain('test.nested');
            expect(keys).not.toContain('test.nested.deep');
        });
        it('should handle camelCase file name conversion correctly', async () => {
            const testContent = `const translation = {
  key: 'value'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'app-debug.ts'), testContent);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'user_profile.ts'), testContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('appDebug.key');
            expect(keys).toContain('userProfile.key');
        });
    });
    describe('Missing keys detection', () => {
        it('should detect missing keys in target language', async () => {
            const enContent = `const translation = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete'
  },
  app: {
    title: 'My App',
    version: '1.0'
  }
}

export default translation
`;
            const zhContent = `const translation = {
  common: {
    save: '保存',
    cancel: '取消'
    // missing 'delete'
  },
  app: {
    title: '我的应用'
    // missing 'version'
  }
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'test.ts'), enContent);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'test.ts'), zhContent);
            const enKeys = await getKeysFromLanguage('en-US');
            const zhKeys = await getKeysFromLanguage('zh-Hans');
            const missingKeys = enKeys.filter(key => !zhKeys.includes(key));
            expect(missingKeys).toContain('test.common.delete');
            expect(missingKeys).toContain('test.app.version');
            expect(missingKeys).toHaveLength(2);
        });
    });
    describe('Extra keys detection', () => {
        it('should detect extra keys in target language', async () => {
            const enContent = `const translation = {
  common: {
    save: 'Save',
    cancel: 'Cancel'
  }
}

export default translation
`;
            const zhContent = `const translation = {
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除', // extra key
    extra: '额外的' // another extra key
  },
  newSection: {
    someKey: '某个值' // extra section
  }
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'test.ts'), enContent);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'test.ts'), zhContent);
            const enKeys = await getKeysFromLanguage('en-US');
            const zhKeys = await getKeysFromLanguage('zh-Hans');
            const extraKeys = zhKeys.filter(key => !enKeys.includes(key));
            expect(extraKeys).toContain('test.common.delete');
            expect(extraKeys).toContain('test.common.extra');
            expect(extraKeys).toContain('test.newSection.someKey');
            expect(extraKeys).toHaveLength(3);
        });
    });
    describe('File filtering logic', () => {
        it('should filter keys by specific file correctly', async () => {
            // Create multiple files
            const file1Content = `const translation = {
  button: 'Button',
  text: 'Text'
}

export default translation
`;
            const file2Content = `const translation = {
  title: 'Title',
  description: 'Description'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'components.ts'), file1Content);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'pages.ts'), file2Content);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'components.ts'), file1Content);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'pages.ts'), file2Content);
            const allEnKeys = await getKeysFromLanguage('en-US');
            // Test file filtering logic
            const targetFile = 'components';
            const filteredEnKeys = allEnKeys.filter(key => key.startsWith(targetFile.replace(/[-_](.)/g, (_, c) => c.toUpperCase())));
            expect(allEnKeys).toHaveLength(4); // 2 keys from each file
            expect(filteredEnKeys).toHaveLength(2); // only components keys
            expect(filteredEnKeys).toContain('components.button');
            expect(filteredEnKeys).toContain('components.text');
            expect(filteredEnKeys).not.toContain('pages.title');
            expect(filteredEnKeys).not.toContain('pages.description');
        });
    });
    describe('Complex nested structure handling', () => {
        it('should handle deeply nested objects correctly', async () => {
            const complexContent = `const translation = {
  level1: {
    level2: {
      level3: {
        level4: {
          deepValue: 'Deep Value'
        },
        anotherValue: 'Another Value'
      },
      simpleValue: 'Simple Value'
    },
    directValue: 'Direct Value'
  },
  rootValue: 'Root Value'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'complex.ts'), complexContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('complex.level1.level2.level3.level4.deepValue');
            expect(keys).toContain('complex.level1.level2.level3.anotherValue');
            expect(keys).toContain('complex.level1.level2.simpleValue');
            expect(keys).toContain('complex.level1.directValue');
            expect(keys).toContain('complex.rootValue');
            // Should not include intermediate objects
            expect(keys).not.toContain('complex.level1');
            expect(keys).not.toContain('complex.level1.level2');
            expect(keys).not.toContain('complex.level1.level2.level3');
            expect(keys).not.toContain('complex.level1.level2.level3.level4');
        });
    });
    describe('Edge cases', () => {
        it('should handle empty objects', async () => {
            const emptyContent = `const translation = {
  empty: {},
  withValue: 'value'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'empty.ts'), emptyContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('empty.withValue');
            expect(keys).not.toContain('empty.empty');
        });
        it('should handle special characters in keys', async () => {
            const specialContent = `const translation = {
  'key-with-dash': 'value1',
  'key_with_underscore': 'value2',
  'key.with.dots': 'value3',
  normalKey: 'value4'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'special.ts'), specialContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('special.key-with-dash');
            expect(keys).toContain('special.key_with_underscore');
            expect(keys).toContain('special.key.with.dots');
            expect(keys).toContain('special.normalKey');
        });
        it('should handle different value types', async () => {
            const typesContent = `const translation = {
  stringValue: 'string',
  numberValue: 42,
  booleanValue: true,
  nullValue: null,
  undefinedValue: undefined,
  arrayValue: ['array', 'values'],
  objectValue: {
    nested: 'nested value'
  }
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'types.ts'), typesContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('types.stringValue');
            expect(keys).toContain('types.numberValue');
            expect(keys).toContain('types.booleanValue');
            expect(keys).toContain('types.nullValue');
            expect(keys).toContain('types.undefinedValue');
            expect(keys).toContain('types.arrayValue');
            expect(keys).toContain('types.objectValue.nested');
            expect(keys).not.toContain('types.objectValue');
        });
    });
    describe('Real-world scenario tests', () => {
        it('should handle app-debug structure like real files', async () => {
            const appDebugEn = `const translation = {
  pageTitle: {
    line1: 'Prompt',
    line2: 'Engineering'
  },
  operation: {
    applyConfig: 'Publish',
    resetConfig: 'Reset',
    debugConfig: 'Debug'
  },
  generate: {
    instruction: 'Instructions',
    generate: 'Generate',
    resTitle: 'Generated Prompt',
    noDataLine1: 'Describe your use case on the left,',
    noDataLine2: 'the orchestration preview will show here.'
  }
}

export default translation
`;
            const appDebugZh = `const translation = {
  pageTitle: {
    line1: '提示词',
    line2: '编排'
  },
  operation: {
    applyConfig: '发布',
    resetConfig: '重置',
    debugConfig: '调试'
  },
  generate: {
    instruction: '指令',
    generate: '生成',
    resTitle: '生成的提示词',
    noData: '在左侧描述您的用例，编排预览将在此处显示。' // This is extra
  }
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'app-debug.ts'), appDebugEn);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'app-debug.ts'), appDebugZh);
            const enKeys = await getKeysFromLanguage('en-US');
            const zhKeys = await getKeysFromLanguage('zh-Hans');
            const missingKeys = enKeys.filter(key => !zhKeys.includes(key));
            const extraKeys = zhKeys.filter(key => !enKeys.includes(key));
            expect(missingKeys).toContain('appDebug.generate.noDataLine1');
            expect(missingKeys).toContain('appDebug.generate.noDataLine2');
            expect(extraKeys).toContain('appDebug.generate.noData');
            expect(missingKeys).toHaveLength(2);
            expect(extraKeys).toHaveLength(1);
        });
        it('should handle time structure with operation nested keys', async () => {
            const timeEn = `const translation = {
  months: {
    January: 'January',
    February: 'February'
  },
  operation: {
    now: 'Now',
    ok: 'OK',
    cancel: 'Cancel',
    pickDate: 'Pick Date'
  },
  title: {
    pickTime: 'Pick Time'
  },
  defaultPlaceholder: 'Pick a time...'
}

export default translation
`;
            const timeZh = `const translation = {
  months: {
    January: '一月',
    February: '二月'
  },
  operation: {
    now: '此刻',
    ok: '确定',
    cancel: '取消',
    pickDate: '选择日期'
  },
  title: {
    pickTime: '选择时间'
  },
  pickDate: '选择日期', // This is extra - duplicates operation.pickDate
  defaultPlaceholder: '请选择时间...'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'time.ts'), timeEn);
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'time.ts'), timeZh);
            const enKeys = await getKeysFromLanguage('en-US');
            const zhKeys = await getKeysFromLanguage('zh-Hans');
            const missingKeys = enKeys.filter(key => !zhKeys.includes(key));
            const extraKeys = zhKeys.filter(key => !enKeys.includes(key));
            expect(missingKeys).toHaveLength(0); // No missing keys
            expect(extraKeys).toContain('time.pickDate'); // Extra root-level pickDate
            expect(extraKeys).toHaveLength(1);
            // Should have both keys available
            expect(zhKeys).toContain('time.operation.pickDate'); // Correct nested key
            expect(zhKeys).toContain('time.pickDate'); // Extra duplicate key
        });
    });
    describe('Statistics calculation', () => {
        it('should calculate correct difference statistics', async () => {
            const enContent = `const translation = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
}

export default translation
`;
            const zhContentMissing = `const translation = {
  key1: 'value1',
  key2: 'value2'
  // missing key3
}

export default translation
`;
            const zhContentExtra = `const translation = {
  key1: 'value1',
  key2: 'value2', 
  key3: 'value3',
  key4: 'extra',
  key5: 'extra2'
}

export default translation
`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'stats.ts'), enContent);
            // Test missing keys scenario
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'stats.ts'), zhContentMissing);
            const enKeys = await getKeysFromLanguage('en-US');
            const zhKeysMissing = await getKeysFromLanguage('zh-Hans');
            expect(enKeys.length - zhKeysMissing.length).toBe(1); // +1 means 1 missing key
            // Test extra keys scenario
            node_fs_1.default.writeFileSync(node_path_1.default.join(testZhDir, 'stats.ts'), zhContentExtra);
            const zhKeysExtra = await getKeysFromLanguage('zh-Hans');
            expect(enKeys.length - zhKeysExtra.length).toBe(-2); // -2 means 2 extra keys
        });
    });
    describe('Auto-remove multiline key-value pairs', () => {
        // Helper function to simulate removeExtraKeysFromFile logic
        function removeExtraKeysFromFile(content, keysToRemove) {
            const lines = content.split('\n');
            const linesToRemove = [];
            for (const keyToRemove of keysToRemove) {
                let targetLineIndex = -1;
                const linesToRemoveForKey = [];
                // Find the key line (simplified for single-level keys in test)
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const keyPattern = new RegExp(`^\\s*${keyToRemove}\\s*:`);
                    if (keyPattern.test(line)) {
                        targetLineIndex = i;
                        break;
                    }
                }
                if (targetLineIndex !== -1) {
                    linesToRemoveForKey.push(targetLineIndex);
                    // Check if this is a multiline key-value pair
                    const keyLine = lines[targetLineIndex];
                    const trimmedKeyLine = keyLine.trim();
                    // If key line ends with ":" (not complete value), it's likely multiline
                    if (trimmedKeyLine.endsWith(':') && !trimmedKeyLine.includes('{') && !trimmedKeyLine.match(/:\s*['"`]/)) {
                        // Find the value lines that belong to this key
                        let currentLine = targetLineIndex + 1;
                        let foundValue = false;
                        while (currentLine < lines.length) {
                            const line = lines[currentLine];
                            const trimmed = line.trim();
                            // Skip empty lines
                            if (trimmed === '') {
                                currentLine++;
                                continue;
                            }
                            // Check if this line starts a new key (indicates end of current value)
                            if (trimmed.match(/^\w+\s*:/))
                                break;
                            // Check if this line is part of the value
                            if (trimmed.startsWith('\'') || trimmed.startsWith('"') || trimmed.startsWith('`') || foundValue) {
                                linesToRemoveForKey.push(currentLine);
                                foundValue = true;
                                // Check if this line ends the value (ends with quote and comma/no comma)
                                if ((trimmed.endsWith('\',') || trimmed.endsWith('",') || trimmed.endsWith('`,')
                                    || trimmed.endsWith('\'') || trimmed.endsWith('"') || trimmed.endsWith('`'))
                                    && !trimmed.startsWith('//')) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                            currentLine++;
                        }
                    }
                    linesToRemove.push(...linesToRemoveForKey);
                }
            }
            // Remove duplicates and sort in reverse order
            const uniqueLinesToRemove = [...new Set(linesToRemove)].sort((a, b) => b - a);
            for (const lineIndex of uniqueLinesToRemove)
                lines.splice(lineIndex, 1);
            return lines.join('\n');
        }
        it('should remove single-line key-value pairs correctly', () => {
            const content = `const translation = {
  keepThis: 'This should stay',
  removeThis: 'This should be removed',
  alsoKeep: 'This should also stay',
}

export default translation`;
            const result = removeExtraKeysFromFile(content, ['removeThis']);
            expect(result).toContain('keepThis: \'This should stay\'');
            expect(result).toContain('alsoKeep: \'This should also stay\'');
            expect(result).not.toContain('removeThis: \'This should be removed\'');
        });
        it('should remove multiline key-value pairs completely', () => {
            const content = `const translation = {
  keepThis: 'This should stay',
  removeMultiline:
    'This is a multiline value that should be removed completely',
  alsoKeep: 'This should also stay',
}

export default translation`;
            const result = removeExtraKeysFromFile(content, ['removeMultiline']);
            expect(result).toContain('keepThis: \'This should stay\'');
            expect(result).toContain('alsoKeep: \'This should also stay\'');
            expect(result).not.toContain('removeMultiline:');
            expect(result).not.toContain('This is a multiline value that should be removed completely');
        });
        it('should handle mixed single-line and multiline removals', () => {
            const content = `const translation = {
  keepThis: 'Keep this',
  removeSingle: 'Remove this single line',
  removeMultiline:
    'Remove this multiline value',
  anotherMultiline:
    'Another multiline that spans multiple lines',
  keepAnother: 'Keep this too',
}

export default translation`;
            const result = removeExtraKeysFromFile(content, ['removeSingle', 'removeMultiline', 'anotherMultiline']);
            expect(result).toContain('keepThis: \'Keep this\'');
            expect(result).toContain('keepAnother: \'Keep this too\'');
            expect(result).not.toContain('removeSingle:');
            expect(result).not.toContain('removeMultiline:');
            expect(result).not.toContain('anotherMultiline:');
            expect(result).not.toContain('Remove this single line');
            expect(result).not.toContain('Remove this multiline value');
            expect(result).not.toContain('Another multiline that spans multiple lines');
        });
        it('should properly detect multiline vs single-line patterns', () => {
            const multilineContent = `const translation = {
  singleLine: 'This is single line',
  multilineKey:
    'This is multiline',
  keyWithColon: 'Value with: colon inside',
  objectKey: {
    nested: 'value'
  },
}

export default translation`;
            // Test that single line with colon in value is not treated as multiline
            const result1 = removeExtraKeysFromFile(multilineContent, ['keyWithColon']);
            expect(result1).not.toContain('keyWithColon:');
            expect(result1).not.toContain('Value with: colon inside');
            // Test that true multiline is handled correctly
            const result2 = removeExtraKeysFromFile(multilineContent, ['multilineKey']);
            expect(result2).not.toContain('multilineKey:');
            expect(result2).not.toContain('This is multiline');
            // Test that object key removal works (note: this is a simplified test)
            // In real scenario, object removal would be more complex
            const result3 = removeExtraKeysFromFile(multilineContent, ['objectKey']);
            expect(result3).not.toContain('objectKey: {');
            // Note: Our simplified test function doesn't handle nested object removal perfectly
            // This is acceptable as it's testing the main multiline string removal functionality
        });
        it('should handle real-world Polish translation structure', () => {
            const polishContent = `const translation = {
  createApp: 'UTWÓRZ APLIKACJĘ',
  newApp: {
    captionAppType: 'Jaki typ aplikacji chcesz stworzyć?',
    chatbotDescription:
      'Zbuduj aplikację opartą na czacie. Ta aplikacja używa formatu pytań i odpowiedzi.',
    agentDescription:
      'Zbuduj inteligentnego agenta, który może autonomicznie wybierać narzędzia.',
    basic: 'Podstawowy',
  },
}

export default translation`;
            const result = removeExtraKeysFromFile(polishContent, ['captionAppType', 'chatbotDescription', 'agentDescription']);
            expect(result).toContain('createApp: \'UTWÓRZ APLIKACJĘ\'');
            expect(result).toContain('basic: \'Podstawowy\'');
            expect(result).not.toContain('captionAppType:');
            expect(result).not.toContain('chatbotDescription:');
            expect(result).not.toContain('agentDescription:');
            expect(result).not.toContain('Jaki typ aplikacji');
            expect(result).not.toContain('Zbuduj aplikację opartą na czacie');
            expect(result).not.toContain('Zbuduj inteligentnego agenta');
        });
    });
    describe('Performance and Scalability', () => {
        it('should handle large translation files efficiently', async () => {
            // Create a large translation file with 1000 keys
            const largeContent = `const translation = {
${Array.from({ length: 1000 }, (_, i) => `  key${i}: 'value${i}',`).join('\n')}
}

export default translation`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'large.ts'), largeContent);
            const startTime = Date.now();
            const keys = await getKeysFromLanguage('en-US');
            const endTime = Date.now();
            expect(keys.length).toBe(1000);
            expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
        });
        it('should handle multiple translation files concurrently', async () => {
            // Create multiple files
            for (let i = 0; i < 10; i++) {
                const content = `const translation = {
  key${i}: 'value${i}',
  nested${i}: {
    subkey: 'subvalue'
  }
}

export default translation`;
                node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, `file${i}.ts`), content);
            }
            const startTime = Date.now();
            const keys = await getKeysFromLanguage('en-US');
            const endTime = Date.now();
            expect(keys.length).toBe(20); // 10 files * 2 keys each
            expect(endTime - startTime).toBeLessThan(500);
        });
    });
    describe('Unicode and Internationalization', () => {
        it('should handle Unicode characters in keys and values', async () => {
            const unicodeContent = `const translation = {
  '中文键': '中文值',
  'العربية': 'قيمة',
  'emoji_😀': 'value with emoji 🎉',
  'mixed_中文_English': 'mixed value'
}

export default translation`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'unicode.ts'), unicodeContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('unicode.中文键');
            expect(keys).toContain('unicode.العربية');
            expect(keys).toContain('unicode.emoji_😀');
            expect(keys).toContain('unicode.mixed_中文_English');
        });
        it('should handle RTL language files', async () => {
            const rtlContent = `const translation = {
  مرحبا: 'Hello',
  العالم: 'World',
  nested: {
    مفتاح: 'key'
  }
}

export default translation`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'rtl.ts'), rtlContent);
            const keys = await getKeysFromLanguage('en-US');
            expect(keys).toContain('rtl.مرحبا');
            expect(keys).toContain('rtl.العالم');
            expect(keys).toContain('rtl.nested.مفتاح');
        });
    });
    describe('Error Recovery', () => {
        it('should handle syntax errors in translation files gracefully', async () => {
            const invalidContent = `const translation = {
  validKey: 'valid value',
  invalidKey: 'missing quote,
  anotherKey: 'another value'
}

export default translation`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(testEnDir, 'invalid.ts'), invalidContent);
            await expect(getKeysFromLanguage('en-US')).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2staTE4bi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hlY2staTE4bi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXdCO0FBQ3hCLHlDQUE0QjtBQUM1QixxQ0FBd0I7QUFDeEIsMkNBQXNDO0FBRXRDLFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQ3BELE1BQU0sU0FBUyxHQUFHLG1CQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUM3QyxNQUFNLFNBQVMsR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFFL0MsZ0VBQWdFO0lBQ2hFLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxRQUFnQixFQUFFLFFBQVEsR0FBRyxPQUFPO1FBQ3JFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxVQUFVLEdBQUcsbUJBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1lBQ25ELE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQTtZQUU1QixJQUFJLENBQUMsaUJBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNYLE9BQU07WUFDUixDQUFDO1lBRUQsaUJBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNwQyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDWCxPQUFNO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxnQkFBZ0Is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QUU1RCxNQUFNLElBQUksR0FBRyxNQUFNLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRS9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzNFLE1BQU0sY0FBYyxHQUFHOzs7Ozs7MkJBTUYsQ0FBQTtZQUVyQixpQkFBRSxDQUFDLGFBQWEsQ0FBQyxtQkFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUE7WUFFcEUsTUFBTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgdm0gZnJvbSAnbm9kZTp2bSdcbmltcG9ydCB7IHRyYW5zcGlsZSB9IGZyb20gJ3R5cGVzY3JpcHQnXG5cbmRlc2NyaWJlKCdpMThuOmNoZWNrIHNjcmlwdCBmdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICBjb25zdCB0ZXN0RGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2kxOG4tdGVzdCcpXG4gIGNvbnN0IHRlc3RFbkRpciA9IHBhdGguam9pbih0ZXN0RGlyLCAnZW4tVVMnKVxuICBjb25zdCB0ZXN0WmhEaXIgPSBwYXRoLmpvaW4odGVzdERpciwgJ3poLUhhbnMnKVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJlcGxpY2F0ZXMgdGhlIGdldEtleXNGcm9tTGFuZ3VhZ2UgbG9naWNcbiAgYXN5bmMgZnVuY3Rpb24gZ2V0S2V5c0Zyb21MYW5ndWFnZShsYW5ndWFnZTogc3RyaW5nLCB0ZXN0UGF0aCA9IHRlc3REaXIpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGZvbGRlclBhdGggPSBwYXRoLnJlc29sdmUodGVzdFBhdGgsIGxhbmd1YWdlKVxuICAgICAgY29uc3QgYWxsS2V5czogc3RyaW5nW10gPSBbXVxuXG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZm9sZGVyUGF0aCkpIHtcbiAgICAgICAgcmVzb2x2ZShbXSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGZzLnJlYWRkaXIoZm9sZGVyUGF0aCwgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbkZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gL1xcLih0c3xqcykkLy50ZXN0KGZpbGUpKVxuXG4gICAgICAgIHRyYW5zbGF0aW9uRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZvbGRlclBhdGgsIGZpbGUpXG4gICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlLnJlcGxhY2UoL1xcLlteLy5dKyQvLCAnJylcbiAgICAgICAgICBjb25zdCBjYW1lbENhc2VGaWxlTmFtZSA9IGZpbGVOYW1lLnJlcGxhY2UoL1stX10oLikvZywgKF8sIGMpID0+XG4gICAgICAgICAgICBjLnRvVXBwZXJDYXNlKCkpXG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKVxuICAgICAgICAgICAgY29uc3QgbW9kdWxlRXhwb3J0cyA9IHt9XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgICAgICAgICBleHBvcnRzOiBtb2R1bGVFeHBvcnRzLFxuICAgICAgICAgICAgICBtb2R1bGU6IHsgZXhwb3J0czogbW9kdWxlRXhwb3J0cyB9LFxuICAgICAgICAgICAgICByZXF1aXJlLFxuICAgICAgICAgICAgICBjb25zb2xlLFxuICAgICAgICAgICAgICBfX2ZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgX19kaXJuYW1lOiBmb2xkZXJQYXRoLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2bS5ydW5Jbk5ld0NvbnRleHQodHJhbnNwaWxlKGNvbnRlbnQpLCBjb250ZXh0KVxuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb25PYmogPSAoY29udGV4dC5tb2R1bGUuZXhwb3J0cyBhcyBhbnkpLmRlZmF1bHQgfHwgY29udGV4dC5tb2R1bGUuZXhwb3J0c1xuXG4gICAgICAgICAgICBpZiAoIXRyYW5zbGF0aW9uT2JqIHx8IHR5cGVvZiB0cmFuc2xhdGlvbk9iaiAhPT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcGFyc2luZyBmaWxlOiAke2ZpbGVQYXRofWApXG5cbiAgICAgICAgICAgIGNvbnN0IG5lc3RlZEtleXM6IHN0cmluZ1tdID0gW11cbiAgICAgICAgICAgIGNvbnN0IGl0ZXJhdGVLZXlzID0gKG9iajogYW55LCBwcmVmaXggPSAnJykgPT4ge1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXN0ZWRLZXkgPSBwcmVmaXggPyBgJHtwcmVmaXh9LiR7a2V5fWAgOiBrZXlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0JyAmJiBvYmpba2V5XSAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShvYmpba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gb2JqZWN0IChidXQgbm90IGFycmF5KSwgcmVjdXJzZSBpbnRvIGl0IGJ1dCBkb24ndCBhZGQgaXQgYXMgYSBrZXlcbiAgICAgICAgICAgICAgICAgIGl0ZXJhdGVLZXlzKG9ialtrZXldLCBuZXN0ZWRLZXkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGxlYWYgbm9kZSAoc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIGFycmF5LCBldGMuKSwgYWRkIGl0IGFzIGEga2V5XG4gICAgICAgICAgICAgICAgICBuZXN0ZWRLZXlzLnB1c2gobmVzdGVkS2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlcmF0ZUtleXModHJhbnNsYXRpb25PYmopXG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVLZXlzID0gbmVzdGVkS2V5cy5tYXAoa2V5ID0+IGAke2NhbWVsQ2FzZUZpbGVOYW1lfS4ke2tleX1gKVxuICAgICAgICAgICAgYWxsS2V5cy5wdXNoKC4uLmZpbGVLZXlzKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJlc29sdmUoYWxsS2V5cylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIENsZWFuIHVwIGFuZCBjcmVhdGUgdGVzdCBkaXJlY3Rvcmllc1xuICAgIGlmIChmcy5leGlzdHNTeW5jKHRlc3REaXIpKVxuICAgICAgZnMucm1TeW5jKHRlc3REaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG5cbiAgICBmcy5ta2RpclN5bmModGVzdERpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgICBmcy5ta2RpclN5bmModGVzdEVuRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgIGZzLm1rZGlyU3luYyh0ZXN0WmhEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAvLyBDbGVhbiB1cCB0ZXN0IGZpbGVzXG4gICAgaWYgKGZzLmV4aXN0c1N5bmModGVzdERpcikpXG4gICAgICBmcy5ybVN5bmModGVzdERpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnS2V5IGV4dHJhY3Rpb24gbG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IG9ubHkgbGVhZiBub2RlIGtleXMsIG5vdCBpbnRlcm1lZGlhdGUgb2JqZWN0cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3RDb250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICBzaW1wbGU6ICdTaW1wbGUgVmFsdWUnLFxuICBuZXN0ZWQ6IHtcbiAgICBsZXZlbDE6ICdMZXZlbCAxIFZhbHVlJyxcbiAgICBkZWVwOiB7XG4gICAgICBsZXZlbDI6ICdMZXZlbCAyIFZhbHVlJ1xuICAgIH1cbiAgfSxcbiAgYXJyYXk6IFsnbm90IGV4dHJhY3RlZCddLFxuICBudW1iZXI6IDQyLFxuICBib29sZWFuOiB0cnVlXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uXG5gXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ3Rlc3QudHMnKSwgdGVzdENvbnRlbnQpXG5cbiAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG5cbiAgICAgIGV4cGVjdChrZXlzKS50b0VxdWFsKFtcbiAgICAgICAgJ3Rlc3Quc2ltcGxlJyxcbiAgICAgICAgJ3Rlc3QubmVzdGVkLmxldmVsMScsXG4gICAgICAgICd0ZXN0Lm5lc3RlZC5kZWVwLmxldmVsMicsXG4gICAgICAgICd0ZXN0LmFycmF5JyxcbiAgICAgICAgJ3Rlc3QubnVtYmVyJyxcbiAgICAgICAgJ3Rlc3QuYm9vbGVhbicsXG4gICAgICBdKVxuXG4gICAgICAvLyBTaG91bGQgbm90IGluY2x1ZGUgaW50ZXJtZWRpYXRlIG9iamVjdCBrZXlzXG4gICAgICBleHBlY3Qoa2V5cykubm90LnRvQ29udGFpbigndGVzdC5uZXN0ZWQnKVxuICAgICAgZXhwZWN0KGtleXMpLm5vdC50b0NvbnRhaW4oJ3Rlc3QubmVzdGVkLmRlZXAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjYW1lbENhc2UgZmlsZSBuYW1lIGNvbnZlcnNpb24gY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGVzdENvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGtleTogJ3ZhbHVlJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdhcHAtZGVidWcudHMnKSwgdGVzdENvbnRlbnQpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICd1c2VyX3Byb2ZpbGUudHMnKSwgdGVzdENvbnRlbnQpXG5cbiAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG5cbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ2FwcERlYnVnLmtleScpXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCd1c2VyUHJvZmlsZS5rZXknKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01pc3Npbmcga2V5cyBkZXRlY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZXRlY3QgbWlzc2luZyBrZXlzIGluIHRhcmdldCBsYW5ndWFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVuQ29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgY29tbW9uOiB7XG4gICAgc2F2ZTogJ1NhdmUnLFxuICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgZGVsZXRlOiAnRGVsZXRlJ1xuICB9LFxuICBhcHA6IHtcbiAgICB0aXRsZTogJ015IEFwcCcsXG4gICAgdmVyc2lvbjogJzEuMCdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBjb25zdCB6aENvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGNvbW1vbjoge1xuICAgIHNhdmU6ICfkv53lrZgnLFxuICAgIGNhbmNlbDogJ+WPlua2iCdcbiAgICAvLyBtaXNzaW5nICdkZWxldGUnXG4gIH0sXG4gIGFwcDoge1xuICAgIHRpdGxlOiAn5oiR55qE5bqU55SoJ1xuICAgIC8vIG1pc3NpbmcgJ3ZlcnNpb24nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25cbmBcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGVzdEVuRGlyLCAndGVzdC50cycpLCBlbkNvbnRlbnQpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0WmhEaXIsICd0ZXN0LnRzJyksIHpoQ29udGVudClcblxuICAgICAgY29uc3QgZW5LZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKVxuICAgICAgY29uc3QgemhLZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnemgtSGFucycpXG5cbiAgICAgIGNvbnN0IG1pc3NpbmdLZXlzID0gZW5LZXlzLmZpbHRlcihrZXkgPT4gIXpoS2V5cy5pbmNsdWRlcyhrZXkpKVxuXG4gICAgICBleHBlY3QobWlzc2luZ0tleXMpLnRvQ29udGFpbigndGVzdC5jb21tb24uZGVsZXRlJylcbiAgICAgIGV4cGVjdChtaXNzaW5nS2V5cykudG9Db250YWluKCd0ZXN0LmFwcC52ZXJzaW9uJylcbiAgICAgIGV4cGVjdChtaXNzaW5nS2V5cykudG9IYXZlTGVuZ3RoKDIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRXh0cmEga2V5cyBkZXRlY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZXRlY3QgZXh0cmEga2V5cyBpbiB0YXJnZXQgbGFuZ3VhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBlbkNvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGNvbW1vbjoge1xuICAgIHNhdmU6ICdTYXZlJyxcbiAgICBjYW5jZWw6ICdDYW5jZWwnXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25cbmBcblxuICAgICAgY29uc3QgemhDb250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICBjb21tb246IHtcbiAgICBzYXZlOiAn5L+d5a2YJyxcbiAgICBjYW5jZWw6ICflj5bmtognLFxuICAgIGRlbGV0ZTogJ+WIoOmZpCcsIC8vIGV4dHJhIGtleVxuICAgIGV4dHJhOiAn6aKd5aSW55qEJyAvLyBhbm90aGVyIGV4dHJhIGtleVxuICB9LFxuICBuZXdTZWN0aW9uOiB7XG4gICAgc29tZUtleTogJ+afkOS4quWAvCcgLy8gZXh0cmEgc2VjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uXG5gXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ3Rlc3QudHMnKSwgZW5Db250ZW50KVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGVzdFpoRGlyLCAndGVzdC50cycpLCB6aENvbnRlbnQpXG5cbiAgICAgIGNvbnN0IGVuS2V5cyA9IGF3YWl0IGdldEtleXNGcm9tTGFuZ3VhZ2UoJ2VuLVVTJylcbiAgICAgIGNvbnN0IHpoS2V5cyA9IGF3YWl0IGdldEtleXNGcm9tTGFuZ3VhZ2UoJ3poLUhhbnMnKVxuXG4gICAgICBjb25zdCBleHRyYUtleXMgPSB6aEtleXMuZmlsdGVyKGtleSA9PiAhZW5LZXlzLmluY2x1ZGVzKGtleSkpXG5cbiAgICAgIGV4cGVjdChleHRyYUtleXMpLnRvQ29udGFpbigndGVzdC5jb21tb24uZGVsZXRlJylcbiAgICAgIGV4cGVjdChleHRyYUtleXMpLnRvQ29udGFpbigndGVzdC5jb21tb24uZXh0cmEnKVxuICAgICAgZXhwZWN0KGV4dHJhS2V5cykudG9Db250YWluKCd0ZXN0Lm5ld1NlY3Rpb24uc29tZUtleScpXG4gICAgICBleHBlY3QoZXh0cmFLZXlzKS50b0hhdmVMZW5ndGgoMylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGaWxlIGZpbHRlcmluZyBsb2dpYycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZpbHRlciBrZXlzIGJ5IHNwZWNpZmljIGZpbGUgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQ3JlYXRlIG11bHRpcGxlIGZpbGVzXG4gICAgICBjb25zdCBmaWxlMUNvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGJ1dHRvbjogJ0J1dHRvbicsXG4gIHRleHQ6ICdUZXh0J1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBjb25zdCBmaWxlMkNvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIHRpdGxlOiAnVGl0bGUnLFxuICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdjb21wb25lbnRzLnRzJyksIGZpbGUxQ29udGVudClcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ3BhZ2VzLnRzJyksIGZpbGUyQ29udGVudClcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RaaERpciwgJ2NvbXBvbmVudHMudHMnKSwgZmlsZTFDb250ZW50KVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGVzdFpoRGlyLCAncGFnZXMudHMnKSwgZmlsZTJDb250ZW50KVxuXG4gICAgICBjb25zdCBhbGxFbktleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG5cbiAgICAgIC8vIFRlc3QgZmlsZSBmaWx0ZXJpbmcgbG9naWNcbiAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSAnY29tcG9uZW50cydcbiAgICAgIGNvbnN0IGZpbHRlcmVkRW5LZXlzID0gYWxsRW5LZXlzLmZpbHRlcihrZXkgPT5cbiAgICAgICAga2V5LnN0YXJ0c1dpdGgodGFyZ2V0RmlsZS5yZXBsYWNlKC9bLV9dKC4pL2csIChfLCBjKSA9PiBjLnRvVXBwZXJDYXNlKCkpKSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGFsbEVuS2V5cykudG9IYXZlTGVuZ3RoKDQpIC8vIDIga2V5cyBmcm9tIGVhY2ggZmlsZVxuICAgICAgZXhwZWN0KGZpbHRlcmVkRW5LZXlzKS50b0hhdmVMZW5ndGgoMikgLy8gb25seSBjb21wb25lbnRzIGtleXNcbiAgICAgIGV4cGVjdChmaWx0ZXJlZEVuS2V5cykudG9Db250YWluKCdjb21wb25lbnRzLmJ1dHRvbicpXG4gICAgICBleHBlY3QoZmlsdGVyZWRFbktleXMpLnRvQ29udGFpbignY29tcG9uZW50cy50ZXh0JylcbiAgICAgIGV4cGVjdChmaWx0ZXJlZEVuS2V5cykubm90LnRvQ29udGFpbigncGFnZXMudGl0bGUnKVxuICAgICAgZXhwZWN0KGZpbHRlcmVkRW5LZXlzKS5ub3QudG9Db250YWluKCdwYWdlcy5kZXNjcmlwdGlvbicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcGxleCBuZXN0ZWQgc3RydWN0dXJlIGhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRlZXBseSBuZXN0ZWQgb2JqZWN0cyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb21wbGV4Q29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgbGV2ZWwxOiB7XG4gICAgbGV2ZWwyOiB7XG4gICAgICBsZXZlbDM6IHtcbiAgICAgICAgbGV2ZWw0OiB7XG4gICAgICAgICAgZGVlcFZhbHVlOiAnRGVlcCBWYWx1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgYW5vdGhlclZhbHVlOiAnQW5vdGhlciBWYWx1ZSdcbiAgICAgIH0sXG4gICAgICBzaW1wbGVWYWx1ZTogJ1NpbXBsZSBWYWx1ZSdcbiAgICB9LFxuICAgIGRpcmVjdFZhbHVlOiAnRGlyZWN0IFZhbHVlJ1xuICB9LFxuICByb290VmFsdWU6ICdSb290IFZhbHVlJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdjb21wbGV4LnRzJyksIGNvbXBsZXhDb250ZW50KVxuXG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKVxuXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdjb21wbGV4LmxldmVsMS5sZXZlbDIubGV2ZWwzLmxldmVsNC5kZWVwVmFsdWUnKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbignY29tcGxleC5sZXZlbDEubGV2ZWwyLmxldmVsMy5hbm90aGVyVmFsdWUnKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbignY29tcGxleC5sZXZlbDEubGV2ZWwyLnNpbXBsZVZhbHVlJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ2NvbXBsZXgubGV2ZWwxLmRpcmVjdFZhbHVlJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ2NvbXBsZXgucm9vdFZhbHVlJylcblxuICAgICAgLy8gU2hvdWxkIG5vdCBpbmNsdWRlIGludGVybWVkaWF0ZSBvYmplY3RzXG4gICAgICBleHBlY3Qoa2V5cykubm90LnRvQ29udGFpbignY29tcGxleC5sZXZlbDEnKVxuICAgICAgZXhwZWN0KGtleXMpLm5vdC50b0NvbnRhaW4oJ2NvbXBsZXgubGV2ZWwxLmxldmVsMicpXG4gICAgICBleHBlY3Qoa2V5cykubm90LnRvQ29udGFpbignY29tcGxleC5sZXZlbDEubGV2ZWwyLmxldmVsMycpXG4gICAgICBleHBlY3Qoa2V5cykubm90LnRvQ29udGFpbignY29tcGxleC5sZXZlbDEubGV2ZWwyLmxldmVsMy5sZXZlbDQnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgb2JqZWN0cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVtcHR5Q29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgZW1wdHk6IHt9LFxuICB3aXRoVmFsdWU6ICd2YWx1ZSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25cbmBcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGVzdEVuRGlyLCAnZW1wdHkudHMnKSwgZW1wdHlDb250ZW50KVxuXG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKVxuXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdlbXB0eS53aXRoVmFsdWUnKVxuICAgICAgZXhwZWN0KGtleXMpLm5vdC50b0NvbnRhaW4oJ2VtcHR5LmVtcHR5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGtleXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjaWFsQ29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgJ2tleS13aXRoLWRhc2gnOiAndmFsdWUxJyxcbiAgJ2tleV93aXRoX3VuZGVyc2NvcmUnOiAndmFsdWUyJyxcbiAgJ2tleS53aXRoLmRvdHMnOiAndmFsdWUzJyxcbiAgbm9ybWFsS2V5OiAndmFsdWU0J1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdzcGVjaWFsLnRzJyksIHNwZWNpYWxDb250ZW50KVxuXG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKVxuXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdzcGVjaWFsLmtleS13aXRoLWRhc2gnKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbignc3BlY2lhbC5rZXlfd2l0aF91bmRlcnNjb3JlJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3NwZWNpYWwua2V5LndpdGguZG90cycpXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdzcGVjaWFsLm5vcm1hbEtleScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpZmZlcmVudCB2YWx1ZSB0eXBlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVzQ29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgc3RyaW5nVmFsdWU6ICdzdHJpbmcnLFxuICBudW1iZXJWYWx1ZTogNDIsXG4gIGJvb2xlYW5WYWx1ZTogdHJ1ZSxcbiAgbnVsbFZhbHVlOiBudWxsLFxuICB1bmRlZmluZWRWYWx1ZTogdW5kZWZpbmVkLFxuICBhcnJheVZhbHVlOiBbJ2FycmF5JywgJ3ZhbHVlcyddLFxuICBvYmplY3RWYWx1ZToge1xuICAgIG5lc3RlZDogJ25lc3RlZCB2YWx1ZSdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICd0eXBlcy50cycpLCB0eXBlc0NvbnRlbnQpXG5cbiAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG5cbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3R5cGVzLnN0cmluZ1ZhbHVlJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3R5cGVzLm51bWJlclZhbHVlJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3R5cGVzLmJvb2xlYW5WYWx1ZScpXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCd0eXBlcy5udWxsVmFsdWUnKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbigndHlwZXMudW5kZWZpbmVkVmFsdWUnKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbigndHlwZXMuYXJyYXlWYWx1ZScpXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCd0eXBlcy5vYmplY3RWYWx1ZS5uZXN0ZWQnKVxuICAgICAgZXhwZWN0KGtleXMpLm5vdC50b0NvbnRhaW4oJ3R5cGVzLm9iamVjdFZhbHVlJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZWFsLXdvcmxkIHNjZW5hcmlvIHRlc3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFwcC1kZWJ1ZyBzdHJ1Y3R1cmUgbGlrZSByZWFsIGZpbGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwRGVidWdFbiA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgcGFnZVRpdGxlOiB7XG4gICAgbGluZTE6ICdQcm9tcHQnLFxuICAgIGxpbmUyOiAnRW5naW5lZXJpbmcnXG4gIH0sXG4gIG9wZXJhdGlvbjoge1xuICAgIGFwcGx5Q29uZmlnOiAnUHVibGlzaCcsXG4gICAgcmVzZXRDb25maWc6ICdSZXNldCcsXG4gICAgZGVidWdDb25maWc6ICdEZWJ1ZydcbiAgfSxcbiAgZ2VuZXJhdGU6IHtcbiAgICBpbnN0cnVjdGlvbjogJ0luc3RydWN0aW9ucycsXG4gICAgZ2VuZXJhdGU6ICdHZW5lcmF0ZScsXG4gICAgcmVzVGl0bGU6ICdHZW5lcmF0ZWQgUHJvbXB0JyxcbiAgICBub0RhdGFMaW5lMTogJ0Rlc2NyaWJlIHlvdXIgdXNlIGNhc2Ugb24gdGhlIGxlZnQsJyxcbiAgICBub0RhdGFMaW5lMjogJ3RoZSBvcmNoZXN0cmF0aW9uIHByZXZpZXcgd2lsbCBzaG93IGhlcmUuJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uXG5gXG5cbiAgICAgIGNvbnN0IGFwcERlYnVnWmggPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIHBhZ2VUaXRsZToge1xuICAgIGxpbmUxOiAn5o+Q56S66K+NJyxcbiAgICBsaW5lMjogJ+e8luaOkidcbiAgfSxcbiAgb3BlcmF0aW9uOiB7XG4gICAgYXBwbHlDb25maWc6ICflj5HluIMnLFxuICAgIHJlc2V0Q29uZmlnOiAn6YeN572uJyxcbiAgICBkZWJ1Z0NvbmZpZzogJ+iwg+ivlSdcbiAgfSxcbiAgZ2VuZXJhdGU6IHtcbiAgICBpbnN0cnVjdGlvbjogJ+aMh+S7pCcsXG4gICAgZ2VuZXJhdGU6ICfnlJ/miJAnLFxuICAgIHJlc1RpdGxlOiAn55Sf5oiQ55qE5o+Q56S66K+NJyxcbiAgICBub0RhdGE6ICflnKjlt6bkvqfmj4/ov7DmgqjnmoTnlKjkvovvvIznvJbmjpLpooTop4jlsIblnKjmraTlpITmmL7npLrjgIInIC8vIFRoaXMgaXMgZXh0cmFcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdhcHAtZGVidWcudHMnKSwgYXBwRGVidWdFbilcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RaaERpciwgJ2FwcC1kZWJ1Zy50cycpLCBhcHBEZWJ1Z1poKVxuXG4gICAgICBjb25zdCBlbktleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG4gICAgICBjb25zdCB6aEtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCd6aC1IYW5zJylcblxuICAgICAgY29uc3QgbWlzc2luZ0tleXMgPSBlbktleXMuZmlsdGVyKGtleSA9PiAhemhLZXlzLmluY2x1ZGVzKGtleSkpXG4gICAgICBjb25zdCBleHRyYUtleXMgPSB6aEtleXMuZmlsdGVyKGtleSA9PiAhZW5LZXlzLmluY2x1ZGVzKGtleSkpXG5cbiAgICAgIGV4cGVjdChtaXNzaW5nS2V5cykudG9Db250YWluKCdhcHBEZWJ1Zy5nZW5lcmF0ZS5ub0RhdGFMaW5lMScpXG4gICAgICBleHBlY3QobWlzc2luZ0tleXMpLnRvQ29udGFpbignYXBwRGVidWcuZ2VuZXJhdGUubm9EYXRhTGluZTInKVxuICAgICAgZXhwZWN0KGV4dHJhS2V5cykudG9Db250YWluKCdhcHBEZWJ1Zy5nZW5lcmF0ZS5ub0RhdGEnKVxuXG4gICAgICBleHBlY3QobWlzc2luZ0tleXMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0KGV4dHJhS2V5cykudG9IYXZlTGVuZ3RoKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRpbWUgc3RydWN0dXJlIHdpdGggb3BlcmF0aW9uIG5lc3RlZCBrZXlzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGltZUVuID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICBtb250aHM6IHtcbiAgICBKYW51YXJ5OiAnSmFudWFyeScsXG4gICAgRmVicnVhcnk6ICdGZWJydWFyeSdcbiAgfSxcbiAgb3BlcmF0aW9uOiB7XG4gICAgbm93OiAnTm93JyxcbiAgICBvazogJ09LJyxcbiAgICBjYW5jZWw6ICdDYW5jZWwnLFxuICAgIHBpY2tEYXRlOiAnUGljayBEYXRlJ1xuICB9LFxuICB0aXRsZToge1xuICAgIHBpY2tUaW1lOiAnUGljayBUaW1lJ1xuICB9LFxuICBkZWZhdWx0UGxhY2Vob2xkZXI6ICdQaWNrIGEgdGltZS4uLidcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25cbmBcblxuICAgICAgY29uc3QgdGltZVpoID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICBtb250aHM6IHtcbiAgICBKYW51YXJ5OiAn5LiA5pyIJyxcbiAgICBGZWJydWFyeTogJ+S6jOaciCdcbiAgfSxcbiAgb3BlcmF0aW9uOiB7XG4gICAgbm93OiAn5q2k5Yi7JyxcbiAgICBvazogJ+ehruWumicsXG4gICAgY2FuY2VsOiAn5Y+W5raIJyxcbiAgICBwaWNrRGF0ZTogJ+mAieaLqeaXpeacnydcbiAgfSxcbiAgdGl0bGU6IHtcbiAgICBwaWNrVGltZTogJ+mAieaLqeaXtumXtCdcbiAgfSxcbiAgcGlja0RhdGU6ICfpgInmi6nml6XmnJ8nLCAvLyBUaGlzIGlzIGV4dHJhIC0gZHVwbGljYXRlcyBvcGVyYXRpb24ucGlja0RhdGVcbiAgZGVmYXVsdFBsYWNlaG9sZGVyOiAn6K+36YCJ5oup5pe26Ze0Li4uJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICd0aW1lLnRzJyksIHRpbWVFbilcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RaaERpciwgJ3RpbWUudHMnKSwgdGltZVpoKVxuXG4gICAgICBjb25zdCBlbktleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG4gICAgICBjb25zdCB6aEtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCd6aC1IYW5zJylcblxuICAgICAgY29uc3QgbWlzc2luZ0tleXMgPSBlbktleXMuZmlsdGVyKGtleSA9PiAhemhLZXlzLmluY2x1ZGVzKGtleSkpXG4gICAgICBjb25zdCBleHRyYUtleXMgPSB6aEtleXMuZmlsdGVyKGtleSA9PiAhZW5LZXlzLmluY2x1ZGVzKGtleSkpXG5cbiAgICAgIGV4cGVjdChtaXNzaW5nS2V5cykudG9IYXZlTGVuZ3RoKDApIC8vIE5vIG1pc3Npbmcga2V5c1xuICAgICAgZXhwZWN0KGV4dHJhS2V5cykudG9Db250YWluKCd0aW1lLnBpY2tEYXRlJykgLy8gRXh0cmEgcm9vdC1sZXZlbCBwaWNrRGF0ZVxuICAgICAgZXhwZWN0KGV4dHJhS2V5cykudG9IYXZlTGVuZ3RoKDEpXG5cbiAgICAgIC8vIFNob3VsZCBoYXZlIGJvdGgga2V5cyBhdmFpbGFibGVcbiAgICAgIGV4cGVjdCh6aEtleXMpLnRvQ29udGFpbigndGltZS5vcGVyYXRpb24ucGlja0RhdGUnKSAvLyBDb3JyZWN0IG5lc3RlZCBrZXlcbiAgICAgIGV4cGVjdCh6aEtleXMpLnRvQ29udGFpbigndGltZS5waWNrRGF0ZScpIC8vIEV4dHJhIGR1cGxpY2F0ZSBrZXlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdGF0aXN0aWNzIGNhbGN1bGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsY3VsYXRlIGNvcnJlY3QgZGlmZmVyZW5jZSBzdGF0aXN0aWNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZW5Db250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICBrZXkxOiAndmFsdWUxJyxcbiAga2V5MjogJ3ZhbHVlMicsXG4gIGtleTM6ICd2YWx1ZTMnXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uXG5gXG5cbiAgICAgIGNvbnN0IHpoQ29udGVudE1pc3NpbmcgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGtleTE6ICd2YWx1ZTEnLFxuICBrZXkyOiAndmFsdWUyJ1xuICAvLyBtaXNzaW5nIGtleTNcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25cbmBcblxuICAgICAgY29uc3QgemhDb250ZW50RXh0cmEgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGtleTE6ICd2YWx1ZTEnLFxuICBrZXkyOiAndmFsdWUyJywgXG4gIGtleTM6ICd2YWx1ZTMnLFxuICBrZXk0OiAnZXh0cmEnLFxuICBrZXk1OiAnZXh0cmEyJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvblxuYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdzdGF0cy50cycpLCBlbkNvbnRlbnQpXG5cbiAgICAgIC8vIFRlc3QgbWlzc2luZyBrZXlzIHNjZW5hcmlvXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0WmhEaXIsICdzdGF0cy50cycpLCB6aENvbnRlbnRNaXNzaW5nKVxuXG4gICAgICBjb25zdCBlbktleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG4gICAgICBjb25zdCB6aEtleXNNaXNzaW5nID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnemgtSGFucycpXG5cbiAgICAgIGV4cGVjdChlbktleXMubGVuZ3RoIC0gemhLZXlzTWlzc2luZy5sZW5ndGgpLnRvQmUoMSkgLy8gKzEgbWVhbnMgMSBtaXNzaW5nIGtleVxuXG4gICAgICAvLyBUZXN0IGV4dHJhIGtleXMgc2NlbmFyaW9cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RaaERpciwgJ3N0YXRzLnRzJyksIHpoQ29udGVudEV4dHJhKVxuXG4gICAgICBjb25zdCB6aEtleXNFeHRyYSA9IGF3YWl0IGdldEtleXNGcm9tTGFuZ3VhZ2UoJ3poLUhhbnMnKVxuXG4gICAgICBleHBlY3QoZW5LZXlzLmxlbmd0aCAtIHpoS2V5c0V4dHJhLmxlbmd0aCkudG9CZSgtMikgLy8gLTIgbWVhbnMgMiBleHRyYSBrZXlzXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQXV0by1yZW1vdmUgbXVsdGlsaW5lIGtleS12YWx1ZSBwYWlycycsICgpID0+IHtcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gc2ltdWxhdGUgcmVtb3ZlRXh0cmFLZXlzRnJvbUZpbGUgbG9naWNcbiAgICBmdW5jdGlvbiByZW1vdmVFeHRyYUtleXNGcm9tRmlsZShjb250ZW50OiBzdHJpbmcsIGtleXNUb1JlbW92ZTogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKVxuICAgICAgY29uc3QgbGluZXNUb1JlbW92ZTogbnVtYmVyW10gPSBbXVxuXG4gICAgICBmb3IgKGNvbnN0IGtleVRvUmVtb3ZlIG9mIGtleXNUb1JlbW92ZSkge1xuICAgICAgICBsZXQgdGFyZ2V0TGluZUluZGV4ID0gLTFcbiAgICAgICAgY29uc3QgbGluZXNUb1JlbW92ZUZvcktleTogbnVtYmVyW10gPSBbXVxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGtleSBsaW5lIChzaW1wbGlmaWVkIGZvciBzaW5nbGUtbGV2ZWwga2V5cyBpbiB0ZXN0KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldXG4gICAgICAgICAgY29uc3Qga2V5UGF0dGVybiA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2tleVRvUmVtb3ZlfVxcXFxzKjpgKVxuICAgICAgICAgIGlmIChrZXlQYXR0ZXJuLnRlc3QobGluZSkpIHtcbiAgICAgICAgICAgIHRhcmdldExpbmVJbmRleCA9IGlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldExpbmVJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBsaW5lc1RvUmVtb3ZlRm9yS2V5LnB1c2godGFyZ2V0TGluZUluZGV4KVxuXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIG11bHRpbGluZSBrZXktdmFsdWUgcGFpclxuICAgICAgICAgIGNvbnN0IGtleUxpbmUgPSBsaW5lc1t0YXJnZXRMaW5lSW5kZXhdXG4gICAgICAgICAgY29uc3QgdHJpbW1lZEtleUxpbmUgPSBrZXlMaW5lLnRyaW0oKVxuXG4gICAgICAgICAgLy8gSWYga2V5IGxpbmUgZW5kcyB3aXRoIFwiOlwiIChub3QgY29tcGxldGUgdmFsdWUpLCBpdCdzIGxpa2VseSBtdWx0aWxpbmVcbiAgICAgICAgICBpZiAodHJpbW1lZEtleUxpbmUuZW5kc1dpdGgoJzonKSAmJiAhdHJpbW1lZEtleUxpbmUuaW5jbHVkZXMoJ3snKSAmJiAhdHJpbW1lZEtleUxpbmUubWF0Y2goLzpcXHMqWydcImBdLykpIHtcbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIHZhbHVlIGxpbmVzIHRoYXQgYmVsb25nIHRvIHRoaXMga2V5XG4gICAgICAgICAgICBsZXQgY3VycmVudExpbmUgPSB0YXJnZXRMaW5lSW5kZXggKyAxXG4gICAgICAgICAgICBsZXQgZm91bmRWYWx1ZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50TGluZSA8IGxpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbY3VycmVudExpbmVdXG4gICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lLnRyaW0oKVxuXG4gICAgICAgICAgICAgIC8vIFNraXAgZW1wdHkgbGluZXNcbiAgICAgICAgICAgICAgaWYgKHRyaW1tZWQgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUrK1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGxpbmUgc3RhcnRzIGEgbmV3IGtleSAoaW5kaWNhdGVzIGVuZCBvZiBjdXJyZW50IHZhbHVlKVxuICAgICAgICAgICAgICBpZiAodHJpbW1lZC5tYXRjaCgvXlxcdytcXHMqOi8pKVxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBsaW5lIGlzIHBhcnQgb2YgdGhlIHZhbHVlXG4gICAgICAgICAgICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJ1xcJycpIHx8IHRyaW1tZWQuc3RhcnRzV2l0aCgnXCInKSB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJ2AnKSB8fCBmb3VuZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGluZXNUb1JlbW92ZUZvcktleS5wdXNoKGN1cnJlbnRMaW5lKVxuICAgICAgICAgICAgICAgIGZvdW5kVmFsdWUgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGxpbmUgZW5kcyB0aGUgdmFsdWUgKGVuZHMgd2l0aCBxdW90ZSBhbmQgY29tbWEvbm8gY29tbWEpXG4gICAgICAgICAgICAgICAgaWYgKCh0cmltbWVkLmVuZHNXaXRoKCdcXCcsJykgfHwgdHJpbW1lZC5lbmRzV2l0aCgnXCIsJykgfHwgdHJpbW1lZC5lbmRzV2l0aCgnYCwnKVxuICAgICAgICAgICAgICAgICAgfHwgdHJpbW1lZC5lbmRzV2l0aCgnXFwnJykgfHwgdHJpbW1lZC5lbmRzV2l0aCgnXCInKSB8fCB0cmltbWVkLmVuZHNXaXRoKCdgJykpXG4gICAgICAgICAgICAgICAgJiYgIXRyaW1tZWQuc3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGN1cnJlbnRMaW5lKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lc1RvUmVtb3ZlLnB1c2goLi4ubGluZXNUb1JlbW92ZUZvcktleSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBhbmQgc29ydCBpbiByZXZlcnNlIG9yZGVyXG4gICAgICBjb25zdCB1bmlxdWVMaW5lc1RvUmVtb3ZlID0gWy4uLm5ldyBTZXQobGluZXNUb1JlbW92ZSldLnNvcnQoKGEsIGIpID0+IGIgLSBhKVxuXG4gICAgICBmb3IgKGNvbnN0IGxpbmVJbmRleCBvZiB1bmlxdWVMaW5lc1RvUmVtb3ZlKVxuICAgICAgICBsaW5lcy5zcGxpY2UobGluZUluZGV4LCAxKVxuXG4gICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJylcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBzaW5nbGUtbGluZSBrZXktdmFsdWUgcGFpcnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAga2VlcFRoaXM6ICdUaGlzIHNob3VsZCBzdGF5JyxcbiAgcmVtb3ZlVGhpczogJ1RoaXMgc2hvdWxkIGJlIHJlbW92ZWQnLFxuICBhbHNvS2VlcDogJ1RoaXMgc2hvdWxkIGFsc28gc3RheScsXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uYFxuXG4gICAgICBjb25zdCByZXN1bHQgPSByZW1vdmVFeHRyYUtleXNGcm9tRmlsZShjb250ZW50LCBbJ3JlbW92ZVRoaXMnXSlcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdrZWVwVGhpczogXFwnVGhpcyBzaG91bGQgc3RheVxcJycpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ2Fsc29LZWVwOiBcXCdUaGlzIHNob3VsZCBhbHNvIHN0YXlcXCcnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvQ29udGFpbigncmVtb3ZlVGhpczogXFwnVGhpcyBzaG91bGQgYmUgcmVtb3ZlZFxcJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIG11bHRpbGluZSBrZXktdmFsdWUgcGFpcnMgY29tcGxldGVseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGtlZXBUaGlzOiAnVGhpcyBzaG91bGQgc3RheScsXG4gIHJlbW92ZU11bHRpbGluZTpcbiAgICAnVGhpcyBpcyBhIG11bHRpbGluZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZW1vdmVkIGNvbXBsZXRlbHknLFxuICBhbHNvS2VlcDogJ1RoaXMgc2hvdWxkIGFsc28gc3RheScsXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uYFxuXG4gICAgICBjb25zdCByZXN1bHQgPSByZW1vdmVFeHRyYUtleXNGcm9tRmlsZShjb250ZW50LCBbJ3JlbW92ZU11bHRpbGluZSddKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ2tlZXBUaGlzOiBcXCdUaGlzIHNob3VsZCBzdGF5XFwnJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbignYWxzb0tlZXA6IFxcJ1RoaXMgc2hvdWxkIGFsc28gc3RheVxcJycpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdyZW1vdmVNdWx0aWxpbmU6JylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ1RoaXMgaXMgYSBtdWx0aWxpbmUgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZCBjb21wbGV0ZWx5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWl4ZWQgc2luZ2xlLWxpbmUgYW5kIG11bHRpbGluZSByZW1vdmFscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGtlZXBUaGlzOiAnS2VlcCB0aGlzJyxcbiAgcmVtb3ZlU2luZ2xlOiAnUmVtb3ZlIHRoaXMgc2luZ2xlIGxpbmUnLFxuICByZW1vdmVNdWx0aWxpbmU6XG4gICAgJ1JlbW92ZSB0aGlzIG11bHRpbGluZSB2YWx1ZScsXG4gIGFub3RoZXJNdWx0aWxpbmU6XG4gICAgJ0Fub3RoZXIgbXVsdGlsaW5lIHRoYXQgc3BhbnMgbXVsdGlwbGUgbGluZXMnLFxuICBrZWVwQW5vdGhlcjogJ0tlZXAgdGhpcyB0b28nLFxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvbmBcblxuICAgICAgY29uc3QgcmVzdWx0ID0gcmVtb3ZlRXh0cmFLZXlzRnJvbUZpbGUoY29udGVudCwgWydyZW1vdmVTaW5nbGUnLCAncmVtb3ZlTXVsdGlsaW5lJywgJ2Fub3RoZXJNdWx0aWxpbmUnXSlcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdrZWVwVGhpczogXFwnS2VlcCB0aGlzXFwnJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbigna2VlcEFub3RoZXI6IFxcJ0tlZXAgdGhpcyB0b29cXCcnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvQ29udGFpbigncmVtb3ZlU2luZ2xlOicpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdyZW1vdmVNdWx0aWxpbmU6JylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ2Fub3RoZXJNdWx0aWxpbmU6JylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ1JlbW92ZSB0aGlzIHNpbmdsZSBsaW5lJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ1JlbW92ZSB0aGlzIG11bHRpbGluZSB2YWx1ZScpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdBbm90aGVyIG11bHRpbGluZSB0aGF0IHNwYW5zIG11bHRpcGxlIGxpbmVzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm9wZXJseSBkZXRlY3QgbXVsdGlsaW5lIHZzIHNpbmdsZS1saW5lIHBhdHRlcm5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbXVsdGlsaW5lQ29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAgc2luZ2xlTGluZTogJ1RoaXMgaXMgc2luZ2xlIGxpbmUnLFxuICBtdWx0aWxpbmVLZXk6XG4gICAgJ1RoaXMgaXMgbXVsdGlsaW5lJyxcbiAga2V5V2l0aENvbG9uOiAnVmFsdWUgd2l0aDogY29sb24gaW5zaWRlJyxcbiAgb2JqZWN0S2V5OiB7XG4gICAgbmVzdGVkOiAndmFsdWUnXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uYFxuXG4gICAgICAvLyBUZXN0IHRoYXQgc2luZ2xlIGxpbmUgd2l0aCBjb2xvbiBpbiB2YWx1ZSBpcyBub3QgdHJlYXRlZCBhcyBtdWx0aWxpbmVcbiAgICAgIGNvbnN0IHJlc3VsdDEgPSByZW1vdmVFeHRyYUtleXNGcm9tRmlsZShtdWx0aWxpbmVDb250ZW50LCBbJ2tleVdpdGhDb2xvbiddKVxuICAgICAgZXhwZWN0KHJlc3VsdDEpLm5vdC50b0NvbnRhaW4oJ2tleVdpdGhDb2xvbjonKVxuICAgICAgZXhwZWN0KHJlc3VsdDEpLm5vdC50b0NvbnRhaW4oJ1ZhbHVlIHdpdGg6IGNvbG9uIGluc2lkZScpXG5cbiAgICAgIC8vIFRlc3QgdGhhdCB0cnVlIG11bHRpbGluZSBpcyBoYW5kbGVkIGNvcnJlY3RseVxuICAgICAgY29uc3QgcmVzdWx0MiA9IHJlbW92ZUV4dHJhS2V5c0Zyb21GaWxlKG11bHRpbGluZUNvbnRlbnQsIFsnbXVsdGlsaW5lS2V5J10pXG4gICAgICBleHBlY3QocmVzdWx0Mikubm90LnRvQ29udGFpbignbXVsdGlsaW5lS2V5OicpXG4gICAgICBleHBlY3QocmVzdWx0Mikubm90LnRvQ29udGFpbignVGhpcyBpcyBtdWx0aWxpbmUnKVxuXG4gICAgICAvLyBUZXN0IHRoYXQgb2JqZWN0IGtleSByZW1vdmFsIHdvcmtzIChub3RlOiB0aGlzIGlzIGEgc2ltcGxpZmllZCB0ZXN0KVxuICAgICAgLy8gSW4gcmVhbCBzY2VuYXJpbywgb2JqZWN0IHJlbW92YWwgd291bGQgYmUgbW9yZSBjb21wbGV4XG4gICAgICBjb25zdCByZXN1bHQzID0gcmVtb3ZlRXh0cmFLZXlzRnJvbUZpbGUobXVsdGlsaW5lQ29udGVudCwgWydvYmplY3RLZXknXSlcbiAgICAgIGV4cGVjdChyZXN1bHQzKS5ub3QudG9Db250YWluKCdvYmplY3RLZXk6IHsnKVxuICAgICAgLy8gTm90ZTogT3VyIHNpbXBsaWZpZWQgdGVzdCBmdW5jdGlvbiBkb2Vzbid0IGhhbmRsZSBuZXN0ZWQgb2JqZWN0IHJlbW92YWwgcGVyZmVjdGx5XG4gICAgICAvLyBUaGlzIGlzIGFjY2VwdGFibGUgYXMgaXQncyB0ZXN0aW5nIHRoZSBtYWluIG11bHRpbGluZSBzdHJpbmcgcmVtb3ZhbCBmdW5jdGlvbmFsaXR5XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlYWwtd29ybGQgUG9saXNoIHRyYW5zbGF0aW9uIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBvbGlzaENvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIGNyZWF0ZUFwcDogJ1VUV8OTUlogQVBMSUtBQ0rEmCcsXG4gIG5ld0FwcDoge1xuICAgIGNhcHRpb25BcHBUeXBlOiAnSmFraSB0eXAgYXBsaWthY2ppIGNoY2VzeiBzdHdvcnp5xIc/JyxcbiAgICBjaGF0Ym90RGVzY3JpcHRpb246XG4gICAgICAnWmJ1ZHVqIGFwbGlrYWNqxJkgb3BhcnTEhSBuYSBjemFjaWUuIFRhIGFwbGlrYWNqYSB1xbx5d2EgZm9ybWF0dSBweXRhxYQgaSBvZHBvd2llZHppLicsXG4gICAgYWdlbnREZXNjcmlwdGlvbjpcbiAgICAgICdaYnVkdWogaW50ZWxpZ2VudG5lZ28gYWdlbnRhLCBrdMOzcnkgbW/FvGUgYXV0b25vbWljem5pZSB3eWJpZXJhxIcgbmFyesSZZHppYS4nLFxuICAgIGJhc2ljOiAnUG9kc3Rhd293eScsXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uYFxuXG4gICAgICBjb25zdCByZXN1bHQgPSByZW1vdmVFeHRyYUtleXNGcm9tRmlsZShwb2xpc2hDb250ZW50LCBbJ2NhcHRpb25BcHBUeXBlJywgJ2NoYXRib3REZXNjcmlwdGlvbicsICdhZ2VudERlc2NyaXB0aW9uJ10pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbignY3JlYXRlQXBwOiBcXCdVVFfDk1JaIEFQTElLQUNKxJhcXCcnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdiYXNpYzogXFwnUG9kc3Rhd293eVxcJycpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdjYXB0aW9uQXBwVHlwZTonKVxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvQ29udGFpbignY2hhdGJvdERlc2NyaXB0aW9uOicpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdhZ2VudERlc2NyaXB0aW9uOicpXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9Db250YWluKCdKYWtpIHR5cCBhcGxpa2FjamknKVxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvQ29udGFpbignWmJ1ZHVqIGFwbGlrYWNqxJkgb3BhcnTEhSBuYSBjemFjaWUnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvQ29udGFpbignWmJ1ZHVqIGludGVsaWdlbnRuZWdvIGFnZW50YScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGVyZm9ybWFuY2UgYW5kIFNjYWxhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIHRyYW5zbGF0aW9uIGZpbGVzIGVmZmljaWVudGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQ3JlYXRlIGEgbGFyZ2UgdHJhbnNsYXRpb24gZmlsZSB3aXRoIDEwMDAga2V5c1xuICAgICAgY29uc3QgbGFyZ2VDb250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuJHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMDAwIH0sIChfLCBpKSA9PiBgICBrZXkke2l9OiAndmFsdWUke2l9JyxgKS5qb2luKCdcXG4nKX1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25gXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ2xhcmdlLnRzJyksIGxhcmdlQ29udGVudClcblxuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3Qga2V5cyA9IGF3YWl0IGdldEtleXNGcm9tTGFuZ3VhZ2UoJ2VuLVVTJylcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSBEYXRlLm5vdygpXG5cbiAgICAgIGV4cGVjdChrZXlzLmxlbmd0aCkudG9CZSgxMDAwKVxuICAgICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbigxMDAwKSAvLyBTaG91bGQgY29tcGxldGUgaW4gdW5kZXIgMSBzZWNvbmRcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgdHJhbnNsYXRpb24gZmlsZXMgY29uY3VycmVudGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQ3JlYXRlIG11bHRpcGxlIGZpbGVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGBjb25zdCB0cmFuc2xhdGlvbiA9IHtcbiAga2V5JHtpfTogJ3ZhbHVlJHtpfScsXG4gIG5lc3RlZCR7aX06IHtcbiAgICBzdWJrZXk6ICdzdWJ2YWx1ZSdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGlvbmBcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4odGVzdEVuRGlyLCBgZmlsZSR7aX0udHNgKSwgY29udGVudClcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3Qga2V5cyA9IGF3YWl0IGdldEtleXNGcm9tTGFuZ3VhZ2UoJ2VuLVVTJylcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSBEYXRlLm5vdygpXG5cbiAgICAgIGV4cGVjdChrZXlzLmxlbmd0aCkudG9CZSgyMCkgLy8gMTAgZmlsZXMgKiAyIGtleXMgZWFjaFxuICAgICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbig1MDApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVW5pY29kZSBhbmQgSW50ZXJuYXRpb25hbGl6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVW5pY29kZSBjaGFyYWN0ZXJzIGluIGtleXMgYW5kIHZhbHVlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVuaWNvZGVDb250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICAn5Lit5paH6ZSuJzogJ+S4reaWh+WAvCcsXG4gICfYp9mE2LnYsdio2YrYqSc6ICfZgtmK2YXYqScsXG4gICdlbW9qaV/wn5iAJzogJ3ZhbHVlIHdpdGggZW1vamkg8J+OiScsXG4gICdtaXhlZF/kuK3mlodfRW5nbGlzaCc6ICdtaXhlZCB2YWx1ZSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25gXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ3VuaWNvZGUudHMnKSwgdW5pY29kZUNvbnRlbnQpXG5cbiAgICAgIGNvbnN0IGtleXMgPSBhd2FpdCBnZXRLZXlzRnJvbUxhbmd1YWdlKCdlbi1VUycpXG5cbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3VuaWNvZGUu5Lit5paH6ZSuJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3VuaWNvZGUu2KfZhNi52LHYqNmK2KknKVxuICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbigndW5pY29kZS5lbW9qaV/wn5iAJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3VuaWNvZGUubWl4ZWRf5Lit5paHX0VuZ2xpc2gnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBSVEwgbGFuZ3VhZ2UgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBydGxDb250ZW50ID0gYGNvbnN0IHRyYW5zbGF0aW9uID0ge1xuICDZhdix2K3YqNinOiAnSGVsbG8nLFxuICDYp9mE2LnYp9mE2YU6ICdXb3JsZCcsXG4gIG5lc3RlZDoge1xuICAgINmF2YHYqtin2K06ICdrZXknXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRpb25gXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRlc3RFbkRpciwgJ3J0bC50cycpLCBydGxDb250ZW50KVxuXG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKVxuXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdydGwu2YXYsdit2KjYpycpXG4gICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdydGwu2KfZhNi52KfZhNmFJylcbiAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3J0bC5uZXN0ZWQu2YXZgdiq2KfYrScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRXJyb3IgUmVjb3ZlcnknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3ludGF4IGVycm9ycyBpbiB0cmFuc2xhdGlvbiBmaWxlcyBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW52YWxpZENvbnRlbnQgPSBgY29uc3QgdHJhbnNsYXRpb24gPSB7XG4gIHZhbGlkS2V5OiAndmFsaWQgdmFsdWUnLFxuICBpbnZhbGlkS2V5OiAnbWlzc2luZyBxdW90ZSxcbiAgYW5vdGhlcktleTogJ2Fub3RoZXIgdmFsdWUnXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0aW9uYFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbih0ZXN0RW5EaXIsICdpbnZhbGlkLnRzJyksIGludmFsaWRDb250ZW50KVxuXG4gICAgICBhd2FpdCBleHBlY3QoZ2V0S2V5c0Zyb21MYW5ndWFnZSgnZW4tVVMnKSkucmVqZWN0cy50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==