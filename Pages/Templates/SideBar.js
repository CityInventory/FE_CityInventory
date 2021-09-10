export const SIDE_BAR = `
    <div class="sidebar-wrapper bg-transparent">
      <div class="logo">
        HARTA INTERACTIVĂ
      </div>
      <ul class="nav">
        <li id="home-link" class="nav-item">
          <a class="nav-link" href="/Index.html">
            <i class="nc-icon nc-chart-pie-35"></i>
            <p>Acasă</p>
          </a>
        </li>
        <li id="issues-link" class="nav-item">
          <a class="nav-link" href="/Pages/Issues/Issues.html">
            <i class="nc-icon nc-paper-2"></i>
            <p>Sesizări</p>
          </a>
        </li>
        <li id="administration-link" class="nav-item d-none">
          <a class="nav-link" href="/Pages/Administation/Administration.html">
            <i class="nc-icon nc-atom"></i>
            <p>Administrare</p>
          </a>
        </li>
        <li id="help-link" class="nav-item">
          <a class="nav-link" href="/Pages/Help/Help.html">
            <i class="fa fa-question-circle"></i>
            <p>Ajutor</p>
          </a>
        </li>
      </ul>
    </div>
    <div class="sidebar-background" style="background-image: url(/assets/img/home.jpg) "></div>
`

export const SidebarItemId = {
  Home: "home-link",
  Issues: "issues-link",
  Administration: "administration-link",
  Help: "help-link"
}

export const SidebarItemIdentifiers = Object.values(SidebarItemId);
