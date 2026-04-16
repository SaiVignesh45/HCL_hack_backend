package com.busbooking.dto;

import com.busbooking.entity.Seat.SeatStatus;

public class SeatDto {
    public record SeatResponse(Integer seatId, Integer seatNumber, SeatStatus status) {}
}
