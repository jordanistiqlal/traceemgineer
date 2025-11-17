<?php

namespace App\Services;

use App\Models\RefreshToken;
use App\Models\User;
use Exception;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Class AuthService.
 */
class AuthService
{
    public function register($request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'name'      => ['required','string','max:128'],
                'nohp'      => ['required','string','max:128','unique:users'],
                'email'     => ['required','string','email','max:64','unique:users'],
                'password'  => ['required','string'],
                'role'      => ['required','string'],
            ]);
            $users = User::where('name', '=', $request->input('name'))->first();

            if (!$users){
                $data = [
                    'name'      => $request->name,
                    'username'  => $request->name,
                    'nohp'      => $request->nohp,
                    'email'     => $request->email,
                    'role'      => $request->role,
                    'password'  => Hash::make($request->password),
                ];

                User::create($data); 

                DB::commit();
                return ['Success', 'User Registered'];
            }

            return throw new \Exception('User Already Exists');
            
        }
        catch (ValidationException $e) {
            DB::rollBack();
            // kirim error validasi ke controller
            return ['Validation Error', $e->errors()];
        }
        catch(Exception $error)
        {
            DB::rollBack();
            return ['Error', $error->getMessage()];
        }
    }

    public function login($request)
    {
            try{
                $request->validate([
                    'username' => 'required|string',
                    'password' => 'required|string'
                ]);

                $user = User::where('username', $request->username)->first();

                if (!$user) {
                    throw new \Exception ('User Not Found');
                }

                Auth::logout(); // Ensure no user is logged in before attempt
                Session::flush(); // Remove all session data

                $credentials = ['email'=>$user->email, 'password'=>$request->password];

                // dd(!Auth::guard('web')->attempt($credentials));
                // dd(!Auth::attempt($credentials));
                
                if(!Auth::attempt($credentials)){
                    throw new \Exception ('Invalid Unauthorized');
                }

                $user = Auth::user();

                if(!Hash::check($request->password, $user->password, [])){
                    throw new \Exception('Invalid Credentials');
                }

                return ['Success', 'Login Successful'];
                
            }catch(Exception $error){
                return [
                    'message' => $error->getMessage()
                ];
            }
    }

    public function logout($request)
    {
        $token = $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'You have successfully logged out'
        ];
    }

    public function api_login($request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            $user = User::where('username', $request->username)->first();

            if (!$user) {
                throw new \Exception('User Not Found');
            }

            if (!Hash::check($request->password, $user->password)) {
                throw new \Exception('Invalid Credentials');
            }

            $accessToken = $this->generate_access_token($user);
            $refreshToken = $this->generate_refresh_token($user);

            DB::commit();

            return [
                'status' => 'Success',
                'message' => 'Login Successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'token_type' => 'Bearer',
                    'expires_in' => config('jwt.access_token_ttl', 3600)
                ]
            ];

        } catch (ValidationException $e) {
            DB::rollBack();
            return [
                'status' => 'Validation Error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ];
        } catch (Exception $error) {
            DB::rollBack();
            return [
                'status' => 'Error',
                'message' => $error->getMessage()
            ];
        }
    }

    private function generate_access_token($user)
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + config('jwt.access_token_ttl', 3600),
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ];

        return JWT::encode($payload, config('jwt.secret'), config('jwt.algo', 'HS256'));
    }

    private function generate_refresh_token($user)
    {
        $token = Str::random(64);
        $expiresAt = now()->addDays(config('jwt.refresh_token_ttl_days', 7));

        RefreshToken::where('user_id', $user->id)->delete();
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'expires_at' => $expiresAt,
        ]);

        return $token;
    }

    public function refresh_token($request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'refresh_token' => 'required|string'
            ]);

            $hashedToken = hash('sha256', $request->refresh_token);

            $refreshToken = RefreshToken::where('token', $hashedToken)
                ->where('expires_at', '>', now())
                ->first();

            if (!$refreshToken) {
                throw new \Exception('Invalid or Expired Refresh Token');
            }

            $user = User::find($refreshToken->user_id);

            if (!$user) { throw new \Exception('User Not Found');}

            $newAccessToken = $this->generate_access_token($user);

            DB::commit();

            return [
                'status' => 'Success',
                'message' => 'Token Refreshed',
                'data' => [
                    'access_token' => $newAccessToken,
                    'token_type' => 'Bearer',
                    'expires_in' => config('jwt.access_token_ttl', 3600)
                ]
            ];

        } catch (ValidationException $e) {
            DB::rollBack();
            return [
                'status' => 'Validation Error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ];
        } catch (Exception $error) {
            DB::rollBack();
            return [
                'status' => 'Error',
                'message' => $error->getMessage()
            ];
        }
    }

    public function api_logout($request)
    {
        try {
            $userId = $request->user()->id;
            RefreshToken::where('user_id', $userId)->delete();

            return [
                'status' => 'Success',
                'message' => 'Logged out successfully'
            ];

        } catch (Exception $error) {
            return [
                'status' => 'Error',
                'message' => $error->getMessage()
            ];
        }
    }
}
