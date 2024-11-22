// 基礎類型
export interface Entity {
  id: number;
  text?: string;
  value?: number;
}

// 添加 AppMenu 类型定义
export interface AppMenu {
  title: string;
  icon?: string;
  to?: string;
  items?: AppMenu[];
}

// 更新 SearchOperation 接口
export interface SearchOperation {
  property: string;
  op: string;
  val: any;
}

// 分類相關
export interface Category extends Entity {
  categoryName: string;
  parentId: string;
}

// 用戶相關
export interface UserInfo extends Entity {
  messages: string[];
  notifications: string[];
  tasks: string[];
}

export interface User extends Entity {
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  mobile: string;
  homephone: string;
  workphone: string;
}

export interface Customer extends User {
  membership: boolean;
  rewards: number;
  orders: string[];
  orderAmount: number;
}

// 地址相關
export interface Address extends Entity {
  address: string;
  city: string;
  zipcode: string;
  country: string;
}

// 訂單相關
export interface Order extends Entity {
  reference: string;
  customerId: number;
  customer: Customer;
  customerName: string;
  products: Product[];
  amount: number;
  quantity: number;
  orderDate: string;
  shippedDate: string;
  shipAddress: Address;
}

// 產品相關
export interface Product extends Entity {
  productName: string;
  categoryId: string;
  unitInStock: string;
  unitPrice: number;
  category: Category;
  categoryName?: string;
}

// 狀態相關
export interface State {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  mode: string;
  snackbar: boolean;
  notice: string;
  customer: Customer;
  orders: Order[];
  orderList: Order[];
}

// 搜索過濾器類型
export interface SearchFilter {
  equal?: Record<string, string | number>;
  contain?: Record<string, string>;
  startsWith?: Record<string, string>;
  endsWith?: Record<string, string>;
  lessThan?: Record<string, number>;
  greaterThan?: Record<string, number>;
  lessThanOrEqual?: Record<string, number>;
  greaterThanOrEqual?: Record<string, number>;
  filters?: Record<string, any>;
}

// 分頁相關
export interface Pagination {
  page: number;
  itemsPerPage: number;
  totalItems: number;
}
