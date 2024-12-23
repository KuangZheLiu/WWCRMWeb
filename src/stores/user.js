import { defineStore } from 'pinia'
import axios from 'axios'

// Fixed Test User Data
// export const useUserStore = defineStore('user', {
//   state: () => ({
//     user: null,
//     loginStatus: false,
//     users: [
//       {
//         username: 'admin',
//         password: 'admin',
//         firstname: 'Light',
//         lastname: 'Liu',
//         avatar: '../assets/admin.png',
//         role: 'Admin',
//       },
//       {
//         username: 'alex_lee',
//         password: 'test',
//         firstname: 'Alex',
//         lastname: 'Lee',
//         avatar: '../assets/user.png',
//         role: 'Sales',
//       },
//     ],
//   }),

//   actions: {
//     async login(username, password) {
//       const user = this.users.find((u) => u.username === username && u.password === password)

//       if (user) {
//         this.user = user
//         this.loginStatus = true
//         localStorage.setItem('user', JSON.stringify(user))
//         return true
//       }
//       return false
//     },

//     async setUser(userData) {
//       this.user = userData
//       this.loginStatus = true
//       localStorage.setItem('user', JSON.stringify(userData))
//     },

//     async logout() {
//       this.user = null
//       this.loginStatus = false
//       localStorage.removeItem('user')
//     },

//     async changePassword(oldPassword, newPassword) {
//       if (!this.user) return false

//       const user = this.users.find(
//         (u) => u.username === this.user.username && u.password === oldPassword,
//       )

//       if (user) {
//         user.password = newPassword
//         return true
//       }
//       return false
//     },
//   },

//   getters: {
//     isLoggedIn: (state) => state.loginStatus,
//     userRole: (state) => state.user?.role,
//   },
// })

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loginStatus: false,
    users: [],
  }),

  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8002/api/userdata')
        if (response.data.success) {
          // 將數據庫數據映射到所需格式
          this.users = response.data.data.map((user) => ({
            username: user.UserID,
            password: user.UserPW,
            role: user.Role,
            firstname: user.NameF,
            lastname: user.NameL,
            name: user.nameCN,
            avatar: user.Photo || '../assets/default-avatar.png',
            jobtitle: user.JobTitle,
            phone: user.PhoneNum,
            email: user.Email,
            company: user.ComNo,
            area: user.Area,
          }))
        }
      } catch (error) {
        console.error('獲取用戶數據失敗:', error)
        throw error
      }
    },

    async login(username, password) {
      await this.fetchUsers() // 登入前先獲取最新用戶數據
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

      try {
        const response = await axios.put(`http://localhost:8002/api/userdata/password`, {
          userId: this.user.username,
          oldPassword,
          newPassword,
        })

        if (response.data.success) {
          await this.fetchUsers() // 更新本地用戶數據
          return true
        }
        return false
      } catch (error) {
        console.error('修改密碼失敗:', error)
        return false
      }
    },
  },

  getters: {
    isLoggedIn: (state) => state.loginStatus,
    userRole: (state) => state.user?.role,
  },
})
