"use client";

import { NextIntlClientProvider } from 'next-intl';

export function ClientI18nProvider({
    messages,
    locale,
    children
}: {
    messages: any;
    locale: string;
    children: React.ReactNode;
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Bangkok">
            {children}
        </NextIntlClientProvider>
    );
}
