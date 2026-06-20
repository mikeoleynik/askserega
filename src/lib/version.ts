import packageJson from "../../package.json"

/** Версия репозитория (package.json, git-тег v0.1.0). */
export const APP_VERSION = packageJson.version

/** Подпись на сайте: базовая версия + канал публикации. */
export const SITE_VERSION_LABEL = `v${APP_VERSION}-alpha`
