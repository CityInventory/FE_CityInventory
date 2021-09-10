import { loadSidebar } from "../Templates/PageTemplate.js";
import { SidebarItemId } from "../Templates/SideBar.js";

window.addEventListener('load', init);

function init() {
  loadSidebar(SidebarItemId.Help);
}
