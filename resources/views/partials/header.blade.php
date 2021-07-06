<nav class="nav-main navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
      <a class="navbar-brand" href="<?= route('home'); ?>">
        <img src="{{ asset('images/slds.png') }}" alt="Home" />
      </a>
      <button class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav-main"
              aria-controls="nav-main"
              aria-expanded="false"
              aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav-main">
          <ul class="navbar-nav me-auto">
              <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="<?= route('home'); ?>">
                      Home
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.blog'); ?>">Blog</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.album'); ?>">Album</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.jumbotron'); ?>">Jumbotron</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.carousel'); ?>">Carousel</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.features'); ?>">Features</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.pricing'); ?>">Pricing</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="<?= route('pages.checkout-form'); ?>">Checkout form</a>
              </li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle"
                     href="#"
                     id="navbarDropdown"
                     role="button"
                     data-bs-toggle="dropdown"
                     aria-expanded="false"
                  >
                      User
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#html-and-css">HTML &amp; CSS</a>
                      <a class="dropdown-item" href="#javascript">JavaScript</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="pages/signin/index.html">Login</a>
                  </div>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="pages/signin/index.html">Login</a>
              </li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle"
                     href="#"
                     id="navbarDropdown"
                     role="button"
                     data-bs-toggle="dropdown"
                     aria-expanded="false"
                  >
                      Dashboards
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="{{ route('pages.dashboard.minimal') }}">Minimal</a>
                      <a class="dropdown-item" href="#javascript">JavaScript</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="pages/signin/index.html">Login</a>
                  </div>
              </li>
          </ul>
          <form class="d-flex"
                action="index.html"
                method="GET">
              <div class="input-group">
                  <input class="form-control"
                         name="q"
                         type="search"
                         placeholder="Search"
                         aria-label="Search"/>
                  <button class="input-group-btn btn btn-primary" type="submit">Search</button>
              </div>
          </form>
      </div>
  </div>
  <!-- /container -->
</nav>