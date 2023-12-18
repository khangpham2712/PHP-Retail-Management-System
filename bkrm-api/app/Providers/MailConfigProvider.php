<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use App\Models\Store;

class MailConfigProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        
        $store_id = '';
        if (Auth::guard('user')->user()) {
            $user_id = Auth::guard('user')->user()->id;
            $store = Store::where('user_id', $user_id)->first();
            $store_id = $store->id;
        } else if (Auth::guard('employee')->user()) {
            $store_id = Auth::guard('employee')->user()->store_id;
        }

        if($store_id) {

            // $email_configuration_str = Store::where('id', $store_id)->get()[0];
            // $email_configuration = json_decode($email_configuration_str, true);

            // if(!is_null($email_configuration)) {
            //     $email_configuration = json_decode($email_configuration, true);
            //     $config = array(
            //         'driver'     =>     'smtp',
            //         'host'       =>     'smtp.gmail.com',
            //         'port'       =>     587,
            //         'username'   =>     $email_configuration['username'],
            //         'password'   =>     $email_configuration['password'],
            //         'encryption' =>     'tls',
            //         'from'       =>     array('address' => $email_configuration['username'], 'name' => $store->name)
            //     );
            //     Config::set('mail', $config);
            // }

            // Config::set('mail', $config);

        }
    }
}
