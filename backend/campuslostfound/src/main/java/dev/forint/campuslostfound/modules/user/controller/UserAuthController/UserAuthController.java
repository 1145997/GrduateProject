package dev.forint.campuslostfound.modules.user.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.user.dto.UserLoginDTO;
import dev.forint.campuslostfound.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/user")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Valid UserLoginDTO dto) {
        return Result.success(userService.login(dto));
    }
}