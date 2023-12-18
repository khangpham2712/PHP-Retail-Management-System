<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    <meta charset="utf-8" />
    <link rel="icon" href="{{asset('appIcon.png')}}" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Phần mềm quản lý bán hàng" />
    <link rel="apple-touch-icon" href="{{asset('logo192.png')}}" />
    <link rel="manifest" href="{{asset('manifest.json')}}" />
    <title>BKRM</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet" />
    <link href="{{asset('app.css')}}" rel="stylesheet">
    </head>
    <body>
   <div id="root"></div>
   <script src="{{asset('app.js')}}" ></script>
</body>
</html>
