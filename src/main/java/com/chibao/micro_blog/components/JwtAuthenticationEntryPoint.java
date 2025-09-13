package com.chibao.micro_blog.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.warn("Unauthorized access attempt to: {} from IP: {}", request.getRequestURI(),
                getClientIpAddress(request)
                );

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Create a structured error response that your React app can handle
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("message", "You need to be logged in to access this resource");
        errorResponse.put("status", 401);
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("path", request.getRequestURI());

        // Include more specific error information based on the exception type
        if (authException instanceof InsufficientAuthenticationException) {
            errorResponse.put("details", "No valid authentication token provided");
        } else if (authException instanceof BadCredentialsException) {
            errorResponse.put("details", "Invalid authentication credentials");
        } else {
            errorResponse.put("details", "Authentication required");
        }

        // Convert to JSON and write to response
        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(errorResponse);

        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

    // client gọi trực tiếp đến server
    // request thường đi qua proxy, load balancer, hoặc reverse proxy
    // Client (123.45.67.89) → Nginx Proxy (10.0.0.1) → Spring Server
    // getRemoteAddr() sẽ trả về 10.0.0.1 (IP của proxy), không phải 123.45.67.89 (IP thật của client).
    // Proxy hoặc load balancer (ví dụ Nginx, AWS ELB, Cloudflare) sẽ thêm header X-Forwarded-For để giữ lại thông tin IP gốc.
    public String getClientIpAddress(HttpServletRequest request){
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null || xForwardedForHeader.isEmpty()){
            return request.getRemoteAddr();
        }
        return xForwardedForHeader.split(",")[0].trim();
    }
}
