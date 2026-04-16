package com.busbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BusDto {
    public record BusSearchRequest(
        @NotBlank String source, 
        @NotBlank String destination, 
        @NotNull LocalDate date) {}

    public record BusResponse(
        Integer busId, 
        String name, 
        String type, 
        Integer capacity,
        String source,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        LocalDate date,
        BigDecimal price) {}
}
