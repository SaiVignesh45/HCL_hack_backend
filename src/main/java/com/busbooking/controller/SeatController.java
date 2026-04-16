package com.busbooking.controller;

import com.busbooking.dto.SeatDto.SeatResponse;
import com.busbooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buses/{busId}/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<SeatResponse>> getSeats(@PathVariable Integer busId) {
        return ResponseEntity.ok(seatService.getSeatsByBus(busId));
    }
}
