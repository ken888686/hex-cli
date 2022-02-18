<template>
  <div class="my-5 row justify-content-center">
    <v-form
      ref="form"
      v-slot="{ errors }"
      class="col-md-6"
      aria-disabled="true"
      @submit="onSubmit"
    >
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        > Email </label>
        <v-field
          id="email"
          v-model="user.email"
          rules="email|required"
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors['email'] }"
          placeholder="請輸入 Email"
          :disabled="isLoading"
        />
        <error-message
          name="email"
          class="invalid-feedback"
        />
      </div>

      <div class="mb-3">
        <label
          for="name"
          class="form-label"
        > 收件人姓名 </label>
        <v-field
          id="name"
          v-model="user.name"
          rules="required"
          name="姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名"
          :disabled="isLoading"
        />
        <error-message
          name="姓名"
          class="invalid-feedback"
        />
      </div>

      <div class="mb-3">
        <label
          for="tel"
          class="form-label"
        >收件人電話</label>
        <v-field
          id="tel"
          v-model="user.tel"
          :rules="isPhone"
          name="電話"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入電話"
          :disabled="isLoading"
        />
        <error-message
          name="電話"
          class="invalid-feedback"
        />
      </div>

      <div class="mb-3">
        <label
          for="address"
          class="form-label"
        >收件人地址</label>
        <v-field
          id="address"
          v-model="user.address"
          rules="required"
          name="地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址"
          :disabled="isLoading"
        />
        <error-message
          name="地址"
          class="invalid-feedback"
        />
      </div>

      <div class="mb-3">
        <label
          for="message"
          class="form-label"
        >留言</label>
        <textarea
          id="message"
          v-model="memo"
          rules="required"
          class="form-control"
          cols="30"
          rows="10"
          :disabled="isLoading"
        />
      </div>
      <div class="text-end">
        <button
          type="submit"
          class="btn btn-danger"
        >
          送出訂單
        </button>
      </div>
    </v-form>
    <NotificationModal
      ref="modal"
      prop-title="建立訂單"
      :prop-message="message"
    />
  </div>
</template>
<script>
import {
  defineRule, Form, Field, ErrorMessage, configure,
} from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
import { customer } from '@/services';
import NotificationModal from '@/components/NotificationModal.vue';

// import localeJson from '@/assets/locale/zh_TW.json';
// loadLocaleFromURL(localeJson);

loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json',
);
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true,
});

defineRule('required', required);
defineRule('email', email);

export default {
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage,
    NotificationModal,
  },
  props: {},
  emits: ['get-cart'],
  data() {
    return {
      user: {
        email: '',
        name: '',
        tel: '',
        address: '',
      },
      memo: '',
      isLoading: false,
      message: '',
      success: false,
    };
  },
  watch: {},
  methods: {
    isPhone(value) {
      // cell: (^09|\+?8869)\d{2}(-?\d{3}-?\d{3})$
      // phone: (((\+?(886)\d{1,2})|(^0\d{1,2}))-?)(\d{3,4}-?)(\d{4}-?)$
      const phoneNum = /(^09|\+?8869)\d{2}(-?\d{3}-?\d{3})$/;
      return phoneNum.test(value) ? true : '需要正確的手機號碼';
    },
    onSubmit() {
      this.isLoading = true;
      const data = {
        user: {
          email: this.user.email,
          name: this.user.name,
          tel: this.user.tel,
          address: this.user.address,
        },
        message: this.memo,
      };
      customer
        .submitOrder(data)
        .then((res) => {
          const { success, message } = res.data;
          this.message = message;
          this.success = success;
          this.$emit('get-cart');
          this.user = {
            email: '',
            name: '',
            tel: '',
            address: '',
          };
          this.memo = '';
        })
        .catch((err) => {
          const { message, success } = err.response.data;
          this.message = message;
          this.success = success;
        })
        .finally(() => {
          this.isLoading = false;
          this.$refs.modal.show();
        });
    },
  },
};
</script>
