<template>
  <div
    id="productDeleteModal"
    ref="productDeleteModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productDeleteModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5
            id="productDeleteModalLabel"
            class="modal-title"
          >
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          是否刪除{{ product.title }}？
          <strong class="text-danger"> (刪除後將無法恢復)。 </strong>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteProduct"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { admin } from '@/services';

export default {
  props: {
    propProduct: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['get-products'],
  data() {
    return {
      product: {},
    };
  },
  watch: {
    propProduct() {
      this.product = this.propProduct;
    },
  },
  methods: {
    deleteProduct() {
      admin
        .deleteProduct(this.product.id)
        .then((res) => {
          const {
            products, pagination, message, success,
          } = res.data;
          this.products = products;
          this.pagination = pagination;
          this.message = message;
          this.success = success;
          this.$emit('get-products');
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
