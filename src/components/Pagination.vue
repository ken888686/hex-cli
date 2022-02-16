<template>
  <nav
    aria-label="Page navigation"
    class="d-inline-block"
  >
    <ul class="pagination">
      <li
        class="page-item"
        :class="{ disabled: !pagination.has_pre }"
      >
        <a
          class="page-link"
          href="#"
          @click="setCurrentPage(pagination.current_page - 1)"
        >
          Previous
        </a>
      </li>
      <li
        v-for="(page, index) in pagination.total_pages"
        :key="index"
        class="page-item"
        :class="{ active: pagination.current_page === page }"
        :aria-current="pagination.current_page === page ? 'page' : null"
      >
        <a
          class="page-link"
          href="#"
          @click="setCurrentPage(page)"
        >
          {{ page }}
        </a>
      </li>
      <li
        class="page-item"
        :class="{ disabled: !pagination.has_next }"
      >
        <a
          class="page-link"
          href="#"
          @click="setCurrentPage(pagination.current_page + 1)"
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    propPagination: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['set-current-page'],
  data() {
    return {
      pagination: {},
    };
  },
  watch: {
    propPagination() {
      this.pagination = this.propPagination;
    },
  },
  methods: {
    setCurrentPage(page) {
      this.$emit('set-current-page', page);
    },
  },
};
</script>
