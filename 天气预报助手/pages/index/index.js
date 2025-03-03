Page({
    data: {
        inputValue: '',
        weatherInfo: null,
        errorMsg: '',
        searchHistory: []
    },
    onInput(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },
    onSearch() {
        const cityName = this.data.inputValue;
        if (!cityName) {
            this.setData({
                errorMsg: '请输入城市名称'
            });
            return;
        }
        // 更新搜索历史
        let searchHistory = this.data.searchHistory;
        searchHistory.unshift(cityName);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        wx.setStorageSync('searchHistory', searchHistory);
        this.setData({
            searchHistory: searchHistory
        });

        // 调用高德地图 API
        wx.request({
            // https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=<用户key>
            url: 'https://restapi.amap.com/v3/weather/weatherInfo',
            data: {
                city: cityName,
                key: 'eb6bae7a22a74f9acf4f45d81752327d', // 请替换为你自己的高德 API Key
                extensions: 'base' // 获取实时天气信息
            },
            success: (res) => {
                if (res.data.infocode === '10000') {
                    const weatherData = res.data.lives[0];
                    const weatherInfo = {
                        city: weatherData.city,
                        temperature: weatherData.temperature,
                        windDirection: weatherData.winddirection,
                        temperatureSuggestion: '你可以参考当地天气预报获取更多建议。'
                    };
                    this.setData({
                        weatherInfo: weatherInfo,
                        errorMsg: ''
                    });
                } else {
                    this.setData({
                        errorMsg: '请输入正确的城市信息',
                        weatherInfo: null
                    });
                }
            },
            fail: () => {
                this.setData({
                    errorMsg: '网络错误，请稍后再试',
                    weatherInfo: null
                });
            }
        });
    },
    onLoad() {
        const searchHistory = wx.getStorageSync('searchHistory') || [];
        this.setData({
            searchHistory: searchHistory
        });
    }
});