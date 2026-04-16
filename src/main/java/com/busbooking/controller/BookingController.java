package com.busbooking.controller;

import com.busbooking.dto.BookingDto.BookingRequest;
import com.busbooking.dto.BookingDto.BookingResponse;
import com.busbooking.entity.User;
import com.busbooking.repository.UserRepository;
import com.busbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> bookSeats(
            Authentication authentication,
            @Valid @RequestBody BookingRequest request) {
        Integer userId = getUserId(authentication);
        return ResponseEntity.ok(bookingService.bookSeats(userId, request));
    }

    @GetMapping("/me/bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        Integer userId = getUserId(authentication);
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Integer bookingId) {
        return ResponseEntity.ok().build(); // Add cancel logic to service layer later
    }

    private Integer getUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByEmail(email).map(User::getUserId).orElseThrow();
    }
}
