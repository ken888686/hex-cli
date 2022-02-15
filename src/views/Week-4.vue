<template>
  <div class="container">
    <div class="text-end mt-4">
      <button
        class="btn btn-primary"
        :disabled="isLoading"
        @click="setProductId('', 'add')"
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
                @click="setProductId(item.id, 'edit')"
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
  </div>
</template>

<script>
// import { Modal } from 'bootstrap';
import { auth, admin } from '@/services';

export default {
  data() {
    return {
      products: [],
      isLoading: true,
    };
  },
  mounted() {
    if (!this.$store.state.isLogin) {
      this.$router.push('/login');
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
        const { data } = err.response;
        this.message = data.message;
        this.success = data.success;
        this.$store.commit('logout');
        this.$router.push('/login');
      });
  },
  methods: {
    setProductId(id, action) {
      this.selectedProductId = id;
      this.action = action;
      switch (action) {
        case 'add':
        case 'edit':
          this.productModal.show();
          break;
        case 'del':
          this.delProductModal.show();
          break;
        default:
      }
    },
    getProducts() {
      this.isLoading = true;
      admin
        .getProducts()
        .then((res) => {
          const { data } = res;
          this.products = data.products;
          this.pagination = data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          const { data } = err.response;
          this.message = data.message;
          this.success = data.success;
          this.$store.commit('logout');
          this.$router.push('/login');
        });
    },
    addProduct() {
      this.isLoading = true;
      admin
        .addProduct(this.product)
        .then((res) => {
          const { data } = res;
          this.message = data.message;
          this.success = data.success;
          this.getProducts();
        })
        .catch((err) => {
          const { data } = err.response;
          this.message = data.message;
          this.success = data.success;
          this.$store.commit('logout');
          this.$router.push('/login');
          this.getProducts();
        });
    },
    updateProduct() {
      this.isLoading = true;
      admin
        .updateProduct(this.selectedProductId, this.product)
        .then((res) => {
          const { data } = res;
          this.products = data.products;
          this.pagination = data.pagination;
          this.message = data.message;
          this.success = data.success;
          this.getProducts();
        })
        .catch((err) => {
          const { data } = err.response;
          this.message = data.message;
          this.success = data.success;
          this.$store.commit('logout');
          this.$router.push('/login');
        });
    },
    deleteProduct() {
      this.isLoading = true;
      admin
        .deleteProduct(this.selectedProductId)
        .then((res) => {
          const { data } = res;
          this.products = data.products;
          this.pagination = data.pagination;
          this.message = data.message;
          this.success = data.success;
          this.getProducts();
        })
        .catch((err) => {
          const { data } = err.response;
          this.message = data.message;
          this.success = data.success;
          this.$store.commit('logout');
          this.$router.push('/login');
        });
    },
  },
};
</script>
