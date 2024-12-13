import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loginStatus: false,
    users: [
      {
        username: 'admin',
        password: 'admin',
        firstname: 'Light',
        lastname: 'Liu',
        avatar: '../assets/admin.png',
        role: 'Admin',
      },
      {
        username: 'alex_lee',
        password: 'test',
        firstname: 'Alex',
        lastname: 'Lee',
        avatar: '../assets/user.png',
        role: 'Sales',
      },
    ],
  }),

  actions: {
    async login(username, password) {
      const user = this.users.find((u) => u.username === username && u.password === password)

      if (user) {
        this.user = user
        this.loginStatus = true
        localStorage.setItem('user', JSON.stringify(user))
        return true
      }
      return false
    },

    async setUser(userData) {
      this.user = userData
      this.loginStatus = true
      localStorage.setItem('user', JSON.stringify(userData))
    },

    async logout() {
      this.user = null
      this.loginStatus = false
      localStorage.removeItem('user')
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
    isLoggedIn: (state) => state.loginStatus,
    userRole: (state) => state.user?.role,
  },
})
