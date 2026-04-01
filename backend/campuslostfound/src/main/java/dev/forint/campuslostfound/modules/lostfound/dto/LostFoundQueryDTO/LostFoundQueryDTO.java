package dev.forint.campuslostfound.modules.lostfound.dto;

import lombok.Data;

@Data
public class LostFoundQueryDTO {

    private Integer type;

    private Integer status;

    private String keyword;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}