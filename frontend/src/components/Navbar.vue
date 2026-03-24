<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function handleLogout() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">uniNote</div>

    <div class="navbar-links">
      <router-link to="/notes" class="link-btn">筆記列表</router-link>
      <router-link to="/favorites" class="link-btn">我的收藏</router-link>
      <router-link to="/create" class="link-btn">新增筆記</router-link>
      <button @click="handleLogout">登出</button>
    </div>
    
  </nav>
</template>