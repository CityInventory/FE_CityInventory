import {
  SidebarItemIdentifiers,
  SIDE_BAR,
  SidebarItemId
} from "./SideBar.js";
import { getUserData } from "../../Utils/Memory.js";
import { Role } from "../../Models/Roles.js";

export function isAuthorized(requiredRole) {
  let token = getUserData();
  return (token != null) && (requiredRole ? token.role === requiredRole : true);
}

export function loadSidebar(selectedItem) {
  document.getElementById('sidebar-container').innerHTML = SIDE_BAR;
  setAdminPageVisibility();

  if(selectedItem) {
    const activeClass = 'active';
    for (let id of SidebarItemIdentifiers) {
      document.getElementById(id).classList.remove(activeClass)
    }
    document.getElementById(selectedItem).classList.add(activeClass)
  }
}

export function setAdminPageVisibility() {
  if (isAuthorized(Role.Admin)) {
    document.getElementById(SidebarItemId.Administration).classList.remove('d-none');
  }
}
