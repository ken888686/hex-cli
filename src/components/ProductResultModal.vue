<template>
  <div
    id="productResultModal"
    ref="productResultModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productResultModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-success text-white">
          <h5
            id="productResultModalLabel"
            class="modal-title"
          >
            <span>結果</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button
            v-if="success"
            type="button"
            class="btn"
            :class="[success ? 'btn-outline-seccess' : 'btn-outline-danger']"
            data-bs-dismiss="modal"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    propResult: {
      type: Object,
      default: () => ({
        success: false,
        message: '',
      }),
    },
  },
  data() {
    return {
      message: '',
      success: false,
    };
  },
  watch: {
    propResult() {
      const { message, success } = this.propResult;
      this.message = message;
      this.success = success;
    },
  },
};
</script>
