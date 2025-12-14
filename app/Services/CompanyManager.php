<?php

// app/Services/CompanyManager.php (Crear este archivo)
namespace App\Services;

class CompanyManager
{
    protected static ?int $companyId = null;

    public static function setCompanyId(int $id): void
    {
        self::$companyId = $id;
    }

    public static function getCompanyId(): ?int
    {
        return self::$companyId;
    }
}