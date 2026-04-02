package dev.forint.campuslostfound.modules.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.admin.entity.Admin;
import dev.forint.campuslostfound.modules.admin.vo.AdminInfoVO;

import java.util.Map;

public interface AdminService extends IService<Admin> {

    Map<String, Object> login(String username, String password);

    AdminInfoVO getCurrentAdminInfo();
}