export default function (Vue) {
    var baseUrl = "https://api-ugo-web.itheima.net";
    Vue.prototype.$request = async function (opt) {
        uni.showLoading({
            title: "加载中...",
            // mask: true  //用户体验不好，治标不治本
        });
        const [err, res] = await uni.request({
            url: baseUrl + opt.url,
            data: opt.data,
            method: opt.method,
            header: opt.header
        });
        // 请求后：hideLoading;
        uni.hideLoading();
        return res.data;
    }
}