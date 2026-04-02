package dev.forint.campuslostfound.modules.comment.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.comment.dto.AdminCommentQueryDTO;
import dev.forint.campuslostfound.modules.comment.dto.CommentAddDTO;
import dev.forint.campuslostfound.modules.comment.entity.Comment;
import dev.forint.campuslostfound.modules.comment.vo.CommentAdminVO;
import dev.forint.campuslostfound.modules.comment.vo.CommentVO;

import java.util.List;

public interface CommentService extends IService<Comment> {

    void add(CommentAddDTO dto);

    List<CommentVO> getListByInfoId(Long infoId);

    Page<CommentAdminVO> getAdminPage(AdminCommentQueryDTO dto);

    void deleteByAdmin(Long id);

    void hideByAdmin(Long id);

    void showByAdmin(Long id);
}