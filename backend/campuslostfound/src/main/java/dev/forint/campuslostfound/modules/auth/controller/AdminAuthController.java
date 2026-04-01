package dev.forint.campuslostfound.modules.auth.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.admin.service.AdminService;
import dev.forint.campuslostfound.modules.auth.dto.AdminLoginDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminService adminService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Valid AdminLoginDTO dto) {
        Map<String, Object> data = adminService.login(dto.getUsername(), dto.getPassword());
        return Result.success(data);
    }
}