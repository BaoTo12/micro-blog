package com.chibao.micro_blog.components;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtil {
    @Value("${jwt.secret:c45c4ceea4a9ecbb46a137d5de54a599ac45ad42c3df49cbd962198b7c29f2791d64e856}") // recommended to set via env var (base64)
    private String jwtSecret;

    @Value("${jwt.expiration:86400}") // seconds
    private long jwtExpirationSeconds;

    @Value("${jwt.refresh.expiration:604800}") // seconds
    private long refreshTokenExpirationSeconds;

    private static final int MIN_KEY_BYTES_FOR_HS512 = 32;

    private Key getSigningKey() {
        if (!StringUtils.hasText(jwtSecret)) {
            throw new IllegalStateException("JWT secret is not configured. Set 'jwt.secret' environment variable (base64).");
        }
        byte[] bytesKey;
        try {
            bytesKey = Decoders.BASE64.decode(jwtSecret);
        } catch (Exception ex) {
            log.warn("JWT Secret Key is not valid base64. Failing back to UTF-8 bytes (not recommended).");
            bytesKey = jwtSecret.getBytes(StandardCharsets.UTF_8);
        }
        if (bytesKey.length < MIN_KEY_BYTES_FOR_HS512) {
            throw new IllegalArgumentException("JWT secret must be at least " + MIN_KEY_BYTES_FOR_HS512 +
                    " bytes (512 bits) for HS512. Provide a stronger secret (base64).");
        }
        return Keys.hmacShaKeyFor(bytesKey);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("tokenType", "access");
        claims.put("jti", UUID.randomUUID().toString());
        if (userDetails instanceof UserPrincipal userPrincipal) {
            claims.put("userId", userPrincipal.getUserId());
            claims.put("email", userPrincipal.getEmail());
        }

        String subject = userDetails.getUsername(); // use username (email) as subject
        return createToken(claims, subject, Duration.ofSeconds(jwtExpirationSeconds));
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "refresh");
        claims.put("jti", UUID.randomUUID().toString());

        if (userDetails instanceof UserPrincipal userPrincipal) {
            claims.put("userId", userPrincipal.getUserId());
        }

        String subject = userDetails.getUsername();
        return createToken(claims, subject, Duration.ofSeconds(refreshTokenExpirationSeconds));
    }

    public String createToken(Map<String, Object> claims, String subject, Duration expiration) {
        Instant now = Instant.now();
        Instant exp = now.plus(expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .issuer("micro-blog-app")
                .signWith(getSigningKey())
                .compact();
    }
    /* ------------------ Claim extractors / parsers ------------------ */

    private Claims parseClaims(String token){
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }catch (ExpiredJwtException e) {
            // caller may want to handle expired case specially
            log.debug("JWT expired: {}", e.getMessage());
            throw e;
        }  catch (JwtException e) {
            // includes MalformedJwtException, UnsupportedJwtException, etc.
            log.warn("JWT processing failure: {}", e.getMessage());
            throw e;
        }
    }
    public <T> T getClaimFromToken(String token, Function<Claims, T> resolver) {
        Claims claims = parseClaims(token);
        return resolver.apply(claims);
    }
    public String getUsernameFromToken(String token) {
        try {
            return getClaimFromToken(token, Claims::getSubject);
        } catch (JwtException e) {
            log.debug("Unable to extract username from token: {}", e.getMessage());
            return null;
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            Claims c = parseClaims(token);
            Object v = c.get("userId");
            if (v instanceof Number) return ((Number) v).longValue();
            if (v instanceof String) {
                try { return Long.parseLong((String) v); } catch (NumberFormatException ignored) {}
            }
            return null;
        } catch (JwtException e) {
            log.debug("Unable to extract userId from token: {}", e.getMessage());
            return null;
        }
    }

    public Date getExpirationDateFromToken(String token) {
        try {
            return getClaimFromToken(token, Claims::getExpiration);
        } catch (JwtException e) {
            log.debug("Unable to extract expiration from token: {}", e.getMessage());
            return null;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date exp = getExpirationDateFromToken(token);
            if (exp == null) return true;
            return exp.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (JwtException e) {
            log.debug("Error while checking token expiration: {}", e.getMessage());
            return true;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            if (username == null) return false;
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
    public boolean canUserAccessResource(String token, Long resourceOwnerId) {
        Long tokenUserId = getUserIdFromToken(token);
        return tokenUserId != null && tokenUserId.equals(resourceOwnerId);
    }
}
