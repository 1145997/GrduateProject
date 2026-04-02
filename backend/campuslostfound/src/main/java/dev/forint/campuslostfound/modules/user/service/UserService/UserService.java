package dev.forint.campuslostfound.modules.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.user.dto.UserLoginDTO;
import dev.forint.campuslostfound.modules.user.entity.User;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import dev.forint.campuslostfound.modules.user.dto.AdminUserQueryDTO;
import dev.forint.campuslostfound.modules.user.vo.UserListVO;


import java.util.Map;

public interface UserService extends IService<User> {

    Map<String, Object> login(UserLoginDTO dto);

    Page<UserListVO> getAdminPage(AdminUserQueryDTO dto);

    User getDetailById(Long id);

    void updateStatus(Long id, Integer status);
}