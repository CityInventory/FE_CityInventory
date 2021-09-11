export const NAV_BAR = `
      <div class="container-fluid">
        <a class="navbar-brand" href="../../Index.html">
          <img alt="" height="30%" src="../../images/logo.PNG" width="30%">
        </a>
        <button aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler navbar-toggler-right"
                data-toggle="collapse" href="" type="button">
          <span class="navbar-toggler-bar burger-lines"></span>
          <span class="navbar-toggler-bar burger-lines"></span>
          <span class="navbar-toggler-bar burger-lines"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navigation">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item" id="log-in-container">
              <a class="nav-link">
                <div class="customGPlusSignIn" id="loginBtn">
                  <span class="buttonText">Autentificare cu Google</span>
                </div>
              </a>
            </li>
            <li class="nav-item" id="log-out-container">
              <a class="nav-link">
                <span class="no-icon" id="user-name"></span>
              </a>
              <a class="nav-link">
                <span class="no-icon" id="logoutBtn">Deconectare</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
`
