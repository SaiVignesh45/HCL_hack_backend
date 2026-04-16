package com.busbooking.service;

import com.busbooking.dto.BookingDto.BookingRequest;
import com.busbooking.dto.BookingDto.BookingResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.exception.SeatAlreadyBookedException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final BusRepository busRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<BookingResponse> bookSeats(Integer userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Bus bus = busRepository.findById(request.busId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        return request.seatIds().stream().map(seatId -> {
            int updated = seatRepository.bookSeatIfAvailable(seatId, Seat.SeatStatus.BOOKED, Seat.SeatStatus.AVAILABLE);
            if (updated == 0) {
                throw new SeatAlreadyBookedException("Seat " + seatId + " is already booked or invalid");
            }
            Seat seat = seatRepository.findById(seatId).orElseThrow();
            
            Booking booking = Booking.builder()
                    .user(user)
                    .bus(bus)
                    .seat(seat)
                    .status(Booking.BookingStatus.CONFIRMED)
                    .bookingTime(LocalDateTime.now()) // Just for response mapping since DB injects its own
                    .build();
                    
            booking = bookingRepository.save(booking);

            return new BookingResponse(booking.getBookingId(), bus.getBusId(), user.getUserId(), 
                    seat.getSeatId(), booking.getStatus(), booking.getBookingTime());
        }).collect(Collectors.toList());
    }

    public List<BookingResponse> getUserBookings(Integer userId) {
        return bookingRepository.findByUser_UserId(userId).stream()
                .map(b -> new BookingResponse(b.getBookingId(), b.getBus().getBusId(), b.getUser().getUserId(),
                        b.getSeat().getSeatId(), b.getStatus(), b.getBookingTime()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            return;
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        Seat seat = booking.getSeat();
        seat.setStatus(Seat.SeatStatus.AVAILABLE);
        seatRepository.save(seat);
    }
}
