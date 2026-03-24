<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import Navbar from "../components/Navbar.vue";

const router = useRouter();

const title = ref("");
const description = ref("");
const fileUrl = ref("");
const course = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

onMounted(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
  }
});

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!title.value.trim()) {
    errorMessage.value = "請輸入筆記標題";
    return;
  }

  if (!fileUrl.value.trim()) {
    errorMessage.value = "請輸入檔案連結";
    return;
  }

  loading.value = true;

  try {
    await api.post("/notes", {
      title: title.value,
      description: description.value,
      fileUrl: fileUrl.value,
      course: course.value,
    });

    successMessage.value = "新增成功，即將返回列表";

    setTimeout(() => {
      router.push("/notes");
    }, 800);
  } catch (error) {
    console.error(error);
    errorMessage.value = "新增失敗，請確認資料是否正確";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <Navbar />

    <div class="page-container" style="max-width: 640px;">
      <h1 class="page-title">新增筆記</h1>

      <div class="card">
        <div class="row" style="flex-direction: column;">
          <input
            v-model="title"
            type="text"
            placeholder="請輸入筆記標題"
            @keyup.enter="handleSubmit"
          />

          <input
            v-model="description"
            type="text"
            placeholder="請輸入筆記描述"
            @keyup.enter="handleSubmit"
          />

          <input
            v-model="fileUrl"
            type="text"
            placeholder="請輸入檔案連結"
            @keyup.enter="handleSubmit"
          />

          <input
            v-model="course"
            type="text"
            placeholder="請輸入課程名稱"
            @keyup.enter="handleSubmit"
          />

          <button @click="handleSubmit" :disabled="loading">
            {{ loading ? "送出中..." : "新增筆記" }}
          </button>
        </div>

        <p v-if="errorMessage" style="margin-top: 16px; color: #c0392b;">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" style="margin-top: 16px; color: #27ae60;">
          {{ successMessage }}
        </p>
      </div>
    </div>
  </div>
</template>