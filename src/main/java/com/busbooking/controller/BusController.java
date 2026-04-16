package com.busbooking.controller;

import com.busbooking.dto.BusDto.BusResponse;
import com.busbooking.dto.BusDto.BusSearchRequest;
import com.busbooking.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService busService;

    @GetMapping
    public ResponseEntity<List<BusResponse>> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        BusSearchRequest request = new BusSearchRequest(source, destination, LocalDate.parse(date));
        return ResponseEntity.ok(busService.searchBuses(request));
    }

    @GetMapping("/{busId}")
    public ResponseEntity<BusResponse> getBusById(@PathVariable Integer busId) {
        return ResponseEntity.ok(busService.getBusById(busId));
    }
}
