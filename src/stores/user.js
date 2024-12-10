import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
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
        username: 'test',
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
