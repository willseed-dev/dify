"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const i18nPrefix = 'metadata.checkName';
const useCheckMetadataName = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return {
        checkName: (name) => {
            if (!name) {
                return {
                    errorMsg: t(`${i18nPrefix}.empty`, { ns: 'dataset' }),
                };
            }
            if (!/^[a-z][a-z0-9_]*$/.test(name)) {
                return {
                    errorMsg: t(`${i18nPrefix}.invalid`, { ns: 'dataset' }),
                };
            }
            if (name.length > 255) {
                return {
                    errorMsg: t(`${i18nPrefix}.tooLong`, { ns: 'dataset', max: 255 }),
                };
            }
            return {
                errorMsg: '',
            };
        },
    };
};
exports.default = useCheckMetadataName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNoZWNrLW1ldGFkYXRhLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtY2hlY2stbWV0YWRhdGEtbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE4QztBQUU5QyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQTtBQUV2QyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUNoQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsT0FBTztRQUNMLFNBQVMsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDVixPQUFPO29CQUNMLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztpQkFDdEQsQ0FBQTtZQUNILENBQUM7WUFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLE9BQU87b0JBQ0wsUUFBUSxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO2lCQUN4RCxDQUFBO1lBQ0gsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDdEIsT0FBTztvQkFDTCxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztpQkFDbEUsQ0FBQTtZQUNILENBQUM7WUFFRCxPQUFPO2dCQUNMLFFBQVEsRUFBRSxFQUFFO2FBQ2IsQ0FBQTtRQUNILENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmNvbnN0IGkxOG5QcmVmaXggPSAnbWV0YWRhdGEuY2hlY2tOYW1lJ1xuXG5jb25zdCB1c2VDaGVja01ldGFkYXRhTmFtZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIHJldHVybiB7XG4gICAgY2hlY2tOYW1lOiAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvck1zZzogdChgJHtpMThuUHJlZml4fS5lbXB0eWAsIHsgbnM6ICdkYXRhc2V0JyB9KSxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIS9eW2Etel1bYS16MC05X10qJC8udGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yTXNnOiB0KGAke2kxOG5QcmVmaXh9LmludmFsaWRgLCB7IG5zOiAnZGF0YXNldCcgfSksXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5hbWUubGVuZ3RoID4gMjU1KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3JNc2c6IHQoYCR7aTE4blByZWZpeH0udG9vTG9uZ2AsIHsgbnM6ICdkYXRhc2V0JywgbWF4OiAyNTUgfSksXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3JNc2c6ICcnLFxuICAgICAgfVxuICAgIH0sXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQ2hlY2tNZXRhZGF0YU5hbWVcbiJdfQ==