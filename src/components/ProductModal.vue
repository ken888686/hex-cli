<template>
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5
            id="productModalLabel"
            class="modal-title"
          >
            <span>{{ title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label
                    for="imageUrl"
                    class="form-label"
                  >
                    輸入主圖網址
                  </label>
                  <input
                    id="imageUrl"
                    v-model="product.imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="輸入主圖網址"
                  >
                  <img
                    v-if="
                      product.imageUrl !== undefined && product.imageUrl !== ''
                    "
                    class="img-fluid mt-1"
                    :src="product.imageUrl"
                    alt="primary pic"
                  >
                </div>
                <div
                  v-if="Array.isArray(product.imagesUrl)"
                  class="mb-3"
                >
                  <hr>
                  <div class="mb-3">
                    <label
                      for="imageUrl"
                      class="form-label"
                    >
                      輸入其他圖片網址
                    </label>
                    <div
                      v-for="(img, index) in product.imagesUrl"
                      id="imageUrl"
                      :key="'pic-' + index"
                      class="mb-3"
                    >
                      <input
                        v-model="product.imagesUrl[index]"
                        type="text"
                        class="form-control"
                        placeholder="輸入其他圖片網址"
                      >
                      <img
                        v-if="product.imagesUrl[index] !== ''"
                        class="img-fluid mt-1"
                        :src="product.imagesUrl[index]"
                        alt="other pic"
                      >
                    </div>
                  </div>
                  <div
                    v-if="
                      !product.imagesUrl.length ||
                        product.imagesUrl[product.imagesUrl.length - 1]
                    "
                  >
                    <button
                      type="button"
                      class="btn btn-primary btn-sm d-block w-100"
                      @click="product.imagesUrl.push('')"
                    >
                      新增圖片
                    </button>
                  </div>
                  <div v-else>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm d-block w-100"
                      @click="product.imagesUrl.pop()"
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label
                  for="title"
                  class="form-label"
                > 標題 </label>
                <input
                  id="title"
                  v-model="product.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                >
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label
                    for="category"
                    class="form-label"
                  > 分類 </label>
                  <input
                    id="category"
                    v-model="product.category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label
                    for="price"
                    class="form-label"
                  > 單位 </label>
                  <input
                    id="price"
                    v-model="product.unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  >
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label
                    for="origin_price"
                    class="form-label"
                  > 原價 </label>
                  <input
                    id="origin_price"
                    v-model="product.origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label
                    for="price"
                    class="form-label"
                  > 售價 </label>
                  <input
                    id="price"
                    v-model="product.price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  >
                </div>
              </div>
              <hr>

              <div class="mb-3">
                <label
                  for="description"
                  class="form-label"
                > 產品描述 </label>
                <textarea
                  id="description"
                  v-model="product.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                />
              </div>
              <div class="mb-3">
                <label
                  for="content"
                  class="form-label"
                > 說明內容 </label>
                <textarea
                  id="content"
                  v-model="product.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    v-model="product.is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :checked="product.is_enabled"
                  >
                  <label
                    class="form-check-label"
                    for="is_enabled"
                  >
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
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
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="isNew ? addProduct() : updateProduct()"
          >
            確認
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
    propIsNew: {
      type: Boolean,
      default: true,
    },
    propProduct: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['get-products'],
  data() {
    return {
      title: '',
      product: {},
      isNew: true,
    };
  },
  watch: {
    propIsNew() {
      this.title = this.propIsNew ? '新增產品' : '編輯產品';
    },
    propProduct() {
      this.product = this.propProduct;
    },
  },
  mounted() {
    this.title = this.propIsNew ? '新增產品' : '編輯產品';
  },
  methods: {
    addProduct() {
      admin
        .addProduct(this.product)
        .then((res) => {
          const { message, success } = res.data;
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
    updateProduct() {
      admin
        .updateProduct(this.selectedProductId, this.product)
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
