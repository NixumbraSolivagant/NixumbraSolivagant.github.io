<script setup>
// 无需引入 HelloWorld
</script>

<template>
  <div>
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/blog">博客</router-link> |
      <router-link to="/about">关于我</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
nav {
  margin-bottom: 2rem;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #42b983;
}
nav a.router-link-exact-active {
  font-weight: bold;
  color: #35495e;
}
</style>
