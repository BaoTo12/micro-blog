package com.chibao.micro_blog.components;

import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

//    The 'username' parameter contains whatever the user submitted as their login identifier.
//            * In my social media app, users will login with their email address,
//            * so i'll treat the username parameter as an email.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Attempting to load user details for: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authentication attempt failed - user not found: {}", email);
                    return new UsernameNotFoundException("No user found with email: " + email);
                });
        // Additional security checks before creating the principal
        if (user.getActivated() == null || !user.getActivated()) {
            log.warn("Authentication attempt with inactive account: {}", email);
            throw new DisabledException("User account is not activated");
        }

        log.debug("Successfully loaded user details for: {}", email);

        return UserPrincipal.create(user);
    }
    // use this for jwt authentication
    public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {
        log.debug("Attempting to load user details for ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User lookup failed - user not found with ID: {}", userId);
                    return new UsernameNotFoundException("No user found with ID: " + userId);
                });

        if (user.getActivated() == null || !user.getActivated()) {
            log.warn("Attempt to load inactive user account with ID: {}", userId);
            throw new DisabledException("User account is not activated");
        }

        log.debug("Successfully loaded user details for ID: {}", userId);

        return UserPrincipal.create(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
