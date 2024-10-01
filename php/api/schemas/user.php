<?php
class User
{
    public int $id;
    public mixed $name;
    public mixed $surname;
    public mixed $nickname;
    public mixed $birthday;
    public mixed $email;
    public mixed $password;

    public function __construct($data)
    {
        $this->id = (isset($data['id'])) ? $data['id'] : null;
        $this->name = (isset($data['name'])) ? $data['name'] : null;
        $this->surname = (isset($data['surname'])) ? $data['surname'] : null;
        $this->nickname = (isset($data['nickname'])) ? $data['nickname'] : null;
        $this->birthday = (isset($data['birthday'])) ? $data['birthday'] : null;
        $this->email = (isset($data['email'])) ? $data['email'] : null;
        $this->password = (isset($data['password'])) ? $data['password'] : null;
    }
}