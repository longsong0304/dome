Page({
    data: {
      searchHistory: []
    },
    onLoad() {
      const searchHistory = wx.getStorageSync('searchHistory') || [];
      this.setData({
        searchHistory: searchHistory
      });
    }
  });