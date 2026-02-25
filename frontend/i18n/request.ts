import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    const locale = 'th';

    return {
        timeZone: 'Asia/Bangkok',
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
