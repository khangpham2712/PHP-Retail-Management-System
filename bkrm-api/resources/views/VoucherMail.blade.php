<!DOCTYPE html>
<html>

<head>
  <title>BKRM: cuahangbk.tk</title>
</head>

<body>
  <div  style="width: 600px;">
    <div style="background-color: #eee; height: 50px;">&nbsp;</div>
    <div style="gap: 20px;">
      <div>
        <h3><strong>Xin chào {{ $details['customer_name'] }},</strong></h3>
      </div>
      <div>
        Cảm ơn bạn vì đã tin tưởng cửa hàng <strong style="color: #f3bd0f">{{ $details['store_name'] }}</strong>, cửa hàng gửi bạn Voucher
      </div>
      <div style=" text-align: center; height: 200px; border-style: dashed; border-radius: 5px; gap: 0px; padding: 20px">
        <h1 style="color: #f3bd0f"><strong>{{ $details['voucher_value'] }}</strong></h1>
        <h3 style="padding: 0;margin: 0; font-style: none">
          Mã voucher:
        </h3>
        <div style="background-color: yellow; border-radius: 15px">
          <h1><strong>{{$details['voucher_code'] }}</strong></h1>
        </div>

        Thời gian: <strong>{{ $details['voucher_start_date'] }} - {{ $details['voucher_end_date'] }}</strong></br>
        Hóa đơn từ: <strong>{{ $details['voucher_min_order'] }}</strong>


      </div>
      <div>Nếu bạn có thắc mắc cách thức áp dụng hóa đơn, xin liên hệ với cửa hàng.</div>
      <div><span style="font-style: italic; color: blue">Thông tin cửa hàng:</span><br />
        Tên cửa hàng: <strong>{{ $details['store_name'] }}</strong><br />
        Website: <a style="color: blue"><strong>cuahangbk.tk/store/{{ $details['store_web_page'] }}</strong></a><br />
        Số điện thoại: <strong>{{ $details['store_phone'] }}</strong><br />
      </div>

      <div>
        Xin chân thành cảm ơn!
      </div>

      <div>
        <em style="color: grey">Dịch vụ cửa hàng online được cung cấp bởi BKRM, tại địa chỉ trang web: cuahangbk.tk</em>
      </div>
    </div>
  </div>
</body>

</html>