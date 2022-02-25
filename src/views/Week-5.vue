<template>
  <div class="container">
    <div class="mt-4">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in products"
            :key="index"
          >
            <td style="width: 200px">
              <div
                style="
                  height: 100px;
                  background-size: cover;
                  background-position: center;
                "
              >
                <img
                  :src="item.imageUrl"
                  style="width: 100%; height: 100%; object-fit: cover"
                >
              </div>
            </td>
            <td>{{ item.title }}</td>
            <td>
              <del class="h6">原價 {{ item.origin_price }} 元</del>
              <div class="h5">
                現在只要 {{ item.price }} 元
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="isLoading && loadingItemId === item.id"
                  @click="showProductInfoModal(item.id)"
                >
                  <i
                    v-if="isLoading && loadingItemId === item.id"
                    class="fas fa-spinner fa-pulse"
                  />
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  :disabled="isLoading && loadingItemId === item.id"
                  @click="addProduct({ productId: item.id, quantity: 1 })"
                >
                  <i
                    v-if="isLoading && loadingItemId === item.id"
                    class="fas fa-spinner fa-pulse"
                  />
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="text-center"
        :class="{ 'd-none': pagination.total_pages < 1 }"
      >
        <Pagination
          :prop-pagination="pagination"
          @set-current-page="getProducts"
        />
      </div>
      <div class="d-flex justify-content-end">
        <button
          class="btn btn-outline-danger"
          type="button"
          :disabled="isLoading || !cartData.carts.length"
          @click="removeProduct('')"
        >
          <i
            v-if="isLoading && loadingItemId === ''"
            class="fas fa-spinner fa-pulse"
          />
          清空購物車
        </button>
      </div>
      <CartList
        :prop-cart-data="cartData"
        :prop-is-loading="isLoading"
        @get-cart="getCart"
        @update-product="updateProduct"
        @remove-product="removeProduct"
      />
    </div>

    <ProductInfoModal
      ref="productInfoModal"
      :prop-product="product"
      @add-product="addProduct"
    />
    <OrderInfo
      :prop-disabled="cartData.carts.length === 0"
      @get-cart="getCart"
    />
    <NotificationModal
      ref="modal"
      :prop-success="success"
      prop-title="結果"
      :prop-message="message"
    />
  </div>
</template>
<script>
import { Modal } from 'bootstrap';
import { customer } from '@/services';
import Pagination from '@/components/Pagination.vue';
import ProductInfoModal from '@/components/ProductInfoModal.vue';
import CartList from '@/components/CartList.vue';
import OrderInfo from '@/components/OrderInfo.vue';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  components: {
    Pagination,
    ProductInfoModal,
    CartList,
    OrderInfo,
    NotificationModal,
  },
  data() {
    return {
      pagination: {},
      product: {},
      products: [],
      success: false,
      message: '',
      cartData: {
        carts: [],
        final_total: 0,
        total: 0,
      },
      productInfoModal: null,
      isLoading: false,
      isProductInfoModalShow: false,
      loadingItemId: '',
      resultModal: null,
    };
  },
  mounted() {
    this.getProducts();
    this.getCart();
    this.productInfoModal = new Modal(this.$refs.productInfoModal.$refs.modal, {
      keyboard: false,
      backdrop: 'static',
    });
    this.resultModal = new Modal(this.$refs.modal.$el);
  },
  methods: {
    showProductInfoModal(productId) {
      this.loadingItemId = productId;
      this.isLoading = true;
      this.isProductInfoModalShow = true;

      customer
        .getProduct(productId)
        .then((res) => {
          this.product = res.data.product;
          this.productInfoModal.show();
        })
        .catch((err) => {
          this.errAction(err.response.data);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    removeProduct(productId = '') {
      if (this.cartData.carts.length <= 0) {
        return;
      }
      this.loadingItemId = '';
      this.isLoading = true;

      customer
        .removeCart(productId)
        .then((res) => {
          const { success, message } = res.data;
          this.success = success;
          this.message = message;
          this.getCart();
        })
        .catch((err) => {
          this.errAction(err.response.data);
        });
    },
    getProducts(page = 1) {
      const loader = this.$loading.show();
      customer
        .getProducts(page)
        .then((res) => {
          const { pagination, products } = res.data;
          this.pagination = pagination;
          this.products = products;
        })
        .catch((err) => {
          this.errAction(err.response.data);
        })
        .finally(() => {
          this.isLoading = false;
          loader.hide();
        });
    },
    addProduct({ productId, quantity = 1 }) {
      this.loadingItemId = productId;
      this.isLoading = true;

      customer
        .addProduct(this.loadingItemId, quantity)
        .then((res) => {
          const { message, success } = res.data;
          this.message = message;
          this.success = success;
          this.getCart();
        })
        .catch((err) => {
          this.errAction(err.response.data);
        })
        .finally(() => {
          if (this.isProductInfoModalShow) {
            this.productInfoModal.hide();
            this.isProductInfoModalShow = false;
          }
        });
    },
    getCart() {
      const loader = this.$loading.show();

      customer
        .getCart()
        .then((res) => {
          const { data } = res.data;
          this.cartData = data;
        })
        .catch((err) => {
          this.errAction(err.response.data);
        })
        .finally(() => {
          this.isLoading = false;
          loader.hide();
        });
    },
    updateProduct({ productId, quantity }) {
      this.isLoading = true;

      customer
        .updateProduct(productId, quantity)
        .then((res) => {
          const { success, message } = res.data;
          this.message = message;
          this.success = success;
          this.getCart();
        })
        .catch((err) => {
          this.errAction(err.response.data);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    errAction(errData) {
      const { message, success } = errData;
      this.message = message;
      this.success = success;
      this.resultModal.show();
    },
  },
};
</script>
