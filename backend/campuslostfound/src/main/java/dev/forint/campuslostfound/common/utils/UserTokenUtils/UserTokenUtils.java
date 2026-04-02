package dev.forint.campuslostfound.common.utils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserTokenUtils {

    private final JwtUtils jwtUtils;
    private final HttpServletRequest request;

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.token-prefix}")
    private String tokenPrefix;
    private String getTokenFromRequest() {
        String tokenHeader = request.getHeader(header);
        if (tokenHeader == null || tokenHeader.isBlank()) {
            throw new RuntimeException("未登录或token不存在");
        }

        if (tokenHeader.startsWith(tokenPrefix)) {
            tokenHeader = tokenHeader.substring(tokenPrefix.length());
        }

        return tokenHeader.trim();
    }

    public Long getCurrentUserId() {
        String token = getTokenFromRequest();
        Claims claims = jwtUtils.parseToken(token);
        return Long.valueOf(claims.getSubject());
    }

    public String getCurrentRole() {
        String token = getTokenFromRequest();
        Claims claims = jwtUtils.parseToken(token);
        return claims.get("role", String.class);
    }
}