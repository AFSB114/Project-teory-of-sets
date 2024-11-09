<?php

class Res
{
    public function __construct(
        public string $status,
        public string $message,
        public mixed $data = null,
    ) {}
}