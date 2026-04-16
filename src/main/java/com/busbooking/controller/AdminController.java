package com.busbooking.controller;

import com.busbooking.entity.Bus;
import com.busbooking.repository.BusRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/buses")
@RequiredArgsConstructor
public class AdminController {
    
    private final BusRepository busRepository;

    @PostMapping
    public ResponseEntity<Bus> createBus(@Valid @RequestBody Bus bus) {
        return ResponseEntity.ok(busRepository.save(bus));
    }

    @PutMapping("/{busId}")
    public ResponseEntity<Bus> updateBus(@PathVariable Integer busId, @Valid @RequestBody Bus bus) {
        bus.setBusId(busId);
        return ResponseEntity.ok(busRepository.save(bus));
    }

    @DeleteMapping("/{busId}")
    public ResponseEntity<Void> deleteBus(@PathVariable Integer busId) {
        busRepository.deleteById(busId);
        return ResponseEntity.ok().build();
    }
}
