// Type boundary for the private VitePress SFC used by ClubFlyout.
// Runtime resolution remains the original VitePress import.
import type { DefineComponent } from 'vue'
import type { DefaultTheme } from 'vitepress'
declare const menu: DefineComponent<{ items?: DefaultTheme.NavItem[] }>
export default menu
