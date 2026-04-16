package com.busbooking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import com.busbooking.entity.Booking.BookingStatus;
import java.time.LocalDateTime;

public class BookingDto {
    public record BookingRequest(
        @NotNull Integer busId, 
        @NotEmpty List<Integer> seatIds) {}

    public record BookingResponse(
        Integer bookingId, 
        Integer busId,
        Integer userId,
        Integer seatId,
        BookingStatus status,
        LocalDateTime bookingTime) {}
}
