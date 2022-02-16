<template>
  <div class="container">
    <div class="text-end mt-4">
      <button
        class="btn btn-primary"
        :disabled="isLoading"
        @click="showAddProductModal"
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
                @click="showUpdateProductModal(item.id)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="setProductId(item.id, 'del')"
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
    />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { auth, admin } from '@/services';
import ProductModal from '@/components/ProductModal.vue';

export default {
  components: {
    ProductModal,
  },
  data() {
    return {
      modalTitle: '',
      product: {},
      products: [],
      isLoading: true,
      productModal: null,
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
  },
  methods: {
    showAddProductModal() {
      this.product = {};
      this.isNew = true;
      this.productModal.show();
    },
    showUpdateProductModal(productId) {
      this.product = this.products.find((product) => product.id === productId);
      this.isNew = false;
      this.productModal.show();
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
    deleteProduct() {
      this.isLoading = true;
      admin
        .deleteProduct(this.selectedProductId)
        .then((res) => {
          const {
            products, pagination, message, success,
          } = res.data;
          this.products = products;
          this.pagination = pagination;
          this.message = message;
          this.success = success;
          this.getProducts();
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
