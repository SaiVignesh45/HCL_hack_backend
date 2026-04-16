package com.busbooking.service;

import com.busbooking.dto.BusDto.BusSearchRequest;
import com.busbooking.dto.BusDto.BusResponse;
import com.busbooking.entity.Bus;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepository busRepository;

    public List<BusResponse> searchBuses(BusSearchRequest request) {
        return busRepository.findBySourceAndDestinationAndDate(
                request.source(), request.destination(), request.date())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BusResponse getBusById(Integer busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));
        return mapToDto(bus);
    }

    private BusResponse mapToDto(Bus bus) {
        return new BusResponse(bus.getBusId(), bus.getName(), bus.getType(), bus.getCapacity(),
                bus.getSource(), bus.getDestination(), bus.getDepartureTime(), bus.getArrivalTime(),
                bus.getDate(), bus.getPrice());
    }
}
