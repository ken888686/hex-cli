<template>
  <div class="container">
    <div class="text-end mt-4">
      <button
        class="btn btn-primary"
        :disabled="isLoading"
        @click="showProductAddModal"
      >
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in products"
          :key="item.id"
        >
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>
            {{ item.origin_price }}
          </td>
          <td>
            {{ item.price }}
          </td>
          <td>
            <span
              :class="[item.is_enabled ? 'text-success' : 'text-secondary']"
            >
              {{ item.is_enabled ? '啟用' : '未啟用' }}
            </span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="showProductUpdateModal(item.id)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="showProductDeleteModal(item.id)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ProductModal
      :prop-is-new="isNew"
      :prop-product="product"
      @get-products="getProducts"
    />
    <ProductDeleteModalVue
      :prop-product="product"
      @get-products="getProducts"
    />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { auth, admin } from '@/services';
import ProductModal from '@/components/ProductModal.vue';
import ProductDeleteModalVue from '@/components/ProductDeleteModal.vue';

export default {
  components: {
    ProductModal,
    ProductDeleteModalVue,
  },
  data() {
    return {
      modalTitle: '',
      product: {},
      products: [],
      isLoading: true,
      productModal: null,
      productDeleteModal: null,
      selectedProductId: '',
      isNew: true,
    };
  },
  watch: {
    // selectedProductId() {
    //   if (this.selectedProductId === '') {
    //     this.product = {};
    //     return;
    //   }
    //   this.product = this.products.find(
    //     (product) => product.id === this.selectedProductId,
    //   );
    // },
  },
  mounted() {
    if (!this.$store.state.isLogin) {
      this.$router.push('/login');
      return;
    }

    auth
      .check()
      .then((res) => {
        const { data } = res;
        if (data.success) {
          this.getProducts();
        }
      })
      .catch((err) => {
        const { message, success } = err.response.data;
        this.message = message;
        this.success = success;
        this.$store.commit('logout');
        this.$router.push('/login');
      });

    this.productModal = new Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static',
    });

    this.productDeleteModal = new Modal(
      document.getElementById('productDeleteModal'),
      {
        keyboard: false,
        backdrop: 'static',
      },
    );
  },
  methods: {
    showProductAddModal() {
      this.product = {};
      this.isNew = true;
      this.productModal.show();
    },
    showProductUpdateModal(productId) {
      this.product = this.products.find((product) => product.id === productId);
      this.isNew = false;
      this.productModal.show();
    },
    showProductDeleteModal(productId) {
      this.product = this.products.find((product) => product.id === productId);
      this.isNew = false;
      this.productDeleteModal.show();
    },
    getProducts() {
      this.isLoading = true;
      admin
        .getProducts()
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          const { message, success } = err.response.data;
          this.message = message;
          this.success = success;
          this.$store.commit('logout');
          this.$router.push('/login');
        });
    },
  },
};
</script>
