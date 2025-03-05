import { defineBoot } from '#q-app/wrappers'
import i18n from 'src/i18n'

export default defineBoot(({ app }) => {
  app.use(i18n)
})

export { i18n }
