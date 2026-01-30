"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTICE_I18N = exports.getPricingPageLanguage = exports.getDocLanguage = exports.localeMap = exports.getLanguage = exports.LanguagesSupported = exports.languages = void 0;
const languages_1 = require("./languages");
exports.languages = languages_1.default.languages;
exports.LanguagesSupported = exports.languages.filter(item => item.supported).map(item => item.value);
const getLanguage = (locale) => {
    if (['zh-Hans', 'ja-JP'].includes(locale))
        return locale.replace('-', '_');
    return exports.LanguagesSupported[0].replace('-', '_');
};
exports.getLanguage = getLanguage;
const DOC_LANGUAGE = {
    'zh-Hans': 'zh-hans',
    'ja-JP': 'ja-jp',
    'en-US': 'en',
};
exports.localeMap = {
    'en-US': 'en',
    'en_US': 'en',
    'zh-Hans': 'zh-cn',
    'zh_Hans': 'zh-cn',
    'zh-Hant': 'zh-tw',
    'pt-BR': 'pt-br',
    'es-ES': 'es',
    'fr-FR': 'fr',
    'de-DE': 'de',
    'ja-JP': 'ja',
    'ja_JP': 'ja',
    'ko-KR': 'ko',
    'ru-RU': 'ru',
    'it-IT': 'it',
    'th-TH': 'th',
    'id-ID': 'id',
    'uk-UA': 'uk',
    'vi-VN': 'vi',
    'ro-RO': 'ro',
    'pl-PL': 'pl',
    'hi-IN': 'hi',
    'tr-TR': 'tr',
    'fa-IR': 'fa',
    'sl-SI': 'sl',
    'ar-TN': 'ar',
};
const getDocLanguage = (locale) => {
    return DOC_LANGUAGE[locale] || 'en';
};
exports.getDocLanguage = getDocLanguage;
const PRICING_PAGE_LANGUAGE = {
    'ja-JP': 'jp',
};
const getPricingPageLanguage = (locale) => {
    return PRICING_PAGE_LANGUAGE[locale] || '';
};
exports.getPricingPageLanguage = getPricingPageLanguage;
exports.NOTICE_I18N = {
    title: {
        en_US: 'Important Notice',
        zh_Hans: '重要公告',
        zh_Hant: '重要公告',
        pt_BR: 'Aviso Importante',
        es_ES: 'Aviso Importante',
        fr_FR: 'Avis important',
        de_DE: 'Wichtiger Hinweis',
        ja_JP: '重要なお知らせ',
        ko_KR: '중요 공지',
        ru_RU: 'Важное Уведомление',
        it_IT: 'Avviso Importante',
        th_TH: 'ประกาศสำคัญ',
        id_ID: 'Pengumuman Penting',
        uk_UA: 'Важливе повідомлення',
        vi_VN: 'Thông báo quan trọng',
        ro_RO: 'Anunț Important',
        pl_PL: 'Ważne ogłoszenie',
        hi_IN: 'महत्वपूर्ण सूचना',
        tr_TR: 'Önemli Duyuru',
        fa_IR: 'هشدار مهم',
        sl_SI: 'Pomembno obvestilo',
        ar_TN: 'إشعار مهم',
    },
    desc: {
        en_US: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        zh_Hans: '为了有效提升数据检索能力及稳定性，Dify 将于 2023 年 8 月 29 日 03:00 至 08:00 期间进行服务升级，届时 Dify 云端版及应用将无法访问。感谢您的耐心与支持。',
        pt_BR: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        es_ES: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        fr_FR: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        de_DE: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        ja_JP: 'Our system will be unavailable from 19:00 to 24:00 UTC on August 28 for an upgrade. For questions, kindly contact our support team (support@dify.ai). We value your patience.',
        ko_KR: '시스템이 업그레이드를 위해 UTC 시간대로 8 월 28 일 19:00 ~ 24:00 에 사용 불가될 예정입니다. 질문이 있으시면 지원 팀에 연락주세요 (support@dify.ai). 최선을 다해 답변해드리겠습니다.',
        pl_PL: 'Nasz system będzie niedostępny od 19:00 do 24:00 UTC 28 sierpnia w celu aktualizacji. W przypadku pytań prosimy o kontakt z naszym zespołem wsparcia (support@dify.ai). Doceniamy Twoją cierpliwość.',
        uk_UA: 'Наша система буде недоступна з 19:00 до 24:00 UTC 28 серпня для оновлення. Якщо у вас виникнуть запитання, будь ласка, зв’яжіться з нашою службою підтримки (support@dify.ai). Дякуємо за терпіння.',
        ru_RU: 'Наша система будет недоступна с 19:00 до 24:00 UTC 28 августа для обновления. По вопросам, пожалуйста, обращайтесь в нашу службу поддержки (support@dify.ai). Спасибо за ваше терпение',
        vi_VN: 'Hệ thống của chúng tôi sẽ ngừng hoạt động từ 19:00 đến 24:00 UTC vào ngày 28 tháng 8 để nâng cấp. Nếu có thắc mắc, vui lòng liên hệ với nhóm hỗ trợ của chúng tôi (support@dify.ai). Chúng tôi đánh giá cao sự kiên nhẫn của bạn.',
        id_ID: 'Sistem kami tidak akan tersedia dari 19:00 hingga 24:00 UTC pada 28 Agustus untuk pemutakhiran. Untuk pertanyaan, silakan hubungi tim dukungan kami (support@dify.ai). Kami menghargai kesabaran Anda.',
        tr_TR: 'Sistemimiz, 28 Ağustos\'ta 19:00 ile 24:00 UTC saatleri arasında güncelleme nedeniyle kullanılamayacaktır. Sorularınız için lütfen destek ekibimizle iletişime geçin (support@dify.ai). Sabrınız için teşekkür ederiz.',
        fa_IR: 'سیستم ما از ساعت 19:00 تا 24:00 UTC در تاریخ 28 اوت برای ارتقاء در دسترس نخواهد بود. برای سؤالات، لطفاً با تیم پشتیبانی ما (support@dify.ai) تماس بگیرید. ما برای صبر شما ارزش قائلیم.',
        sl_SI: 'Naš sistem ne bo na voljo od 19:00 do 24:00 UTC 28. avgusta zaradi nadgradnje. Za vprašanja se obrnite na našo skupino za podporo (support@dify.ai). Cenimo vašo potrpežljivost.',
        th_TH: 'ระบบของเราจะไม่สามารถใช้งานได้ตั้งแต่เวลา 19:00 ถึง 24:00 UTC ในวันที่ 28 สิงหาคม เพื่อทำการอัปเกรด หากมีคำถามใดๆ กรุณาติดต่อทีมสนับสนุนของเรา (support@dify.ai) เราขอขอบคุณในความอดทนของท่าน',
        ar_TN: 'سيكون نظامنا غير متاح من الساعة 19:00 إلى 24:00 بالتوقيت العالمي المنسق في 28 أغسطس لإجراء ترقية. للأسئلة، يرجى الاتصال بفريق الدعم لدينا (support@dify.ai). نحن نقدر صبرك.',
    },
    href: '#',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBOEI7QUFVakIsUUFBQSxTQUFTLEdBQUcsbUJBQUksQ0FBQyxTQUFTLENBQUE7QUFLMUIsUUFBQSxrQkFBa0IsR0FBYSxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFFckcsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFjLEVBQVUsRUFBRTtJQUNwRCxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDdkMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQVcsQ0FBQTtJQUUzQyxPQUFPLDBCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFXLENBQUE7QUFDMUQsQ0FBQyxDQUFBO0FBTFksUUFBQSxXQUFXLGVBS3ZCO0FBRUQsTUFBTSxZQUFZLEdBQTJCO0lBQzNDLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQTtBQUVZLFFBQUEsU0FBUyxHQUEyQjtJQUMvQyxPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsU0FBUyxFQUFFLE9BQU87SUFDbEIsU0FBUyxFQUFFLE9BQU87SUFDbEIsU0FBUyxFQUFFLE9BQU87SUFDbEIsT0FBTyxFQUFFLE9BQU87SUFDaEIsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7Q0FDZCxDQUFBO0FBRU0sTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUMvQyxPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUE7QUFDckMsQ0FBQyxDQUFBO0FBRlksUUFBQSxjQUFjLGtCQUUxQjtBQUVELE1BQU0scUJBQXFCLEdBQTJCO0lBQ3BELE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQTtBQUVNLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUN2RCxPQUFPLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUM1QyxDQUFDLENBQUE7QUFGWSxRQUFBLHNCQUFzQiwwQkFFbEM7QUFFWSxRQUFBLFdBQVcsR0FBRztJQUN6QixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLE1BQU07UUFDZixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLEtBQUssRUFBRSxrQkFBa0I7UUFDekIsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLG9CQUFvQjtRQUMzQixLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLEtBQUssRUFBRSxhQUFhO1FBQ3BCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLHNCQUFzQjtRQUM3QixLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLEtBQUssRUFBRSxpQkFBaUI7UUFDeEIsS0FBSyxFQUFFLGtCQUFrQjtRQUN6QixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLEtBQUssRUFBRSxlQUFlO1FBQ3RCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLFdBQVc7S0FDbkI7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQ0gsK0tBQStLO1FBQ2pMLE9BQU8sRUFDTCxnR0FBZ0c7UUFDbEcsS0FBSyxFQUNILCtLQUErSztRQUNqTCxLQUFLLEVBQ0gsK0tBQStLO1FBQ2pMLEtBQUssRUFDSCwrS0FBK0s7UUFDakwsS0FBSyxFQUNILCtLQUErSztRQUNqTCxLQUFLLEVBQ0gsK0tBQStLO1FBQ2pMLEtBQUssRUFDSCwwSEFBMEg7UUFDNUgsS0FBSyxFQUNILHNNQUFzTTtRQUN4TSxLQUFLLEVBQ0gscU1BQXFNO1FBQ3ZNLEtBQUssRUFDSCx3TEFBd0w7UUFDMUwsS0FBSyxFQUNILG1PQUFtTztRQUNyTyxLQUFLLEVBQ0gsd01BQXdNO1FBQzFNLEtBQUssRUFDSCx3TkFBd047UUFDMU4sS0FBSyxFQUNILHdMQUF3TDtRQUMxTCxLQUFLLEVBQ0gsa0xBQWtMO1FBQ3BMLEtBQUssRUFDSCwrTEFBK0w7UUFDak0sS0FBSyxFQUNILDZLQUE2SztLQUNoTDtJQUNELElBQUksRUFBRSxHQUFHO0NBQ1YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhIGZyb20gJy4vbGFuZ3VhZ2VzJ1xuXG5leHBvcnQgdHlwZSBJdGVtID0ge1xuICB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nXG4gIG5hbWU6IHN0cmluZ1xuICBleGFtcGxlOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgSTE4blRleHQgPSBSZWNvcmQ8dHlwZW9mIExhbmd1YWdlc1N1cHBvcnRlZFtudW1iZXJdLCBzdHJpbmc+XG5cbmV4cG9ydCBjb25zdCBsYW5ndWFnZXMgPSBkYXRhLmxhbmd1YWdlc1xuXG4vLyBmb3IgY29tcGF0aWJpbGl0eVxuZXhwb3J0IHR5cGUgTG9jYWxlID0gJ2phX0pQJyB8ICd6aF9IYW5zJyB8ICdlbl9VUycgfCAodHlwZW9mIGxhbmd1YWdlc1tudW1iZXJdKVsndmFsdWUnXVxuXG5leHBvcnQgY29uc3QgTGFuZ3VhZ2VzU3VwcG9ydGVkOiBMb2NhbGVbXSA9IGxhbmd1YWdlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN1cHBvcnRlZCkubWFwKGl0ZW0gPT4gaXRlbS52YWx1ZSlcblxuZXhwb3J0IGNvbnN0IGdldExhbmd1YWdlID0gKGxvY2FsZTogTG9jYWxlKTogTG9jYWxlID0+IHtcbiAgaWYgKFsnemgtSGFucycsICdqYS1KUCddLmluY2x1ZGVzKGxvY2FsZSkpXG4gICAgcmV0dXJuIGxvY2FsZS5yZXBsYWNlKCctJywgJ18nKSBhcyBMb2NhbGVcblxuICByZXR1cm4gTGFuZ3VhZ2VzU3VwcG9ydGVkWzBdLnJlcGxhY2UoJy0nLCAnXycpIGFzIExvY2FsZVxufVxuXG5jb25zdCBET0NfTEFOR1VBR0U6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICd6aC1IYW5zJzogJ3poLWhhbnMnLFxuICAnamEtSlAnOiAnamEtanAnLFxuICAnZW4tVVMnOiAnZW4nLFxufVxuXG5leHBvcnQgY29uc3QgbG9jYWxlTWFwOiBSZWNvcmQ8TG9jYWxlLCBzdHJpbmc+ID0ge1xuICAnZW4tVVMnOiAnZW4nLFxuICAnZW5fVVMnOiAnZW4nLFxuICAnemgtSGFucyc6ICd6aC1jbicsXG4gICd6aF9IYW5zJzogJ3poLWNuJyxcbiAgJ3poLUhhbnQnOiAnemgtdHcnLFxuICAncHQtQlInOiAncHQtYnInLFxuICAnZXMtRVMnOiAnZXMnLFxuICAnZnItRlInOiAnZnInLFxuICAnZGUtREUnOiAnZGUnLFxuICAnamEtSlAnOiAnamEnLFxuICAnamFfSlAnOiAnamEnLFxuICAna28tS1InOiAna28nLFxuICAncnUtUlUnOiAncnUnLFxuICAnaXQtSVQnOiAnaXQnLFxuICAndGgtVEgnOiAndGgnLFxuICAnaWQtSUQnOiAnaWQnLFxuICAndWstVUEnOiAndWsnLFxuICAndmktVk4nOiAndmknLFxuICAncm8tUk8nOiAncm8nLFxuICAncGwtUEwnOiAncGwnLFxuICAnaGktSU4nOiAnaGknLFxuICAndHItVFInOiAndHInLFxuICAnZmEtSVInOiAnZmEnLFxuICAnc2wtU0knOiAnc2wnLFxuICAnYXItVE4nOiAnYXInLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0RG9jTGFuZ3VhZ2UgPSAobG9jYWxlOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIERPQ19MQU5HVUFHRVtsb2NhbGVdIHx8ICdlbidcbn1cblxuY29uc3QgUFJJQ0lOR19QQUdFX0xBTkdVQUdFOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnamEtSlAnOiAnanAnLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0UHJpY2luZ1BhZ2VMYW5ndWFnZSA9IChsb2NhbGU6IHN0cmluZykgPT4ge1xuICByZXR1cm4gUFJJQ0lOR19QQUdFX0xBTkdVQUdFW2xvY2FsZV0gfHwgJydcbn1cblxuZXhwb3J0IGNvbnN0IE5PVElDRV9JMThOID0ge1xuICB0aXRsZToge1xuICAgIGVuX1VTOiAnSW1wb3J0YW50IE5vdGljZScsXG4gICAgemhfSGFuczogJ+mHjeimgeWFrOWRiicsXG4gICAgemhfSGFudDogJ+mHjeimgeWFrOWRiicsXG4gICAgcHRfQlI6ICdBdmlzbyBJbXBvcnRhbnRlJyxcbiAgICBlc19FUzogJ0F2aXNvIEltcG9ydGFudGUnLFxuICAgIGZyX0ZSOiAnQXZpcyBpbXBvcnRhbnQnLFxuICAgIGRlX0RFOiAnV2ljaHRpZ2VyIEhpbndlaXMnLFxuICAgIGphX0pQOiAn6YeN6KaB44Gq44GK55+l44KJ44GbJyxcbiAgICBrb19LUjogJ+ykkeyalCDqs7Xsp4AnLFxuICAgIHJ1X1JVOiAn0JLQsNC20L3QvtC1INCj0LLQtdC00L7QvNC70LXQvdC40LUnLFxuICAgIGl0X0lUOiAnQXZ2aXNvIEltcG9ydGFudGUnLFxuICAgIHRoX1RIOiAn4Lib4Lij4Liw4LiB4Liy4Lio4Liq4Liz4LiE4Lix4LiNJyxcbiAgICBpZF9JRDogJ1Blbmd1bXVtYW4gUGVudGluZycsXG4gICAgdWtfVUE6ICfQktCw0LbQu9C40LLQtSDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8nLFxuICAgIHZpX1ZOOiAnVGjDtG5nIGLDoW8gcXVhbiB0cuG7jW5nJyxcbiAgICByb19STzogJ0FudW7ImyBJbXBvcnRhbnQnLFxuICAgIHBsX1BMOiAnV2HFvG5lIG9nxYJvc3plbmllJyxcbiAgICBoaV9JTjogJ+CkruCkueCkpOCljeCkteCkquClguCksOCljeCkoyDgpLjgpYLgpJrgpKjgpL4nLFxuICAgIHRyX1RSOiAnw5ZuZW1saSBEdXl1cnUnLFxuICAgIGZhX0lSOiAn2YfYtNiv2KfYsSDZhdmH2YUnLFxuICAgIHNsX1NJOiAnUG9tZW1ibm8gb2J2ZXN0aWxvJyxcbiAgICBhcl9UTjogJ9il2LTYudin2LEg2YXZh9mFJyxcbiAgfSxcbiAgZGVzYzoge1xuICAgIGVuX1VTOlxuICAgICAgJ091ciBzeXN0ZW0gd2lsbCBiZSB1bmF2YWlsYWJsZSBmcm9tIDE5OjAwIHRvIDI0OjAwIFVUQyBvbiBBdWd1c3QgMjggZm9yIGFuIHVwZ3JhZGUuIEZvciBxdWVzdGlvbnMsIGtpbmRseSBjb250YWN0IG91ciBzdXBwb3J0IHRlYW0gKHN1cHBvcnRAZGlmeS5haSkuIFdlIHZhbHVlIHlvdXIgcGF0aWVuY2UuJyxcbiAgICB6aF9IYW5zOlxuICAgICAgJ+S4uuS6huacieaViOaPkOWNh+aVsOaNruajgOe0ouiDveWKm+WPiueos+WumuaAp++8jERpZnkg5bCG5LqOIDIwMjMg5bm0IDgg5pyIIDI5IOaXpSAwMzowMCDoh7MgMDg6MDAg5pyf6Ze06L+b6KGM5pyN5Yqh5Y2H57qn77yM5bGK5pe2IERpZnkg5LqR56uv54mI5Y+K5bqU55So5bCG5peg5rOV6K6/6Zeu44CC5oSf6LCi5oKo55qE6ICQ5b+D5LiO5pSv5oyB44CCJyxcbiAgICBwdF9CUjpcbiAgICAgICdPdXIgc3lzdGVtIHdpbGwgYmUgdW5hdmFpbGFibGUgZnJvbSAxOTowMCB0byAyNDowMCBVVEMgb24gQXVndXN0IDI4IGZvciBhbiB1cGdyYWRlLiBGb3IgcXVlc3Rpb25zLCBraW5kbHkgY29udGFjdCBvdXIgc3VwcG9ydCB0ZWFtIChzdXBwb3J0QGRpZnkuYWkpLiBXZSB2YWx1ZSB5b3VyIHBhdGllbmNlLicsXG4gICAgZXNfRVM6XG4gICAgICAnT3VyIHN5c3RlbSB3aWxsIGJlIHVuYXZhaWxhYmxlIGZyb20gMTk6MDAgdG8gMjQ6MDAgVVRDIG9uIEF1Z3VzdCAyOCBmb3IgYW4gdXBncmFkZS4gRm9yIHF1ZXN0aW9ucywga2luZGx5IGNvbnRhY3Qgb3VyIHN1cHBvcnQgdGVhbSAoc3VwcG9ydEBkaWZ5LmFpKS4gV2UgdmFsdWUgeW91ciBwYXRpZW5jZS4nLFxuICAgIGZyX0ZSOlxuICAgICAgJ091ciBzeXN0ZW0gd2lsbCBiZSB1bmF2YWlsYWJsZSBmcm9tIDE5OjAwIHRvIDI0OjAwIFVUQyBvbiBBdWd1c3QgMjggZm9yIGFuIHVwZ3JhZGUuIEZvciBxdWVzdGlvbnMsIGtpbmRseSBjb250YWN0IG91ciBzdXBwb3J0IHRlYW0gKHN1cHBvcnRAZGlmeS5haSkuIFdlIHZhbHVlIHlvdXIgcGF0aWVuY2UuJyxcbiAgICBkZV9ERTpcbiAgICAgICdPdXIgc3lzdGVtIHdpbGwgYmUgdW5hdmFpbGFibGUgZnJvbSAxOTowMCB0byAyNDowMCBVVEMgb24gQXVndXN0IDI4IGZvciBhbiB1cGdyYWRlLiBGb3IgcXVlc3Rpb25zLCBraW5kbHkgY29udGFjdCBvdXIgc3VwcG9ydCB0ZWFtIChzdXBwb3J0QGRpZnkuYWkpLiBXZSB2YWx1ZSB5b3VyIHBhdGllbmNlLicsXG4gICAgamFfSlA6XG4gICAgICAnT3VyIHN5c3RlbSB3aWxsIGJlIHVuYXZhaWxhYmxlIGZyb20gMTk6MDAgdG8gMjQ6MDAgVVRDIG9uIEF1Z3VzdCAyOCBmb3IgYW4gdXBncmFkZS4gRm9yIHF1ZXN0aW9ucywga2luZGx5IGNvbnRhY3Qgb3VyIHN1cHBvcnQgdGVhbSAoc3VwcG9ydEBkaWZ5LmFpKS4gV2UgdmFsdWUgeW91ciBwYXRpZW5jZS4nLFxuICAgIGtvX0tSOlxuICAgICAgJ+yLnOyKpO2FnOydtCDsl4Xqt7jroIjsnbTrk5zrpbwg7JyE7ZW0IFVUQyDsi5zqsITrjIDroZwgOCDsm5QgMjgg7J28IDE5OjAwIH4gMjQ6MDAg7JeQIOyCrOyaqSDrtojqsIDrkKAg7JiI7KCV7J6F64uI64ukLiDsp4jrrLjsnbQg7J6I7Jy87Iuc66m0IOyngOybkCDtjIDsl5Ag7Jew65297KO87IS47JqUIChzdXBwb3J0QGRpZnkuYWkpLiDstZzshKDsnYQg64uk7ZW0IOuLteuzgO2VtOuTnOumrOqyoOyKteuLiOuLpC4nLFxuICAgIHBsX1BMOlxuICAgICAgJ05hc3ogc3lzdGVtIGLEmWR6aWUgbmllZG9zdMSZcG55IG9kIDE5OjAwIGRvIDI0OjAwIFVUQyAyOCBzaWVycG5pYSB3IGNlbHUgYWt0dWFsaXphY2ppLiBXIHByenlwYWRrdSBweXRhxYQgcHJvc2lteSBvIGtvbnRha3QgeiBuYXN6eW0gemVzcG/FgmVtIHdzcGFyY2lhIChzdXBwb3J0QGRpZnkuYWkpLiBEb2NlbmlhbXkgVHdvasSFIGNpZXJwbGl3b8WbxIcuJyxcbiAgICB1a19VQTpcbiAgICAgICfQndCw0YjQsCDRgdC40YHRgtC10LzQsCDQsdGD0LTQtSDQvdC10LTQvtGB0YLRg9C/0L3QsCDQtyAxOTowMCDQtNC+IDI0OjAwIFVUQyAyOCDRgdC10YDQv9C90Y8g0LTQu9GPINC+0L3QvtCy0LvQtdC90L3Rjy4g0K/QutGJ0L4g0YMg0LLQsNGBINCy0LjQvdC40LrQvdGD0YLRjCDQt9Cw0L/QuNGC0LDQvdC90Y8sINCx0YPQtNGMINC70LDRgdC60LAsINC30LLigJnRj9C20ZbRgtGM0YHRjyDQtyDQvdCw0YjQvtGOINGB0LvRg9C20LHQvtGOINC/0ZbQtNGC0YDQuNC80LrQuCAoc3VwcG9ydEBkaWZ5LmFpKS4g0JTRj9C60YPRlNC80L4g0LfQsCDRgtC10YDQv9GW0L3QvdGPLicsXG4gICAgcnVfUlU6XG4gICAgICAn0J3QsNGI0LAg0YHQuNGB0YLQtdC80LAg0LHRg9C00LXRgiDQvdC10LTQvtGB0YLRg9C/0L3QsCDRgSAxOTowMCDQtNC+IDI0OjAwIFVUQyAyOCDQsNCy0LPRg9GB0YLQsCDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8uINCf0L4g0LLQvtC/0YDQvtGB0LDQvCwg0L/QvtC20LDQu9GD0LnRgdGC0LAsINC+0LHRgNCw0YnQsNC50YLQtdGB0Ywg0LIg0L3QsNGI0YMg0YHQu9GD0LbQsdGDINC/0L7QtNC00LXRgNC20LrQuCAoc3VwcG9ydEBkaWZ5LmFpKS4g0KHQv9Cw0YHQuNCx0L4g0LfQsCDQstCw0YjQtSDRgtC10YDQv9C10L3QuNC1JyxcbiAgICB2aV9WTjpcbiAgICAgICdI4buHIHRo4buRbmcgY+G7p2EgY2jDum5nIHTDtGkgc+G6vSBuZ+G7q25nIGhv4bqhdCDEkeG7mW5nIHThu6sgMTk6MDAgxJHhur9uIDI0OjAwIFVUQyB2w6BvIG5nw6B5IDI4IHRow6FuZyA4IMSR4buDIG7Dom5nIGPhuqVwLiBO4bq/dSBjw7MgdGjhuq9jIG3huq9jLCB2dWkgbMOybmcgbGnDqm4gaOG7hyB24bubaSBuaMOzbSBo4buXIHRy4bujIGPhu6dhIGNow7puZyB0w7RpIChzdXBwb3J0QGRpZnkuYWkpLiBDaMO6bmcgdMO0aSDEkcOhbmggZ2nDoSBjYW8gc+G7sSBracOqbiBuaOG6q24gY+G7p2EgYuG6oW4uJyxcbiAgICBpZF9JRDpcbiAgICAgICdTaXN0ZW0ga2FtaSB0aWRhayBha2FuIHRlcnNlZGlhIGRhcmkgMTk6MDAgaGluZ2dhIDI0OjAwIFVUQyBwYWRhIDI4IEFndXN0dXMgdW50dWsgcGVtdXRha2hpcmFuLiBVbnR1ayBwZXJ0YW55YWFuLCBzaWxha2FuIGh1YnVuZ2kgdGltIGR1a3VuZ2FuIGthbWkgKHN1cHBvcnRAZGlmeS5haSkuIEthbWkgbWVuZ2hhcmdhaSBrZXNhYmFyYW4gQW5kYS4nLFxuICAgIHRyX1RSOlxuICAgICAgJ1Npc3RlbWltaXosIDI4IEHEn3VzdG9zXFwndGEgMTk6MDAgaWxlIDI0OjAwIFVUQyBzYWF0bGVyaSBhcmFzxLFuZGEgZ8O8bmNlbGxlbWUgbmVkZW5peWxlIGt1bGxhbsSxbGFtYXlhY2FrdMSxci4gU29ydWxhcsSxbsSxeiBpw6dpbiBsw7x0ZmVuIGRlc3RlayBla2liaW1pemxlIGlsZXRpxZ9pbWUgZ2XDp2luIChzdXBwb3J0QGRpZnkuYWkpLiBTYWJyxLFuxLF6IGnDp2luIHRlxZ9la2vDvHIgZWRlcml6LicsXG4gICAgZmFfSVI6XG4gICAgICAn2LPbjNiz2KrZhSDZhdinINin2LIg2LPYp9i52KogMTk6MDAg2KrYpyAyNDowMCBVVEMg2K/YsSDYqtin2LHbjNiuIDI4INin2YjYqiDYqNix2KfbjCDYp9ix2KrZgtin2KEg2K/YsSDYr9iz2KrYsdizINmG2K7ZiNin2YfYryDYqNmI2K8uINio2LHYp9uMINiz2KTYp9mE2KfYqtiMINmE2LfZgdin2Ysg2KjYpyDYqtuM2YUg2b7YtNiq24zYqNin2YbbjCDZhdinIChzdXBwb3J0QGRpZnkuYWkpINiq2YXYp9izINio2q/bjNix24zYry4g2YXYpyDYqNix2KfbjCDYtdio2LEg2LTZhdinINin2LHYsti0INmC2KfYptmE24zZhS4nLFxuICAgIHNsX1NJOlxuICAgICAgJ05hxaEgc2lzdGVtIG5lIGJvIG5hIHZvbGpvIG9kIDE5OjAwIGRvIDI0OjAwIFVUQyAyOC4gYXZndXN0YSB6YXJhZGkgbmFkZ3JhZG5qZS4gWmEgdnByYcWhYW5qYSBzZSBvYnJuaXRlIG5hIG5hxaFvIHNrdXBpbm8gemEgcG9kcG9ybyAoc3VwcG9ydEBkaWZ5LmFpKS4gQ2VuaW1vIHZhxaFvIHBvdHJwZcW+bGppdm9zdC4nLFxuICAgIHRoX1RIOlxuICAgICAgJ+C4o+C4sOC4muC4muC4guC4reC4h+C5gOC4o+C4suC4iOC4sOC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC5g+C4iuC5ieC4h+C4suC4meC5hOC4lOC5ieC4leC4seC5ieC4h+C5geC4leC5iOC5gOC4p+C4peC4siAxOTowMCDguJbguLbguIcgMjQ6MDAgVVRDIOC5g+C4meC4p+C4seC4meC4l+C4teC5iCAyOCDguKrguLTguIfguKvguLLguITguKEg4LmA4Lie4Li34LmI4Lit4LiX4Liz4LiB4Liy4Lij4Lit4Lix4Lib4LmA4LiB4Lij4LiUIOC4q+C4suC4geC4oeC4teC4hOC4s+C4luC4suC4oeC5g+C4lOC5hiDguIHguKPguLjguJPguLLguJXguLTguJTguJXguYjguK3guJfguLXguKHguKrguJnguLHguJrguKrguJnguLjguJnguILguK3guIfguYDguKPguLIgKHN1cHBvcnRAZGlmeS5haSkg4LmA4Lij4Liy4LiC4Lit4LiC4Lit4Lia4LiE4Li44LiT4LmD4LiZ4LiE4Lin4Liy4Lih4Lit4LiU4LiX4LiZ4LiC4Lit4LiH4LiX4LmI4Liy4LiZJyxcbiAgICBhcl9UTjpcbiAgICAgICfYs9mK2YPZiNmGINmG2LjYp9mF2YbYpyDYutmK2LEg2YXYqtin2K0g2YXZhiDYp9mE2LPYp9i52KkgMTk6MDAg2KXZhNmJIDI0OjAwINio2KfZhNiq2YjZgtmK2Kog2KfZhNi52KfZhNmF2Yog2KfZhNmF2YbYs9mCINmB2YogMjgg2KPYutiz2LfYsyDZhNil2KzYsdin2KEg2KrYsdmC2YrYqS4g2YTZhNij2LPYptmE2KnYjCDZitix2KzZiSDYp9mE2KfYqti12KfZhCDYqNmB2LHZitmCINin2YTYr9i52YUg2YTYr9mK2YbYpyAoc3VwcG9ydEBkaWZ5LmFpKS4g2YbYrdmGINmG2YLYr9ixINi12KjYsdmDLicsXG4gIH0sXG4gIGhyZWY6ICcjJyxcbn1cbiJdfQ==