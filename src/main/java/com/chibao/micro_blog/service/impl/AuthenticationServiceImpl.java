package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.components.CustomUserDetailsService;
import com.chibao.micro_blog.components.JwtUtil;
import com.chibao.micro_blog.components.UserPrincipal;
import com.chibao.micro_blog.dto.request.LoginRequest;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    CustomUserDetailsService userDetailsService;
    JwtUtil jwtUtil;

    @Override
    public String authenticate(LoginRequest request) {
        UserDetails userDetails = null;
        try {
            userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception ex) {
            log.warn("Authentication Failed for User with email {}", request.getEmail());
            throw ex;
        }

        return jwtUtil.generateToken(userDetails);
    }


}