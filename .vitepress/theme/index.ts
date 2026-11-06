import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { registerContentComponents } from './components/register'
import { usePageEnhancements } from './composables/usePageEnhancements'
import { useRouteMotion } from './composables/useRouteMotion'

import './style.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'
import './styles/artwork-motion.css'
import './styles/learning.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) { registerContentComponents(app) },
  setup() {
    useRouteMotion()
    usePageEnhancements()
  }
} satisfies Theme
