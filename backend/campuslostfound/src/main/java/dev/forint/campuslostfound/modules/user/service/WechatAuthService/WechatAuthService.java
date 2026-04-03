package dev.forint.campuslostfound.modules.user.service;

import dev.forint.campuslostfound.modules.user.dto.WechatCode2SessionResponse;

public interface WechatAuthService {

    WechatCode2SessionResponse code2Session(String code);
}