<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class Employee extends Authenticatable implements JWTSubject
{
    use  HasFactory, Notifiable, HasRoles;
    protected $guard = 'employee';

    protected $fillable = [
        'name',
        'email',
        'password',
        'store_id',
        'phone',
        'date_of_birth',
        'status',
        'user_name',
        'gender',
        'uuid',
        'salary_type',
        'img_url',
        'salary',
        'id_card_num',
        'address',
        'employee_code'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function priviledges()
    {
        return $this->belongsToMany(Priviledge::class);
    }
}
