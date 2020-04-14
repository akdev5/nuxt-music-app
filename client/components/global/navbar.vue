<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <div class="container">
        <b-navbar-brand to="/">Music App</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse class="justify-content-end" id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Player</b-nav-item>
            <b-nav-item to="/manager">Manager</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </header>
</template>
