export function useLang(locale: object, lang: string) {
  const t = (key: string) => {
    console.log(locale, lang)

    return locale[lang][key]
  }
  return { t }
}
