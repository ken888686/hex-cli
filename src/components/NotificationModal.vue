<template>
  <div
    ref="modal"
    class="modal fade"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal } from 'bootstrap';

export default {
  props: {
    propTitle: {
      type: String,
      default: '',
    },
    propMessage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: '',
      message: '',
      modal: null,
    };
  },
  watch: {
    propTitle(val) {
      this.title = val;
    },
    propMessage(val) {
      this.message = val;
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
  methods: {
    show() {
      this.title = this.propTitle;
      this.message = this.propMessage;
      this.modal.show();
    },
  },
};
</script>
