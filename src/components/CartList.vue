<template>
  <table class="table align-middle">
    <thead>
      <tr>
        <th />
        <th>品名</th>
        <th style="width: 150px">
          數量/單位
        </th>
        <th class="text-end">
          單價
        </th>
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
</template>
<script>
export default {
  props: {
    propCartData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['get-cart'],
  data() {
    return {
      cartData: {
        carts: [],
        total: 0,
        final_total: 0,
      },
    };
  },
  watch: {
    propCartData() {
      this.cartData = this.propCartData;
    },
  },
  methods: {},
};
</script>
