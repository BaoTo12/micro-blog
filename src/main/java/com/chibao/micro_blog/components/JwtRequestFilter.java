package com.chibao.micro_blog.components;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtRequestFilter extends OncePerRequestFilter {
    CustomUserDetailsService userDetailsService;
    JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        log.debug("JwtRequestFilter invoked - requestURI='{}', servletPath='{}', contextPath='{}'",
                request.getRequestURI(), request.getServletPath(), request.getContextPath());

        String jwtToken = resolveToken(request);
        String email = null;

        if (jwtToken != null) {
            try {
                email = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                log.warn("Unable to get JWT Token for request to: {}", request.getRequestURI());
            } catch (ExpiredJwtException e) {
                log.debug("JWT Token has expired for user: {}", e.getClaims().getSubject());
            } catch (MalformedJwtException e) {
                log.warn("Malformed JWT Token received from IP: {}", request.getRemoteAddr());
            } catch (SignatureException e) {
                log.warn("JWT signature does not match for request to: {}", request.getRequestURI());
            } catch (Exception e) {
                log.error("Error processing JWT token", e);
            }
        } else {
            log.debug("JWT Token does not begin with Bearer String for request to: {}",
                    request.getRequestURI());
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (jwtUtil.validateToken(jwtToken, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    // Set additional details like IP address, user agent for audit logging
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Set the authentication in the security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.debug("JWT token validation failed for user: {}", email);
                }
            } catch (UsernameNotFoundException e) {
                log.warn("User not found: {} while processing JWT for request: {}",
                        email, request.getRequestURI());
            } catch (Exception e) {
                log.error("Error during authentication for user: {}", email, e);
            }
        }

        // Continue with the filter chain regardless of authentication result
        // If authentication failed, SecurityContextHolder will be empty and
        // Spring Security will handle the unauthorized access
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header)) return null;

        // case-insensitive "Bearer " check and trim
        String lower = header.toLowerCase();
        if (lower.startsWith("bearer ")) {
            return header.substring(7).trim();
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String uri = request.getRequestURI();      // e.g. /api/auth/login
        String servletPath = request.getServletPath(); // e.g. /auth/login
        // skip both possible variants to be safe
        return servletPath.startsWith("/auth/")
                || uri.startsWith("/api/auth/")
                || servletPath.startsWith("/posts/public/")
                || uri.startsWith("/api/posts/public/")
                || uri.startsWith("/actuator/health")
                || uri.equals("/error");
    }
}