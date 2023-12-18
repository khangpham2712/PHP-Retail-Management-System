import { renderToString } from 'react-dom/server'

const CustomerRegisterEmail = (header, footer, customer, store) => {
    
    return renderToString(
        <>
        {header}
        <div>
            Xin chào <strong>{customer.name}</strong>, 
        </div>
        <div>
            Email này được gửi từ {store.name},<br/>
            Chúc mừng bạn đã trở thành khách hàng thân thiết của cửa hàng chúng tôi.<br/>
            Đây là mã khách hàng của bạn <strong>{customer.customer_code}</strong>, sử dụng mã này để tích điểm nhé!
            
            <br/>
            Thông tin của bạn:
            <ul>
                <li>Tên: {customer.name}</li>
                <li>Số điện thoại: {customer.phone}</li>
                <li>Thông tin thanh toán: {customer.payment_info}</li>
            </ul>
        </div>
        {footer}
        </>
    )
}

export default CustomerRegisterEmail;