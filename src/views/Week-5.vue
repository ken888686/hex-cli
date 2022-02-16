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
                >
                  <i class="fas fa-spinner fa-pulse" />
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                >
                  <i class="fas fa-spinner fa-pulse" />
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination
        :prop-pagination="pagination"
        @set-current-page="getProducts"
      />
      <div class="d-flex justify-content-end">
        <button
          class="btn btn-outline-danger"
          type="button"
          @click="clear"
        >
          清空購物車
        </button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th />
            <th>品名</th>
            <th style="width: 150px">
              數量/單位
            </th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cartData.carts">
            <tr
              v-for="(item, index) in cartData.carts"
              :key="index"
            >
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                >
                  <i class="fas fa-spinner fa-pulse" />
                  x
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div class="text-success">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <input
                      v-model="item.qty"
                      min="1"
                      type="number"
                      class="form-control"
                    >
                    <span
                      id="basic-addon2"
                      class="input-group-text"
                    >
                      {{ item.product.unit }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                <small class="text-success">折扣價：</small>
                {{ item.product.price }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td
              colspan="3"
              class="text-end"
            >
              總計
            </td>
            <td class="text-end">
              {{ cartData.total }}
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
              class="text-end text-success"
            >
              折扣價
            </td>
            <td class="text-end text-success">
              {{ cartData.final_total }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import { customer } from '@/services';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      pagination: {},
      products: [],
      success: false,
      message: '',
      cartData: {
        carts: [],
        final_total: 0,
        total: 0,
      },
    };
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    // submit() {
    //   const loader = this.$loading.show({
    //     canCancel: true,
    //     onCancel: this.onCancel,
    //   });
    //   setTimeout(() => {
    //     loader.hide();
    //   }, 1000);
    // },
    // onCancel() {
    //   console.log('User cancelled the loader.');
    // },
    clear() {
      customer
        .removeCart()
        .then((res) => {
          const { success, message } = res.data;
          this.success = success;
          this.message = message;
          this.getCart();
        })
        .catch((err) => {
          const { message, success } = err.response.data;
          this.message = message;
          this.success = success;
          this.$store.commit('logout');
          this.$router.push('/login');
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
          const { message, success } = err.response.data;
          this.message = message;
          this.success = success;
          this.$store.commit('logout');
          this.$router.push('/login');
        })
        .finally(() => {
          loader.hide();
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
          const { message, success } = err.response.data;
          this.message = message;
          this.success = success;
          this.$store.commit('logout');
          this.$router.push('/login');
        })
        .finally(() => {
          loader.hide();
        });
    },
  },
};
</script>
