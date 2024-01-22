const App = {
	data() {
		return {
			apiUrl: "https://vue3-course-api.hexschool.io/v2",
			user: {
				username: "",
				password: "",
			},
		};
	},
	methods: {
		login() {
			axios
				.post(`${this.apiUrl}/admin/signin`, this.user)
				.then((res) => {
					const { token, expired } = res.data;
					document.cookie = `fabio20token=${token};expires=${new Date(
						expired
					)}; path=/`;
					window.location = "product02.html";
					this.user = {
						username: "",
						password: "",
					};
				})
				.catch((err) => {
					//alert("錯誤輸入");
					console.log(`${err}錯誤資訊`);
				});
		},
	},
};
Vue.createApp(App).mount("#app");
