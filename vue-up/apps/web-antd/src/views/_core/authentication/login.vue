<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

// 精简为：用户名 + 密码 两个字段，更贴近设计图
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: 'USERNAME',
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: 'PASSWORD',
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});
</script>

<template>
  <div class="custom-login-page">
    <div class="login-card">
      <div class="login-icon-wrapper">
        <svg
          class="login-icon"
          fill="none"
          height="56"
          viewBox="0 0 64 64"
          width="56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 18h28l-3.5 18H24L20 10H10"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
          />
          <path
            d="M30 26l6-8 6 8"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
          />
          <path
            d="M36 18v10"
            stroke="white"
            stroke-linecap="round"
            stroke-width="2.5"
          />
          <circle cx="28" cy="40" r="2" fill="white" />
          <circle cx="42" cy="40" r="2" fill="white" />
        </svg>
      </div>

      <AuthenticationLogin
        :form-schema="formSchema"
        :loading="authStore.loginLoading"
        :show-code-login="false"
        :show-forget-password="false"
        :show-qrcode-login="false"
        :show-register="false"
        :show-remember-me="false"
        :show-third-party-login="false"
        submit-button-text="LOGIN"
        title=""
        sub-title=""
        @submit="authStore.authLogin"
      />

      <button class="forgot-btn" type="button">
        Forgot password?
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3246d3;
  background: radial-gradient(circle at 10% 80%, #2738b5 0, #3246d3 40%, #2e40c2 70%, #2436aa 100%);
}

.login-card {
  min-width: 360px;
  padding: 40px 48px 32px;
  border-radius: 10px;
  background: #3246d3;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.login-icon-wrapper {
  margin-bottom: 32px;
}

.login-icon {
  display: block;
}

/* 让表单宽度适配卡片，并让按钮与输入框视觉类似 */
.login-card :deep(form) {
  width: 320px;
}

.login-card :deep(.vben-btn) {
  height: 44px;
  font-weight: 600;
  letter-spacing: 1px;
}

.forgot-btn {
  margin-top: 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  cursor: pointer;
}

.forgot-btn:hover {
  text-decoration: underline;
}
</style>

