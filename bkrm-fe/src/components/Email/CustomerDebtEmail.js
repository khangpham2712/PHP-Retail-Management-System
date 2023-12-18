import { renderToString } from "react-dom/server";

const CustomerDebtEmail = (header, footer, customer, store) => {
  return renderToString(
    <>
      {header}
      <div>
        Xin chào <strong>{customer.name}</strong>,
      </div>
      <div>
        Email này được gửi từ {store.name},<br />
        Thông tin công nợ:
        <ul>
          <li>Tên: {customer.name}</li>
          <li>Số điện thoại: {customer.phone}</li>
          <li>Thông tin thanh toán: {customer.payment_info}</li>
          <li>Công nơ: {customer.total_debt}</li>
        </ul>
        <div>Trân trọng</div>
      </div>
      {footer}
    </>
  );
};

export default CustomerDebtEmail;
