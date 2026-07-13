<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码：123456" show-password
        autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="captchaCode">
      <div class="captcha-row">
        <el-input v-model="loginForm.captchaCode" maxlength="4" placeholder="验证码" autocomplete="off">
          <template #prefix>
            <el-icon class="el-input__icon">
              <key />
            </el-icon>
          </template>
        </el-input>
        <button class="captcha-image" type="button" aria-label="刷新验证码" :disabled="captchaLoading" @click="refreshCaptcha">
          <img v-if="captchaImageUrl" :src="captchaImageUrl" alt="验证码" />
        </button>
      </div>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { type Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi, getCaptchaApi, getUserInfoApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, Key, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captchaCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

const loading = ref(false);
const captchaLoading = ref(false);
const captchaSvg = ref("");
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
  captchaId: "",
  captchaCode: ""
});
const captchaImageUrl = computed(() => {
  if (!captchaSvg.value) return "";
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(captchaSvg.value)}`;
});

// 获取验证码
const refreshCaptcha = async () => {
  captchaLoading.value = true;
  try {
    const { data } = await getCaptchaApi();
    loginForm.captchaId = data.captchaId;
    loginForm.captchaCode = "";
    captchaSvg.value = data.svg;
  } finally {
    captchaLoading.value = false;
  }
};

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi({ ...loginForm });
      userStore.setToken(data.token);

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      const result = await getUserInfoApi();
      userStore.setUserInfo(result.data);
      // console.log(result, '用户信息');
      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 YOU GUESS",
        type: "success",
        duration: 3000
      });
      // ElNotification({
      //   title: "React 付费版本 🔥🔥🔥",
      //   dangerouslyUseHTMLString: true,
      //   message: "预览地址：<a href='https://pro.spicyboy.cn'>https://pro.spicyboy.cn</a>",
      //   type: "success",
      //   duration: 8000
      // });
    } catch {
      await refreshCaptcha();
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  refreshCaptcha();
};

onMounted(() => {
  refreshCaptcha();
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped lang="scss">
@use "../index";

.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 12px;
  width: 100%;
}

.captcha-image {
  box-sizing: border-box;
  width: 120px;
  height: 44px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
