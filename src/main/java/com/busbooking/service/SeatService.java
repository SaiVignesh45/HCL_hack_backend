package com.busbooking.service;

import com.busbooking.dto.SeatDto.SeatResponse;
import com.busbooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;

    public List<SeatResponse> getSeatsByBus(Integer busId) {
        return seatRepository.findByBus_BusId(busId)
                .stream()
                .map(seat -> new SeatResponse(seat.getSeatId(), seat.getSeatNumber(), seat.getStatus()))
                .collect(Collectors.toList());
    }
}
