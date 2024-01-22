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
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById("productModal"));

    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );

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
    getData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
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
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.catchProduct.id}`;
      ///這邊因為catchProduct.id直接提取id即可
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
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
      //把心照片推進去
      this.product.imagesUrl = [];
      this.product.imagesUrl.push("");
    },
  },
});
app.mount("#app");
