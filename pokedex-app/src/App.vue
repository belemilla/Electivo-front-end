<template>
  <div id="app-container">
    <header>
      <h1>Mi Pokédex</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* These are global styles for your entire application */
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
}
#app-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}
header {
  text-align: center;
  margin-bottom: 2rem;
}
header h1 {
  color: #ef5350; /* A reddish color, like a Pokéball */
  text-transform: uppercase;
}
</style>
