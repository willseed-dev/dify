"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const headers_1 = require("next/headers");
const script_1 = require("next/script");
const react_1 = require("react");
const config_1 = require("@/config");
const Zendesk = async () => {
    if (config_1.IS_CE_EDITION || !config_1.ZENDESK_WIDGET_KEY)
        return null;
    const nonce = config_1.IS_PROD ? (await (0, headers_1.headers)()).get('x-nonce') ?? '' : '';
    return (<>
      <script_1.default nonce={nonce ?? undefined} id="ze-snippet" src={`https://static.zdassets.com/ekr/snippet.js?key=${config_1.ZENDESK_WIDGET_KEY}`}/>
      <script_1.default nonce={nonce ?? undefined} id="ze-init">
        {`
        (function () {
          window.addEventListener('load', function () {
            if (window.zE)
              window.zE('messenger', 'hide')
          })
        })()
      `}
      </script_1.default>
    </>);
};
exports.default = (0, react_1.memo)(Zendesk);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBc0M7QUFDdEMsd0NBQWdDO0FBQ2hDLGlDQUE0QjtBQUM1QixxQ0FBcUU7QUFFckUsTUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDekIsSUFBSSxzQkFBYSxJQUFJLENBQUMsMkJBQWtCO1FBQ3RDLE9BQU8sSUFBSSxDQUFBO0lBRWIsTUFBTSxLQUFLLEdBQUcsZ0JBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUEsaUJBQU8sR0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBRW5FLE9BQU8sQ0FDTCxFQUNFO01BQUEsQ0FBQyxnQkFBTSxDQUNMLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FDMUIsRUFBRSxDQUFDLFlBQVksQ0FDZixHQUFHLENBQUMsQ0FBQyxrREFBa0QsMkJBQWtCLEVBQUUsQ0FBQyxFQUU5RTtNQUFBLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FDN0M7UUFBQSxDQUFDOzs7Ozs7O09BT0YsQ0FDRDtNQUFBLEVBQUUsZ0JBQU0sQ0FDVjtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsT0FBTyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuaW1wb3J0IFNjcmlwdCBmcm9tICduZXh0L3NjcmlwdCdcbmltcG9ydCB7IG1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IElTX0NFX0VESVRJT04sIElTX1BST0QsIFpFTkRFU0tfV0lER0VUX0tFWSB9IGZyb20gJ0AvY29uZmlnJ1xuXG5jb25zdCBaZW5kZXNrID0gYXN5bmMgKCkgPT4ge1xuICBpZiAoSVNfQ0VfRURJVElPTiB8fCAhWkVOREVTS19XSURHRVRfS0VZKVxuICAgIHJldHVybiBudWxsXG5cbiAgY29uc3Qgbm9uY2UgPSBJU19QUk9EID8gKGF3YWl0IGhlYWRlcnMoKSkuZ2V0KCd4LW5vbmNlJykgPz8gJycgOiAnJ1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTY3JpcHRcbiAgICAgICAgbm9uY2U9e25vbmNlID8/IHVuZGVmaW5lZH1cbiAgICAgICAgaWQ9XCJ6ZS1zbmlwcGV0XCJcbiAgICAgICAgc3JjPXtgaHR0cHM6Ly9zdGF0aWMuemRhc3NldHMuY29tL2Vrci9zbmlwcGV0LmpzP2tleT0ke1pFTkRFU0tfV0lER0VUX0tFWX1gfVxuICAgICAgLz5cbiAgICAgIDxTY3JpcHQgbm9uY2U9e25vbmNlID8/IHVuZGVmaW5lZH0gaWQ9XCJ6ZS1pbml0XCI+XG4gICAgICAgIHtgXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LnpFKVxuICAgICAgICAgICAgICB3aW5kb3cuekUoJ21lc3NlbmdlcicsICdoaWRlJylcbiAgICAgICAgICB9KVxuICAgICAgICB9KSgpXG4gICAgICBgfVxuICAgICAgPC9TY3JpcHQ+XG4gICAgPC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhaZW5kZXNrKVxuIl19