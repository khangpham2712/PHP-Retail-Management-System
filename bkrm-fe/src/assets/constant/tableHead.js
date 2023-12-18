// -----------HEADER TABLE

//  ID phải trùng tên ATTRIBUTE THÌ MỚI SORT ĐC

export const InventoryHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "Mã SP" },
  { id: "name", align: "center", disablePadding: false, label: "Sản phẩm" },
  // { id: "bar_code", align: "center", disablePadding: true, label: "Mã vạch" },
  { id: "category", align: "left", disablePadding: false, label: "Danh mục" },
  { id: "price", align: "right", disablePadding: false, label: "Giá bán" },
  {
    id: "import_price",
    align: "right",
    disablePadding: false,
    label: "Giá vốn",
  },
  {
    id: "quantity",
    align: "center",
    disablePadding: false,
    label: "Tình trạng",
  },
  { id: "inventory", align: "center", disablePadding: false, label: "Tồn kho" },

  { id: "reoder_point", align: "center", disablePadding: false, label: "Đang đặt" },

  { id: "reorder_quantity", align: "center", disablePadding: false, label: "Đặt lại sau" },
];
export const InventoryOrderHeadCells = [
  // thêm cột Tiền hàng, Giảm giá, (tiền còn thiếu)
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày nhập" },
  {
    id: "supplier",
    align: "left",
    disablePadding: false,
    label: "Nhà cung cấp",
  },
  // { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  // {
  //   id: "payment",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Hình thức trả",
  // },
  {
    id: "total_quantity",
    align: "left",
    disablePadding: false,
    label: "Số lượng",
  },
  {
    id: "total",
    align: "right",
    disablePadding: false,
    label: "Tổng tiền nhập",
  },
  { id: "debt", align: "center", disablePadding: false, label: "Trạng thái" },
];
export const InventoryReturnOrderHeadCells = [
  // them cột tình trạng
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày trả" },
  {
    id: "supplier",
    align: "left",
    disablePadding: false,
    label: "Nhà cung cấp",
  },
  // { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  // {
  //   id: "payment",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Hình thức trả",
  // },
  {
    id: "total_quantity",
    align: "right",
    disablePadding: false,
    label: "Số lượng",
  },

  {
    id: "total",
    align: "right",
    disablePadding: false,
    label: "Tổng tiền trả",
  },

  // { id: "import_id", align: "left", disablePadding: false, label: "#Đơn nhập" },
  // {
  //   id: "employee",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Người thực hiện",
  // },
];

export const SupplierHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "name", align: "left", disablePadding: false, label: "Tên NCC" },
  { id: "phone", align: "left", disablePadding: false, label: "Số điện thoại" },
  // { id: "email", align: "left", disablePadding: false, label: "Email" },
  // { id: "address", align: "left", disablePadding: false, label: "Địa chỉ" },
  {
    id: "total_cost",
    align: "right",
    disablePadding: false,
    label: "Tổng tiền nhập",
  },
  {
    id: "debt",
    align: "right",
    disablePadding: false,
    label: "Nợ NCC",
  },
  { id: "debtStatus", align: "center", disablePadding: false, label: "" },
];

export const InvoiceHeadCells = [
  // thêm cột Tiền hàng, Giảm giá, (tiền còn thiếu)
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày bán" },
  { id: "customer", align: "left", disablePadding: false, label: "Khách hàng" },
  // { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  // {
  //   id: "payment",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Hình thức trả",
  // },
  {
    id: "total_quantity",
    align: "right",
    disablePadding: false,
    label: "Số lượng",
  },
  { id: "total", align: "right", disablePadding: false, label: "Tổng tiền" },
  { id: "debt", align: "left", disablePadding: false, label: "Trạng thái" },
];
export const InvoiceReturnHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày trả" },
  { id: "customer", align: "left", disablePadding: false, label: "Khách hàng" },
  // { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  // {
  //   id: "payment",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Hình thức trả",
  // },
  {
    id: "total_quantity",
    align: "right",
    disablePadding: false,
    label: "Số lượng",
  },
  {
    id: "total",
    align: "right",
    disablePadding: false,
    label: "Tổng tiền trả",
  },
  // { id: "invoid_id", align: "left", disablePadding: false, label: "#Hoá đơn" },
  // {
  //   id: "employee",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Người thực hiện",
  // },
];
export const EmployeeHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "name", align: "left", disablePadding: true, label: "Nhân viên" },
  { id: "phone", align: "left", disablePadding: true, label: "Số điện thoại" },
  { id: "email", align: "left", disablePadding: true, label: "Email" },
  // { id: "role", align: "left", disablePadding: true, label: "Chức năng" },
  // { id: "branch", align: "left", disablePadding: true, label: "Chi nhánh" },
  { id: "function", align: "left", disablePadding: false, label: "Trạng thái" },
];

export const CustomerHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  // { id: 'img', align: false, disablePadding: true, label: '#' },
  { id: "name", align: "left", disablePadding: true, label: "Khách hàng" },
  { id: "phone", align: "left", disablePadding: true, label: "Số điện thoại" },
  { id: "score", align: "right", disablePadding: true, label: "Tích điểm" },
  { id: "total", align: "right", disablePadding: true, label: "Tổng tiền mua" },
  { id: "debt", align: "right", disablePadding: true, label: "Tổng nợ" },
  { id: "debtStatus", align: "center", disablePadding: true, label: "" },
];

export const CartHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "product_code", align: "left", disablePadding: true, label: "Mã SP" },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  // { id: "bar_code", align: "left", disablePadding: true, label: "Mã vạch" },
  // { id: "price", align: "right", disablePadding: true, label: "Đơn giá" },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "price", align: "center", disablePadding: true, label: "Đơn giá" },

  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];

export const ImportHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "product_code", align: "left", disablePadding: true, label: "Mã SP" },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  // { id: "bar_code", align: "left", disablePadding: true, label: "Mã vạch" },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "price", align: "center", disablePadding: true, label: "Giá nhập" },
  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];

export const TableInventoryHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "product_code", align: "left", disablePadding: true, label: "Mã SP" },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  {
    id: "quantity",
    align: "center",
    disablePadding: true,
    label: "Số lượng chuyển",
  },
  { id: "price", align: "center", disablePadding: true, label: "Giá chuyển" },
  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];

export const TableInventoryHeadCellsDetail = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "product_code", align: "left", disablePadding: true, label: "Mã SP" },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  {
    id: "quantity",
    align: "center",
    disablePadding: true,
    label: "SL chuyển",
  },
  {
    id: "receive_quantity",
    align: "center",
    disablePadding: true,
    label: "SL nhận",
  },
  { id: "price", align: "center", disablePadding: true, label: "Giá chuyển" },
];

export const CartReturnHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  // { id: 'id', align: 'left', disablePadding: true, label: '#' },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  { id: "price", align: "right", disablePadding: true, label: "Giá bán" },
  {
    id: "return_price",
    align: "right",
    disablePadding: true,
    label: "Giá trả",
  },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];
export const ImportReturnHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  // { id: 'id', align: 'left', disablePadding: true, label: '#' },
  { id: "name", align: "left", disablePadding: true, label: "Tên" },
  { id: "price", align: "right", disablePadding: true, label: "Giá nhập" },
  {
    id: "return_price",
    align: "right",
    disablePadding: true,
    label: "Giá trả",
  },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];

export const OrderHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  // { id: 'id', align: 'left', disablePadding: true, label: '#' },
  { id: "name", align: "left", disablePadding: true, label: "Sản phẩm" },
  { id: "price", align: "right", disablePadding: true, label: "Khoảng giá" },
  { id: "quantity", align: "center", disablePadding: true, label: "Số lượng" },
  { id: "protein1", align: "right", disablePadding: true, label: "Thành tiền" },
];
export const CheckHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  // { id: 'id', align: 'left', disablePadding: true, label: '#' },
  { id: "name", align: "left", disablePadding: true, label: "Sản phẩm" },
  { id: "quantity", align: "right", disablePadding: true, label: "Tồn kho" },
  {
    id: "real-quantity",
    align: "center",
    disablePadding: true,
    label: "SL thực tế",
  },
  { id: "balance", align: "right", disablePadding: true, label: "Lệch" },
];

export const OrderListHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày đặt" },
  {
    id: "supplier",
    align: "left",
    disablePadding: false,
    label: "Khách hàng",
  },
  { id: "phone", align: "left", disablePadding: false, label: "Số điện thoại" },
  { id: "address", align: "left", disablePadding: false, label: "Địa chỉ" },
  { id: "total", align: "right", disablePadding: false, label: "Khoảng tiền" },
  { id: "status", align: "center", disablePadding: false, label: "Trạng thái" },
  // {
  //   id: "employee",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Người thực hiện",
  // },
];
export const CheckHistoryHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày kiểm" },
  // { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  {
    id: "inventory",
    align: "right",
    disablePadding: false,
    label: "Tổng SL lệch",
  },
  {
    id: "substract",
    align: "right",
    disablePadding: false,
    label: "Tổng tiền lệch",
  },
  // { id: "status", align: "left", disablePadding: false, label: "Chức vụ" },
  {
    id: "employee",
    align: "center",
    disablePadding: false,
    label: "Người thực hiện",
  },
];

export const DeliveryHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày đặt" },
  { id: "customer", align: "left", disablePadding: false, label: "Khách hàng" },
  { id: "branch", align: "left", disablePadding: false, label: "Chi nhánh" },
  {
    id: "payment",
    align: "left",
    disablePadding: false,
    label: "Hình thức trả",
  },
  { id: "total", align: "right", disablePadding: false, label: "Tổng hoá đơn" },
  { id: "debt", align: "left", disablePadding: false, label: "Trạng thái" },
  {
    id: "employee",
    align: "left",
    disablePadding: false,
    label: "Người thực hiện",
  },
];

export const EmployeeScheduleHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "name", align: "left", disablePadding: true, label: "Nhân viên" },
  { id: "phone", align: "left", disablePadding: true, label: "Số điện thoại" },
  { id: "timecheck", align: "center", disablePadding: true, label: "Thời gian" },
  { id: "status", align: "center", disablePadding: true, label: "Chấm công" },
];

export const InventoryCheckHeadCells = [
  { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "id", align: "left", disablePadding: true, label: "Mã" },
  { id: "name", align: "left", disablePadding: false, label: "Tên sản phẩm" },
  { id: "inventory", align: "left", disablePadding: false, label: "Tồn kho" },
  { id: "real", align: "left", disablePadding: false, label: "Thực tế" },
  {
    id: "diffQuantity",
    align: "left",
    disablePadding: false,
    label: "SL lệch",
  },
  { id: "total", align: "right", disablePadding: false, label: "Giá trị lệch" },
];

export const VoucherHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  { id: "name", align: "left", disablePadding: true, label: "Tên voucher" },
  { id: "fromDate", align: "left", disablePadding: true, label: "Từ ngày" },
  { id: "toDate", align: "left", disablePadding: true, label: "Đến ngày" },
  { id: "quantity", align: "left", disablePadding: true, label: "Số lượng" },
  { id: "value", align: "left", disablePadding: true, label: "Mệnh giá" },
  { id: "status", align: "left", disablePadding: true, label: "Trạng thái" },
];

export const DiscountHeadCells = [
  { id: "id", align: "left", disablePadding: true, label: "#" },
  {
    id: "name",
    align: "left",
    disablePadding: true,
    label: "Tên chương trình",
  },
  { id: "fromDate", align: "left", disablePadding: true, label: "Từ ngày" },
  { id: "toDate", align: "left", disablePadding: true, label: "Đến ngày" },
  { id: "type", align: "left", disablePadding: true, label: "Hình thức" },
  { id: "status", align: "left", disablePadding: true, label: "Trạng thái" },
];

export const TransferInventoryHeadCells = [
  // { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "id", align: "left", disablePadding: true, label: "Mã" },
  { id: "from", align: "left", disablePadding: false, label: "Từ" },
  { id: "to", align: "left", disablePadding: false, label: "Đến" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày chuyển" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày nhận" },
  { id: "date", align: "left", disablePadding: false, label: "Gía trị chuyển" },
  { id: "status", align: "left", disablePadding: false, label: "Trạng thái" },
];

export const CashbookHeadCells = [
  // { id: "stt", align: "left", disablePadding: true, label: "Stt" },
  { id: "id", align: "left", disablePadding: true, label: "Mã" },
  { id: "date", align: "left", disablePadding: false, label: "Ngày" },
  { id: "quantity", align: "left", disablePadding: false, label: "Giá trị" },
  { id: "user_type", align: "left", disablePadding: false, label: "Đối tác" },
  { id: "user_name", align: "left", disablePadding: false, label: "Tên" },
  { id: "type", align: "left", disablePadding: false, label: "Loại thu chi" },
];