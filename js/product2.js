let productModal = null;
let delProductModal = null;
const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "fabio20",
      products: [],
      catchProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pagination: {},
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById("productModal"));

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)fabio20token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checklogin();
  },
  methods: {
    checklogin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    },
    getData(page = 1) {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert("找不到資訊");
        });
    },
    openModal(isNew, item) {
      if (isNew === "new") {
        //是新的就給予全空的catchProduct
        this.catchProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        //是既有的就複製catchProduct本身
        this.catchProduct = { ...item };
        this.isNew = false; // 方便去API的時候可以辨別資料要post 還是 put
        productModal.show();
      } else if (isNew === "delete") {
        this.catchProduct = { ...item };
        delProductModal.show();
      }
    },
  },
});
app.component("producthere", {
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "fabio20",
    };
  },
  props: ["product", "isNew"],
  template: "#productModal",
  methods: {
    updateProduct() {
      const url = this.isNew
        ? `${this.apiUrl}/api/${this.apiPath}/admin/product`
        : `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;

      const httpMethod = this.isNew ? "post" : "put";

      axios[httpMethod](url, { data: this.product })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.$emit("update");
        })
        .catch((error) => {
          alert(error.res.data.message);
        });
    },
    newImages() {
      //把新照片推進去
      this.product.imagesUrl = [];
      this.product.imagesUrl.push("");
    },
  },
});
app.component("delhere", {
  template: "#delProductModal",
  props: ["item"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "fabio20",
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
  methods: {
    delProduct() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`
        )
        .then((response) => {
          delProductModal.hide();
          this.$emit("update");
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
});
app.component("pagination", {
  template: "#pagination",
  props: ["pages"],
  methods: {
    emitPages(item) {
      this.$emit("emit-pages", item);
    },
  },
});

app.mount("#app");
