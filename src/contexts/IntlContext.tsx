import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import messages from "../../translations/messages.json";
import languages from "../languages.json";

type TranslatedLocales = keyof typeof messages;
type SupportedLanguageLocales = keyof typeof languages;
interface LanguageName {
  /** IETF BCP 47 langauge tag with region code. */
  locale: SupportedLanguageLocales;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

export type SupportedLanguageName = Omit<LanguageName, "locale"> & {
  locale: TranslatedLocales;
};

const translatedLocales = Object.keys(messages) as Array<TranslatedLocales>;

export const supportedLanguages: SupportedLanguageName[] = translatedLocales
  .filter((locale) => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0;
    // This will show a typescript error if the language name does not exist
    const hasTranslatedLanguageName = languages[locale];
    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${locale}" is not available in Mapeo because we do not have
a language name and translations in \`src/frontend/languages.json\``
      );
    }
    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName;
  })
  .map((locale) => ({
    locale,
    ...languages[locale],
  }))
  .sort((a, b) => {
    return a.englishName.localeCompare(b.englishName);
  });

type IntlSetContextType = Readonly<
  [string, Dispatch<SetStateAction<TranslatedLocales>>]
>;

export const IntlSetContext = createContext<IntlSetContextType>([
  "en",
  () => {},
]);

export const IntlProvider = ({ children }: { children: ReactNode }) => {
  const [appLocale, setAppLocale] = useState<TranslatedLocales>("en");

  const locale = appLocale || getSupportedLocale(appLocale) || "en";

  const languageCode = locale.split("-")[0];

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[languageCode as TranslatedLocales],
    ...(messages[locale as TranslatedLocales] || {}),
  };

  const contextValue = useMemo(
    () => [locale, setAppLocale] as const,
    [locale, setAppLocale]
  );

  return (
    <ReactIntlProvider
      locale={locale}
      messages={localeMessages}
      wrapRichTextChunksInFragment
    >
      <IntlSetContext.Provider value={contextValue}>
        {children}
      </IntlSetContext.Provider>
    </ReactIntlProvider>
  );
};

function getSupportedLocale(
  locale: SupportedLanguageLocales
): keyof typeof languages | undefined {
  if (supportedLanguages.find((lang) => lang.locale === locale))
    return locale as keyof typeof languages;
  const nonRegionalLocale = locale.split("-")[0];
  if (supportedLanguages.find(({ locale }) => locale === nonRegionalLocale))
    return nonRegionalLocale as keyof typeof languages;
}
