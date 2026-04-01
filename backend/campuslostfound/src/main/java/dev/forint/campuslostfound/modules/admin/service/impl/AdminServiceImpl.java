package dev.forint.campuslostfound.modules.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dev.forint.campuslostfound.common.utils.JwtUtils;
import dev.forint.campuslostfound.modules.admin.entity.Admin;
import dev.forint.campuslostfound.modules.admin.mapper.AdminMapper;
import dev.forint.campuslostfound.modules.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {

    private final JwtUtils jwtUtils;

    @Override
    public Map<String, Object> login(String username, String password) {
        Admin admin = this.getOne(new LambdaQueryWrapper<Admin>()
                .eq(Admin::getUsername, username)
                .eq(Admin::getPassword, password)
                .eq(Admin::getStatus, 1));

        if (admin == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtils.createToken(admin.getId(), admin.getUsername(), admin.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("username", admin.getUsername());
        data.put("nickname", admin.getNickname());
        data.put("role", admin.getRole());

        return data;
    }
}