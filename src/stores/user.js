import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: [
      {
        username: 'admin',
        password: 'admin',
        firstname: '管理員',
        lastname: '王',
        avatar: '../assets/avatar.png',
        role: 'admin',
      },
      {
        username: 'usertest',
        password: 'test1',
        firstname: '測試',
        lastname: '李',
        avatar: '../assets/avatar.png',
        role: 'user',
      },
    ],
  }),

  actions: {
    async login(username, password) {
      const user = this.users.find((u) => u.username === username && u.password === password)

      if (user) {
        this.user = user
        return true
      }
      return false
    },

    async logout() {
      this.user = null
    },

    async changePassword(oldPassword, newPassword) {
      if (!this.user) return false

      const user = this.users.find(
        (u) => u.username === this.user.username && u.password === oldPassword,
      )

      if (user) {
        user.password = newPassword
        return true
      }
      return false
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    userRole: (state) => state.user?.role,
  },
})
