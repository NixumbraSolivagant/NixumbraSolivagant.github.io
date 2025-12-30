<template>
  <section>
    <section class="hero is-light is-bold">
      <div class="hero-body">
        <p class="title">欢迎来到我的个人网站</p>
        <p class="subtitle">这里是我记录学习、思考和实验的地方。</p>
      </div>
    </section>

    <div class="section">
      <div class="columns is-multiline">
        <div class="column is-6">
          <div class="box">
            <h2 class="title is-5">学习笔记与博客</h2>
            <p class="mb-3">
              整理我在数值相对论、机器学习等方向的思考与总结。
            </p>
            <router-link to="/blog" class="button is-link is-light">进入博客</router-link>
          </div>
        </div>

        <div class="column is-6">
          <div class="box">
            <h2 class="title is-5">关于我</h2>
            <p class="mb-3">
              简短介绍、正在做的项目，以及常用的联系方式。
            </p>
            <router-link to="/about" class="button is-primary is-light">了解更多</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
